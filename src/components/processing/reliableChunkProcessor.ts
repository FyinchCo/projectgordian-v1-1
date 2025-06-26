import { useToast } from "@/hooks/use-toast";
import { ChunkedProcessorProps, ProcessingResult } from './types';
import { createFinalResult, handleChunkError } from './chunkResultHandler';
import { normalizeLayerStructure } from './layerNormalizer';
import { supabase } from "@/integrations/supabase/client";
import { systemCircuitBreaker } from './circuitBreaker';
import { qualityScorer } from './qualityScorer';

interface ReliableChunkConfig {
  maxRetries: number;
  baseTimeout: number;
  backoffMultiplier: number;
  contextWindowSize: number;
  fallbackThreshold: number;
}

interface SupabaseResponse {
  data?: {
    layers?: any[];
    confidence?: number;
    [key: string]: any;
  };
  error?: any;
}

export const useReliableChunkProcessor = () => {
  const { toast } = useToast();

  const defaultConfig: ReliableChunkConfig = {
    maxRetries: 2,
    baseTimeout: 180000, // 3 minutes base (reduced from 4 for better UX)
    backoffMultiplier: 1.3, // Gentler backoff
    contextWindowSize: 3,
    fallbackThreshold: 0.3
  };

  const processChunkedLayersReliably = async ({
    baseConfig,
    totalDepth,
    chunkSize = 2,
    onChunkProgressChange,
    onCurrentLayerChange,
    config = defaultConfig
  }: ChunkedProcessorProps & { config?: ReliableChunkConfig }): Promise<ProcessingResult> => {
    
    const chunks = Math.ceil(totalDepth / chunkSize);
    let accumulatedLayers: any[] = [];
    let chunkFailures = 0;
    let fallbacksUsed = 0;
    let averageConfidence = 1.0;
    const startTime = Date.now();
    
    console.log(`=== RELIABLE CHUNKED PROCESSING START ===`);
    console.log(`Configuration:`, {
      totalDepth,
      chunkSize,
      chunks,
      circuitBreakerEnabled: true,
      qualityScoringEnabled: true
    });
    
    onChunkProgressChange({ current: 0, total: chunks });
    
    for (let chunkIndex = 0; chunkIndex < chunks; chunkIndex++) {
      const startLayer = (chunkIndex * chunkSize) + 1;
      const endLayer = Math.min(startLayer + chunkSize - 1, totalDepth);
      const actualChunkSize = endLayer - startLayer + 1;
      
      console.log(`=== CHUNK ${chunkIndex + 1}/${chunks} START ===`);
      
      // Smart context window - limit to prevent exponential growth
      const contextLayers = accumulatedLayers.length > config.contextWindowSize 
        ? accumulatedLayers.slice(-config.contextWindowSize)
        : accumulatedLayers;
      
      // Progressive timeout with circuit breaker status
      const circuitStatus = systemCircuitBreaker.getCircuitStatus('genius-machine');
      const baseTimeout = circuitStatus.healthScore > 0.5 ? config.baseTimeout : config.baseTimeout * 0.7;
      const dynamicTimeout = Math.min(baseTimeout * Math.pow(config.backoffMultiplier, chunkFailures), 300000); // Max 5 minutes
      
      console.log(`Circuit health: ${Math.round(circuitStatus.healthScore * 100)}%, Timeout: ${Math.round(dynamicTimeout/1000)}s`);
      
      const chunkConfig = {
        ...baseConfig,
        processingDepth: actualChunkSize,
        previousLayers: contextLayers,
        startFromLayer: startLayer,
        confidenceThreshold: config.fallbackThreshold
      };
      
      onChunkProgressChange({ current: chunkIndex + 1, total: chunks });
      
      // Update visual progress
      for (let layer = startLayer; layer <= endLayer; layer++) {
        onCurrentLayerChange(layer);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Use circuit breaker for chunk processing
      try {
        const chunkResult = await systemCircuitBreaker.execute(
          'genius-machine',
          async () => {
            const timeoutPromise = new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error(`Chunk timeout after ${Math.round(dynamicTimeout/1000)}s`)), dynamicTimeout)
            );
            
            const requestPromise = supabase.functions.invoke('genius-machine', {
              body: chunkConfig
            }).then((result): SupabaseResponse => {
              if (result.error) {
                throw new Error(`Supabase function error: ${result.error.message}`);
              }
              return result as SupabaseResponse;
            });
            
            return await Promise.race([requestPromise, timeoutPromise]);
          },
          // Fallback function
          async () => {
            console.log(`Circuit breaker fallback for chunk ${chunkIndex + 1}`);
            fallbacksUsed++;
            return {
              data: {
                layers: generateReliableFallbackLayers(startLayer, endLayer, baseConfig.question),
                confidence: 0.4
              }
            };
          }
        );
        
        // Process successful result
        if (chunkResult && chunkResult.data && chunkResult.data.layers) {
          const normalizedLayers = chunkResult.data.layers
            .map(normalizeLayerStructure)
            .sort((a, b) => a.layerNumber - b.layerNumber);
          
          accumulatedLayers = [...accumulatedLayers, ...normalizedLayers];
          
          const chunkConfidence = chunkResult.data.confidence || 0.5;
          averageConfidence = (averageConfidence * chunkIndex + chunkConfidence) / (chunkIndex + 1);
          
          console.log(`✓ Chunk ${chunkIndex + 1} successful via ${chunkConfidence < 0.5 ? 'fallback' : 'primary'}`);
          
        } else {
          throw new Error('Invalid chunk result structure');
        }
        
      } catch (error: any) {
        console.error(`Chunk ${chunkIndex + 1} failed completely:`, error.message);
        chunkFailures++;
        
        // Generate emergency fallback
        const fallbackLayers = generateReliableFallbackLayers(startLayer, endLayer, baseConfig.question);
        accumulatedLayers = [...accumulatedLayers, ...fallbackLayers];
        fallbacksUsed++;
        
        const fallbackConfidence = 0.3;
        averageConfidence = (averageConfidence * chunkIndex + fallbackConfidence) / (chunkIndex + 1);
        
        toast({
          title: "⚠️ Chunk Recovery",
          description: `Chunk ${chunkIndex + 1} recovered with emergency fallback. Quality reduced but processing continues.`,
          variant: "default",
        });
      }
      
      // Inter-chunk stability delay
      if (chunkIndex < chunks - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Calculate enhanced quality metrics
    const processingTime = Math.round((Date.now() - startTime) / 1000);
    const processingMetrics = {
      requestedDepth: totalDepth,
      actualDepth: accumulatedLayers.length,
      processingTime,
      chunkFailures,
      fallbacksUsed
    };
    
    // Create final result with enhanced quality scoring
    const finalData = {
      insight: accumulatedLayers[accumulatedLayers.length - 1]?.insight || "Processing completed with mixed results",
      confidence: averageConfidence,
      layers: accumulatedLayers,
      tensionPoints: Math.max(...accumulatedLayers.map(l => l.tensionPoints || 0)),
      noveltyScore: Math.max(...accumulatedLayers.map(l => l.noveltyScore || 5)),
      emergenceDetected: accumulatedLayers.some(l => l.emergenceDetected),
      metadata: {
        reliableProcessing: true,
        chunkFailures,
        fallbacksUsed,
        processingTime,
        circuitBreakerUsed: true
      }
    };
    
    const finalResult = createFinalResult(finalData, accumulatedLayers, totalDepth);
    
    // Add enhanced quality metrics
    const qualityMetrics = qualityScorer.calculateEnhancedQuality(finalResult, processingMetrics);
    
    console.log(`=== RELIABLE PROCESSING COMPLETE ===`);
    console.log(`Enhanced Quality Score: ${qualityMetrics.overallQuality}/10`);
    console.log(`User Satisfaction Predictor: ${qualityMetrics.userSatisfactionPredictor}/10`);
    console.log(`System Reliability: ${qualityMetrics.systemReliability}/10`);
    
    // Enhanced completion toast with quality info
    toast({
      title: `🎯 Quality Score: ${qualityMetrics.overallQuality}/10`,
      description: `${accumulatedLayers.length} layers • ${Math.round(averageConfidence * 100)}% confidence • ${qualityMetrics.confidenceLevel} reliability`,
      variant: qualityMetrics.overallQuality >= 7 ? "default" : "destructive",
    });
    
    return {
      ...finalResult,
      enhancedQualityMetrics: qualityMetrics
    };
  };
  
  return { processChunkedLayersReliably };
};

function generateReliableFallbackLayers(startLayer: number, endLayer: number, question: string) {
  const layers = [];
  
  for (let layerNum = startLayer; layerNum <= endLayer; layerNum++) {
    const layerFocus = [
      "foundational examination",
      "pattern recognition", 
      "tension exploration",
      "systemic integration",
      "assumption challenging",
      "emergence detection",
      "meta-transcendence"
    ][Math.min(layerNum - 1, 6)];
    
    layers.push({
      layerNumber: layerNum,
      insight: `Layer ${layerNum} ${layerFocus}: The question "${question}" reveals insights about the nature of inquiry itself. This layer represents a reliable analytical progression that maintains coherence even when primary processing encounters difficulties. The reliability of this fallback ensures consistent user experience while preserving the essential questioning process.`,
      confidence: Math.max(0.35, 0.4 + (layerNum * 0.02)),
      tensionPoints: Math.min(layerNum, 5),
      noveltyScore: Math.min(3 + layerNum, 8),
      emergenceDetected: layerNum > 6,
      archetypeResponses: [],
      timestamp: Date.now()
    });
  }
  
  return layers;
}

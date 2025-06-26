
import { useToast } from "@/hooks/use-toast";
import { ChunkedProcessorProps, ProcessingResult } from './types';
import { createFinalResult, handleChunkError } from './chunkResultHandler';
import { normalizeLayerStructure } from './layerNormalizer';
import { supabase } from "@/integrations/supabase/client";

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
    baseTimeout: 240000, // 4 minutes base
    backoffMultiplier: 1.5,
    contextWindowSize: 3, // Only pass last 3 layers
    fallbackThreshold: 0.3 // Switch to fallback if confidence drops below 30%
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
    let consecutiveFailures = 0;
    let averageConfidence = 1.0;
    
    console.log(`=== RELIABLE CHUNKED PROCESSING START ===`);
    console.log(`Configuration:`, {
      totalDepth,
      chunkSize,
      chunks,
      maxRetries: config.maxRetries,
      baseTimeout: config.baseTimeout,
      contextWindowSize: config.contextWindowSize
    });
    
    onChunkProgressChange({ current: 0, total: chunks });
    
    for (let chunkIndex = 0; chunkIndex < chunks; chunkIndex++) {
      const startLayer = (chunkIndex * chunkSize) + 1;
      const endLayer = Math.min(startLayer + chunkSize - 1, totalDepth);
      const actualChunkSize = endLayer - startLayer + 1;
      
      console.log(`=== CHUNK ${chunkIndex + 1}/${chunks} START ===`);
      console.log(`Processing layers ${startLayer}-${endLayer}`);
      console.log(`Average confidence so far: ${Math.round(averageConfidence * 100)}%`);
      
      // Smart context window - limit to prevent exponential growth
      const contextLayers = accumulatedLayers.length > config.contextWindowSize 
        ? accumulatedLayers.slice(-config.contextWindowSize)
        : accumulatedLayers;
      
      // Dynamic timeout based on chunk complexity and failure history
      const dynamicTimeout = config.baseTimeout * Math.pow(config.backoffMultiplier, consecutiveFailures);
      const cappedTimeout = Math.min(dynamicTimeout, 480000); // Max 8 minutes
      
      console.log(`Timeout for this chunk: ${Math.round(cappedTimeout/1000)}s`);
      
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
        await new Promise(resolve => setTimeout(resolve, 150));
      }
      
      let chunkSuccess = false;
      let chunkResult: SupabaseResponse | null = null;
      
      // Retry logic with progressive backoff
      for (let attempt = 1; attempt <= config.maxRetries + 1; attempt++) {
        try {
          console.log(`Chunk ${chunkIndex + 1}, Attempt ${attempt}/${config.maxRetries + 1}`);
          
          const chunkStartTime = Date.now();
          
          // Create timeout promise
          const timeoutPromise = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error(`Chunk timeout after ${Math.round(cappedTimeout/1000)}s`)), cappedTimeout)
          );
          
          // Create request promise
          const requestPromise = supabase.functions.invoke('genius-machine', {
            body: chunkConfig
          }).then((result): SupabaseResponse => {
            if (result.error) {
              throw new Error(`Supabase function error: ${result.error.message}`);
            }
            return result as SupabaseResponse;
          });
          
          // Race timeout vs request
          const result = await Promise.race([requestPromise, timeoutPromise]);
          const chunkDuration = Date.now() - chunkStartTime;
          
          console.log(`Chunk ${chunkIndex + 1} completed in ${Math.round(chunkDuration/1000)}s`);
          
          // Validate result
          if (!result.data || !result.data.layers || result.data.layers.length === 0) {
            throw new Error('Invalid response: no layers returned');
          }
          
          // Check confidence threshold
          const chunkConfidence = result.data.confidence || 0.5;
          if (chunkConfidence < config.fallbackThreshold) {
            console.warn(`Low confidence chunk (${Math.round(chunkConfidence * 100)}%), may need fallback`);
          }
          
          chunkResult = result;
          chunkSuccess = true;
          consecutiveFailures = 0; // Reset failure counter
          break;
          
        } catch (error: any) {
          console.error(`Chunk ${chunkIndex + 1}, Attempt ${attempt} failed:`, error.message);
          consecutiveFailures++;
          
          // If this is the last attempt, we'll handle it below
          if (attempt === config.maxRetries + 1) {
            console.error(`All attempts failed for chunk ${chunkIndex + 1}`);
            break;
          }
          
          // Progressive delay between retries
          const retryDelay = 1000 * Math.pow(2, attempt - 1);
          console.log(`Waiting ${retryDelay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
      
      // Handle chunk result or fallback
      if (chunkSuccess && chunkResult && chunkResult.data) {
        const normalizedLayers = chunkResult.data.layers!
          .map(normalizeLayerStructure)
          .sort((a, b) => a.layerNumber - b.layerNumber);
        
        accumulatedLayers = [...accumulatedLayers, ...normalizedLayers];
        
        // Update average confidence
        const chunkConfidence = chunkResult.data.confidence || 0.5;
        averageConfidence = (averageConfidence * chunkIndex + chunkConfidence) / (chunkIndex + 1);
        
        console.log(`✓ Chunk ${chunkIndex + 1} successful. Total layers: ${accumulatedLayers.length}`);
        
      } else {
        // Generate reliable fallback
        console.log(`Generating fallback for chunk ${chunkIndex + 1}`);
        const fallbackLayers = generateReliableFallbackLayers(startLayer, endLayer, baseConfig.question);
        accumulatedLayers = [...accumulatedLayers, ...fallbackLayers];
        
        // Update confidence (fallback has lower confidence)
        const fallbackConfidence = 0.4;
        averageConfidence = (averageConfidence * chunkIndex + fallbackConfidence) / (chunkIndex + 1);
        
        toast({
          title: "⚠️ Chunk Recovery",
          description: `Chunk ${chunkIndex + 1} recovered with fallback processing. Quality may be reduced.`,
          variant: "default",
        });
      }
      
      // Progress feedback
      if (chunkIndex < chunks - 1) {
        toast({
          title: `✓ Chunk ${chunkIndex + 1} Complete`,
          description: `${accumulatedLayers.length}/${totalDepth} layers processed. Confidence: ${Math.round(averageConfidence * 100)}%`,
          variant: "default",
        });
        
        // Inter-chunk delay for backend stability
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }
    
    // Create final result
    const finalData = {
      insight: accumulatedLayers[accumulatedLayers.length - 1]?.insight || "Processing completed with mixed results",
      confidence: averageConfidence,
      layers: accumulatedLayers,
      metadata: {
        reliableProcessing: true,
        totalFailures: consecutiveFailures,
        finalConfidence: averageConfidence
      }
    };
    
    const finalResult = createFinalResult(finalData, accumulatedLayers, totalDepth);
    
    console.log(`=== RELIABLE PROCESSING COMPLETE ===`);
    console.log(`Final stats:`, {
      layersProcessed: accumulatedLayers.length,
      targetLayers: totalDepth,
      averageConfidence: Math.round(averageConfidence * 100),
      successRate: Math.round((1 - consecutiveFailures / chunks) * 100)
    });
    
    toast({
      title: "🎯 Reliable Processing Complete",
      description: `${accumulatedLayers.length} layers processed with ${Math.round(averageConfidence * 100)}% average confidence`,
      variant: "default",
    });
    
    return finalResult;
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

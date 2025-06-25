import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ChunkedProcessorProps, ProcessingResult } from './types';
import { buildChunkConfig, logChunkStart } from './chunkConfigBuilder';
import { 
  createProcessingTimeout, 
  validateChunkResult, 
  createFinalResult, 
  handleChunkError 
} from './chunkResultHandler';
import { updateVisualProgress, createProgressToast } from './visualProgressHandler';

export const useChunkedProcessor = () => {
  const { toast } = useToast();

  const normalizeLayerStructure = (layer: any) => {
    // Ensure consistent layer structure with insights in the expected location
    if (!layer) return layer;
    
    const normalizedLayer = {
      ...layer,
      // Ensure insight is available at the expected location
      insight: layer.insight || layer.synthesis?.insight || `Layer ${layer.layerNumber || 'unknown'} insight not available`,
      confidence: layer.confidence || layer.synthesis?.confidence || 0.5,
      tensionPoints: layer.tensionPoints || layer.synthesis?.tensionPoints || 3,
      noveltyScore: layer.noveltyScore || layer.synthesis?.noveltyScore || 5,
      emergenceDetected: layer.emergenceDetected || layer.synthesis?.emergenceDetected || false,
      archetypeResponses: layer.archetypeResponses || [],
      // Preserve synthesis object for compatibility
      synthesis: layer.synthesis || {
        insight: layer.insight,
        confidence: layer.confidence || 0.5,
        tensionPoints: layer.tensionPoints || 3,
        noveltyScore: layer.noveltyScore || 5,
        emergenceDetected: layer.emergenceDetected || false
      }
    };

    console.log(`Normalized layer ${normalizedLayer.layerNumber}:`, {
      hasInsight: !!normalizedLayer.insight,
      insightLength: normalizedLayer.insight?.length || 0,
      hasSynthesis: !!normalizedLayer.synthesis,
      confidence: normalizedLayer.confidence
    });

    return normalizedLayer;
  };

  const processChunkedLayers = async ({
    baseConfig,
    totalDepth,
    chunkSize = 2, // REDUCED from 3 to 2 layers per chunk
    onChunkProgressChange,
    onCurrentLayerChange,
  }: ChunkedProcessorProps): Promise<ProcessingResult> => {
    const chunks = Math.ceil(totalDepth / chunkSize);
    let accumulatedLayers: any[] = [];
    
    console.log(`=== CHUNKED PROCESSING START ===`);
    console.log(`Total depth: ${totalDepth}, Chunk size: ${chunkSize}, Total chunks: ${chunks}`);
    console.log(`Expected timing: ~${chunkSize * 30}s per chunk (30s per layer average)`);
    console.log(`🔧 OPTIMIZATION: Using reduced chunk size (2) and limited context window`);
    onChunkProgressChange({ current: 0, total: chunks });
    
    for (let chunkIndex = 0; chunkIndex < chunks; chunkIndex++) {
      const startLayer = (chunkIndex * chunkSize) + 1;
      const endLayer = Math.min(startLayer + chunkSize - 1, totalDepth);
      const actualChunkSize = endLayer - startLayer + 1;
      
      console.log(`=== CHUNK ${chunkIndex + 1}/${chunks} START ===`);
      console.log(`Processing layers ${startLayer}-${endLayer} (${actualChunkSize} layers)`);
      console.log(`Expected chunk duration: ~${actualChunkSize * 30}s`);
      
      // CONTEXT WINDOW LIMITING: Only pass last 3 layers to prevent exponential growth
      const contextLayers = accumulatedLayers.length > 3 
        ? accumulatedLayers.slice(-3) 
        : accumulatedLayers;
      
      console.log(`Context optimization: Using ${contextLayers.length} layers (total accumulated: ${accumulatedLayers.length})`);
      
      const chunkConfig = {
        ...baseConfig,
        processingDepth: actualChunkSize,
        previousLayers: contextLayers, // LIMITED CONTEXT WINDOW
        startFromLayer: startLayer
      };
      
      console.log(`Chunk config:`, {
        processingDepth: actualChunkSize,
        startFromLayer: startLayer,
        contextLayersCount: contextLayers.length,
        totalAccumulatedCount: accumulatedLayers.length,
        questionLength: baseConfig.question?.length || 0
      });
      
      onChunkProgressChange({ current: chunkIndex + 1, total: chunks });
      
      // Update visual progress
      for (let layer = startLayer; layer <= endLayer; layer++) {
        onCurrentLayerChange(layer);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      try {
        const chunkStartTime = Date.now();
        
        console.log(`Calling genius-machine for chunk ${chunkIndex + 1} at ${new Date().toISOString()}...`);
        
        // Reduced timeout for smaller chunks (6 minutes instead of 8)
        const timeoutPromise = createProcessingTimeout(chunkIndex, 360000);
        
        const requestPromise = supabase.functions.invoke('genius-machine', {
          body: chunkConfig
        }).then(result => {
          console.log(`Chunk ${chunkIndex + 1} raw result received at ${new Date().toISOString()}:`, {
            hasData: !!result.data,
            hasError: !!result.error,
            errorMessage: result.error?.message
          });
          
          if (result.error) {
            throw new Error(`Supabase function error: ${result.error.message}`);
          }
          
          return result;
        });
        
        const result = await Promise.race([requestPromise, timeoutPromise]);
        
        const chunkDuration = Date.now() - chunkStartTime;
        console.log(`Chunk ${chunkIndex + 1} completed in ${Math.round(chunkDuration/1000)}s (expected: ~${actualChunkSize * 30}s)`);
        
        if (chunkDuration > actualChunkSize * 45000) {
          console.warn(`⚠️ CHUNK ${chunkIndex + 1} TOOK LONGER THAN EXPECTED: ${Math.round(chunkDuration/1000)}s vs expected ~${actualChunkSize * 30}s`);
        }
        
        const { data } = validateChunkResult(result, chunkIndex);
        
        console.log(`Chunk ${chunkIndex + 1} result validation:`, {
          hasData: !!data,
          hasLayers: !!data.layers,
          layerCount: data.layers?.length || 0,
          hasInsight: !!data.insight,
          expectedLayers: actualChunkSize,
          actualDepth: data.processingDepth || 0,
          layerProcessingSuccess: data.metadata?.layerProcessingSuccess
        });
        
        if (!data.layers || data.layers.length === 0) {
          console.error(`Chunk ${chunkIndex + 1} returned no layers!`);
          throw new Error(`Chunk ${chunkIndex + 1} processing failed: No layers returned`);
        }
        
        if (data.layers.length !== actualChunkSize) {
          console.warn(`Chunk ${chunkIndex + 1} expected ${actualChunkSize} layers but got ${data.layers.length}`);
        }
        
        const normalizedLayers = data.layers
          .map(normalizeLayerStructure)
          .sort((a, b) => a.layerNumber - b.layerNumber);
        
        const expectedLayerNumbers = [];
        for (let i = startLayer; i <= endLayer; i++) {
          expectedLayerNumbers.push(i);
        }
        
        const actualLayerNumbers = normalizedLayers.map(l => l.layerNumber);
        console.log(`Expected layer numbers:`, expectedLayerNumbers);
        console.log(`Actual layer numbers:`, actualLayerNumbers);
        
        accumulatedLayers = [...accumulatedLayers, ...normalizedLayers];
        
        console.log(`=== CHUNK ${chunkIndex + 1} COMPLETE ===`);
        console.log(`Total accumulated layers: ${accumulatedLayers.length}/${totalDepth}`);
        console.log(`Chunk progress: ${chunkIndex + 1}/${chunks}`);
        console.log(`Processing efficiency: ${Math.round(chunkDuration/(actualChunkSize * 1000))}s per layer`);
        
        if (chunkIndex === chunks - 1) {
          const finalResult = createFinalResult(data, accumulatedLayers, totalDepth);
          
          console.log(`=== FINAL CHUNKED PROCESSING COMPLETE ===`);
          console.log('Final result summary:', {
            totalLayers: finalResult.layers?.length || 0,
            hasInsight: !!finalResult.insight,
            confidence: finalResult.confidence,
            layersWithInsights: accumulatedLayers.filter(l => l.insight && l.insight !== `Layer ${l.layerNumber} insight not available`).length,
            requestedDepth: totalDepth,
            actualDepth: accumulatedLayers.length,
            processingSuccess: accumulatedLayers.length === totalDepth
          });
          
          toast({
            title: "🎯 Deep Processing Complete",
            description: `Successfully processed all ${accumulatedLayers.length} layers with ${Math.round((finalResult.confidence || 0) * 100)}% confidence`,
            variant: "default",
          });
          
          return finalResult;
        } else {
          const progressData = createProgressToast(chunkIndex, chunks, startLayer, endLayer);
          toast(progressData);
          
          console.log(`Chunk ${chunkIndex + 1} complete, continuing to next chunk...`);
          
          // INTER-CHUNK DELAY: Let backend recover between chunks
          console.log(`⏱️ Adding 2-second delay before next chunk for backend stability...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
      } catch (chunkError: any) {
        console.error(`=== CHUNK ${chunkIndex + 1} ERROR ===`);
        console.error('Error details:', {
          message: chunkError.message,
          name: chunkError.name,
          stack: chunkError.stack?.substring(0, 200),
          accumulatedLayers: accumulatedLayers.length,
          hasValidLayers: accumulatedLayers.some(l => l?.insight),
          chunkIndex,
          totalChunks: chunks
        });
        
        const isTimeoutError = chunkError.message?.includes('timeout') || chunkError.message?.includes('timed out');
        const isConnectionError = chunkError.message?.includes('Failed to send a request') || chunkError.message?.includes('connection');
        
        if (isTimeoutError) {
          console.log(`🚨 TIMEOUT ISSUE: Chunk ${chunkIndex + 1} exceeded 6 minutes - this suggests backend processing issues`);
          toast({
            title: "Processing Timeout",
            description: `Chunk ${chunkIndex + 1} exceeded timeout. Backend may be overloaded or question too complex.`,
            variant: "destructive",
          });
        } else if (isConnectionError) {
          console.log(`🚨 CONNECTION ISSUE: Chunk ${chunkIndex + 1} had network problems`);
          toast({
            title: "Connection Issue",
            description: `Chunk ${chunkIndex + 1} had a connection problem. Network or server issue.`,
            variant: "destructive",
          });
        }
        
        if (accumulatedLayers.length > 0) {
          const lastValidLayer = accumulatedLayers[accumulatedLayers.length - 1];
          
          toast({
            title: "Partial Results Available",
            description: `Completed ${accumulatedLayers.length} layers before error. Returning available insights.`,
            variant: "default",
          });
          
          return {
            insight: lastValidLayer?.insight || `Partial processing completed with ${accumulatedLayers.length} layers.`,
            confidence: lastValidLayer?.confidence || 0.6,
            tensionPoints: lastValidLayer?.tensionPoints || 3,
            noveltyScore: lastValidLayer?.noveltyScore || 5,
            emergenceDetected: lastValidLayer?.emergenceDetected || false,
            layers: accumulatedLayers,
            processingDepth: accumulatedLayers.length,
            partialResults: true,
            errorMessage: chunkError.message,
            logicTrail: lastValidLayer?.archetypeResponses || [],
            compressionFormats: lastValidLayer?.compressionFormats
          };
        } else {
          throw chunkError;
        }
      }
    }

    throw new Error('Unexpected end of processing loop - this should never happen');
  };

  return { processChunkedLayers };
};

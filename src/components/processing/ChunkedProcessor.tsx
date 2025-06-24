
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

  const processChunkedLayers = async ({
    baseConfig,
    totalDepth,
    chunkSize = 2,
    onChunkProgressChange,
    onCurrentLayerChange,
  }: ChunkedProcessorProps): Promise<ProcessingResult> => {
    const chunks = Math.ceil(totalDepth / chunkSize);
    let accumulatedLayers: any[] = [];
    
    console.log(`Starting chunked processing: ${totalDepth} layers in ${chunks} chunks of size ${chunkSize}`);
    onChunkProgressChange({ current: 0, total: chunks });
    
    for (let chunkIndex = 0; chunkIndex < chunks; chunkIndex++) {
      const chunkConfig = buildChunkConfig(baseConfig, chunkIndex, chunkSize, totalDepth, accumulatedLayers);
      
      logChunkStart(chunkConfig);
      onChunkProgressChange({ current: chunkIndex + 1, total: chunks });
      
      // Visual progress update
      await updateVisualProgress(chunkConfig.startLayer, chunkConfig.endLayer, onCurrentLayerChange);
      
      try {
        const chunkStartTime = Date.now();
        
        // Create timeout and request promises
        const timeoutPromise = createProcessingTimeout(chunkIndex);
        const requestPromise = supabase.functions.invoke('genius-machine', {
          body: chunkConfig.config
        });
        
        // Race the promises
        const result = await Promise.race([requestPromise, timeoutPromise]);
        const chunkDuration = Date.now() - chunkStartTime;
        
        console.log(`Chunk ${chunkIndex + 1} completed in ${chunkDuration}ms`);
        
        // Validate and extract data
        const { data } = validateChunkResult(result, chunkIndex);
        
        console.log(`Chunk ${chunkIndex + 1} success:`, {
          hasLayers: !!data.layers,
          layerCount: data.layers?.length || 0,
          hasInsight: !!data.insight,
          expectedLayers: chunkConfig.chunkDepth,
          actualLayers: data.layers?.length || 0
        });
        
        // Verify we got the expected number of layers for this chunk
        if (data.layers && data.layers.length !== chunkConfig.chunkDepth) {
          console.warn(`Expected ${chunkConfig.chunkDepth} layers but got ${data.layers.length} for chunk ${chunkIndex + 1}`);
        }
        
        // Accumulate layers - ensure we're getting all layers from each chunk
        if (data.layers && data.layers.length > 0) {
          // Make sure we're adding layers in the correct order
          const sortedNewLayers = data.layers.sort((a, b) => a.layerNumber - b.layerNumber);
          accumulatedLayers = [...accumulatedLayers, ...sortedNewLayers];
          console.log(`Total accumulated layers after chunk ${chunkIndex + 1}: ${accumulatedLayers.length}/${totalDepth}`);
        } else {
          console.error(`Chunk ${chunkIndex + 1} returned no layers! This is unexpected.`);
        }
        
        // Handle final vs intermediate chunks
        if (chunkIndex === chunks - 1) {
          // Final chunk - verify we have all expected layers
          if (accumulatedLayers.length < totalDepth) {
            console.warn(`Expected ${totalDepth} total layers but only got ${accumulatedLayers.length}`);
            toast({
              title: "Incomplete Processing",
              description: `Processed ${accumulatedLayers.length} of ${totalDepth} requested layers. Some layers may have been skipped.`,
              variant: "default",
            });
          }
          
          return createFinalResult(data, accumulatedLayers, totalDepth);
        } else {
          const progressData = createProgressToast(chunkIndex, chunks, chunkConfig.startLayer, chunkConfig.endLayer);
          toast(progressData);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
      } catch (chunkError: any) {
        console.error(`Error in chunk ${chunkIndex + 1}:`, chunkError);
        
        const result = handleChunkError(chunkError, accumulatedLayers, chunkIndex);
        
        if (result.partialResults && accumulatedLayers.length > 0) {
          toast({
            title: "Partial Results Available",
            description: `Completed ${accumulatedLayers.length} layers before error. Returning available insights.`,
            variant: "default",
          });
          return result;
        } else {
          // If no partial results and we're not on the first chunk, return what we have
          if (chunkIndex > 0 && accumulatedLayers.length > 0) {
            toast({
              title: "Processing Error - Partial Results",
              description: `Error occurred after processing ${accumulatedLayers.length} layers. Returning partial results.`,
              variant: "destructive",
            });
            
            return {
              insight: `Partial processing completed with ${accumulatedLayers.length} layers processed.`,
              confidence: 0.5,
              tensionPoints: 3,
              layers: accumulatedLayers,
              processingDepth: accumulatedLayers.length,
              partialResults: true,
              errorMessage: chunkError.message
            };
          }
          
          throw chunkError; // Re-throw if no partial results
        }
      }
    }

    // This should never be reached, but TypeScript needs it
    throw new Error('Unexpected end of processing loop');
  };

  return { processChunkedLayers };
};

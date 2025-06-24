
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
          hasInsight: !!data.insight
        });
        
        // Accumulate layers
        if (data.layers) {
          accumulatedLayers = [...accumulatedLayers, ...data.layers];
          console.log(`Total accumulated layers: ${accumulatedLayers.length}`);
        }
        
        // Handle final vs intermediate chunks
        if (chunkIndex === chunks - 1) {
          return createFinalResult(data, accumulatedLayers, totalDepth);
        } else {
          const progressData = createProgressToast(chunkIndex, chunks, chunkConfig.startLayer, chunkConfig.endLayer);
          toast(progressData);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
      } catch (chunkError: any) {
        const result = handleChunkError(chunkError, accumulatedLayers, chunkIndex);
        
        if (result.partialResults) {
          toast({
            title: "Partial Results Available",
            description: `Completed ${accumulatedLayers.length} layers before error. Returning available insights.`,
            variant: "default",
          });
          return result;
        } else {
          throw chunkError; // Re-throw if no partial results
        }
      }
    }

    // This should never be reached, but TypeScript needs it
    throw new Error('Unexpected end of processing loop');
  };

  return { processChunkedLayers };
};

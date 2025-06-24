
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChunkedProcessorProps {
  baseConfig: any;
  totalDepth: number;
  chunkSize: number;
  onChunkProgressChange: (progress: { current: number; total: number }) => void;
  onCurrentLayerChange: (layer: number) => void;
}

export const useChunkedProcessor = () => {
  const { toast } = useToast();

  const processChunkedLayers = async ({
    baseConfig,
    totalDepth,
    chunkSize = 2,
    onChunkProgressChange,
    onCurrentLayerChange,
  }: ChunkedProcessorProps) => {
    const chunks = Math.ceil(totalDepth / chunkSize);
    let accumulatedLayers: any[] = [];
    
    console.log(`Starting chunked processing: ${totalDepth} layers in ${chunks} chunks of size ${chunkSize}`);
    onChunkProgressChange({ current: 0, total: chunks });
    
    for (let chunkIndex = 0; chunkIndex < chunks; chunkIndex++) {
      const startLayer = chunkIndex * chunkSize + 1;
      const endLayer = Math.min((chunkIndex + 1) * chunkSize, totalDepth);
      const chunkDepth = endLayer - startLayer + 1;
      
      console.log(`Processing chunk ${chunkIndex + 1}/${chunks}: layers ${startLayer}-${endLayer} (depth: ${chunkDepth})`);
      onChunkProgressChange({ current: chunkIndex + 1, total: chunks });
      
      // Visual progress update
      for (let layer = startLayer; layer <= endLayer; layer++) {
        onCurrentLayerChange(layer);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      const chunkConfig = {
        ...baseConfig,
        processingDepth: chunkDepth,
        previousLayers: accumulatedLayers,
        startFromLayer: startLayer
      };
      
      try {
        console.log(`Chunk ${chunkIndex + 1} config:`, {
          depth: chunkDepth,
          startLayer,
          previousLayerCount: accumulatedLayers.length,
          timestamp: new Date().toISOString()
        });
        
        const chunkStartTime = Date.now();
        
        // Reasonable timeout - 45 seconds to allow function to complete
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error(`CHUNK_TIMEOUT: Chunk ${chunkIndex + 1} timed out after 45 seconds`));
          }, 45000);
        });
        
        const requestPromise = supabase.functions.invoke('genius-machine', {
          body: chunkConfig
        });
        
        const result = await Promise.race([requestPromise, timeoutPromise]);
        const chunkDuration = Date.now() - chunkStartTime;
        
        console.log(`Chunk ${chunkIndex + 1} completed in ${chunkDuration}ms`);
        
        if (result.error) {
          console.error(`Chunk ${chunkIndex + 1} function error:`, result.error);
          throw new Error(`FUNCTION_ERROR: ${result.error.message || 'Unknown function error'}`);
        }
        
        if (!result.data) {
          console.error(`Chunk ${chunkIndex + 1} returned no data`);
          throw new Error(`NO_DATA: Chunk ${chunkIndex + 1} returned empty response`);
        }
        
        console.log(`Chunk ${chunkIndex + 1} success:`, {
          hasLayers: !!result.data.layers,
          layerCount: result.data.layers?.length || 0,
          hasInsight: !!result.data.insight
        });
        
        // Accumulate layers
        if (result.data.layers) {
          accumulatedLayers = [...accumulatedLayers, ...result.data.layers];
          console.log(`Total accumulated layers: ${accumulatedLayers.length}`);
        }
        
        // Handle final vs intermediate chunks
        if (chunkIndex === chunks - 1) {
          const finalResults = {
            ...result.data,
            layers: accumulatedLayers,
            processingDepth: totalDepth,
            chunkProcessed: true
          };
          
          console.log('Final chunk processed, returning complete results:', {
            totalLayers: accumulatedLayers.length,
            hasInsight: !!finalResults.insight,
            confidence: finalResults.confidence
          });
          
          return finalResults;
        } else {
          toast({
            title: `Progress: ${chunkIndex + 1}/${chunks} Complete`,
            description: `Processed layers ${startLayer}-${endLayer}. Continuing with next chunk...`,
            variant: "default",
          });
          
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
      } catch (chunkError: any) {
        console.error(`Chunk ${chunkIndex + 1} failed:`, {
          error: chunkError.message,
          errorType: chunkError.name,
          accumulatedLayers: accumulatedLayers.length,
          timestamp: new Date().toISOString()
        });
        
        // Return partial results if we have some progress
        if (accumulatedLayers.length > 0) {
          console.log(`Returning partial results: ${accumulatedLayers.length} layers processed`);
          
          toast({
            title: "Partial Results Available",
            description: `Completed ${accumulatedLayers.length} layers before error. Returning available insights.`,
            variant: "default",
          });
          
          const lastLayer = accumulatedLayers[accumulatedLayers.length - 1];
          return {
            insight: lastLayer.insight || "Partial processing completed",
            confidence: lastLayer.confidence || 6,
            tensionPoints: lastLayer.tensionPoints || 5,
            layers: accumulatedLayers,
            processingDepth: accumulatedLayers.length,
            partialResults: true,
            errorMessage: `Processing stopped at layer ${accumulatedLayers.length}: ${chunkError.message}`
          };
        } else {
          const errorMessage = chunkError.message || 'Unknown error';
          if (errorMessage.includes('CHUNK_TIMEOUT')) {
            throw new Error('PROCESSING_TIMEOUT: The genius machine is taking longer than expected. This may be due to system load.');
          } else {
            throw new Error(`PROCESSING_ERROR: ${errorMessage}`);
          }
        }
      }
    }
  };

  return { processChunkedLayers };
};

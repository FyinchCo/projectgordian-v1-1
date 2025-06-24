
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
    chunkSize = 2, // Even smaller default chunks
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
      
      // Visual progress update with shorter delays
      for (let layer = startLayer; layer <= endLayer; layer++) {
        onCurrentLayerChange(layer);
        await new Promise(resolve => setTimeout(resolve, 200)); // Faster visual updates
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
        
        // Very aggressive timeout for chunks - 20 seconds max
        const chunkTimeout = new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error(`CHUNK_TIMEOUT: Chunk ${chunkIndex + 1} timed out after 20 seconds`));
          }, 20000);
        });
        
        const chunkRequest = supabase.functions.invoke('genius-machine', {
          body: chunkConfig
        });
        
        const result = await Promise.race([chunkRequest, chunkTimeout]);
        const { data, error } = result;
        
        const chunkDuration = Date.now() - chunkStartTime;
        console.log(`Chunk ${chunkIndex + 1} completed in ${chunkDuration}ms`);
        
        if (error) {
          console.error(`Chunk ${chunkIndex + 1} error:`, error);
          throw new Error(`Chunk processing failed: ${error.message}`);
        }
        
        if (!data) {
          throw new Error(`Chunk ${chunkIndex + 1} returned no data`);
        }
        
        console.log(`Chunk ${chunkIndex + 1} results:`, {
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
          // Final chunk - return complete results
          const finalResults = {
            ...data,
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
          // Intermediate chunk - show progress and continue
          toast({
            title: `Progress: ${chunkIndex + 1}/${chunks} Complete`,
            description: `Processed layers ${startLayer}-${endLayer}. Continuing with next chunk...`,
            variant: "default",
          });
          
          // Small delay between chunks to prevent overwhelming the service
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
      } catch (chunkError) {
        console.error(`Chunk ${chunkIndex + 1} failed:`, {
          error: chunkError.message,
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
          // No progress made, re-throw the error
          throw chunkError;
        }
      }
    }
  };

  return { processChunkedLayers };
};

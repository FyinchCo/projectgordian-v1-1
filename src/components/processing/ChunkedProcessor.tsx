
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
    chunkSize = 4,
    onChunkProgressChange,
    onCurrentLayerChange,
  }: ChunkedProcessorProps) => {
    const chunks = Math.ceil(totalDepth / chunkSize);
    let accumulatedLayers: any[] = [];
    
    onChunkProgressChange({ current: 0, total: chunks });
    
    for (let chunkIndex = 0; chunkIndex < chunks; chunkIndex++) {
      const startLayer = chunkIndex * chunkSize + 1;
      const endLayer = Math.min((chunkIndex + 1) * chunkSize, totalDepth);
      const chunkDepth = endLayer - startLayer + 1;
      
      console.log(`Processing chunk ${chunkIndex + 1}/${chunks}: layers ${startLayer}-${endLayer}`);
      onChunkProgressChange({ current: chunkIndex + 1, total: chunks });
      
      // Update visual progress
      for (let layer = startLayer; layer <= endLayer; layer++) {
        onCurrentLayerChange(layer);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      const chunkConfig = {
        ...baseConfig,
        processingDepth: chunkDepth,
        previousLayers: accumulatedLayers,
        startFromLayer: startLayer
      };
      
      try {
        console.log(`Invoking chunk ${chunkIndex + 1} with config:`, chunkConfig);
        
        const { data, error } = await supabase.functions.invoke('genius-machine', {
          body: chunkConfig
        });
        
        if (error) {
          console.error(`Chunk ${chunkIndex + 1} error:`, error);
          throw error;
        }
        
        console.log(`Chunk ${chunkIndex + 1} completed:`, data);
        
        // Accumulate layers
        if (data.layers) {
          accumulatedLayers = [...accumulatedLayers, ...data.layers];
        }
        
        // Update intermediate results
        if (chunkIndex === chunks - 1) {
          // Final chunk - return complete results
          return {
            ...data,
            layers: accumulatedLayers,
            processingDepth: totalDepth,
            chunkProcessed: true
          };
        } else {
          // Intermediate chunk - show progress
          toast({
            title: `Chunk ${chunkIndex + 1}/${chunks} Complete`,
            description: `Processed layers ${startLayer}-${endLayer}. Continuing...`,
            variant: "default",
          });
        }
        
      } catch (chunkError) {
        console.error(`Chunk ${chunkIndex + 1} failed:`, chunkError);
        
        if (accumulatedLayers.length > 0) {
          // Return partial results if we have some progress
          toast({
            title: "Partial Results Available",
            description: `Completed ${accumulatedLayers.length} layers before timeout. Returning available insights.`,
            variant: "default",
          });
          
          const lastLayer = accumulatedLayers[accumulatedLayers.length - 1];
          return {
            insight: lastLayer.insight,
            confidence: lastLayer.confidence,
            tensionPoints: lastLayer.tensionPoints,
            layers: accumulatedLayers,
            processingDepth: accumulatedLayers.length,
            partialResults: true
          };
        } else {
          throw chunkError;
        }
      }
    }
  };

  return { processChunkedLayers };
};

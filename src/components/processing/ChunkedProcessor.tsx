
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
    chunkSize = 3, // Increased chunk size for better efficiency
    onChunkProgressChange,
    onCurrentLayerChange,
  }: ChunkedProcessorProps): Promise<ProcessingResult> => {
    const chunks = Math.ceil(totalDepth / chunkSize);
    let accumulatedLayers: any[] = [];
    
    console.log(`Starting chunked processing: ${totalDepth} layers in ${chunks} chunks of size ${chunkSize}`);
    onChunkProgressChange({ current: 0, total: chunks });
    
    for (let chunkIndex = 0; chunkIndex < chunks; chunkIndex++) {
      const startLayer = (chunkIndex * chunkSize) + 1;
      const endLayer = Math.min(startLayer + chunkSize - 1, totalDepth);
      const actualChunkSize = endLayer - startLayer + 1;
      
      console.log(`Processing chunk ${chunkIndex + 1}/${chunks}: layers ${startLayer}-${endLayer} (${actualChunkSize} layers)`);
      
      const chunkConfig = {
        ...baseConfig,
        processingDepth: actualChunkSize,
        previousLayers: accumulatedLayers,
        startFromLayer: startLayer
      };
      
      onChunkProgressChange({ current: chunkIndex + 1, total: chunks });
      
      // Update visual progress
      for (let layer = startLayer; layer <= endLayer; layer++) {
        onCurrentLayerChange(layer);
        await new Promise(resolve => setTimeout(resolve, 200)); // Brief delay for visual feedback
      }
      
      try {
        const chunkStartTime = Date.now();
        
        console.log(`Calling genius-machine for chunk ${chunkIndex + 1} with config:`, {
          processingDepth: actualChunkSize,
          startFromLayer: startLayer,
          previousLayersCount: accumulatedLayers.length
        });
        
        // Extended timeout for chunked processing - 4 minutes per chunk
        const timeoutPromise = createProcessingTimeout(chunkIndex, 240000);
        const requestPromise = supabase.functions.invoke('genius-machine', {
          body: chunkConfig
        });
        
        const result = await Promise.race([requestPromise, timeoutPromise]);
        
        const chunkDuration = Date.now() - chunkStartTime;
        console.log(`Chunk ${chunkIndex + 1} completed in ${chunkDuration}ms`);
        
        // Validate and extract data
        const { data } = validateChunkResult(result, chunkIndex);
        
        console.log(`Chunk ${chunkIndex + 1} result:`, {
          hasLayers: !!data.layers,
          layerCount: data.layers?.length || 0,
          hasInsight: !!data.insight,
          expectedLayers: actualChunkSize
        });
        
        // Accumulate layers properly
        if (data.layers && data.layers.length > 0) {
          // Ensure layers are properly ordered and added
          const newLayers = data.layers.sort((a, b) => a.layerNumber - b.layerNumber);
          accumulatedLayers = [...accumulatedLayers, ...newLayers];
          console.log(`Total accumulated layers: ${accumulatedLayers.length}/${totalDepth}`);
        } else {
          console.warn(`Chunk ${chunkIndex + 1} returned no layers!`);
          // If this chunk failed but we have previous layers, continue
          if (accumulatedLayers.length > 0) {
            console.log('Continuing with existing layers...');
          } else {
            throw new Error(`No layers returned from chunk ${chunkIndex + 1}`);
          }
        }
        
        // Handle final vs intermediate chunks
        if (chunkIndex === chunks - 1) {
          // Final chunk - create final result
          const finalResult = createFinalResult(data, accumulatedLayers, totalDepth);
          
          console.log('Final chunked processing result:', {
            totalLayers: finalResult.layers?.length || 0,
            hasInsight: !!finalResult.insight,
            confidence: finalResult.confidence
          });
          
          toast({
            title: "🎯 Deep Processing Complete",
            description: `Successfully processed all ${accumulatedLayers.length} layers with ${Math.round((finalResult.confidence || 0) * 100)}% confidence`,
            variant: "default",
          });
          
          return finalResult;
        } else {
          // Intermediate chunk - show progress
          const progressData = createProgressToast(chunkIndex, chunks, startLayer, endLayer);
          toast(progressData);
          
          // Brief pause between chunks
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
      } catch (chunkError: any) {
        console.error(`Error in chunk ${chunkIndex + 1}:`, chunkError);
        
        // If we have accumulated layers from previous chunks, return partial results
        if (accumulatedLayers.length > 0) {
          const lastValidLayer = accumulatedLayers[accumulatedLayers.length - 1];
          
          toast({
            title: "Partial Results Available",
            description: `Completed ${accumulatedLayers.length} layers before error. Returning available insights.`,
            variant: "default",
          });
          
          return {
            insight: lastValidLayer?.synthesis?.insight || `Partial processing completed with ${accumulatedLayers.length} layers.`,
            confidence: lastValidLayer?.synthesis?.confidence || 0.6,
            tensionPoints: lastValidLayer?.synthesis?.tensionPoints || 3,
            noveltyScore: lastValidLayer?.synthesis?.noveltyScore || 5,
            emergenceDetected: lastValidLayer?.synthesis?.emergenceDetected || false,
            layers: accumulatedLayers,
            processingDepth: accumulatedLayers.length,
            partialResults: true,
            errorMessage: chunkError.message,
            logicTrail: lastValidLayer?.archetypeResponses || [],
            compressionFormats: lastValidLayer?.synthesis?.compressionFormats
          };
        } else {
          // No accumulated layers, re-throw error
          throw chunkError;
        }
      }
    }

    // This should never be reached, but TypeScript needs it
    throw new Error('Unexpected end of processing loop');
  };

  return { processChunkedLayers };
};


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
    chunkSize = 3,
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
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      try {
        const chunkStartTime = Date.now();
        
        console.log(`Calling genius-machine for chunk ${chunkIndex + 1} with config:`, {
          processingDepth: actualChunkSize,
          startFromLayer: startLayer,
          previousLayersCount: accumulatedLayers.length
        });
        
        const timeoutPromise = createProcessingTimeout(chunkIndex, 240000);
        const requestPromise = supabase.functions.invoke('genius-machine', {
          body: chunkConfig
        });
        
        const result = await Promise.race([requestPromise, timeoutPromise]);
        
        const chunkDuration = Date.now() - chunkStartTime;
        console.log(`Chunk ${chunkIndex + 1} completed in ${chunkDuration}ms`);
        
        const { data } = validateChunkResult(result, chunkIndex);
        
        console.log(`Chunk ${chunkIndex + 1} result:`, {
          hasLayers: !!data.layers,
          layerCount: data.layers?.length || 0,
          hasInsight: !!data.insight,
          expectedLayers: actualChunkSize
        });
        
        // Normalize and accumulate layers properly
        if (data.layers && data.layers.length > 0) {
          const normalizedLayers = data.layers
            .map(normalizeLayerStructure)
            .sort((a, b) => a.layerNumber - b.layerNumber);
          
          accumulatedLayers = [...accumulatedLayers, ...normalizedLayers];
          
          console.log(`Total accumulated layers: ${accumulatedLayers.length}/${totalDepth}`);
          console.log('Sample layer structure:', {
            layerNumber: normalizedLayers[0]?.layerNumber,
            hasInsight: !!normalizedLayers[0]?.insight,
            insightPreview: normalizedLayers[0]?.insight?.substring(0, 50) + '...'
          });
        } else {
          console.warn(`Chunk ${chunkIndex + 1} returned no layers!`);
          if (accumulatedLayers.length === 0) {
            throw new Error(`No layers returned from chunk ${chunkIndex + 1}`);
          }
        }
        
        // Handle final vs intermediate chunks
        if (chunkIndex === chunks - 1) {
          const finalResult = createFinalResult(data, accumulatedLayers, totalDepth);
          
          console.log('Final chunked processing result:', {
            totalLayers: finalResult.layers?.length || 0,
            hasInsight: !!finalResult.insight,
            confidence: finalResult.confidence,
            layersWithInsights: accumulatedLayers.filter(l => l.insight && l.insight !== `Layer ${l.layerNumber} insight not available`).length
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
          
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
      } catch (chunkError: any) {
        console.error(`Error in chunk ${chunkIndex + 1}:`, chunkError);
        
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

    throw new Error('Unexpected end of processing loop');
  };

  return { processChunkedLayers };
};

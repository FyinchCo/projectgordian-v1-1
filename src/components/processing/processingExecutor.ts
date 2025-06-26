import { useToast } from "@/hooks/use-toast";
import { ChunkedProcessor } from './ChunkedProcessor';
import { normalizeLayerStructure, deduplicateLayers } from './layerNormalizer';
import { generateCompressionFormats } from '../../../supabase/functions/genius-machine/compression.ts';

interface ProcessingExecutorParams {
  question: string;
  processingDepth: number[];
  circuitType: string;
  enhancedMode: boolean;
  customArchetypes: any;
  currentAssessment: any;
  compressionSettings?: any;
  onProcessingComplete: (results: any) => void;
  onCurrentLayerChange: (layer: number) => void;
  onChunkProgressChange: (progress: { current: number; total: number }) => void;
}

export const useProcessingExecutor = () => {
  const { toast } = useToast();

  const executeProcessing = async ({
    question,
    processingDepth,
    circuitType,
    enhancedMode,
    customArchetypes,
    currentAssessment,
    compressionSettings,
    onProcessingComplete,
    onCurrentLayerChange,
    onChunkProgressChange
  }: ProcessingExecutorParams) => {
    const processor = new ChunkedProcessor();
    
    try {
      const rawResults = await processor.processInChunks({
        question,
        processingDepth: processingDepth[0],
        circuitType,
        enhancedMode,
        customArchetypes,
        compressionSettings,
        onCurrentLayerChange,
        onChunkProgressChange
      });
      
      // Normalize and deduplicate layers
      const normalizedLayers = rawResults.layers.map(normalizeLayerStructure);
      const cleanLayers = deduplicateLayers(normalizedLayers);

      // Basic insight extraction
      const insight = cleanLayers.length > 0 ? cleanLayers[cleanLayers.length - 1].insight : 'No insights generated.';
      const confidence = cleanLayers.length > 0 ? cleanLayers[cleanLayers.length - 1].confidence : 0.5;
      const tensionPoints = cleanLayers.length > 0 ? cleanLayers[cleanLayers.length - 1].tensionPoints : 0;
      const noveltyScore = cleanLayers.length > 0 ? cleanLayers[cleanLayers.length - 1].noveltyScore : 5;
      const emergenceDetected = cleanLayers.some(layer => layer.emergenceDetected);

      // Generate compression formats
      let compressionFormats = null;
      if (insight) {
        try {
          compressionFormats = await generateCompressionFormats(
            insight,
            {
              insight,
              confidence,
              tensionPoints,
              noveltyScore,
              emergenceDetected,
              layers: cleanLayers,
              logicTrail: [],
              circuitType,
              processingDepth: cleanLayers.length
            },
            question
          );
        } catch (compressionError) {
          console.error('Failed to generate compression formats:', compressionError);
          toast({
            title: "Compression Failed",
            description: "Insight compression encountered an error. Displaying uncompressed insight.",
            variant: "destructive",
          });
        }
      }
      
      const finalResults = {
        ...rawResults,
        insight,
        confidence,
        tensionPoints,
        noveltyScore,
        emergenceDetected,
        compressionFormats,
        layers: cleanLayers,
        processingDepth: cleanLayers.length,
        logicTrailLength: cleanLayers.reduce((sum, layer) => 
          sum + (layer.archetypeResponses?.length || 0), 0)
      };
      
      console.log('Final results prepared for display:', {
        insight: finalResults.insight?.substring(0, 100) + '...',
        layerCount: finalResults.layers.length,
        hasCompressionFormats: !!finalResults.compressionFormats
      });
      
      onProcessingComplete(finalResults);
      return finalResults;
      
    } catch (error) {
      console.error('Processing execution failed:', error);
      throw error;
    }
  };

  return { executeProcessing };
};

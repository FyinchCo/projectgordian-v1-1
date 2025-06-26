
import { useToast } from "@/hooks/use-toast";
import { ChunkedProcessor } from './ChunkedProcessor';
import { normalizeLayerStructure, deduplicateLayers } from './layerNormalizer';

interface ProcessingExecutorParams {
  question: string;
  processingDepth: number[];
  circuitType: string;
  enhancedMode: boolean;
  customArchetypes: any;
  currentAssessment: any;
  compressionSettings?: any;
  outputType?: string;
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
    outputType,
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
        outputType,
        onCurrentLayerChange,
        onChunkProgressChange
      });
      
      // Normalize and deduplicate layers
      const normalizedLayers = rawResults.layers?.map(normalizeLayerStructure) || [];
      const cleanLayers = deduplicateLayers(normalizedLayers);

      // Basic insight extraction
      const insight = cleanLayers.length > 0 ? cleanLayers[cleanLayers.length - 1].insight : 'No insights generated.';
      const confidence = cleanLayers.length > 0 ? cleanLayers[cleanLayers.length - 1].confidence : 0.5;
      const tensionPoints = cleanLayers.length > 0 ? cleanLayers[cleanLayers.length - 1].tensionPoints : 0;
      const noveltyScore = cleanLayers.length > 0 ? cleanLayers[cleanLayers.length - 1].noveltyScore : 5;
      const emergenceDetected = cleanLayers.some(layer => layer.emergenceDetected);

      // Note: Compression formats are now handled by the main edge function with outputType
      // They will be included in the results if available
      const compressionFormats = (rawResults as any).compressionFormats || null;
      
      const finalResults = {
        insight,
        confidence,
        tensionPoints,
        noveltyScore,
        emergenceDetected,
        compressionFormats,
        layers: cleanLayers,
        processingDepth: cleanLayers.length,
        logicTrail: cleanLayers.reduce((acc, layer) => 
          acc.concat(layer.archetypeResponses?.map((response: any) => ({
            archetype: response.archetype || 'Unknown',
            contribution: response.response || ''
          })) || []), [] as Array<{archetype: string; contribution: string}>),
        circuitType,
        enhancedMode,
        outputType
      };
      
      console.log('Final results prepared for display:', {
        insight: finalResults.insight?.substring(0, 100) + '...',
        layerCount: finalResults.layers.length,
        hasCompressionFormats: !!finalResults.compressionFormats,
        outputType: finalResults.outputType
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

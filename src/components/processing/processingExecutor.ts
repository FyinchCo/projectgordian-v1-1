
import { processWithGeniusMachine } from './directProcessor';

export const useProcessingExecutor = () => {
  const executeProcessing = async (params: {
    question: string;
    processingDepth: number[];
    circuitType: string;
    enhancedMode: boolean;
    customArchetypes?: any;
    currentAssessment?: any;
    compressionSettings?: any;
    outputType?: string;
    onProcessingComplete: (results: any) => void;
    onCurrentLayerChange: (layer: number) => void;
    onChunkProgressChange: (progress: { current: number; total: number }) => void;
  }) => {
    console.log('=== PROCESSING EXECUTOR START ===');
    
    try {
      // Call the simplified direct processor
      const results = await processWithGeniusMachine({
        question: params.question,
        processingDepth: params.processingDepth[0], // Use first depth value
        circuitType: params.circuitType,
        enhancedMode: params.enhancedMode,
        customArchetypes: params.customArchetypes,
        compressionSettings: params.compressionSettings,
        outputType: params.outputType,
        onCurrentLayerChange: params.onCurrentLayerChange,
        onChunkProgressChange: params.onChunkProgressChange
      });

      console.log('✓ Processing completed successfully');
      
      // Call completion handler
      params.onProcessingComplete(results);
      
      return results;

    } catch (error) {
      console.error('Processing executor failed:', error);
      throw error;
    }
  };

  return { executeProcessing };
};

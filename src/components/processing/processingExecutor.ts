
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
    console.log('Executor received params:', {
      question: params.question.substring(0, 50) + '...',
      processingDepth: params.processingDepth,
      circuitType: params.circuitType,
      enhancedMode: params.enhancedMode
    });
    
    try {
      console.log('Calling processWithGeniusMachine...');
      
      // Call the direct processor for immediate reliable results
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
      console.log('Result confidence:', Math.round(results.confidence * 100) + '%');
      console.log('Layers generated:', results.layers.length);
      console.log('Calling onProcessingComplete...');
      
      // Call completion handler
      params.onProcessingComplete(results);
      
      console.log('✓ Processing executor completed successfully');
      return results;

    } catch (error) {
      console.error('Processing executor failed:', error);
      console.error('Error stack:', error.stack);
      throw new Error(`Processing system encountered an unexpected error: ${error.message}`);
    }
  };

  return { executeProcessing };
};


import { useReliableChunkProcessor } from './reliableChunkProcessor';
import { handleChunkError } from './chunkResultHandler';

interface ProcessingExecutorProps {
  question: string;
  processingDepth: number[];
  circuitType: string;
  enhancedMode: boolean;
  customArchetypes: any;
  currentAssessment: any;
  onProcessingComplete: (results: any) => void;
  onCurrentLayerChange: (layer: number) => void;
  onChunkProgressChange: (progress: { current: number; total: number }) => void;
}

export const useProcessingExecutor = () => {
  const { processChunkedLayersReliably } = useReliableChunkProcessor();

  const executeProcessing = async ({
    question,
    processingDepth,
    circuitType,
    enhancedMode,
    customArchetypes,
    currentAssessment,
    onProcessingComplete,
    onCurrentLayerChange,
    onChunkProgressChange
  }: ProcessingExecutorProps) => {

    const totalDepth = processingDepth[0];
    console.log(`=== PROCESSING EXECUTOR START ===`);
    console.log(`Using reliable chunked processor for ${totalDepth} layers`);

    const baseConfig = {
      question: question.trim(),
      processingDepth: totalDepth,
      circuitType,
      enhancedMode,
      customArchetypes: customArchetypes || 'default'
    };

    try {
      // Use reliable chunked processing
      const finalResults = await processChunkedLayersReliably({
        baseConfig,
        totalDepth,
        chunkSize: 2, // Conservative chunk size for reliability
        onChunkProgressChange,
        onCurrentLayerChange,
        config: {
          maxRetries: 2,
          baseTimeout: 240000, // 4 minutes
          backoffMultiplier: 1.5,
          contextWindowSize: 3,
          fallbackThreshold: 0.3
        }
      });

      console.log(`✓ Processing executor completed successfully`);
      onProcessingComplete(finalResults);
      
      return finalResults;

    } catch (error: any) {
      console.error(`=== PROCESSING EXECUTOR ERROR ===`);
      console.error('Final error:', error);
      
      // Try to salvage any partial results
      const partialResult = handleChunkError(error, [], 0);
      
      if (partialResult.partialResults) {
        console.log('Returning partial results from executor');
        onProcessingComplete(partialResult);
        return partialResult;
      } else {
        // Complete failure - throw to be handled by ProcessingLogic
        throw error;
      }
    }
  };

  return { executeProcessing };
};

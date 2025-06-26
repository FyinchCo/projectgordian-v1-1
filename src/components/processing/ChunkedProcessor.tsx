
import { processWithGeniusMachine } from './directProcessor';

export const useChunkedProcessor = () => {
  // This hook is kept for compatibility but now uses the direct processor
  const processChunkedLayers = processWithGeniusMachine;
  
  return { processChunkedLayers };
};

export class ChunkedProcessor {
  async processInChunks({
    question,
    processingDepth,
    circuitType,
    enhancedMode,
    customArchetypes,
    compressionSettings,
    outputType,
    onCurrentLayerChange,
    onChunkProgressChange
  }: {
    question: string;
    processingDepth: number;
    circuitType: string;
    enhancedMode: boolean;
    customArchetypes?: any;
    compressionSettings?: any;
    outputType?: string;
    onCurrentLayerChange: (layer: number) => void;
    onChunkProgressChange: (progress: { current: number; total: number }) => void;
  }) {
    console.log('=== CHUNKED PROCESSOR - USING DIRECT CALL ===');
    
    try {
      // Use the direct processor function instead of a React hook
      return await processWithGeniusMachine({
        question,
        processingDepth,
        circuitType,
        enhancedMode,
        customArchetypes,
        compressionSettings,
        outputType,
        onCurrentLayerChange,
        onChunkProgressChange
      });
      
    } catch (error) {
      console.error('ChunkedProcessor failed:', error);
      throw error;
    }
  }
}

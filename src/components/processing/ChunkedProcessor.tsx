
import { useCoreProcessor } from './coreProcessor';

export const useChunkedProcessor = () => {
  const { processChunkedLayers } = useCoreProcessor();
  
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
    console.log('=== CHUNKED PROCESSOR - CALLING REAL FUNCTION ===');
    
    try {
      // Import the core processor function
      const { useCoreProcessor } = await import('./coreProcessor');
      const processor = useCoreProcessor();
      
      // Call the real processing function
      return await processor.processChunkedLayers({
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

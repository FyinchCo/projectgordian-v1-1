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
    onCurrentLayerChange,
    onChunkProgressChange
  }: {
    question: string;
    processingDepth: number;
    circuitType: string;
    enhancedMode: boolean;
    customArchetypes?: any;
    compressionSettings?: any;
    onCurrentLayerChange: (layer: number) => void;
    onChunkProgressChange: (progress: { current: number; total: number }) => void;
  }) {
    const chunkSize = 10; // Example chunk size
    const chunks = Array.from({ length: Math.ceil(question.length / chunkSize) }, (_, i) => i * chunkSize);

    const chunkConfigs = chunks.map((chunkSize, index) => ({
      question,
      processingDepth: chunkSize,
      circuitType,
      enhancedMode,
      customArchetypes,
      compressionSettings,
      chunkIndex: index,
      totalChunks: chunks.length
    }));

    // ... keep existing code (rest of the processing logic)
  }
}

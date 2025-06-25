
import { useCoreProcessor } from './coreProcessor';

export const useChunkedProcessor = () => {
  const { processChunkedLayers } = useCoreProcessor();
  
  return { processChunkedLayers };
};

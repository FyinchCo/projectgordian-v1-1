
import { processWithGeniusMachine } from './directProcessor';

export const useCoreProcessor = () => {
  // The hook now just returns the direct processor function
  const processChunkedLayers = processWithGeniusMachine;

  return { processChunkedLayers };
};

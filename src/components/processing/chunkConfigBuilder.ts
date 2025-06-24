
import { ChunkConfig } from './types';

export const buildChunkConfig = (
  baseConfig: any,
  chunkIndex: number,
  chunkSize: number,
  totalDepth: number,
  accumulatedLayers: any[]
): ChunkConfig => {
  const startLayer = chunkIndex * chunkSize + 1;
  const endLayer = Math.min((chunkIndex + 1) * chunkSize, totalDepth);
  const chunkDepth = endLayer - startLayer + 1;
  const totalChunks = Math.ceil(totalDepth / chunkSize);

  const chunkConfig = {
    ...baseConfig,
    processingDepth: chunkDepth,
    previousLayers: accumulatedLayers,
    startFromLayer: startLayer
  };

  return {
    config: chunkConfig,
    startLayer,
    endLayer,
    chunkDepth,
    chunkIndex,
    totalChunks
  };
};

export const logChunkStart = (chunkConfig: ChunkConfig) => {
  console.log(`Processing chunk ${chunkConfig.chunkIndex + 1}/${chunkConfig.totalChunks}: layers ${chunkConfig.startLayer}-${chunkConfig.endLayer} (depth: ${chunkConfig.chunkDepth})`);
  console.log(`Chunk ${chunkConfig.chunkIndex + 1} config:`, {
    depth: chunkConfig.chunkDepth,
    startLayer: chunkConfig.startLayer,
    previousLayerCount: chunkConfig.config.previousLayers?.length || 0,
    timestamp: new Date().toISOString()
  });
};

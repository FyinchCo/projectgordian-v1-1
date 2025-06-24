
export interface ChunkedProcessorProps {
  baseConfig: any;
  totalDepth: number;
  chunkSize: number;
  onChunkProgressChange: (progress: { current: number; total: number }) => void;
  onCurrentLayerChange: (layer: number) => void;
}

export interface ChunkConfig {
  config: any;
  startLayer: number;
  endLayer: number;
  chunkDepth: number;
  chunkIndex: number;
  totalChunks: number;
}

export interface ChunkResult {
  data?: any;
  error?: any;
  chunkIndex: number;
  processingTime: number;
}

export interface ProcessingResult {
  insight?: string;
  confidence?: number;
  tensionPoints?: number;
  noveltyScore?: number;
  emergenceDetected?: boolean;
  layers?: any[];
  processingDepth?: number;
  chunkProcessed?: boolean;
  partialResults?: boolean;
  errorMessage?: string;
  logicTrail?: Array<{
    archetype: string;
    contribution: string;
  }>;
  circuitType?: string;
  enhancedMode?: boolean;
  assumptionAnalysis?: any;
  assumptionChallenge?: any;
  finalTensionMetrics?: any;
  compressionFormats?: any;
}

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

export interface QuestionQualityMetrics {
  geniusYield: number;
  constraintBalance: number;
  metaPotential: number;
  effortVsEmergence: number;
  overallScore: number;
  feedback: string;
  recommendations: string[];
}

export interface EnhancedQualityMetrics {
  insightDepth: number;
  practicalValue: number;
  noveltyScore: number;
  coherenceScore: number;
  systemReliability: number;
  responseCompleteness: number;
  breakthroughPotential: number;
  userSatisfactionPredictor: number;
  overallQuality: number;
  strengths: string[];
  improvements: string[];
  confidenceLevel: 'High' | 'Medium' | 'Low';
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
  questionQuality?: QuestionQualityMetrics;
  enhancedQualityMetrics?: EnhancedQualityMetrics;
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

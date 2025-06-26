
export interface Archetype {
  name: string;
  description: string;
  languageStyle: string;
  imagination: number;
  skepticism: number;
  aggression: number;
  emotionality: number;
  constraint?: string;
  systemPrompt?: string;
}

export interface ArchetypeResponse {
  archetype: string;
  response: string;
  processingTime: number;
  timestamp: number;
}

export interface LayerResult {
  layerNumber: number;
  archetypeResponses: ArchetypeResponse[];
  synthesis: {
    insight: string;
    confidence: number;
    tensionPoints: number;
    emergenceDetected: boolean;
    keyTensions?: string[];
    convergentThemes?: string[];
  };
  logicTrail: Array<{
    archetype: string;
    contribution: string;
  }>;
  circuitType: string;
  timestamp: number;
}

export interface ProcessedResults {
  insight: string;
  confidence: number;
  tensionPoints: number;
  noveltyScore: number;
  emergenceDetected: boolean;
  layers: Array<{
    layerNumber: number;
    insight: string;
    confidence: number;
    tensionPoints: number;
    circuitType: string;
    timestamp: number;
  }>;
  logicTrail: Array<{
    archetype: string;
    contribution: string;
  }>;
  circuitType: string;
  processingDepth: number;
  enhancedMode: boolean;
  questionQuality: {
    geniusYield: number;
    constraintBalance: number;
    metaPotential: number;
    effortVsEmergence: number;
    overallScore: number;
    feedback: string;
    recommendations: string[];
  };
  compressionFormats?: {
    ultraConcise: string;
    medium: string;
    comprehensive: string;
  };
}

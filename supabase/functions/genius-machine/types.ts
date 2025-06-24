export interface ArchetypeResponse {
  archetype: string;
  contribution: string;
}

export interface TensionMetrics {
  tensionScore: number;
  contradictionCount: number;
  consensusRisk: number;
}

export interface SynthesisResult {
  insight: string;
  confidence: number;
  tensionPoints: number;
  noveltyScore: number;
  emergenceDetected: boolean;
  questionQuality?: QuestionQualityMetrics;
}

export interface AssumptionAnalysis {
  assumptions: string[];
  challengingQuestions: string[];
  resistanceScore: number;
}

export interface AssumptionChallenge {
  challengedAssumptions: string[];
  reframedQuestion: string;
  disruptionLevel: number;
}

export interface LayerResult {
  layerNumber: number;
  circuitType: string;
  archetypeResponses: ArchetypeResponse[];
  synthesis: SynthesisResult;
  assumptionAnalysis?: AssumptionAnalysis;
  assumptionChallenge?: AssumptionChallenge;
  tensionMetrics?: TensionMetrics;
  enhancedMode: boolean;
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

export interface Archetype {
  name: string;
  systemPrompt?: string;
  description?: string;
  languageStyle?: string;
  imagination?: number;
  skepticism?: number;
  aggression?: number;
  emotionality?: number;
  constraint?: string;
}

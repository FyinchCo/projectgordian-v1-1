
export interface ArchetypeTestConfiguration {
  id: string;
  name: string;
  description: string;
  archetypes: Array<{
    name: string;
    description: string;
    languageStyle: string;
    imagination: number;
    skepticism: number;
    aggression: number;
    emotionality: number;
    constraint?: string;
  }>;
  metadata: {
    version: string;
    hypothesis: string;
    expectedImprovements: string[];
  };
}

export interface TestQuestion {
  id: string;
  question: string;
  domain: string;
  expectedOutcomes: string[];
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  category: 'philosophical' | 'technical' | 'creative' | 'social' | 'business' | 'scientific';
  archetypeTarget?: string;
  measuresQualities?: string[];
  // Market viability testing properties
  marketSegment?: string;
  customerValue?: string;
  typicalCost?: string;
  realWorldContext?: string;
}

export interface TestResult {
  configurationId: string;
  questionId: string;
  timestamp: number;
  processingTime: number;
  results: {
    insight: string;
    confidence: number;
    tensionPoints: number;
    noveltyScore: number;
    emergenceDetected: boolean;
    questionQuality: any;
    layers: any[];
  };
  qualityMetrics: {
    insightQuality: number;
    noveltyScore: number;
    coherenceScore: number;
    breakthroughPotential: number;
    practicalValue: number;
    overallScore: number;
  };
}

export interface ComparisonResult {
  configurationComparison: {
    configA: string;
    configB: string;
    winner: string;
    confidenceLevel: number;
    significantDifferences: string[];
  };
  statisticalAnalysis: {
    averageScores: Record<string, number>;
    standardDeviations: Record<string, number>;
    sampleSize: number;
    pValue?: number;
  };
  qualitativeAnalysis: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
}

export interface ArchetypeInsight {
  archetypeName: string;
  targetedQuestions: number;
  averagePerformance: number;
  roleEffectiveness: string;
  specificWeaknesses: string[];
  optimizationSuggestions: string[];
}

export interface ConfigurationPerformance {
  averageScore: number;
  testCount: number;
  strengths: string[];
  improvements: string[];
}

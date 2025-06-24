
export interface LearningConfiguration {
  originalConfig: any;
  optimizedConfig: any;
  confidence: number;
  reasoning: string;
  expectedImprovement: number;
}

export interface MetaInsight {
  type: 'archetype_tuning' | 'circuit_optimization' | 'depth_adjustment' | 'tension_calibration';
  insight: string;
  evidence: string;
  confidence: number;
  applicability: string[];
}

export interface SystemEvolution {
  totalLearningCycles: number;
  qualityTrend: string;
  learningVelocity: number;
  maturity: number;
}

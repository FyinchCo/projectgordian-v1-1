
import { analyzeDomain } from "./domainDetector";

export interface EnhancedQuestionAssessment {
  complexityScore: number;
  domainType: string;
  abstractionLevel: string;
  controversyPotential: number;
  noveltyRequirement: number;
  stakeholderComplexity: number;
  breakthroughPotential: number;
  cognitiveComplexity: number;
  recommendations: {
    processingDepth: number;
    circuitType: string;
    enhancedMode: boolean;
    archetypeEmphasis: string[];
    reasoning: string;
    metaLearningApplied: boolean;
    learningConfidence: number;
    expectedImprovement: number;
  };
  archetypeConfigurations: any[];
  tensionParameters: any;
  processingConfiguration: any;
  metaOptimization?: {
    appliedOptimizations: string[];
    learningInsights: string[];
    systemConfidence: number;
  };
}

const createBaseArchetypeConfigurations = () => [
  {
    name: "The Visionary",
    personalityAdjustments: { imagination: 8, skepticism: 2, aggression: 3, emotionality: 7 },
    emphasis: 7
  },
  {
    name: "The Mystic",
    personalityAdjustments: { imagination: 7, skepticism: 3, aggression: 1, emotionality: 9 },
    emphasis: 6
  },
  {
    name: "The Skeptic", 
    personalityAdjustments: { imagination: 3, skepticism: 9, aggression: 5, emotionality: 2 },
    emphasis: 7
  },
  {
    name: "The Realist",
    personalityAdjustments: { imagination: 2, skepticism: 7, aggression: 8, emotionality: 3 },
    emphasis: 6
  },
  {
    name: "The Contrarian",
    personalityAdjustments: { imagination: 5, skepticism: 6, aggression: 9, emotionality: 4 },
    emphasis: 5
  }
];

const determineProcessingConfiguration = (domain: any) => {
  let processingDepth = 2;
  let circuitType = "sequential";
  const enhancedMode = true;
  
  if (domain.isPhilosophical) {
    processingDepth = 3;
  } else if (domain.isBusiness) {
    processingDepth = 2;
  } else if (domain.isTechnical) {
    circuitType = "parallel";
  } else if (domain.isCreative) {
    processingDepth = 3;
  }
  
  if (domain.isComplex) {
    processingDepth = Math.min(processingDepth + 1, 5);
  }
  
  return { processingDepth, circuitType, enhancedMode };
};

export const createEnhancedIntelligentFallback = async (
  question: string,
  metaLearning: any
): Promise<EnhancedQuestionAssessment> => {
  const domain = analyzeDomain(question);
  const baseArchetypeConfigs = createBaseArchetypeConfigurations();
  const { processingDepth, circuitType, enhancedMode } = determineProcessingConfiguration(domain);
  
  const baseAssessment = {
    complexityScore: domain.complexityScore,
    domainType: domain.domainType,
    abstractionLevel: domain.isPhilosophical ? "Metaphysical" : domain.isTechnical ? "Concrete" : "Theoretical",
    controversyPotential: domain.controversyPotential,
    noveltyRequirement: domain.isCreative ? 8 : 5,
    stakeholderComplexity: domain.isSocial || domain.isBusiness ? 7 : 4,
    breakthroughPotential: domain.isPhilosophical || domain.isCreative ? 8 : 5,
    cognitiveComplexity: domain.complexityScore
  };
  
  // Apply meta-learning optimization
  let metaOptimization = null;
  let finalProcessingDepth = processingDepth;
  let finalCircuitType = circuitType;
  let finalArchetypeConfigs = baseArchetypeConfigs;
  let learningConfidence = 0.3;
  let expectedImprovement = 0;
  
  try {
    const fallbackConfig = {
      processingDepth,
      circuitType,
      enhancedMode,
      archetypeConfigurations: baseArchetypeConfigs
    };
    
    const metaResult = await metaLearning.generateMetaOptimizedConfig(
      question,
      baseAssessment,
      fallbackConfig
    );
    
    if (metaResult && metaResult.confidence > 0.3) {
      finalProcessingDepth = metaResult.optimizedConfig.processingDepth;
      finalCircuitType = metaResult.optimizedConfig.circuitType;
      finalArchetypeConfigs = metaResult.optimizedConfig.archetypeConfigurations || baseArchetypeConfigs;
      learningConfidence = metaResult.confidence;
      expectedImprovement = metaResult.expectedImprovement;
      
      metaOptimization = {
        appliedOptimizations: [
          `Processing depth optimized to ${finalProcessingDepth}`,
          `Circuit type set to ${finalCircuitType}`,
          'Archetype emphasis tuned based on learning'
        ],
        learningInsights: [metaResult.reasoning],
        systemConfidence: metaResult.confidence
      };
    }
  } catch (error) {
    console.warn('Meta-learning optimization failed, using base configuration:', error);
  }
  
  return {
    ...baseAssessment,
    recommendations: {
      processingDepth: finalProcessingDepth,
      circuitType: finalCircuitType,
      enhancedMode,
      archetypeEmphasis: finalArchetypeConfigs.filter(a => a.emphasis >= 7).map(a => a.name),
      reasoning: metaOptimization 
        ? `Meta-learning enhanced: ${metaOptimization.learningInsights[0]}`
        : `Intelligent analysis detected ${domain.domainType.toLowerCase()} domain with optimized configuration. All 5 archetypes active with domain-specific emphasis tuning.`,
      metaLearningApplied: !!metaOptimization,
      learningConfidence,
      expectedImprovement
    },
    archetypeConfigurations: finalArchetypeConfigs,
    tensionParameters: {
      contradictionThreshold: domain.controversyPotential,
      recursionDepth: finalProcessingDepth,
      consensusRiskTolerance: domain.isPhilosophical ? 8 : 5,
      dialecticalMode: true
    },
    processingConfiguration: {
      optimalDepth: finalProcessingDepth,
      circuitType: finalCircuitType,
      enhancedMode,
      compressionStyle: domain.isCreative ? "poetic" : domain.isBusiness ? "actionable" : "insight-summary",
      outputFormat: domain.isTechnical ? "technical" : domain.isPhilosophical ? "provocative" : "balanced"
    },
    metaOptimization
  };
};

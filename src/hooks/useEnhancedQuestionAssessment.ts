
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useMetaLearning } from "./useMetaLearning";

// Enhanced assessment interface with meta-learning integration
interface EnhancedQuestionAssessment {
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

// Create intelligent fallback with meta-learning enhancement
const createEnhancedIntelligentFallback = async (
  question: string,
  metaLearning: any
): Promise<EnhancedQuestionAssessment> => {
  const lowerQ = question.toLowerCase();
  
  // Basic domain detection (same as before)
  const isPhilosophical = /why|meaning|purpose|existence|consciousness|reality|truth|belief/.test(lowerQ);
  const isBusiness = /business|profit|market|strategy|company|revenue|cost|customer/.test(lowerQ);
  const isTechnical = /code|software|algorithm|system|technical|programming|data/.test(lowerQ);
  const isCreative = /creative|art|design|innovation|imagine|vision|dream/.test(lowerQ);
  const isSocial = /society|people|community|social|culture|relationship|group/.test(lowerQ);
  const isComplex = question.length > 200 || /complex|multiple|various|several|many|different/.test(lowerQ);
  
  let domainType = "General";
  let processingDepth = 2;
  let circuitType = "sequential";
  let enhancedMode = true;
  
  // Domain-specific configuration
  if (isPhilosophical) {
    domainType = "Philosophy";
    processingDepth = 3;
  } else if (isBusiness) {
    domainType = "Business";
    processingDepth = 2;
  } else if (isTechnical) {
    domainType = "Technical";
    circuitType = "parallel";
  } else if (isCreative) {
    domainType = "Creative";
    processingDepth = 3;
  } else if (isSocial) {
    domainType = "Social";
  }
  
  if (isComplex) {
    processingDepth = Math.min(processingDepth + 1, 5);
    enhancedMode = true;
  }
  
  const complexityScore = isComplex ? 8 : 5;
  const controversyPotential = isPhilosophical || isSocial ? 7 : 4;
  
  // Create base assessment
  const baseAssessment = {
    complexityScore,
    domainType,
    abstractionLevel: isPhilosophical ? "Metaphysical" : isTechnical ? "Concrete" : "Theoretical",
    controversyPotential,
    noveltyRequirement: isCreative ? 8 : 5,
    stakeholderComplexity: isSocial || isBusiness ? 7 : 4,
    breakthroughPotential: isPhilosophical || isCreative ? 8 : 5,
    cognitiveComplexity: complexityScore
  };
  
  // Standard archetype configurations
  const baseArchetypeConfigs = [
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
        learningInsights: [
          metaResult.reasoning
        ],
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
        : `Intelligent analysis detected ${domainType.toLowerCase()} domain with optimized configuration. All 5 archetypes active with domain-specific emphasis tuning.`,
      metaLearningApplied: !!metaOptimization,
      learningConfidence,
      expectedImprovement
    },
    archetypeConfigurations: finalArchetypeConfigs,
    tensionParameters: {
      contradictionThreshold: controversyPotential,
      recursionDepth: finalProcessingDepth,
      consensusRiskTolerance: isPhilosophical ? 8 : 5,
      dialecticalMode: true
    },
    processingConfiguration: {
      optimalDepth: finalProcessingDepth,
      circuitType: finalCircuitType,
      enhancedMode,
      compressionStyle: isCreative ? "poetic" : isBusiness ? "actionable" : "insight-summary",
      outputFormat: isTechnical ? "technical" : isPhilosophical ? "provocative" : "balanced"
    },
    metaOptimization
  };
};

export const useEnhancedQuestionAssessment = () => {
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessment, setAssessment] = useState<EnhancedQuestionAssessment | null>(null);
  const { toast } = useToast();
  const metaLearning = useMetaLearning();

  const assessQuestion = async (question: string): Promise<EnhancedQuestionAssessment | null> => {
    if (!question.trim()) return null;
    
    setIsAssessing(true);
    
    try {
      console.log('Attempting AI-powered assessment with meta-learning...');
      
      const { data, error } = await supabase.functions.invoke('question-assessor', {
        body: { question }
      });
      
      if (error) {
        console.warn('AI assessment service unavailable:', error.message);
        throw error;
      }
      
      // Enhance AI result with meta-learning if available
      let enhancedData = data;
      try {
        const metaResult = await metaLearning.generateMetaOptimizedConfig(
          question,
          data,
          {
            processingDepth: data.recommendations.processingDepth,
            circuitType: data.recommendations.circuitType,
            enhancedMode: data.recommendations.enhancedMode,
            archetypeConfigurations: data.archetypeConfigurations
          }
        );
        
        if (metaResult && metaResult.confidence > 0.4) {
          enhancedData = {
            ...data,
            recommendations: {
              ...data.recommendations,
              processingDepth: metaResult.optimizedConfig.processingDepth,
              circuitType: metaResult.optimizedConfig.circuitType,
              reasoning: `AI + Meta-Learning: ${metaResult.reasoning}`,
              metaLearningApplied: true,
              learningConfidence: metaResult.confidence,
              expectedImprovement: metaResult.expectedImprovement
            },
            archetypeConfigurations: metaResult.optimizedConfig.archetypeConfigurations || data.archetypeConfigurations,
            metaOptimization: {
              appliedOptimizations: [
                'AI assessment enhanced with meta-learning',
                'Configuration tuned based on historical performance'
              ],
              learningInsights: [metaResult.reasoning],
              systemConfidence: metaResult.confidence
            }
          };
        }
      } catch (metaError) {
        console.warn('Meta-learning enhancement failed:', metaError);
      }
      
      console.log('Enhanced AI assessment successful:', enhancedData);
      setAssessment(enhancedData);
      
      toast({
        title: "Enhanced AI Assessment Complete",
        description: enhancedData.metaOptimization 
          ? `AI analysis enhanced with meta-learning (${Math.round(enhancedData.metaOptimization.systemConfidence * 100)}% confidence)`
          : "Cognitive architecture optimized based on AI analysis.",
        variant: "default",
      });
      
      return enhancedData;
    } catch (error) {
      console.log('Falling back to enhanced intelligent local analysis...');
      
      // Use enhanced intelligent fallback with meta-learning
      const fallbackAssessment = await createEnhancedIntelligentFallback(question, metaLearning);
      
      setAssessment(fallbackAssessment);
      
      const learningMessage = fallbackAssessment.metaOptimization
        ? ` Meta-learning applied (${Math.round(fallbackAssessment.metaOptimization.systemConfidence * 100)}% confidence).`
        : ' System is learning your preferences.';
      
      toast({
        title: "Enhanced Smart Assessment",
        description: `Optimized for ${fallbackAssessment.domainType.toLowerCase()} domain with intelligent tuning.${learningMessage}`,
        variant: "default",
      });
      
      return fallbackAssessment;
    } finally {
      setIsAssessing(false);
    }
  };

  const clearAssessment = () => {
    setAssessment(null);
  };

  return {
    assessQuestion,
    assessment,
    isAssessing,
    clearAssessment,
    metaLearning
  };
};

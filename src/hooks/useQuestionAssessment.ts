
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ArchetypeConfiguration {
  name: string;
  personalityAdjustments: {
    imagination: number;
    skepticism: number;
    aggression: number;
    emotionality: number;
  };
  emphasis: number; // 1-10 how much to emphasize this archetype
}

interface TensionParameters {
  contradictionThreshold: number;
  recursionDepth: number;
  consensusRiskTolerance: number;
  dialecticalMode: boolean;
}

interface ProcessingConfiguration {
  optimalDepth: number;
  circuitType: string;
  enhancedMode: boolean;
  compressionStyle: string;
  outputFormat: string;
}

interface QuestionAssessment {
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
  };
  archetypeConfigurations: ArchetypeConfiguration[];
  tensionParameters: TensionParameters;
  processingConfiguration: ProcessingConfiguration;
}

// Intelligent fallback assessment based on question analysis
const createIntelligentFallback = (question: string): QuestionAssessment => {
  const lowerQ = question.toLowerCase();
  
  // Basic keyword-based analysis
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
  
  // Archetype configurations based on domain
  let archetypeConfigs: ArchetypeConfiguration[] = [
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
  
  if (isPhilosophical) {
    domainType = "Philosophy";
    processingDepth = 3;
    archetypeConfigs[0].emphasis = 9; // Visionary
    archetypeConfigs[1].emphasis = 8; // Mystic
    archetypeConfigs[2].emphasis = 6; // Skeptic
  } else if (isBusiness) {
    domainType = "Business";
    processingDepth = 2;
    archetypeConfigs[3].emphasis = 9; // Realist
    archetypeConfigs[2].emphasis = 8; // Skeptic
    archetypeConfigs[0].emphasis = 5; // Visionary
  } else if (isTechnical) {
    domainType = "Technical";
    processingDepth = 2;
    circuitType = "parallel";
    archetypeConfigs[2].emphasis = 10; // Skeptic
    archetypeConfigs[3].emphasis = 7; // Realist
    archetypeConfigs[0].emphasis = 4; // Visionary
  } else if (isCreative) {
    domainType = "Creative";
    processingDepth = 3;
    archetypeConfigs[0].emphasis = 10; // Visionary
    archetypeConfigs[1].emphasis = 8; // Mystic
    archetypeConfigs[2].emphasis = 4; // Skeptic
  } else if (isSocial) {
    domainType = "Social";
    processingDepth = 2;
    // Balanced emphasis for social issues
    archetypeConfigs.forEach(config => config.emphasis = 7);
  }
  
  if (isComplex) {
    processingDepth = Math.min(processingDepth + 1, 5);
    enhancedMode = true;
  }
  
  const complexityScore = isComplex ? 8 : 5;
  const controversyPotential = isPhilosophical || isSocial ? 7 : 4;
  
  return {
    complexityScore,
    domainType,
    abstractionLevel: isPhilosophical ? "Metaphysical" : isTechnical ? "Concrete" : "Theoretical",
    controversyPotential,
    noveltyRequirement: isCreative ? 8 : 5,
    stakeholderComplexity: isSocial || isBusiness ? 7 : 4,
    breakthroughPotential: isPhilosophical || isCreative ? 8 : 5,
    cognitiveComplexity: complexityScore,
    recommendations: {
      processingDepth,
      circuitType,
      enhancedMode,
      archetypeEmphasis: archetypeConfigs.filter(a => a.emphasis >= 7).map(a => a.name),
      reasoning: `Intelligent analysis detected ${domainType.toLowerCase()} domain with optimized configuration. All 5 archetypes active with domain-specific emphasis tuning.`
    },
    archetypeConfigurations: archetypeConfigs,
    tensionParameters: {
      contradictionThreshold: controversyPotential,
      recursionDepth: processingDepth,
      consensusRiskTolerance: isPhilosophical ? 8 : 5,
      dialecticalMode: true
    },
    processingConfiguration: {
      optimalDepth: processingDepth,
      circuitType,
      enhancedMode,
      compressionStyle: isCreative ? "poetic" : isBusiness ? "actionable" : "insight-summary",
      outputFormat: isTechnical ? "technical" : isPhilosophical ? "provocative" : "balanced"
    }
  };
};

export const useQuestionAssessment = () => {
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessment, setAssessment] = useState<QuestionAssessment | null>(null);
  const { toast } = useToast();

  const assessQuestion = async (question: string): Promise<QuestionAssessment | null> => {
    if (!question.trim()) return null;
    
    setIsAssessing(true);
    
    try {
      console.log('Attempting AI-powered assessment...');
      
      const { data, error } = await supabase.functions.invoke('question-assessor', {
        body: { question }
      });
      
      if (error) {
        console.warn('AI assessment service unavailable:', error.message);
        throw error;
      }
      
      console.log('AI assessment successful:', data);
      setAssessment(data);
      
      toast({
        title: "AI Assessment Complete",
        description: "Cognitive architecture optimized based on AI analysis.",
        variant: "default",
      });
      
      return data;
    } catch (error) {
      console.log('Falling back to intelligent local analysis...');
      
      // Use intelligent fallback based on question analysis
      const fallbackAssessment = createIntelligentFallback(question);
      
      setAssessment(fallbackAssessment);
      
      toast({
        title: "Smart Fallback Assessment",
        description: `Optimized for ${fallbackAssessment.domainType.toLowerCase()} domain - all archetypes active with intelligent tuning.`,
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
    clearAssessment
  };
};


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

export const useQuestionAssessment = () => {
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessment, setAssessment] = useState<QuestionAssessment | null>(null);
  const { toast } = useToast();

  const assessQuestion = async (question: string): Promise<QuestionAssessment | null> => {
    if (!question.trim()) return null;
    
    setIsAssessing(true);
    
    try {
      console.log('Assessing question with enhanced cognitive architecture analysis:', question);
      
      const { data, error } = await supabase.functions.invoke('question-assessor', {
        body: { question }
      });
      
      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }
      
      console.log('Enhanced assessment result:', data);
      setAssessment(data);
      return data;
    } catch (error) {
      console.error('Error assessing question:', error);
      
      // Provide a comprehensive fallback assessment with ALL archetypes active
      const fallbackAssessment: QuestionAssessment = {
        complexityScore: 5,
        domainType: "General",
        abstractionLevel: "Theoretical",
        controversyPotential: 5,
        noveltyRequirement: 5,
        stakeholderComplexity: 5,
        breakthroughPotential: 5,
        cognitiveComplexity: 5,
        recommendations: {
          processingDepth: 2,
          circuitType: "sequential",
          enhancedMode: true,
          archetypeEmphasis: ["The Visionary", "The Skeptic", "The Realist"],
          reasoning: "Default balanced settings with all archetypes active - assessment service temporarily unavailable."
        },
        archetypeConfigurations: [
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
        ],
        tensionParameters: {
          contradictionThreshold: 5,
          recursionDepth: 2,
          consensusRiskTolerance: 5,
          dialecticalMode: true
        },
        processingConfiguration: {
          optimalDepth: 2,
          circuitType: "sequential",
          enhancedMode: true,
          compressionStyle: "insight-summary",
          outputFormat: "balanced"
        }
      };
      
      setAssessment(fallbackAssessment);
      
      toast({
        title: "Assessment Notice",
        description: "Using default cognitive architecture with all archetypes active - assessment service temporarily unavailable.",
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

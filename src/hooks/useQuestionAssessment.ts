
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface QuestionAssessment {
  complexityScore: number;
  domainType: string;
  abstractionLevel: string;
  controversyPotential: number;
  noveltyRequirement: number;
  stakeholderComplexity: number;
  recommendations: {
    processingDepth: number;
    circuitType: string;
    enhancedMode: boolean;
    archetypeEmphasis: string[];
    reasoning: string;
  };
}

export const useQuestionAssessment = () => {
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessment, setAssessment] = useState<QuestionAssessment | null>(null);
  const { toast } = useToast();

  const assessQuestion = async (question: string): Promise<QuestionAssessment | null> => {
    if (!question.trim()) return null;
    
    setIsAssessing(true);
    
    try {
      console.log('Assessing question:', question);
      
      const { data, error } = await supabase.functions.invoke('question-assessor', {
        body: { question }
      });
      
      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }
      
      console.log('Assessment result:', data);
      setAssessment(data);
      return data;
    } catch (error) {
      console.error('Error assessing question:', error);
      
      // Provide a fallback assessment instead of failing completely
      const fallbackAssessment: QuestionAssessment = {
        complexityScore: 5,
        domainType: "General",
        abstractionLevel: "Theoretical",
        controversyPotential: 5,
        noveltyRequirement: 5,
        stakeholderComplexity: 5,
        recommendations: {
          processingDepth: 2,
          circuitType: "sequential",
          enhancedMode: true,
          archetypeEmphasis: ["The Visionary", "The Skeptic"],
          reasoning: "Default settings applied - assessment service temporarily unavailable."
        }
      };
      
      setAssessment(fallbackAssessment);
      
      toast({
        title: "Assessment Notice",
        description: "Using default optimization settings - assessment service temporarily unavailable.",
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

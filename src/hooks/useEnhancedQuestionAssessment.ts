
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useMetaLearning } from "./useMetaLearning";
import { createEnhancedIntelligentFallback, EnhancedQuestionAssessment } from "@/services/assessment/fallbackAssessmentCreator";

export const useEnhancedQuestionAssessment = () => {
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessment, setAssessment] = useState<EnhancedQuestionAssessment | null>(null);
  const { toast } = useToast();
  const metaLearning = useMetaLearning();

  const enhanceWithMetaLearning = async (aiData: any, question: string) => {
    try {
      const metaResult = await metaLearning.generateMetaOptimizedConfig(
        question,
        aiData,
        {
          processingDepth: aiData.recommendations.processingDepth,
          circuitType: aiData.recommendations.circuitType,
          enhancedMode: aiData.recommendations.enhancedMode,
          archetypeConfigurations: aiData.archetypeConfigurations
        }
      );
      
      if (metaResult && metaResult.confidence > 0.4) {
        return {
          ...aiData,
          recommendations: {
            ...aiData.recommendations,
            processingDepth: metaResult.optimizedConfig.processingDepth,
            circuitType: metaResult.optimizedConfig.circuitType,
            reasoning: `AI + Meta-Learning: ${metaResult.reasoning}`,
            metaLearningApplied: true,
            learningConfidence: metaResult.confidence,
            expectedImprovement: metaResult.expectedImprovement
          },
          archetypeConfigurations: metaResult.optimizedConfig.archetypeConfigurations || aiData.archetypeConfigurations,
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
    
    return aiData;
  };

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
      
      // Enhance AI result with meta-learning
      const enhancedData = await enhanceWithMetaLearning(data, question);
      
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

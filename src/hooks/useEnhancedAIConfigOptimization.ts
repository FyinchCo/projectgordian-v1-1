
import { useState, useEffect } from "react";
import { useEnhancedQuestionAssessment } from "./useEnhancedQuestionAssessment";
import { useToast } from "./use-toast";

export const useEnhancedAIConfigOptimization = () => {
  const { assessQuestion, assessment, isAssessing, metaLearning } = useEnhancedQuestionAssessment();
  const { toast } = useToast();
  const [optimizationReasoning, setOptimizationReasoning] = useState<{
    reasoning: string;
    domainType: string;
    metaLearningApplied?: boolean;
    systemConfidence?: number;
  } | null>(null);

  // Load optimization reasoning from localStorage on mount
  useEffect(() => {
    const savedReasoning = localStorage.getItem('genius-machine-optimization-reasoning');
    if (savedReasoning) {
      setOptimizationReasoning(JSON.parse(savedReasoning));
    }
  }, []);

  const optimizeAndApplyConfiguration = async (
    question: string,
    updateArchetype: (id: number, field: string, value: any) => void,
    updateTensionSettings: (field: string, value: number[]) => void,
    updateCompressionSettings: (field: string, value: any) => void
  ) => {
    if (!question.trim()) {
      toast({
        title: "Question Required",
        description: "Please enter a question to optimize configuration for.",
        variant: "destructive",
      });
      return null;
    }

    const result = await assessQuestion(question);
    
    if (result) {
      // Apply archetype configurations
      if (result.archetypeConfigurations) {
        result.archetypeConfigurations.forEach((config, index) => {
          const archetypeId = index + 1; // Assuming IDs start at 1
          updateArchetype(archetypeId, 'imagination', [config.personalityAdjustments.imagination]);
          updateArchetype(archetypeId, 'skepticism', [config.personalityAdjustments.skepticism]);
          updateArchetype(archetypeId, 'aggression', [config.personalityAdjustments.aggression]);
          updateArchetype(archetypeId, 'emotionality', [config.personalityAdjustments.emotionality]);
        });
      }

      // Apply tension parameters
      if (result.tensionParameters) {
        updateTensionSettings('contradictionThreshold', [result.tensionParameters.contradictionThreshold]);
        updateTensionSettings('recursionDepth', [result.tensionParameters.recursionDepth]);
        updateTensionSettings('archetypeOverlap', [Math.min(result.tensionParameters.consensusRiskTolerance, 5)]);
      }

      // Apply compression settings
      if (result.processingConfiguration) {
        updateCompressionSettings('style', result.processingConfiguration.compressionStyle || 'insight-summary');
        updateCompressionSettings('length', 'medium'); // Default to medium
        updateCompressionSettings('includeTrail', true);
        updateCompressionSettings('includeFullTranscript', false);
      }

      // Store the enhanced reasoning for display and persist to localStorage
      const reasoningData = {
        reasoning: result.recommendations.reasoning,
        domainType: result.domainType,
        metaLearningApplied: result.recommendations.metaLearningApplied || false,
        systemConfidence: result.metaOptimization?.systemConfidence || 0.3
      };
      setOptimizationReasoning(reasoningData);
      localStorage.setItem('genius-machine-optimization-reasoning', JSON.stringify(reasoningData));

      // Enhanced toast message
      const learningStatus = result.recommendations.metaLearningApplied
        ? ` Meta-learning system applied optimizations with ${Math.round((result.metaOptimization?.systemConfidence || 0) * 100)}% confidence.`
        : ' System is learning and will improve with use.';
      
      toast({
        title: "Enhanced Configuration Optimized",
        description: `All settings optimized for ${result.domainType.toLowerCase()} domain analysis.${learningStatus}`,
        variant: "default",
      });
    }

    return result;
  };

  // Record processing results for learning
  const recordProcessingResults = (
    question: string,
    configuration: any,
    results: any,
    qualityMetrics: any
  ) => {
    if (assessment) {
      metaLearning.recordProcessingResults(
        question,
        assessment,
        configuration,
        results,
        qualityMetrics
      );
    }
  };

  const clearOptimizationReasoning = () => {
    setOptimizationReasoning(null);
    localStorage.removeItem('genius-machine-optimization-reasoning');
  };

  const getLearningInsights = () => {
    return metaLearning.getLearningInsights();
  };

  return {
    optimizeAndApplyConfiguration,
    recordProcessingResults,
    assessment,
    isAssessing,
    optimizationReasoning,
    clearOptimizationReasoning,
    getLearningInsights,
    metaLearning
  };
};


import { useState } from "react";
import { useQuestionAssessment } from "./useQuestionAssessment";
import { useToast } from "./use-toast";

export const useAIConfigOptimization = () => {
  const { assessQuestion, assessment, isAssessing } = useQuestionAssessment();
  const { toast } = useToast();
  const [optimizationReasoning, setOptimizationReasoning] = useState<{
    reasoning: string;
    domainType: string;
  } | null>(null);

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

      // Store the reasoning for display
      setOptimizationReasoning({
        reasoning: result.recommendations.reasoning,
        domainType: result.domainType
      });

      toast({
        title: "Configuration Optimized",
        description: `All settings optimized for ${result.domainType.toLowerCase()} domain analysis.`,
        variant: "default",
      });
    }

    return result;
  };

  const clearOptimizationReasoning = () => {
    setOptimizationReasoning(null);
  };

  return {
    optimizeAndApplyConfiguration,
    assessment,
    isAssessing,
    optimizationReasoning,
    clearOptimizationReasoning
  };
};


import { useEffect } from "react";
import { useMetaLearning } from "./useMetaLearning";

interface UseResultsMetaLearningProps {
  results: any;
  question: string;
}

export const useResultsMetaLearning = ({ results, question }: UseResultsMetaLearningProps) => {
  const { recordProcessingResults } = useMetaLearning();

  useEffect(() => {
    if (results && results.questionQuality && question) {
      try {
        console.log('Recording processing results for meta-learning...');
        console.log('Question:', question);
        console.log('Results quality metrics:', results.questionQuality);
        
        // Create assessment object from results
        const assessment = {
          complexityScore: results.processingDepth || 5,
          domainType: "General", // We'll improve this later
          abstractionLevel: "Theoretical",
          controversyPotential: results.tensionPoints || 5,
          noveltyRequirement: results.noveltyScore || 5,
          stakeholderComplexity: 5,
          breakthroughPotential: results.emergenceDetected ? 8 : 5,
          cognitiveComplexity: results.processingDepth || 5
        };
        
        // Create configuration object from results
        const configuration = {
          processingDepth: results.processingDepth || 5,
          circuitType: results.circuitType || 'sequential',
          enhancedMode: results.enhancedMode !== false,
          archetypeConfigurations: [],
          tensionParameters: {}
        };
        
        // Record the results for meta-learning
        recordProcessingResults(
          question,
          assessment,
          configuration,
          {
            insight: results.insight,
            confidence: results.confidence,
            tensionPoints: results.tensionPoints,
            noveltyScore: results.noveltyScore || 5,
            emergenceDetected: results.emergenceDetected || false
          },
          results.questionQuality
        );
        
        console.log('Learning data recorded successfully');
      } catch (error) {
        console.warn('Failed to record learning data:', error);
      }
    } else {
      console.log('Missing required data for learning:', {
        hasResults: !!results,
        hasQuestionQuality: !!results?.questionQuality,
        hasQuestion: !!question
      });
    }
  }, [results, question, recordProcessingResults]);
};

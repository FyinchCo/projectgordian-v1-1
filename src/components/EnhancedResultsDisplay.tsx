import { MainInsightDisplay } from "@/components/results/MainInsightDisplay";
import { QuestionQualitySection } from "@/components/results/QuestionQualitySection";
import { AssumptionAnalysisSection } from "@/components/results/AssumptionAnalysisSection";
import { TensionAnalysisSection } from "@/components/results/TensionAnalysisSection";
import { ProcessingLayersSection } from "@/components/results/ProcessingLayersSection";
import { LogicTrailSection } from "@/components/results/LogicTrailSection";
import { LearningSystemStatus } from "@/components/results/LearningSystemStatus";
import { QuestionContext } from "@/components/results/QuestionContext";
import { ActionButtons } from "@/components/results/ActionButtons";
import { ActionPlanGenerator } from "@/components/results/ActionPlanGenerator";
import { useMetaLearning } from "@/hooks/useMetaLearning";
import { useEffect } from "react";

interface QuestionQualityMetrics {
  geniusYield: number;
  constraintBalance: number;
  metaPotential: number;
  effortVsEmergence: number;
  overallScore: number;
  feedback: string;
  recommendations: string[];
}

interface EnhancedResultsDisplayProps {
  results: {
    insight: string;
    confidence: number;
    tensionPoints: number;
    noveltyScore?: number;
    emergenceDetected?: boolean;
    enhancedMode?: boolean;
    questionQuality?: QuestionQualityMetrics;
    assumptionAnalysis?: {
      assumptions: string[];
      challengingQuestions: string[];
      resistanceScore: number;
    };
    assumptionChallenge?: {
      challengedAssumptions: string[];
      reframedQuestion: string;
      disruptionLevel: number;
    };
    finalTensionMetrics?: {
      tensionScore: number;
      contradictionCount: number;
      consensusRisk: number;
    };
    processingDepth?: number;
    circuitType?: string;
    compressionFormats?: {
      ultraConcise: string;
      medium: string;
      comprehensive: string;
    };
    layers?: Array<{
      layerNumber: number;
      circuitType: string;
      insight: string;
      confidence: number;
      tensionPoints: number;
      noveltyScore?: number;
      emergenceDetected?: boolean;
      tensionMetrics?: any;
      archetypeResponses: Array<{
        archetype: string;
        contribution: string;
      }>;
    }>;
    logicTrail: Array<{
      archetype: string;
      contribution: string;
    }>;
  };
  question: string;
  onReset: () => void;
  onExport: () => void;
}

export const EnhancedResultsDisplay = ({ results, question, onReset, onExport }: EnhancedResultsDisplayProps) => {
  const { recordProcessingResults } = useMetaLearning();

  // Record learning data when results are displayed
  useEffect(() => {
    if (results && results.questionQuality && question) {
      try {
        console.log('EnhancedResultsDisplay: Recording processing results for meta-learning...');
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
        
        console.log('EnhancedResultsDisplay: Learning data recorded successfully');
      } catch (error) {
        console.warn('EnhancedResultsDisplay: Failed to record learning data:', error);
      }
    } else {
      console.log('EnhancedResultsDisplay: Missing required data for learning:', {
        hasResults: !!results,
        hasQuestionQuality: !!results?.questionQuality,
        hasQuestion: !!question
      });
    }
  }, [results, question, recordProcessingResults]);

  // Safe render with error boundaries
  const renderSafeSection = (Component: React.ComponentType<any>, props: any, fallback?: React.ReactNode) => {
    try {
      return <Component {...props} />;
    } catch (error) {
      console.error('Error rendering section:', error);
      return fallback || null;
    }
  };

  // Safe logicTrail with fallback to empty array
  const safeLogicTrail = results.logicTrail || [];

  return (
    <div className="space-y-8">
      {/* Learning System Status */}
      <LearningSystemStatus questionQuality={results.questionQuality} />

      {/* Question Context */}
      <QuestionContext 
        question={question}
        reframedQuestion={results.assumptionChallenge?.reframedQuestion}
      />

      {/* Main Insight */}
      {renderSafeSection(MainInsightDisplay, {
        insight: results.insight,
        confidence: results.confidence,
        tensionPoints: results.tensionPoints,
        noveltyScore: results.noveltyScore,
        emergenceDetected: results.emergenceDetected,
        enhancedMode: results.enhancedMode,
        circuitType: results.circuitType,
        processingDepth: results.processingDepth,
        logicTrailLength: safeLogicTrail.length,
        compressionFormats: results.compressionFormats
      })}

      {/* NEW: Action Plan Generator - Post-Output Scaffolding */}
      <ActionPlanGenerator 
        insight={results.insight}
        question={question}
      />

      {/* Question Quality Evaluation */}
      {results.questionQuality && renderSafeSection(QuestionQualitySection, { 
        questionQuality: results.questionQuality 
      })}

      {/* Assumption Analysis */}
      {results.assumptionAnalysis && renderSafeSection(AssumptionAnalysisSection, { 
        assumptionAnalysis: results.assumptionAnalysis 
      })}

      {/* Tension Analysis */}
      {results.finalTensionMetrics && renderSafeSection(TensionAnalysisSection, { 
        tensionMetrics: results.finalTensionMetrics 
      })}

      {/* Processing Layers */}
      {renderSafeSection(ProcessingLayersSection, { layers: results.layers })}

      {/* Logic Trail */}
      {renderSafeSection(LogicTrailSection, { logicTrail: safeLogicTrail })}

      {/* Actions */}
      <ActionButtons onReset={onReset} onExport={onExport} />
    </div>
  );
};

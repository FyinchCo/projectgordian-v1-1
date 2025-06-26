
import { ResultsHeader } from "./results/ResultsHeader";
import { ResultsContent } from "./results/ResultsContent";
import { ResultsFooter } from "./results/ResultsFooter";
import { useResultsMetaLearning } from "@/hooks/useResultsMetaLearning";

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
  // Record learning data when results are displayed
  useResultsMetaLearning({ results, question });

  return (
    <div className="space-y-8">
      <ResultsHeader 
        questionQuality={results.questionQuality}
        question={question}
        reframedQuestion={results.assumptionChallenge?.reframedQuestion}
      />

      <ResultsContent 
        results={results}
        question={question}
      />

      <ResultsFooter 
        onReset={onReset}
        onExport={onExport}
      />
    </div>
  );
};

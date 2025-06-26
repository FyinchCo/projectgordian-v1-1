
import { MainInsightDisplay } from "./MainInsightDisplay";
import { QuestionQualitySection } from "./QuestionQualitySection";
import { AssumptionAnalysisSection } from "./AssumptionAnalysisSection";
import { TensionAnalysisSection } from "./TensionAnalysisSection";
import { ProcessingLayersSection } from "./ProcessingLayersSection";
import { LogicTrailSection } from "./LogicTrailSection";
import { ActionPlanGenerator } from "./ActionPlanGenerator";

interface ResultsContentProps {
  results: any;
  question: string;
}

export const ResultsContent = ({ results, question }: ResultsContentProps) => {
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

      {/* Action Plan Generator - Post-Output Scaffolding */}
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
    </div>
  );
};

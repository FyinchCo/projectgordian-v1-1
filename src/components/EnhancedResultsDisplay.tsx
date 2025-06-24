
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RotateCcw, Download, Brain, TrendingUp } from "lucide-react";
import { MainInsightDisplay } from "@/components/results/MainInsightDisplay";
import { QuestionQualitySection } from "@/components/results/QuestionQualitySection";
import { AssumptionAnalysisSection } from "@/components/results/AssumptionAnalysisSection";
import { TensionAnalysisSection } from "@/components/results/TensionAnalysisSection";
import { ProcessingLayersSection } from "@/components/results/ProcessingLayersSection";
import { LogicTrailSection } from "@/components/results/LogicTrailSection";
import { Badge } from "@/components/ui/badge";

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
  return (
    <div className="space-y-8">
      {/* Learning System Status - Show if question quality is available */}
      {results.questionQuality && (
        <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="w-5 h-5 text-green-600" />
              <div>
                <h3 className="text-sm font-semibold text-green-800">Learning Cycle Completed</h3>
                <p className="text-xs text-green-600">
                  Quality score: {results.questionQuality.overallScore}/10 | 
                  Results recorded for future optimization
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <Badge variant="outline" className="border-green-300 text-green-700">
                System Learning
              </Badge>
            </div>
          </div>
        </Card>
      )}

      {/* Question Context */}
      <Card className="p-6 bg-gray-50">
        <h3 className="font-bold text-sm uppercase tracking-wide text-gray-500 mb-2">ORIGINAL QUESTION</h3>
        <p className="text-lg">{question}</p>
        {results.assumptionChallenge?.reframedQuestion && results.assumptionChallenge.reframedQuestion !== question && (
          <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
            <h4 className="font-semibold text-sm text-yellow-800">REFRAMED QUESTION</h4>
            <p className="text-yellow-700">{results.assumptionChallenge.reframedQuestion}</p>
          </div>
        )}
      </Card>

      {/* Main Insight */}
      <MainInsightDisplay 
        insight={results.insight}
        confidence={results.confidence}
        tensionPoints={results.tensionPoints}
        noveltyScore={results.noveltyScore}
        emergenceDetected={results.emergenceDetected}
        enhancedMode={results.enhancedMode}
        circuitType={results.circuitType}
        processingDepth={results.processingDepth}
        logicTrailLength={results.logicTrail.length}
      />

      {/* Question Quality Evaluation */}
      {results.questionQuality && (
        <QuestionQualitySection questionQuality={results.questionQuality} />
      )}

      {/* Assumption Analysis */}
      {results.assumptionAnalysis && (
        <AssumptionAnalysisSection assumptionAnalysis={results.assumptionAnalysis} />
      )}

      {/* Tension Analysis */}
      {results.finalTensionMetrics && (
        <TensionAnalysisSection tensionMetrics={results.finalTensionMetrics} />
      )}

      {/* Processing Layers */}
      <ProcessingLayersSection layers={results.layers} />

      {/* Logic Trail */}
      <LogicTrailSection logicTrail={results.logicTrail} />

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <Button 
          onClick={onReset}
          variant="outline"
          size="lg"
          className="flex items-center space-x-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>New Question</span>
        </Button>
        
        <Button 
          onClick={onExport}
          size="lg"
          className="bg-black text-white hover:bg-gray-800 flex items-center space-x-2"
        >
          <Download className="w-5 h-5" />
          <span>Export Insight</span>
        </Button>
      </div>
    </div>
  );
};

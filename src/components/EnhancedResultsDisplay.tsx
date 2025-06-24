
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, RotateCcw, Lightbulb, TrendingUp, Zap, Layers, Download, AlertTriangle, Target, Brain, Compass } from "lucide-react";

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
  const [isTrailOpen, setIsTrailOpen] = useState(false);
  const [isLayersOpen, setIsLayersOpen] = useState(false);
  const [isAssumptionsOpen, setIsAssumptionsOpen] = useState(false);
  const [isTensionOpen, setIsTensionOpen] = useState(false);
  const [isQuestionQualityOpen, setIsQuestionQualityOpen] = useState(false);

  const getNoveltyColor = (score: number) => {
    if (score >= 8) return "bg-red-500";
    if (score >= 6) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getNoveltyLabel = (score: number) => {
    if (score >= 8) return "Paradigm Shift";
    if (score >= 6) return "Challenging";
    return "Conventional";
  };

  const getScoreColor = (score: number, isConstraint = false) => {
    if (isConstraint) {
      // For constraint balance, 5-7 is optimal
      if (score >= 5 && score <= 7) return "text-green-600";
      if (score >= 3 && score <= 8) return "text-yellow-600";
      return "text-red-600";
    }
    
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getConstraintLabel = (score: number) => {
    if (score >= 8) return "Too Vague";
    if (score >= 5) return "Well-Scoped";
    if (score >= 3) return "Focused";
    return "Too Narrow";
  };

  return (
    <div className="space-y-8">
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

      {/* Main Insight with Enhanced Metrics */}
      <Card className="p-8 border-2 border-black">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-2">
            <Lightbulb className="w-12 h-12 text-black" />
            {results.emergenceDetected && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                <Brain className="w-3 h-3 mr-1" />
                EMERGENCE DETECTED
              </Badge>
            )}
          </div>
          
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-2">
              BREAKTHROUGH INSIGHT
              {results.enhancedMode && (
                <Badge variant="outline" className="ml-2">Enhanced Mode</Badge>
              )}
            </h2>
            <p className="text-2xl font-bold leading-tight">
              "{results.insight}"
            </p>
          </div>

          {/* Enhanced Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.round(results.confidence * 100)}%</div>
              <div className="text-xs text-gray-500 uppercase">Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{results.tensionPoints}</div>
              <div className="text-xs text-gray-500 uppercase">Tension Points</div>
            </div>
            {results.noveltyScore !== undefined && (
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2">
                  <div className="text-2xl font-bold">{results.noveltyScore}/10</div>
                  <div className={`w-3 h-3 rounded-full ${getNoveltyColor(results.noveltyScore)}`}></div>
                </div>
                <div className="text-xs text-gray-500 uppercase">{getNoveltyLabel(results.noveltyScore)}</div>
              </div>
            )}
            <div className="text-center">
              <div className="text-2xl font-bold">{results.logicTrail.length}</div>
              <div className="text-xs text-gray-500 uppercase">Perspectives</div>
            </div>
          </div>

          {results.circuitType && (
            <div className="text-center pt-2">
              <span className="text-sm text-gray-500 uppercase tracking-wide">
                Processed via {results.circuitType} circuit
                {results.processingDepth && ` • ${results.processingDepth} layers`}
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Question Quality Evaluation */}
      {results.questionQuality && (
        <Collapsible open={isQuestionQualityOpen} onOpenChange={setIsQuestionQualityOpen}>
          <Card className="p-6">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full flex items-center justify-between p-0 h-auto">
                <div className="flex items-center space-x-2">
                  <Compass className="w-5 h-5" />
                  <h3 className="font-bold text-lg">QUESTION QUALITY EVALUATION</h3>
                  <Badge variant="outline" className={`${getScoreColor(results.questionQuality.overallScore)} border-current`}>
                    {results.questionQuality.overallScore}/10
                  </Badge>
                </div>
                {isQuestionQualityOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-6">
              <div className="space-y-6">
                {/* Final Score Summary */}
                <div className="p-4 bg-gray-50 rounded border-l-4 border-gray-400">
                  <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-700 mb-2">
                    Question Genius Yield: {results.questionQuality.overallScore}/10
                  </h4>
                  <p className="text-gray-700">{results.questionQuality.feedback}</p>
                </div>

                {/* Scoring Categories */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded">
                    <div className={`text-2xl font-bold ${getScoreColor(results.questionQuality.geniusYield)}`}>
                      {results.questionQuality.geniusYield}/10
                    </div>
                    <div className="text-sm text-blue-700 font-semibold">Genius Yield</div>
                    <div className="text-xs text-blue-600">Insight value unlocked</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded">
                    <div className={`text-2xl font-bold ${getScoreColor(results.questionQuality.constraintBalance, true)}`}>
                      {results.questionQuality.constraintBalance}/10
                    </div>
                    <div className="text-sm text-green-700 font-semibold">Constraint Balance</div>
                    <div className="text-xs text-green-600">{getConstraintLabel(results.questionQuality.constraintBalance)}</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded">
                    <div className={`text-2xl font-bold ${getScoreColor(results.questionQuality.metaPotential)}`}>
                      {results.questionQuality.metaPotential}/10
                    </div>
                    <div className="text-sm text-purple-700 font-semibold">Meta-Potential</div>
                    <div className="text-xs text-purple-600">Layers & paradoxes</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded">
                    <div className={`text-2xl font-bold ${getScoreColor(results.questionQuality.effortVsEmergence)}`}>
                      {results.questionQuality.effortVsEmergence}/10
                    </div>
                    <div className="text-sm text-orange-700 font-semibold">Effort vs Emergence</div>
                    <div className="text-xs text-orange-600">How easily genius emerged</div>
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-700 mb-3">
                    Recommendations for Better Questions
                  </h4>
                  <div className="space-y-2">
                    {results.questionQuality.recommendations.map((rec, index) => (
                      <div key={index} className="p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-700">
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Assumption Analysis */}
      {results.assumptionAnalysis && (
        <Collapsible open={isAssumptionsOpen} onOpenChange={setIsAssumptionsOpen}>
          <Card className="p-6">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full flex items-center justify-between p-0 h-auto">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="font-bold text-lg">ASSUMPTION INTERROGATION</h3>
                  <Badge variant="outline">
                    Resistance: {results.assumptionAnalysis.resistanceScore}/10
                  </Badge>
                </div>
                {isAssumptionsOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-700 mb-3">
                    Hidden Assumptions Detected
                  </h4>
                  <div className="space-y-2">
                    {results.assumptionAnalysis.assumptions.map((assumption, index) => (
                      <div key={index} className="p-3 bg-red-50 border-l-4 border-red-400 text-red-700">
                        {assumption}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-700 mb-3">
                    Challenging Questions
                  </h4>
                  <div className="space-y-2">
                    {results.assumptionAnalysis.challengingQuestions.map((question, index) => (
                      <div key={index} className="p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
                        {question}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Tension Analysis */}
      {results.finalTensionMetrics && (
        <Collapsible open={isTensionOpen} onOpenChange={setIsTensionOpen}>
          <Card className="p-6">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full flex items-center justify-between p-0 h-auto">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <h3 className="font-bold text-lg">DIALECTICAL TENSION ANALYSIS</h3>
                </div>
                {isTensionOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded">
                  <div className="text-2xl font-bold text-blue-600">
                    {results.finalTensionMetrics.tensionScore}/10
                  </div>
                  <div className="text-sm text-blue-700">Tension Score</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded">
                  <div className="text-2xl font-bold text-purple-600">
                    {results.finalTensionMetrics.contradictionCount}
                  </div>
                  <div className="text-sm text-purple-700">Contradictions</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded">
                  <div className="text-2xl font-bold text-orange-600">
                    {results.finalTensionMetrics.consensusRisk}/10
                  </div>
                  <div className="text-sm text-orange-700">Consensus Risk</div>
                </div>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Processing Layers */}
      {results.layers && results.layers.length > 1 && (
        <Collapsible open={isLayersOpen} onOpenChange={setIsLayersOpen}>
          <Card className="p-6">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full flex items-center justify-between p-0 h-auto">
                <div className="flex items-center space-x-2">
                  <Layers className="w-5 h-5" />
                  <h3 className="font-bold text-lg">PROCESSING LAYERS</h3>
                </div>
                {isLayersOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-6">
              <div className="space-y-4">
                {results.layers.map((layer, index) => (
                  <Card key={index} className="p-4 bg-gray-50">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm uppercase tracking-wide text-gray-700">
                          Layer {layer.layerNumber} - {layer.circuitType}
                        </h4>
                        <div className="flex space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {Math.round(layer.confidence * 100)}% confidence
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {layer.tensionPoints} tensions
                          </Badge>
                          {layer.noveltyScore !== undefined && (
                            <Badge variant="outline" className="text-xs">
                              {layer.noveltyScore}/10 novelty
                            </Badge>
                          )}
                          {layer.emergenceDetected && (
                            <Badge className="text-xs bg-purple-100 text-purple-800">
                              Emergence
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-800">{layer.insight}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Logic Trail */}
      <Collapsible open={isTrailOpen} onOpenChange={setIsTrailOpen}>
        <Card className="p-6">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full flex items-center justify-between p-0 h-auto">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <h3 className="font-bold text-lg">LOGIC TRAIL</h3>
              </div>
              {isTrailOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-6">
            <div className="space-y-4">
              {results.logicTrail.map((entry, index) => (
                <Card key={index} className="p-4 bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm uppercase tracking-wide text-gray-700 mb-1">
                        {entry.archetype}
                      </h4>
                      <p className="text-gray-800">{entry.contribution}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

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

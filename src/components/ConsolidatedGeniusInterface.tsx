import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Play, Zap, Users, Brain, ChevronDown, ChevronUp } from "lucide-react";
import { OutputType } from "@/types/outputTypes";
import { useEnhancedAIConfigOptimization } from "@/hooks/useEnhancedAIConfigOptimization";
import { QuestionInputSection } from "./interface/QuestionInputSection";
import { OptimizationReasoningCard } from "./OptimizationReasoningCard";
import { LearningDashboard } from "./LearningDashboard";

interface ConsolidatedGeniusInterfaceProps {
  question: string;
  setQuestion: (question: string) => void;
  outputType: OutputType;
  setOutputType: (type: OutputType) => void;
  processingDepth: number[];
  setProcessingDepth: (depth: number[]) => void;
  circuitType: string;
  setCircuitType: (type: string) => void;
  enhancedMode: boolean;
  setEnhancedMode: (enabled: boolean) => void;
  customArchetypes: any;
  currentAssessment: any;
  setCurrentAssessment: (assessment: any) => void;
  onStartGenius: () => void;
}

export const ConsolidatedGeniusInterface = ({
  question,
  setQuestion,
  outputType,
  setOutputType,
  processingDepth,
  setProcessingDepth,
  circuitType,
  setCircuitType,
  enhancedMode,
  setEnhancedMode,
  customArchetypes,
  currentAssessment,
  setCurrentAssessment,
  onStartGenius
}: ConsolidatedGeniusInterfaceProps) => {
  const [showLearningDashboard, setShowLearningDashboard] = useState(false);
  const {
    optimizationReasoning,
    clearOptimizationReasoning,
    getLearningInsights
  } = useEnhancedAIConfigOptimization();

  const learningInsights = getLearningInsights();

  // Debug logging
  useEffect(() => {
    console.log('ConsolidatedGeniusInterface: Learning insights:', learningInsights);
    console.log('ConsolidatedGeniusInterface: Is system learning?', learningInsights?.isSystemLearning);
  }, [learningInsights]);

  const getDepthLabel = (depth: number) => {
    if (depth <= 5) return "Quick Analysis";
    if (depth <= 10) return "Deep Analysis";
    return "Ultra-Deep Analysis";
  };

  const getDepthDescription = (depth: number) => {
    if (depth <= 5) return "Fast processing, good for straightforward questions";
    if (depth <= 10) return "Thorough analysis, recommended for complex problems";
    return "Maximum depth, for the most challenging questions";
  };

  return <div className="space-zen-lg max-w-4xl mx-auto">
      {/* Debug Info - Temporary for troubleshooting */}
      <Card className="p-3 mb-4 bg-yellow-50 border border-yellow-200">
        <div className="text-xs">
          <strong>Debug Info:</strong><br/>
          Learning Insights Available: {learningInsights ? 'Yes' : 'No'}<br/>
          Is System Learning: {learningInsights?.isSystemLearning ? 'Yes' : 'No'}<br/>
          Total Experience: {learningInsights?.totalExperience || 0}<br/>
          System Maturity: {learningInsights?.maturityLevel ? Math.round(learningInsights.maturityLevel * 100) + '%' : '0%'}
        </div>
      </Card>

      {/* Meta-Learning Status - Enhanced with collapsible dashboard */}
      {learningInsights?.isSystemLearning && (
        <Collapsible open={showLearningDashboard} onOpenChange={setShowLearningDashboard}>
          <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 mb-6">
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <div className="text-left">
                    <h3 className="text-sm font-semibold text-purple-800">Meta-Learning System Active</h3>
                    <p className="text-xs text-purple-600">
                      System maturity: {Math.round(learningInsights.maturityLevel * 100)}% | 
                      Total experience: {learningInsights.totalExperience} questions | 
                      Quality trend: {learningInsights.qualityTrend}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="border-purple-300 text-purple-700">
                    Learning Enabled
                  </Badge>
                  {showLearningDashboard ? (
                    <ChevronUp className="w-4 h-4 text-purple-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-purple-600" />
                  )}
                </div>
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="pt-4">
              <LearningDashboard />
            </CollapsibleContent>
            
            {!showLearningDashboard && learningInsights.bestPerformingDomains.length > 0 && (
              <div className="mt-3 pt-3 border-t border-purple-200">
                <p className="text-xs text-purple-600">
                  <strong>Best performance:</strong> {learningInsights.bestPerformingDomains.map(d => `${d.domain} (${Math.round(d.averageQuality * 10) / 10}/10)`).join(', ')}
                </p>
              </div>
            )}
          </Card>
        </Collapsible>
      )}

      {/* Show learning system even when no data exists - for debugging */}
      {!learningInsights?.isSystemLearning && (
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 mb-6">
          <div className="flex items-center space-x-3">
            <Brain className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-sm font-semibold text-blue-800">Meta-Learning System Ready</h3>
              <p className="text-xs text-blue-600">
                System is ready to learn. Process your first question to begin building intelligence.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Optimization Reasoning Display - Enhanced with meta-learning info */}
      {optimizationReasoning && (
        <div className="mb-6">
          <OptimizationReasoningCard
            reasoning={optimizationReasoning.reasoning}
            domainType={optimizationReasoning.domainType}
            onDismiss={clearOptimizationReasoning}
          />
          
          {optimizationReasoning.metaLearningApplied && (
            <Card className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Meta-Learning Enhanced</span>
                <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                  {Math.round((optimizationReasoning.systemConfidence || 0) * 100)}% Confidence
                </Badge>
              </div>
              <p className="text-xs text-green-700 mt-1">
                Configuration optimized using patterns learned from {learningInsights?.totalExperience || 0} previous questions.
              </p>
            </Card>
          )}
        </div>
      )}

      {/* Main Question Input and Configuration */}
      <Card className="border border-zen-light bg-zen-paper shadow-zen-lg rounded-md">
        <div className="p-8 space-zen">
          <QuestionInputSection question={question} setQuestion={setQuestion} outputType={outputType} setOutputType={setOutputType} />

          {/* Assessment Display - Enhanced with meta-learning info */}
          {currentAssessment && (
            <div className="p-6 bg-zen-whisper border border-zen-light rounded-md">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-zen-mono text-xs uppercase tracking-wide text-zen-charcoal">Domain</span>
                  <Badge className="text-xs bg-zen-light text-zen-charcoal border-zen-medium">{currentAssessment.domainType}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zen-mono text-xs uppercase tracking-wide text-zen-charcoal">Complexity</span>
                  <Badge variant="outline" className="text-xs border-zen-medium text-zen-charcoal">{currentAssessment.complexityScore}/10</Badge>
                </div>
                {currentAssessment.recommendations?.metaLearningApplied && (
                  <div className="flex justify-between items-center">
                    <span className="text-zen-mono text-xs uppercase tracking-wide text-zen-charcoal">Learning Applied</span>
                    <Badge className="text-xs bg-purple-100 text-purple-800 border-purple-200">
                      {Math.round(currentAssessment.recommendations.learningConfidence * 100)}% Confidence
                    </Badge>
                  </div>
                )}
                <div className="text-xs text-zen-body text-zen-medium mt-3 leading-relaxed">
                  {currentAssessment.recommendations?.metaLearningApplied 
                    ? "Configuration enhanced with meta-learning insights. System continuously improves based on results."
                    : "Configuration optimized for maximum insight generation. System is learning your preferences."
                  }
                </div>
              </div>
            </div>
          )}

          {/* Manual Configuration Section */}
          <div className="pt-6 space-zen border-t border-zen-light">
            <h3 className="text-zen-mono text-sm uppercase tracking-wide text-zen-ink mb-6">Processing Configuration</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-zen-mono text-sm uppercase tracking-wide text-zen-charcoal">Processing Depth</Label>
                <Badge variant="outline" className="text-zen-mono text-xs border-zen-medium text-zen-charcoal">
                  {processingDepth[0]} layers — {getDepthLabel(processingDepth[0])}
                </Badge>
              </div>
              <Slider value={processingDepth} onValueChange={setProcessingDepth} max={20} min={1} step={1} className="w-full" />
              <div className="flex justify-between text-xs text-zen-mono text-zen-medium">
                <span>1 (Fast)</span>
                <span>10 (Balanced)</span>
                <span>20 (Maximum)</span>
              </div>
              <p className="text-xs text-zen-body text-zen-medium leading-relaxed">
                {getDepthDescription(processingDepth[0])}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-8">
              <div className="md:col-span-3 space-y-3">
                <Label className="text-zen-mono text-sm uppercase tracking-wide text-zen-charcoal">Circuit Type</Label>
                <Select value={circuitType} onValueChange={setCircuitType}>
                  <SelectTrigger className="border border-zen-light bg-zen-paper text-sm rounded-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zen-paper border border-zen-light shadow-zen-lg">
                    <SelectItem value="sequential" className="text-sm">Sequential — Build on each other</SelectItem>
                    <SelectItem value="parallel" className="text-sm">Parallel — Think simultaneously</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 flex flex-col justify-center">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-zen-mono text-sm uppercase tracking-wide text-zen-charcoal">Enhanced Mode</Label>
                    <p className="text-xs text-zen-body text-zen-medium mt-1">Dialectical tension</p>
                  </div>
                  <Switch checked={enhancedMode} onCheckedChange={setEnhancedMode} />
                </div>
              </div>
            </div>

            {customArchetypes && (
              <div className="space-y-2 mt-6">
                <Label className="text-zen-mono text-sm uppercase tracking-wide text-zen-charcoal">Custom Archetypes</Label>
                <div className="flex items-center space-x-3">
                  <Users className="w-4 h-4 text-zen-medium" />
                  <span className="text-xs text-zen-body text-zen-medium">
                    {customArchetypes.length} custom archetypes loaded
                  </span>
                </div>
              </div>
            )}

            {learningInsights?.isSystemLearning && (
              <div className="space-y-2 mt-6">
                <Label className="text-zen-mono text-sm uppercase tracking-wide text-zen-charcoal">Learning System</Label>
                <div className="flex items-center space-x-3">
                  <Brain className="w-4 h-4 text-purple-500" />
                  <span className="text-xs text-zen-body text-zen-medium">
                    Active - Continuously improving based on results
                  </span>
                  {learningInsights.isImproving && (
                    <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                      Improving
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Launch Button */}
          <div className="pt-8 border-t border-zen-light">
            <Button 
              onClick={onStartGenius} 
              disabled={!question.trim()} 
              size="lg" 
              className="w-full bg-zen-ink hover:bg-zen-charcoal text-zen-paper border-0 px-8 py-6 rounded-lg shadow-zen-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center space-x-3 text-zen-mono uppercase tracking-wide font-light">
                <Play className="w-5 h-5" />
                <span>Start Genius Machine</span>
                <Zap className="w-5 h-5" />
              </div>
            </Button>
          </div>
        </div>
      </Card>
    </div>;
};

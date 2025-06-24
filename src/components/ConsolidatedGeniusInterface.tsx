import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Play, Zap, Users } from "lucide-react";
import { OutputType } from "@/types/outputTypes";
import { useQuestionAssessment } from "@/hooks/useQuestionAssessment";
import { useAIConfigOptimization } from "@/hooks/useAIConfigOptimization";
import { QuestionInputSection } from "./interface/QuestionInputSection";
import { OptimizationReasoningCard } from "./OptimizationReasoningCard";
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
  const {
    optimizationReasoning,
    clearOptimizationReasoning
  } = useAIConfigOptimization();
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
      {/* Optimization Reasoning Display - Only show if exists from config page */}
      {optimizationReasoning && <OptimizationReasoningCard reasoning={optimizationReasoning.reasoning} domainType={optimizationReasoning.domainType} onDismiss={clearOptimizationReasoning} />}

      {/* Main Question Input and Configuration */}
      <Card className="border border-zen-light bg-zen-paper shadow-zen-lg rounded-md">
        <div className="p-8 space-zen">
          <QuestionInputSection question={question} setQuestion={setQuestion} outputType={outputType} setOutputType={setOutputType} />

          {/* Assessment Display - Only show if exists */}
          {currentAssessment && <div className="p-6 bg-zen-whisper border border-zen-light rounded-md">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-zen-mono text-xs uppercase tracking-wide text-zen-charcoal">Domain</span>
                  <Badge className="text-xs bg-zen-light text-zen-charcoal border-zen-medium">{currentAssessment.domainType}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zen-mono text-xs uppercase tracking-wide text-zen-charcoal">Complexity</span>
                  <Badge variant="outline" className="text-xs border-zen-medium text-zen-charcoal">{currentAssessment.complexityScore}/10</Badge>
                </div>
                <div className="text-xs text-zen-body text-zen-medium mt-3 leading-relaxed">
                  Configuration optimized for maximum insight generation. Detailed reasoning shown above.
                </div>
              </div>
            </div>}

          {/* Manual Configuration Section */}
          <div className="pt-6 space-zen border-t border-zen-light">
            <h3 className="text-zen-mono text-sm uppercase tracking-wide text-zen-ink mb-6">Processing Configuration</h3>
            
            {/* Processing Depth */}
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

            {/* Circuit Type and Enhanced Mode */}
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

            {/* Archetype Status */}
            {customArchetypes && <div className="space-y-2 mt-6">
                <Label className="text-zen-mono text-sm uppercase tracking-wide text-zen-charcoal">Custom Archetypes</Label>
                <div className="flex items-center space-x-3">
                  <Users className="w-4 h-4 text-zen-medium" />
                  <span className="text-xs text-zen-body text-zen-medium">
                    {customArchetypes.length} custom archetypes loaded
                  </span>
                </div>
              </div>}
          </div>

          {/* Launch Button */}
          <div className="pt-8 border-t border-zen-light">
            <Button onClick={onStartGenius} disabled={!question.trim()} size="lg" className="w-full text-zen-paper flex items-center justify-center space-x-3 text-zen-mono uppercase tracking-wide border-0 px-8 py-6 shadow-zen-lg transition-all duration-300 animate-zen-scale font-light bg-zinc-900 hover:bg-zinc-800 rounded-lg">
              <Play className="w-5 h-5" />
              <span>Start Genius Machine</span>
              <Zap className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>;
};
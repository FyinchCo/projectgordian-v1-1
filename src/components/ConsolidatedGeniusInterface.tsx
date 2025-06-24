
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Play, Zap, Brain, Users } from "lucide-react";
import { OutputType } from "@/types/outputTypes";
import { useQuestionAssessment } from "@/hooks/useQuestionAssessment";
import { useAIConfigOptimization } from "@/hooks/useAIConfigOptimization";
import { useToast } from "@/hooks/use-toast";
import { QuestionInputSection } from "./interface/QuestionInputSection";
import { InfoCards } from "./interface/InfoCards";

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
  const { assessQuestion, isAssessing } = useQuestionAssessment();
  const { optimizeAndApplyConfiguration, isAssessing: isOptimizing } = useAIConfigOptimization();
  const { toast } = useToast();

  const handleOptimizeAllSettings = async () => {
    if (!question.trim()) {
      toast({
        title: "Question Required",
        description: "Please enter a question before optimizing all settings.",
        variant: "destructive",
      });
      return;
    }

    // Mock update functions for the comprehensive optimization
    const mockUpdateArchetype = (id: number, field: string, value: any) => {
      console.log(`Updated archetype ${id}, field ${field}:`, value);
    };

    const mockUpdateTensionSettings = (field: string, value: number[]) => {
      console.log(`Updated tension setting ${field}:`, value);
    };

    const mockUpdateCompressionSettings = (field: string, value: any) => {
      console.log(`Updated compression setting ${field}:`, value);
    };

    const result = await optimizeAndApplyConfiguration(
      question,
      mockUpdateArchetype,
      mockUpdateTensionSettings,
      mockUpdateCompressionSettings
    );

    if (result) {
      // Apply only circuit type and enhanced mode - NOT processing depth
      setCircuitType(result.recommendations.circuitType);
      setEnhancedMode(result.recommendations.enhancedMode);
      setCurrentAssessment(result);
    }
  };

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

  return (
    <div className="space-y-8">
      {/* Main Question Input and Configuration */}
      <Card className="border-2 border-mono-pure-black bg-mono-pure-white shadow-lg">
        <div className="p-6 space-y-6">
          <QuestionInputSection
            question={question}
            setQuestion={setQuestion}
            outputType={outputType}
            setOutputType={setOutputType}
          />

          {/* AI Optimization Button - Updated to match brutal monochrome style */}
          <div className="p-4 bg-mono-light-gray rounded-none border-2 border-mono-pure-black">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-mono-pure-black" />
                <div>
                  <h3 className="font-mono font-bold text-mono-pure-black text-sm uppercase tracking-wide">AI Configuration Optimizer</h3>
                  <p className="text-xs text-mono-dark-gray font-inter">
                    Automatically optimize archetype personalities, tension detection, and compression settings
                  </p>
                </div>
              </div>
              <Button
                onClick={handleOptimizeAllSettings}
                disabled={!question.trim() || isOptimizing}
                size="sm"
                className="bg-mono-pure-black hover:bg-mono-charcoal text-mono-pure-white border-2 border-mono-pure-black font-mono uppercase tracking-wide"
              >
                {isOptimizing ? (
                  <>
                    <Brain className="w-4 h-4 mr-2 animate-pulse" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Optimize All Settings
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Assessment Display */}
          {currentAssessment && (
            <div className="p-4 bg-mono-light-gray border-2 border-mono-pure-black">
              <div className="text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono uppercase">Domain:</span>
                  <Badge className="text-xs">{currentAssessment.domainType}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-mono uppercase">Complexity:</span>
                  <Badge variant="outline" className="text-xs">{currentAssessment.complexityScore}/10</Badge>
                </div>
                <div className="text-xs text-mono-dark-gray mt-2">
                  Archetype personalities, tension parameters, and compression settings optimized.
                </div>
              </div>
            </div>
          )}

          {/* Manual Configuration Section */}
          <div className="border-t-2 border-mono-pure-black pt-4 space-y-4">
            <h3 className="font-mono uppercase tracking-wide text-sm text-mono-pure-black">Configuration Settings</h3>
            
            {/* Processing Depth */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="font-mono uppercase tracking-wide text-sm">Processing Depth</Label>
                <Badge variant="outline" className="font-mono text-xs">
                  {processingDepth[0]} layers - {getDepthLabel(processingDepth[0])}
                </Badge>
              </div>
              <Slider
                value={processingDepth}
                onValueChange={setProcessingDepth}
                max={20}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-mono-medium-gray font-mono">
                <span>1 (Fast)</span>
                <span>10 (Balanced)</span>
                <span>20 (Maximum)</span>
              </div>
              <p className="text-xs text-mono-dark-gray font-inter">
                {getDepthDescription(processingDepth[0])}
              </p>
            </div>

            {/* Circuit Type and Enhanced Mode Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Circuit Type */}
              <div className="space-y-2">
                <Label className="font-mono uppercase tracking-wide text-sm">Circuit Type</Label>
                <Select value={circuitType} onValueChange={setCircuitType}>
                  <SelectTrigger className="border-2 border-mono-pure-black text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sequential" className="text-sm">Sequential - Build on each other</SelectItem>
                    <SelectItem value="parallel" className="text-sm">Parallel - Think simultaneously</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Enhanced Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-mono uppercase tracking-wide text-sm">Enhanced Mode</Label>
                  <p className="text-xs text-mono-dark-gray">Assumption analysis and dialectical tension</p>
                </div>
                <Switch
                  checked={enhancedMode}
                  onCheckedChange={setEnhancedMode}
                />
              </div>
            </div>

            {/* Archetype Status */}
            {customArchetypes && (
              <div className="space-y-1">
                <Label className="font-mono uppercase tracking-wide text-sm">Custom Archetypes</Label>
                <div className="flex items-center space-x-2">
                  <Users className="w-3 h-3" />
                  <span className="text-xs text-mono-dark-gray">
                    {customArchetypes.length} custom archetypes loaded
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Launch Button */}
          <div className="border-t-2 border-mono-pure-black pt-4">
            <Button 
              onClick={onStartGenius}
              disabled={!question.trim()}
              size="lg"
              className="w-full bg-mono-pure-black text-mono-pure-white hover:bg-mono-charcoal flex items-center justify-center space-x-2 font-mono font-bold uppercase tracking-wide border-2 border-mono-pure-black px-8 py-4"
            >
              <Play className="w-5 h-5" />
              <span>START GENIUS MACHINE</span>
              <Zap className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </Card>

      <InfoCards />
    </div>
  );
};

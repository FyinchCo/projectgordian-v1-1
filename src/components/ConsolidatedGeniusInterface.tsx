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
import { useArchetypes } from "@/hooks/useArchetypes";
import { useToast } from "@/hooks/use-toast";
import { QuestionInputSection } from "./interface/QuestionInputSection";

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
  const { updateArchetype } = useArchetypes();
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

    // Real update functions that actually save to localStorage
    const updateTensionSettings = (field: string, value: number[]) => {
      const currentTension = JSON.parse(localStorage.getItem('genius-machine-tension') || '{"contradictionThreshold":[5],"recursionDepth":[3],"archetypeOverlap":[2]}');
      currentTension[field] = value;
      localStorage.setItem('genius-machine-tension', JSON.stringify(currentTension));
    };

    const updateCompressionSettings = (field: string, value: any) => {
      const currentCompression = JSON.parse(localStorage.getItem('genius-machine-compression') || '{"style":"insight-summary","length":"medium","includeTrail":true,"includeFullTranscript":false,"customInstructions":""}');
      currentCompression[field] = value;
      localStorage.setItem('genius-machine-compression', JSON.stringify(currentCompression));
    };

    const result = await optimizeAndApplyConfiguration(
      question,
      updateArchetype,
      updateTensionSettings,
      updateCompressionSettings
    );

    if (result) {
      // Apply only circuit type and enhanced mode - NOT processing depth
      setCircuitType(result.recommendations.circuitType);
      setEnhancedMode(result.recommendations.enhancedMode);
      setCurrentAssessment(result);
      
      // Show success message with link to config page
      toast({
        title: "Configuration Optimized",
        description: "All settings updated. Visit the Configuration page to see detailed reasoning.",
        variant: "default",
      });
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
    <div className="space-zen-lg max-w-4xl mx-auto">
      {/* Main Question Input and Configuration */}
      <Card className="border border-zen-light bg-zen-paper shadow-zen-lg rounded-md">
        <div className="p-8 space-zen">
          <QuestionInputSection
            question={question}
            setQuestion={setQuestion}
            outputType={outputType}
            setOutputType={setOutputType}
          />

          {/* AI Optimization Section - Refined */}
          <div className="p-6 bg-zen-whisper rounded-md border border-zen-light">
            <div className="flex items-start justify-between space-x-6">
              <div className="flex items-start space-x-3">
                <Brain className="w-5 h-5 text-zen-charcoal mt-1" />
                <div className="space-y-1">
                  <h3 className="text-zen-mono text-sm uppercase tracking-wide text-zen-ink">AI Configuration Optimizer</h3>
                  <p className="text-xs text-zen-body text-zen-medium leading-relaxed">
                    Automatically optimize archetype personalities, tension detection, and compression settings
                  </p>
                </div>
              </div>
              <Button
                onClick={handleOptimizeAllSettings}
                disabled={!question.trim() || isOptimizing}
                size="sm"
                className="bg-zen-ink hover:bg-zen-charcoal text-zen-paper text-zen-mono uppercase tracking-wide transition-all duration-300 px-4 py-2 rounded-sm shadow-zen"
              >
                {isOptimizing ? (
                  <>
                    <Brain className="w-4 h-4 mr-2 animate-pulse" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Optimize All
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Assessment Display - Zen styling */}
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
                <div className="text-xs text-zen-body text-zen-medium mt-3 leading-relaxed">
                  Configuration optimized for maximum insight generation. Visit the Configuration page for detailed reasoning.
                </div>
              </div>
            </div>
          )}

          {/* Manual Configuration Section - Refined spacing */}
          <div className="pt-6 space-zen border-t border-zen-light">
            <h3 className="text-zen-mono text-sm uppercase tracking-wide text-zen-ink mb-6">Manual Configuration</h3>
            
            {/* Processing Depth - More zen styling */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-zen-mono text-sm uppercase tracking-wide text-zen-charcoal">Processing Depth</Label>
                <Badge variant="outline" className="text-zen-mono text-xs border-zen-medium text-zen-charcoal">
                  {processingDepth[0]} layers — {getDepthLabel(processingDepth[0])}
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
              <div className="flex justify-between text-xs text-zen-mono text-zen-medium">
                <span>1 (Fast)</span>
                <span>10 (Balanced)</span>
                <span>20 (Maximum)</span>
              </div>
              <p className="text-xs text-zen-body text-zen-medium leading-relaxed">
                {getDepthDescription(processingDepth[0])}
              </p>
            </div>

            {/* Circuit Type and Enhanced Mode - Asymmetric grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-8">
              {/* Circuit Type - Takes 3 columns */}
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

              {/* Enhanced Mode - Takes 2 columns */}
              <div className="md:col-span-2 flex flex-col justify-center">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-zen-mono text-sm uppercase tracking-wide text-zen-charcoal">Enhanced Mode</Label>
                    <p className="text-xs text-zen-body text-zen-medium mt-1">Dialectical tension</p>
                  </div>
                  <Switch
                    checked={enhancedMode}
                    onCheckedChange={setEnhancedMode}
                  />
                </div>
              </div>
            </div>

            {/* Archetype Status */}
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
          </div>

          {/* Launch Button - Zen refinement */}
          <div className="pt-8 border-t border-zen-light">
            <Button 
              onClick={onStartGenius}
              disabled={!question.trim()}
              size="lg"
              className="w-full bg-zen-ink text-zen-paper hover:bg-zen-charcoal flex items-center justify-center space-x-3 text-zen-mono uppercase tracking-wide border-0 px-8 py-6 rounded-md shadow-zen-lg transition-all duration-300 animate-zen-scale"
            >
              <Play className="w-5 h-5" />
              <span>Start Genius Machine</span>
              <Zap className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

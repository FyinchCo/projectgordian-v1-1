
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Zap, Brain } from "lucide-react";
import { OutputType } from "@/types/outputTypes";
import { useQuestionAssessment } from "@/hooks/useQuestionAssessment";
import { useAIConfigOptimization } from "@/hooks/useAIConfigOptimization";
import { useToast } from "@/hooks/use-toast";
import { QuestionInputSection } from "./interface/QuestionInputSection";
import { ConfigurationTabs } from "./interface/ConfigurationTabs";
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
  const [configMode, setConfigMode] = useState<"ai" | "manual">("ai");
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
      // Also apply the main interface settings
      setProcessingDepth([result.recommendations.processingDepth]);
      setCircuitType(result.recommendations.circuitType);
      setEnhancedMode(result.recommendations.enhancedMode);
      setCurrentAssessment(result);
    }
  };

  return (
    <div className="space-y-8">
      {/* Main Question Input with Integrated Configuration */}
      <Card className="border-2 border-mono-pure-black bg-mono-pure-white shadow-lg">
        <div className="p-6 space-y-6">
          <QuestionInputSection
            question={question}
            setQuestion={setQuestion}
            outputType={outputType}
            setOutputType={setOutputType}
          />

          {/* AI Optimization Section */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <div>
                  <h3 className="font-semibold text-purple-800 text-sm">AI Configuration Optimizer</h3>
                  <p className="text-xs text-purple-700">
                    Automatically optimize all archetype personalities, tension detection, and compression settings
                  </p>
                </div>
              </div>
              <Button
                onClick={handleOptimizeAllSettings}
                disabled={!question.trim() || isOptimizing}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white"
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

          <ConfigurationTabs
            configMode={configMode}
            setConfigMode={setConfigMode}
            question={question}
            isAssessing={isAssessing}
            currentAssessment={currentAssessment}
            onAIOptimize={handleOptimizeAllSettings}
            processingDepth={processingDepth}
            setProcessingDepth={setProcessingDepth}
            circuitType={circuitType}
            setCircuitType={setCircuitType}
            enhancedMode={enhancedMode}
            setEnhancedMode={setEnhancedMode}
            customArchetypes={customArchetypes}
          />

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

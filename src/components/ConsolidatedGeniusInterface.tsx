
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Zap } from "lucide-react";
import { OutputType } from "@/types/outputTypes";
import { useQuestionAssessment } from "@/hooks/useQuestionAssessment";
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
  const { toast } = useToast();

  const handleAIOptimize = async () => {
    if (!question.trim()) {
      toast({
        title: "Question Required",
        description: "Please enter a question before optimizing configuration.",
        variant: "destructive",
      });
      return;
    }

    const result = await assessQuestion(question);
    if (result) {
      setProcessingDepth([result.recommendations.processingDepth]);
      setCircuitType(result.recommendations.circuitType);
      setEnhancedMode(result.recommendations.enhancedMode);
      setCurrentAssessment(result);
      
      toast({
        title: "AI Configuration Applied",
        description: `Optimized for ${result.domainType} domain with ${result.recommendations.processingDepth} layers`,
      });
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

          <ConfigurationTabs
            configMode={configMode}
            setConfigMode={setConfigMode}
            question={question}
            isAssessing={isAssessing}
            currentAssessment={currentAssessment}
            onAIOptimize={handleAIOptimize}
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

import { Card } from "@/components/ui/card";
import { OutputType } from "@/types/outputTypes";
import { useEnhancedAIConfigOptimization } from "@/hooks/useEnhancedAIConfigOptimization";
import { QuestionInputSection } from "./interface/QuestionInputSection";
import { MetaLearningStatusCard } from "./interface/MetaLearningStatusCard";
import { AssessmentDisplay } from "./interface/AssessmentDisplay";
import { ProcessingConfigurationSection } from "./interface/ProcessingConfigurationSection";
import { LaunchSection } from "./interface/LaunchSection";
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
    clearOptimizationReasoning,
    getLearningInsights
  } = useEnhancedAIConfigOptimization();
  const learningInsights = getLearningInsights();
  return <div className="space-zen-lg max-w-4xl mx-auto">
      {/* Meta-Learning Status and Optimization Reasoning */}
      <MetaLearningStatusCard learningInsights={learningInsights} optimizationReasoning={optimizationReasoning} clearOptimizationReasoning={clearOptimizationReasoning} />

      {/* Main Question Input and Configuration */}
      <Card className="border border-zen-light bg-zen-paper shadow-zen-lg rounded-md">
        <div className="p-8 space-zen bg-[#3c3d37]">
          <QuestionInputSection question={question} setQuestion={setQuestion} outputType={outputType} setOutputType={setOutputType} />

          {/* Assessment Display */}
          <AssessmentDisplay currentAssessment={currentAssessment} learningInsights={learningInsights} />

          {/* Manual Configuration Section */}
          <ProcessingConfigurationSection processingDepth={processingDepth} setProcessingDepth={setProcessingDepth} circuitType={circuitType} setCircuitType={setCircuitType} enhancedMode={enhancedMode} setEnhancedMode={setEnhancedMode} customArchetypes={customArchetypes} learningInsights={learningInsights} />

          {/* Launch Button */}
          <LaunchSection question={question} onStartGenius={onStartGenius} />
        </div>
      </Card>
    </div>;
};
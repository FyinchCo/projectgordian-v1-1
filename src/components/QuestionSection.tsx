
import { QuestionInput } from "@/components/QuestionInput";
import { QuestionAssessment } from "@/components/QuestionAssessment";
import { OutputType } from "@/types/outputTypes";

interface QuestionSectionProps {
  question: string;
  setQuestion: (question: string) => void;
  onStartGenius: () => void;
  customArchetypes: any;
  enhancedMode: boolean;
  showAssessment: boolean;
  onToggleAssessment: () => void;
  onApplyRecommendations: (recommendations: any, fullAssessment: any) => void;
  outputType: OutputType;
  onOutputTypeChange: (type: OutputType) => void;
}

export const QuestionSection = ({
  question,
  setQuestion,
  onStartGenius,
  customArchetypes,
  enhancedMode,
  showAssessment,
  onToggleAssessment,
  onApplyRecommendations,
  outputType,
  onOutputTypeChange
}: QuestionSectionProps) => {
  return (
    <div className="space-y-8">
      <QuestionInput
        question={question}
        setQuestion={setQuestion}
        onStartGenius={onStartGenius}
        customArchetypes={customArchetypes}
        enhancedMode={enhancedMode}
        onToggleAssessment={onToggleAssessment}
        showAssessment={showAssessment}
        outputType={outputType}
        onOutputTypeChange={onOutputTypeChange}
      />

      {showAssessment && (
        <QuestionAssessment
          question={question}
          onApplyRecommendations={onApplyRecommendations}
        />
      )}
    </div>
  );
};


import { QuestionInput } from "@/components/QuestionInput";
import { QuestionAssessment } from "@/components/QuestionAssessment";

interface QuestionSectionProps {
  question: string;
  setQuestion: (question: string) => void;
  onStartGenius: () => void;
  customArchetypes: any;
  enhancedMode: boolean;
  showAssessment: boolean;
  onToggleAssessment: () => void;
  onApplyRecommendations: (recommendations: any, fullAssessment: any) => void;
}

export const QuestionSection = ({
  question,
  setQuestion,
  onStartGenius,
  customArchetypes,
  enhancedMode,
  showAssessment,
  onToggleAssessment,
  onApplyRecommendations
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

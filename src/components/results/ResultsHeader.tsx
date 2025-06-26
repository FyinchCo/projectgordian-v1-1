
import { LearningSystemStatus } from "./LearningSystemStatus";
import { QuestionContext } from "./QuestionContext";

interface ResultsHeaderProps {
  questionQuality?: any;
  question: string;
  reframedQuestion?: string;
}

export const ResultsHeader = ({ questionQuality, question, reframedQuestion }: ResultsHeaderProps) => {
  return (
    <div className="space-y-8">
      {/* Learning System Status */}
      <LearningSystemStatus questionQuality={questionQuality} />

      {/* Question Context */}
      <QuestionContext 
        question={question}
        reframedQuestion={reframedQuestion}
      />
    </div>
  );
};

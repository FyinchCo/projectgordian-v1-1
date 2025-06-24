
import { Card } from "@/components/ui/card";

interface QuestionContextProps {
  question: string;
  reframedQuestion?: string;
}

export const QuestionContext = ({ question, reframedQuestion }: QuestionContextProps) => {
  return (
    <Card className="p-6 bg-gray-50">
      <h3 className="font-bold text-sm uppercase tracking-wide text-gray-500 mb-2">ORIGINAL QUESTION</h3>
      <p className="text-lg">{question}</p>
      {reframedQuestion && reframedQuestion !== question && (
        <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
          <h4 className="font-semibold text-sm text-yellow-800">REFRAMED QUESTION</h4>
          <p className="text-yellow-700">{reframedQuestion}</p>
        </div>
      )}
    </Card>
  );
};

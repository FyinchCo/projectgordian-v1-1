
interface ResultsAnswerProps {
  answer: string;
}

export const ResultsAnswer = ({ answer }: ResultsAnswerProps) => {
  return (
    <div className="prose max-w-none">
      <h3 className="text-xl font-semibold mb-4">Answer to Your Question</h3>
      <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
          {answer}
        </p>
      </div>
    </div>
  );
};

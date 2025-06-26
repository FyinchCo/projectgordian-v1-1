
interface ResultsHeaderProps {
  title?: string;
  subtitle?: string;
}

export const ResultsHeader = ({ 
  title = "Analysis Complete!", 
  subtitle = "Your genius analysis has finished processing" 
}: ResultsHeaderProps) => {
  return (
    <div className="text-center border-b pb-4">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  );
};

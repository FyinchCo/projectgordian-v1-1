
import { AnalysisResultsDisplay } from "./AnalysisResultsDisplay";
import { AnalysisForm } from "./AnalysisForm";

interface AnalysisConfigurationProps {
  question: string;
  setQuestion: (question: string) => void;
  totalLayers: number;
  setTotalLayers: (layers: number) => void;
  loading: boolean;
  onSubmitJob: () => void;
  jobResults: any;
  onClearResults: () => void;
}

export const AnalysisConfiguration = ({
  question,
  setQuestion,
  totalLayers,
  setTotalLayers,
  loading,
  onSubmitJob,
  jobResults,
  onClearResults
}: AnalysisConfigurationProps) => {
  // Results Display
  if (jobResults) {
    return (
      <AnalysisResultsDisplay 
        jobResults={jobResults}
        onClearResults={onClearResults}
      />
    );
  }

  // Configuration Interface
  return (
    <AnalysisForm
      question={question}
      setQuestion={setQuestion}
      totalLayers={totalLayers}
      setTotalLayers={setTotalLayers}
      loading={loading}
      onSubmitJob={onSubmitJob}
    />
  );
};

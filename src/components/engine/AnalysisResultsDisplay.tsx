
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { ResultsExtractor } from "./results/ResultsExtractor";
import { ResultsHeader } from "./results/ResultsHeader";
import { ResultsAnswer } from "./results/ResultsAnswer";
import { ResultsMetrics } from "./results/ResultsMetrics";

interface AnalysisResultsDisplayProps {
  jobResults: any;
  onClearResults: () => void;
}

export const AnalysisResultsDisplay = ({ jobResults, onClearResults }: AnalysisResultsDisplayProps) => {
  console.log('=== DEBUGGING JOB RESULTS ===');
  console.log('Full jobResults:', JSON.stringify(jobResults, null, 2));
  
  const actualAnswer = ResultsExtractor.extractAnswer(jobResults);
  const metrics = ResultsExtractor.extractMetrics(jobResults);
  
  return (
    <Card className="p-8 bg-white shadow-lg">
      <div className="space-y-6">
        <ResultsHeader />
        
        <ResultsAnswer answer={actualAnswer} />

        <ResultsMetrics metrics={metrics} />

        <div className="flex justify-center space-x-4 pt-6">
          <Button onClick={onClearResults} variant="outline" className="px-6">
            <RefreshCw className="w-4 h-4 mr-2" />
            Start New Analysis
          </Button>
        </div>
      </div>
    </Card>
  );
};

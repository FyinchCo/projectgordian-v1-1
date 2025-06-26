
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface AnalysisResultsDisplayProps {
  jobResults: any;
  onClearResults: () => void;
}

export const AnalysisResultsDisplay = ({ jobResults, onClearResults }: AnalysisResultsDisplayProps) => {
  return (
    <Card className="p-8 bg-white shadow-lg">
      <div className="space-y-6">
        <div className="text-center border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">Analysis Results</h2>
          <p className="text-gray-600">Your completed genius analysis</p>
        </div>
        
        <div className="prose max-w-none">
          <h3 className="text-xl font-semibold mb-4">Synthesis</h3>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700 leading-relaxed">
              {jobResults.synthesis || "Analysis completed successfully. Full results processing..."}
            </p>
          </div>
        </div>

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

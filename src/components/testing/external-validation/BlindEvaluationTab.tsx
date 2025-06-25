
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Users } from "lucide-react";
import { ValidationTestResult } from "@/services/testing/externalValidation/externalValidationFramework";

interface BlindEvaluationTabProps {
  results: ValidationTestResult[];
  metrics: any;
  onGenerateBlindEvaluation: () => void;
}

export const BlindEvaluationTab = ({ results, metrics, onGenerateBlindEvaluation }: BlindEvaluationTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Blind Evaluation Setup</CardTitle>
        <CardDescription>
          Generate anonymized data for external human evaluation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Human Evaluation Protocol
            </h4>
            <p className="text-sm text-gray-700 mb-3">
              Export anonymized responses for external evaluators to assess quality, novelty, and practical value 
              without knowing which AI generated each response.
            </p>
            <Button onClick={onGenerateBlindEvaluation} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Generate Blind Evaluation Dataset
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-blue-600">{results.length}</div>
              <div className="text-sm text-gray-600">Questions Tested</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-green-600">
                {results.reduce((sum, r) => sum + r.externalResults.length + 1, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Responses</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-purple-600">
                {metrics ? Object.keys(metrics.externalProviderStats).length + 1 : 1}
              </div>
              <div className="text-sm text-gray-600">AI Systems Compared</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

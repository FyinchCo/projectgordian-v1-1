
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MarketViabilityResultsProps {
  results: any[];
}

export const MarketViabilityResults = ({ results }: MarketViabilityResultsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Individual Test Results</CardTitle>
        <CardDescription>
          Detailed breakdown of each market viability question
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {results.map((result: any, index: number) => (
            <div key={result.questionId} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  Test {index + 1}
                </Badge>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    {result.qualityMetrics?.overallScore || 'N/A'}/10
                  </span>
                  {result.results.emergenceDetected && (
                    <Badge variant="secondary" className="text-xs">
                      Breakthrough
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-700">
                <strong>Insight:</strong> {result.results.insight?.substring(0, 200)}...
              </div>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>Confidence: {(result.results.confidence * 100).toFixed(0)}%</span>
                <span>Novelty: {result.results.noveltyScore}/10</span>
                <span>Processing: {result.processingTime}ms</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

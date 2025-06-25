
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ValidationMetricsProps {
  metrics: any;
}

export const ValidationMetrics = ({ metrics }: ValidationMetricsProps) => {
  if (!metrics) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>
          Statistical analysis of validation test results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Genius Machine Performance</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Average Confidence:</span>
                <Badge>{(metrics.averageGeniusMetrics.confidence * 100).toFixed(1)}%</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Average Novelty Score:</span>
                <Badge>{metrics.averageGeniusMetrics.noveltyScore.toFixed(1)}/10</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Emergence Rate:</span>
                <Badge>{(metrics.averageGeniusMetrics.emergenceRate * 100).toFixed(1)}%</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Avg Processing Depth:</span>
                <Badge>{metrics.averageGeniusMetrics.averageProcessingDepth.toFixed(1)} layers</Badge>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">External LLM Performance</h4>
            <div className="space-y-2">
              {Object.entries(metrics.externalProviderStats).map(([provider, stats]: [string, any]) => (
                <div key={provider} className="border rounded p-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{provider}</span>
                    <Badge variant="outline">
                      {(stats.successRate * 100).toFixed(0)}% success
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600">
                    Avg Response Time: {stats.averageResponseTime.toFixed(0)}ms
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

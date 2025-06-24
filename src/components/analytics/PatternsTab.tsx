
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PatternsTabProps {
  patterns: any[];
}

export const PatternsTab = ({ patterns }: PatternsTabProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Discovered Configuration Patterns</h3>
      {patterns.length > 0 ? (
        <div className="space-y-4">
          {patterns.map((pattern, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  {pattern.pattern}
                </code>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {Math.round(pattern.confidence * 100)}% confidence
                  </Badge>
                  <Badge variant="secondary">
                    {pattern.sampleSize} samples
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Average Quality: {Math.round(pattern.averageQuality * 10) / 10}/10
              </p>
              <p className="text-xs text-gray-500">
                Domains: {pattern.applicableDomains.join(', ')}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No patterns discovered yet. Process more questions to see patterns emerge.</p>
      )}
    </Card>
  );
};

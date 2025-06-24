
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RawDataTabProps {
  rawData: any;
}

export const RawDataTab = ({ rawData }: RawDataTabProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Raw Learning Records</h3>
        <div className="text-sm text-gray-500">
          Total: {rawData?.records?.length || 0} records
        </div>
      </div>
      <ScrollArea className="h-96">
        {rawData?.records?.length > 0 ? (
          <div className="space-y-3">
            {rawData.records.slice(-10).reverse().map((record: any, index: number) => (
              <div key={record.id} className="border rounded p-3 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">
                    {new Date(record.timestamp).toLocaleString()}
                  </span>
                  <Badge variant="outline">
                    Quality: {record.qualityMetrics.overallScore}/10
                  </Badge>
                </div>
                <p className="text-sm font-medium mb-1 truncate">
                  {record.question}
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <span>{record.domainType}</span>
                  <span>•</span>
                  <span>Complexity: {record.complexity}</span>
                  <span>•</span>
                  <span>{record.learningTags.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">No learning records found.</p>
            <p className="text-xs text-gray-400">
              Process a question on the main page to generate learning data.
            </p>
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};

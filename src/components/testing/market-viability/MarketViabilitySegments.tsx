
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

interface MarketViabilitySegmentsProps {
  segmentPerformance: Record<string, number>;
}

export const MarketViabilitySegments = ({ segmentPerformance }: MarketViabilitySegmentsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Market Segment Performance</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(segmentPerformance).map(([segment, score]) => (
            <div key={segment} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge variant="outline">{segment}</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${((score as number) / 10) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium w-12 text-right">{(score as number).toFixed(1)}/10</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

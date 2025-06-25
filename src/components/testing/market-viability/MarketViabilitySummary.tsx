
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, CheckCircle, DollarSign, AlertCircle } from "lucide-react";

interface MarketViabilitySummaryProps {
  summary: {
    averageScore: number;
    successfulTests: number;
    totalTests: number;
    highValuePerformance: number;
    marketReadiness: string;
  };
}

export const MarketViabilitySummary = ({ summary }: MarketViabilitySummaryProps) => {
  const getReadinessColor = (readiness: string) => {
    switch (readiness) {
      case 'Ready': return 'bg-green-500';
      case 'Near Ready': return 'bg-yellow-500';
      case 'Needs Work': return 'bg-orange-500';
      default: return 'bg-red-500';
    }
  };

  const getReadinessIcon = (readiness: string) => {
    switch (readiness) {
      case 'Ready': return <CheckCircle className="w-4 h-4" />;
      case 'Near Ready': return <TrendingUp className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-2xl font-bold">{summary.averageScore}/10</div>
              <div className="text-sm text-gray-600">Average Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <div className="text-2xl font-bold">{summary.successfulTests}/{summary.totalTests}</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <div>
              <div className="text-2xl font-bold">{summary.highValuePerformance}/10</div>
              <div className="text-sm text-gray-600">High-Value Performance</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getReadinessColor(summary.marketReadiness)}`}></div>
            <div>
              <div className="text-lg font-bold flex items-center space-x-1">
                {getReadinessIcon(summary.marketReadiness)}
                <span>{summary.marketReadiness}</span>
              </div>
              <div className="text-sm text-gray-600">Market Readiness</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

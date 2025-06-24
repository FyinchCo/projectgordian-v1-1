
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, TrendingDown, BarChart3, RefreshCw } from "lucide-react";
import { useMetaLearning } from "@/hooks/useMetaLearning";

export const LearningDashboard = () => {
  const { learningDashboard, resetLearningSystem } = useMetaLearning();

  if (!learningDashboard || learningDashboard.learningStats.totalRecords === 0) {
    return (
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
        <div className="text-center">
          <Brain className="w-8 h-8 text-blue-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Meta-Learning System</h3>
          <p className="text-sm text-blue-600">
            System is ready to learn. Process your first question to begin building intelligence.
          </p>
        </div>
      </Card>
    );
  }

  const { learningStats, systemEvolution, recommendations } = learningDashboard;

  return (
    <div className="space-y-4">
      {/* System Overview */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Brain className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-purple-800">Learning System Status</h3>
          </div>
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            {Math.round(systemEvolution.maturity * 100)}% Mature
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-800">{learningStats.totalRecords}</div>
            <div className="text-xs text-purple-600">Questions Processed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-800">
              {Math.round(learningStats.averageQuality * 10) / 10}
            </div>
            <div className="text-xs text-purple-600">Average Quality</div>
          </div>
          <div className="text-center flex flex-col items-center">
            {learningStats.improvementTrend > 0 ? (
              <TrendingUp className="w-6 h-6 text-green-500" />
            ) : (
              <TrendingDown className="w-6 h-6 text-red-500" />
            )}
            <div className="text-xs text-purple-600 mt-1">Quality Trend</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-800">
              {Math.round(systemEvolution.learningVelocity * 100)}%
            </div>
            <div className="text-xs text-purple-600">Learning Rate</div>
          </div>
        </div>
      </Card>

      {/* Best Domains */}
      {learningStats.bestDomains && learningStats.bestDomains.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-blue-800">Top Performing Domains</h4>
          </div>
          <div className="space-y-2">
            {learningStats.bestDomains.slice(0, 3).map((domain, index) => (
              <div key={domain.domain} className="flex justify-between items-center">
                <span className="text-sm">{domain.domain}</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {Math.round(domain.averageQuality * 10) / 10}/10
                  </Badge>
                  <span className="text-xs text-gray-500">({domain.sampleSize} samples)</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* System Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <Card className="p-4">
          <h4 className="font-semibold text-green-800 mb-3">System Insights</h4>
          <div className="space-y-2">
            {recommendations.slice(0, 2).map((rec, index) => (
              <div key={index} className="text-sm text-green-700 bg-green-50 p-2 rounded">
                {rec}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Reset Option */}
      <div className="text-center pt-2">
        <Button
          onClick={resetLearningSystem}
          variant="outline"
          size="sm"
          className="text-xs"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Reset Learning Data
        </Button>
      </div>
    </div>
  );
};

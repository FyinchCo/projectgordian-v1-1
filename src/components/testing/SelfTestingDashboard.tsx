
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  BarChart3,
  Lightbulb,
  RefreshCw,
  Clock
} from "lucide-react";
import { useSelfTesting } from "@/hooks/useSelfTesting";

interface SelfTestingDashboardProps {
  onRunFullTest: () => Promise<void>;
  isVisible: boolean;
}

export const SelfTestingDashboard = ({ onRunFullTest, isVisible }: SelfTestingDashboardProps) => {
  const {
    isRunningTests,
    testResults,
    performanceMetrics,
    improvementPlan,
    currentTestProgress,
    getPerformanceInsights,
    clearTestHistory
  } = useSelfTesting();

  if (!isVisible) return null;

  const recentTests = testResults.slice(-10);
  const insights = getPerformanceInsights();

  const handleRunFullTest = async () => {
    console.log('Dashboard: Starting full test suite...');
    await onRunFullTest();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Target className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Self-Testing Dashboard</h2>
          {isRunningTests && (
            <Badge variant="secondary" className="ml-2">
              <Clock className="w-3 h-3 mr-1" />
              Testing...
            </Badge>
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={handleRunFullTest}
            disabled={isRunningTests}
            className="flex items-center space-x-2"
          >
            {isRunningTests ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Target className="w-4 h-4" />
            )}
            <span>{isRunningTests ? 'Running Tests...' : 'Run Full Test Suite'}</span>
          </Button>
          <Button
            onClick={clearTestHistory}
            variant="outline"
            className="flex items-center space-x-2"
            disabled={isRunningTests}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Clear History</span>
          </Button>
        </div>
      </div>

      {/* Test Progress */}
      {isRunningTests && currentTestProgress.total > 0 && (
        <Card className="p-4 border-blue-200 bg-blue-50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-blue-800">Running Tests</h3>
            <span className="text-sm text-blue-600">
              {currentTestProgress.current}/{currentTestProgress.total}
            </span>
          </div>
          <Progress 
            value={(currentTestProgress.current / currentTestProgress.total) * 100} 
            className="h-2"
          />
          <p className="text-sm text-blue-600 mt-2">
            Testing scenario {currentTestProgress.current} of {currentTestProgress.total}
          </p>
        </Card>
      )}

      {/* No Results Message */}
      {!isRunningTests && testResults.length === 0 && (
        <Card className="p-6 text-center">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Test Results Yet</h3>
          <p className="text-gray-500 mb-4">
            Run the full test suite to see performance metrics and insights.
          </p>
          <Button onClick={handleRunFullTest} className="flex items-center space-x-2 mx-auto">
            <Target className="w-4 h-4" />
            <span>Run Your First Test</span>
          </Button>
        </Card>
      )}

      {/* Performance Overview */}
      {performanceMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overall Score</p>
                <p className="text-2xl font-bold">{performanceMetrics.overallScore}%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
            <Progress value={performanceMetrics.overallScore} className="mt-2" />
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pass Rate</p>
                <p className="text-2xl font-bold">{performanceMetrics.passRate}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <Progress value={performanceMetrics.passRate} className="mt-2" />
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Confidence</p>
                <p className="text-2xl font-bold">{performanceMetrics.averageConfidence}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
            <Progress value={performanceMetrics.averageConfidence} className="mt-2" />
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Emergence Rate</p>
                <p className="text-2xl font-bold">{performanceMetrics.emergenceDetectionRate}%</p>
              </div>
              <Lightbulb className="w-8 h-8 text-yellow-500" />
            </div>
            <Progress value={performanceMetrics.emergenceDetectionRate} className="mt-2" />
          </Card>
        </div>
      )}

      {/* Performance Insights */}
      {insights.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Performance Insights</span>
          </h3>
          <div className="space-y-2">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm">{insight}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Category Performance */}
      {performanceMetrics && Object.keys(performanceMetrics.categoryPerformance).length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Category Performance</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(performanceMetrics.categoryPerformance).map(([category, score]) => (
              <div key={category} className="flex items-center space-x-3">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{category}</span>
                    <span className="text-sm text-gray-600">{score}%</span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
                <Badge variant={score >= 80 ? "default" : score >= 60 ? "secondary" : "destructive"}>
                  {score >= 80 ? "Strong" : score >= 60 ? "Good" : "Weak"}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Improvement Plan */}
      {improvementPlan && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Auto-Improvement Suggestions</span>
            <Badge variant={improvementPlan.priority === 'high' ? 'destructive' : improvementPlan.priority === 'medium' ? 'secondary' : 'outline'}>
              {improvementPlan.priority} priority
            </Badge>
          </h3>
          
          <p className="text-sm text-gray-600 mb-4">{improvementPlan.reasoning}</p>
          
          <div className="space-y-3">
            {improvementPlan.suggestions.slice(0, 5).map((suggestion, index) => (
              <div key={index} className="border rounded-lg p-3 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{suggestion.parameter}</h4>
                  <Badge variant="outline">+{suggestion.expectedImprovement}%</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{suggestion.reason}</p>
                <div className="text-xs text-gray-500">
                  {suggestion.currentValue} → {suggestion.suggestedValue} 
                  <span className="ml-2">({Math.round(suggestion.confidence * 100)}% confidence)</span>
                </div>
              </div>
            ))}
          </div>
          
          {improvementPlan.expectedOverallImprovement > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-800">
                Expected overall improvement: +{improvementPlan.expectedOverallImprovement}%
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Recent Test Results */}
      {recentTests.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>Recent Test Results ({recentTests.length})</span>
          </h3>
          <div className="space-y-3">
            {recentTests.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {result.passed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium">{result.scenarioId}</p>
                    <p className="text-sm text-gray-600">
                      Quality: {result.qualityScore}% | Issues: {result.issues.length}
                    </p>
                    {result.issues.length > 0 && (
                      <p className="text-xs text-red-600 mt-1">
                        {result.issues[0]}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={result.passed ? "default" : "destructive"}>
                    {result.passed ? "PASS" : "FAIL"}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

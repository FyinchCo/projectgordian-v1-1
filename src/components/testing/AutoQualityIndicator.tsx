
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertTriangle, TrendingUp } from "lucide-react";
import { TestResult } from "@/services/testing/selfTestingEngine";

interface AutoQualityIndicatorProps {
  testResult: TestResult | null;
  isVisible: boolean;
}

export const AutoQualityIndicator = ({ testResult, isVisible }: AutoQualityIndicatorProps) => {
  if (!isVisible || !testResult) return null;

  const getStatusIcon = () => {
    if (testResult.passed) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (testResult.qualityScore >= 50) {
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    } else {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    if (testResult.passed) return "text-green-700 bg-green-50 border-green-200";
    if (testResult.qualityScore >= 50) return "text-yellow-700 bg-yellow-50 border-yellow-200";
    return "text-red-700 bg-red-50 border-red-200";
  };

  return (
    <Card className={`p-4 border-2 ${getStatusColor()}`}>
      <div className="flex items-start space-x-3">
        {getStatusIcon()}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">Auto-Quality Assessment</h4>
            <Badge variant={testResult.passed ? "default" : "destructive"}>
              {testResult.qualityScore}% Quality Score
            </Badge>
          </div>
          
          {testResult.issues.length > 0 && (
            <div className="mb-3">
              <h5 className="font-medium text-sm mb-1">Issues Detected:</h5>
              <ul className="text-sm space-y-1">
                {testResult.issues.map((issue, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-current rounded-full"></div>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {testResult.recommendations.length > 0 && (
            <div>
              <h5 className="font-medium text-sm mb-1 flex items-center space-x-1">
                <TrendingUp className="w-4 h-4" />
                <span>Recommendations:</span>
              </h5>
              <ul className="text-sm space-y-1">
                {testResult.recommendations.slice(0, 2).map((rec, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-current rounded-full"></div>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { DebugInfo, isDetailedAnalysis } from "./types";

interface DebugInfoCardProps {
  debugInfo: DebugInfo | null;
  resultsCount: number;
}

export const DebugInfoCard = ({ debugInfo, resultsCount }: DebugInfoCardProps) => {
  if (!debugInfo) return null;

  return (
    <Card className="p-4 border-2">
      {resultsCount > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-green-800 flex items-center">
              ✅ Validation Results Available ({resultsCount} tests)
              {debugInfo && isDetailedAnalysis(debugInfo) && debugInfo.issues && debugInfo.issues.length > 0 && (
                <AlertTriangle className="w-4 h-4 ml-2 text-yellow-600" />
              )}
            </h4>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="font-bold text-green-700">
                {isDetailedAnalysis(debugInfo) ? debugInfo.completeResults : 0}
              </div>
              <div className="text-xs text-green-600">Complete</div>
            </div>
            <div className="text-center p-2 bg-yellow-50 rounded">
              <div className="font-bold text-yellow-700">
                {isDetailedAnalysis(debugInfo) ? debugInfo.partialResults : 0}
              </div>
              <div className="text-xs text-yellow-600">Partial</div>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded">
              <div className="font-bold text-blue-700">
                {isDetailedAnalysis(debugInfo) ? debugInfo.geniusMachineErrors : 0}
              </div>
              <div className="text-xs text-blue-600">GM Errors</div>
            </div>
            <div className="text-center p-2 bg-purple-50 rounded">
              <div className="font-bold text-purple-700">
                {isDetailedAnalysis(debugInfo) 
                  ? Object.values(debugInfo.externalErrors).reduce((a: number, b: number) => a + b, 0)
                  : 0
                }
              </div>
              <div className="text-xs text-purple-600">Ext Errors</div>
            </div>
          </div>
          
          {debugInfo && isDetailedAnalysis(debugInfo) && debugInfo.issues && debugInfo.issues.length > 0 && (
            <div className="mt-3 p-3 bg-yellow-50 rounded border border-yellow-200">
              <p className="text-sm font-medium text-yellow-800 mb-2">Issues Detected:</p>
              <ul className="text-xs text-yellow-700 space-y-1">
                {debugInfo.issues.slice(0, 3).map((issue: string, idx: number) => (
                  <li key={idx}>• {issue}</li>
                ))}
                {debugInfo.issues.length > 3 && (
                  <li>• ... and {debugInfo.issues.length - 3} more issues</li>
                )}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-600 mb-2">
            📋 No Results Available
          </h4>
          <p className="text-sm text-gray-600">
            {!isDetailedAnalysis(debugInfo) ? debugInfo.message : "Run a validation test to see comparisons."}
          </p>
          {!isDetailedAnalysis(debugInfo) && debugInfo.error && (
            <p className="text-sm text-red-600 mt-2">
              Error: {debugInfo.error}
            </p>
          )}
        </div>
      )}
    </Card>
  );
};

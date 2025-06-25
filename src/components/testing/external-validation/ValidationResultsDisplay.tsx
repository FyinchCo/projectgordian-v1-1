
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ValidationTestResult } from "@/services/testing/externalValidation/externalValidationFramework";

interface ValidationResultsDisplayProps {
  results: ValidationTestResult[];
}

export const ValidationResultsDisplay = ({ results }: ValidationResultsDisplayProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Validation Test Results</CardTitle>
        <CardDescription>
          Comparison of Genius Machine (3-layer) vs External LLMs (single-pass)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {results.map((result, index) => {
            const hasGeniusError = result.geniusMachineResult.insight.startsWith('Error:');
            const externalErrors = result.externalResults.filter(ext => ext.error).length;
            const externalSuccess = result.externalResults.filter(ext => !ext.error).length;
            
            return (
              <div key={result.questionId} className="border rounded-lg p-4">
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      Question {index + 1}
                    </Badge>
                    <div className="flex space-x-2">
                      {hasGeniusError && (
                        <Badge variant="destructive" className="text-xs">
                          GM Failed
                        </Badge>
                      )}
                      {externalErrors > 0 && (
                        <Badge variant="outline" className="text-xs text-red-600">
                          {externalErrors} Ext Failed
                        </Badge>
                      )}
                      {externalSuccess > 0 && (
                        <Badge variant="outline" className="text-xs text-green-600">
                          {externalSuccess} Ext Success
                        </Badge>
                      )}
                    </div>
                  </div>
                  <h4 className="font-medium text-sm">{result.question}</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Genius Machine Result */}
                  <div className={`border rounded p-3 ${hasGeniusError ? 'bg-red-50 border-red-200' : 'bg-blue-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={`text-xs ${hasGeniusError ? 'bg-red-600' : 'bg-blue-600'}`}>
                        Genius Machine (3-layer)
                      </Badge>
                      {!hasGeniusError && (
                        <div className="flex space-x-1">
                          <Badge variant="outline" className="text-xs">
                            Novel: {result.geniusMachineResult.noveltyScore}/10
                          </Badge>
                          {result.geniusMachineResult.emergenceDetected && (
                            <Badge variant="outline" className="text-xs text-green-600">
                              Emergence
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <p className={`text-sm mb-2 ${hasGeniusError ? 'text-red-700' : 'text-gray-700'}`}>
                      {result.geniusMachineResult.insight.substring(0, 150)}...
                    </p>
                    <div className="text-xs text-gray-500">
                      {hasGeniusError ? 'Processing failed' : `${result.geniusMachineResult.processingDepth} layers, ${Math.round(result.geniusMachineResult.confidence * 100)}% confidence`}
                    </div>
                  </div>

                  {/* External LLM Results */}
                  {result.externalResults.map((ext, extIndex) => (
                    <div key={extIndex} className={`border rounded p-3 ${ext.error ? 'bg-red-50 border-red-200' : ''}`}>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {ext.provider} {ext.model}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {ext.processingTime}ms
                        </Badge>
                      </div>
                      {ext.error ? (
                        <p className="text-sm text-red-600 mb-2">Error: {ext.error}</p>
                      ) : (
                        <p className="text-sm text-gray-700 mb-2">
                          {ext.response.substring(0, 150)}...
                        </p>
                      )}
                      <div className="text-xs text-gray-500">
                        Single-pass processing
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

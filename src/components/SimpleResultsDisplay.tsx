
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Eye, Zap } from "lucide-react";

interface SimpleResultsDisplayProps {
  results: any;
  question: string;
  onReset: () => void;
}

export const SimpleResultsDisplay = ({ results, question, onReset }: SimpleResultsDisplayProps) => {
  console.log('=== DISPLAYING SIMPLE RESULTS ===');
  console.log('Results structure:', Object.keys(results || {}));
  console.log('Full results:', results);

  if (!results) {
    return (
      <Card className="p-8 bg-white shadow-lg">
        <div className="text-center text-gray-500">
          No results to display
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-3">
            <Eye className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-blue-900">Analysis Complete</h2>
          </div>
          <p className="text-blue-700 max-w-2xl mx-auto">
            "{question}"
          </p>
        </div>
      </Card>

      {/* Main Insight */}
      <Card className="p-8 bg-white shadow-lg">
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-4">
            <Zap className="w-5 h-5 text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-800">Synthesized Insight</h3>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-purple-500">
            <div className="text-gray-700 leading-relaxed text-base space-y-4">
              {(results.insight || 'No insight available').split('\n\n').map((paragraph: string, index: number) => (
                <p key={index} className="mb-3 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Individual Archetype Responses */}
      {results.archetypeResponses && results.archetypeResponses.length > 0 && (
        <Card className="p-8 bg-white shadow-lg">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Individual Perspectives</h3>
            
            <div className="space-y-6">
              {results.archetypeResponses.map((response: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <h4 className="font-semibold text-gray-800">
                      {response.archetype || `Perspective ${index + 1}`}
                    </h4>
                  </div>
                  <div className="text-gray-700 leading-relaxed space-y-3">
                    {(response.response || 'No response available').split('\n\n').map((paragraph: string, idx: number) => (
                      <p key={idx} className="mb-2 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Simple Metrics */}
      <Card className="p-6 bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round((results.confidence || 0) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Confidence</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {results.archetypeResponses?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Perspectives</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {results.processingDepth || 1}
            </div>
            <div className="text-sm text-gray-600">Depth</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {results.insight?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Characters</div>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-center space-x-4 pt-6">
        <Button onClick={onReset} variant="outline" className="px-6">
          <RefreshCw className="w-4 h-4 mr-2" />
          Start New Analysis
        </Button>
      </div>
    </div>
  );
};

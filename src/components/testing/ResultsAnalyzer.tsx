
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { archetypeTestingFramework } from "@/services/testing/archetypeTestingFramework";
import { BarChart3, TrendingUp, Award } from "lucide-react";

export const ResultsAnalyzer = () => {
  const [selectedComparison, setSelectedComparison] = useState<{configA: string, configB: string} | null>(null);
  
  const results = archetypeTestingFramework.getTestResults();
  const configurations = archetypeTestingFramework.getConfigurations();
  
  // Calculate performance summary for each configuration
  const performanceSummary = configurations.map(config => {
    const performance = archetypeTestingFramework.getConfigurationPerformance(config.id);
    return {
      ...config,
      ...performance
    };
  }).filter(config => config.testCount > 0)
    .sort((a, b) => b.averageScore - a.averageScore);

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>Configuration Performance Rankings</span>
          </CardTitle>
          <CardDescription>
            Ranked by overall average score across all tests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {performanceSummary.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No test results available. Run some tests to see performance analysis.
            </p>
          ) : (
            <div className="space-y-4">
              {performanceSummary.map((config, index) => (
                <div key={config.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl font-bold text-gray-400">
                      #{index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold">{config.name}</h4>
                      <p className="text-sm text-gray-600">{config.description}</p>
                      {config.strengths.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {config.strengths.map((strength, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {strength}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {config.averageScore.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {config.testCount} tests
                    </div>
                    {config.improvements.length > 0 && (
                      <div className="text-xs text-orange-600 mt-1">
                        Needs: {config.improvements[0]}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Results Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Testing Statistics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{results.length}</div>
              <div className="text-sm text-gray-600">Total Tests Run</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {configurations.filter(c => archetypeTestingFramework.getConfigurationPerformance(c.id).testCount > 0).length}
              </div>
              <div className="text-sm text-gray-600">Configurations Tested</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {results.length > 0 ? (
                  (results.reduce((sum, r) => sum + r.qualityMetrics.overallScore, 0) / results.length).toFixed(1)
                ) : '0.0'}
              </div>
              <div className="text-sm text-gray-600">Average Quality Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Comparison */}
      {performanceSummary.length >= 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Configuration Comparison</span>
            </CardTitle>
            <CardDescription>
              Compare the performance of different archetype configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {performanceSummary.slice(0, 2).map((config, index) => (
                  <div key={config.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{config.name}</h4>
                      <Badge variant={index === 0 ? "default" : "secondary"}>
                        {index === 0 ? "Best" : "Second"}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold mb-2">{config.averageScore.toFixed(1)}/10</div>
                    <div className="text-sm text-gray-600">
                      Based on {config.testCount} tests
                    </div>
                  </div>
                ))}
              </div>
              
              {performanceSummary.length >= 2 && (
                <Button 
                  onClick={() => {
                    try {
                      const comparison = archetypeTestingFramework.compareConfigurations(
                        performanceSummary[0].id,
                        performanceSummary[1].id
                      );
                      console.log('Detailed comparison:', comparison);
                    } catch (error) {
                      console.error('Comparison failed:', error);
                    }
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Generate Detailed Comparison Report
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { baselineOptimizer, BaselineOptimizationResult } from "@/services/testing/baselineOptimizer";
import { archetypeTestingFramework } from "@/services/testing/archetypeTestingFramework";
import { TrendingUp, Zap, Target, CheckCircle, AlertCircle } from "lucide-react";

export const BaselineOptimizer = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<BaselineOptimizationResult | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const { toast } = useToast();

  const extractOptimizations = async () => {
    setIsAnalyzing(true);
    try {
      console.log('Starting baseline optimization analysis...');
      const result = await baselineOptimizer.extractOptimizationRecommendations();
      setOptimizationResult(result);
      
      toast({
        title: "Analysis Complete",
        description: `Generated optimizations based on test data with ${Math.round(result.recommendations.confidence * 100)}% confidence.`,
      });
    } catch (error) {
      console.error('Optimization analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze test data.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const deployOptimizedConfiguration = async () => {
    if (!optimizationResult) return;
    
    setIsDeploying(true);
    try {
      await baselineOptimizer.deployOptimizedConfiguration(optimizationResult.optimizedConfiguration);
      
      toast({
        title: "Configuration Deployed",
        description: "Performance-optimized default configuration is now available for testing.",
      });
    } catch (error) {
      toast({
        title: "Deployment Failed",
        description: "Failed to deploy optimized configuration.",
        variant: "destructive"
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const testResults = archetypeTestingFramework.getTestResults();
  const hasTestData = testResults.filter(r => r.configurationId === 'current-default').length > 0;

  if (!hasTestData) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <span>No Baseline Data</span>
          </CardTitle>
          <CardDescription>
            Run baseline tests first to generate optimization recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-orange-700">
            Click "Run Baseline Test" in the main interface to collect performance data before optimizing the baseline configuration.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analysis Controls */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span>Baseline Performance Optimization</span>
          </CardTitle>
          <CardDescription>
            Extract data-driven optimizations from your {testResults.filter(r => r.configurationId === 'current-default').length} baseline test results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={extractOptimizations}
            disabled={isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? "Analyzing Test Data..." : "Extract Optimization Recommendations"}
          </Button>
        </CardContent>
      </Card>

      {/* Optimization Results */}
      {optimizationResult && (
        <div className="space-y-6">
          {/* Current Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Current Baseline Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-bold text-blue-600">
                    {optimizationResult.currentPerformance.overallScore.toFixed(1)}/10
                  </div>
                  <div className="text-sm text-gray-600">Overall Quality Score</div>
                  <Progress value={optimizationResult.currentPerformance.overallScore * 10} className="mt-2" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">
                    {(optimizationResult.currentPerformance.emergenceRate * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Emergence Rate</div>
                  <Progress value={optimizationResult.currentPerformance.emergenceRate * 100} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Archetype Performance Issues */}
          <Card>
            <CardHeader>
              <CardTitle>Archetype Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {optimizationResult.currentPerformance.archetypeEffectiveness.map(archetype => (
                  <div key={archetype.name} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{archetype.name}</h4>
                      <Badge variant={archetype.roleEffectiveness >= 7 ? "default" : archetype.roleEffectiveness >= 5 ? "secondary" : "destructive"}>
                        {archetype.roleEffectiveness.toFixed(1)}/10
                      </Badge>
                    </div>
                    {archetype.issues.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-1">Issues identified:</p>
                        <ul className="text-sm text-red-600 space-y-1">
                          {archetype.issues.map((issue, idx) => (
                            <li key={idx}>• {issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Optimization Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Optimization Recommendations</span>
                <Badge variant="outline">
                  {Math.round(optimizationResult.recommendations.confidence * 100)}% confidence
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {optimizationResult.recommendations.archetypeAdjustments.map(adjustment => (
                  <div key={adjustment.archetypeName} className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">{adjustment.archetypeName}</h4>
                    
                    {adjustment.recommendedSettings.reasoning && (
                      <div className="mb-3 p-2 bg-blue-50 rounded text-sm text-blue-800">
                        {adjustment.recommendedSettings.reasoning}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <h5 className="font-medium text-gray-700">Current Settings</h5>
                        <ul className="mt-1 space-y-1">
                          {Object.entries(adjustment.currentSettings).map(([key, value]) => (
                            <li key={key}>{key}: {value}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-700">Recommended Changes</h5>
                        <ul className="mt-1 space-y-1">
                          {Object.entries(adjustment.recommendedSettings).filter(([key]) => key !== 'reasoning').map(([key, value]) => (
                            <li key={key} className="text-green-600">
                              {key}: {adjustment.currentSettings[key]} → {value}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    {adjustment.expectedImprovements.length > 0 && (
                      <div className="mt-3">
                        <h5 className="font-medium text-gray-700 mb-1">Expected Improvements:</h5>
                        <ul className="text-sm text-green-600 space-y-1">
                          {adjustment.expectedImprovements.map((improvement, idx) => (
                            <li key={idx}>• {improvement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Deploy Optimized Configuration */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Deploy Optimized Configuration</span>
              </CardTitle>
              <CardDescription>
                Create and deploy the performance-optimized default configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm space-y-2">
                  <p><strong>Configuration ID:</strong> {optimizationResult.optimizedConfiguration.id}</p>
                  <p><strong>Expected Improvements:</strong></p>
                  <ul className="ml-4 space-y-1">
                    {optimizationResult.optimizedConfiguration.metadata?.expectedImprovements?.map((improvement, idx) => (
                      <li key={idx} className="text-green-600">• {improvement}</li>
                    ))}
                  </ul>
                </div>
                
                <Button 
                  onClick={deployOptimizedConfiguration}
                  disabled={isDeploying}
                  className="w-full"
                >
                  {isDeploying ? "Deploying..." : "Deploy Performance-Optimized Configuration"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

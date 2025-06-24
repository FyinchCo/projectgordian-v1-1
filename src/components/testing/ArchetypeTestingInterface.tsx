
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { TestConfigurationManager } from "./TestConfigurationManager";
import { TestQuestionManager } from "./TestQuestionManager";
import { TestRunner } from "./TestRunner";
import { ResultsAnalyzer } from "./ResultsAnalyzer";
import { archetypeTestingFramework } from "@/services/testing/archetypeTestingFramework";
import { initializeDefaultTestData } from "@/services/testing/defaultTestConfigurations";
import { FlaskConical, Target, BarChart3, Settings } from "lucide-react";

export const ArchetypeTestingInterface = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  const initializeFramework = () => {
    try {
      initializeDefaultTestData();
      setIsInitialized(true);
      toast({
        title: "Framework Initialized",
        description: "Default configurations and benchmark questions have been loaded.",
      });
    } catch (error) {
      toast({
        title: "Initialization Failed",
        description: "Failed to initialize the testing framework.",
        variant: "destructive"
      });
    }
  };

  const resetFramework = () => {
    archetypeTestingFramework.clearAllData();
    setIsInitialized(false);
    toast({
      title: "Framework Reset",
      description: "All test data has been cleared.",
    });
  };

  const stats = {
    configurations: archetypeTestingFramework.getConfigurations().length,
    questions: archetypeTestingFramework.getTestQuestions().length,
    results: archetypeTestingFramework.getTestResults().length
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Archetype Testing Framework</h1>
          <p className="text-gray-600 mt-2">
            Scientific optimization of archetype configurations for breakthrough insights
          </p>
        </div>
        <div className="flex space-x-2">
          {!isInitialized && (
            <Button onClick={initializeFramework} className="bg-blue-600 hover:bg-blue-700">
              Initialize Framework
            </Button>
          )}
          <Button variant="outline" onClick={resetFramework}>
            Reset All Data
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Configurations</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.configurations}</div>
            <p className="text-xs text-muted-foreground">
              Test configurations available
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Test Questions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.questions}</div>
            <p className="text-xs text-muted-foreground">
              Benchmark questions ready
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Test Results</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.results}</div>
            <p className="text-xs text-muted-foreground">
              Completed test runs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="configurations">Configurations</TabsTrigger>
          <TabsTrigger value="testing">Run Tests</TabsTrigger>
          <TabsTrigger value="results">Results & Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FlaskConical className="w-5 h-5" />
                  <span>Testing Methodology</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Scientific Approach</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Controlled configuration variables</li>
                    <li>• Standardized benchmark questions</li>
                    <li>• Quantitative quality metrics</li>
                    <li>• Statistical significance testing</li>
                    <li>• Qualitative analysis and recommendations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Quality Metrics</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Insight Quality (depth, specificity)</li>
                    <li>• Novelty Score (breakthrough potential)</li>
                    <li>• Coherence (logical consistency)</li>
                    <li>• Practical Value (actionability)</li>
                    <li>• Overall Effectiveness Score</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Test Configurations</CardTitle>
                <CardDescription>
                  Available archetype configurations for testing
                </CardDescription>
              </CardHeader>
              <CardContent>
                {archetypeTestingFramework.getConfigurations().map(config => {
                  const performance = archetypeTestingFramework.getConfigurationPerformance(config.id);
                  return (
                    <div key={config.id} className="flex items-center justify-between p-3 border rounded mb-2">
                      <div>
                        <h4 className="font-medium">{config.name}</h4>
                        <p className="text-sm text-gray-600">{config.description}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={performance.testCount > 0 ? "default" : "secondary"}>
                          {performance.testCount} tests
                        </Badge>
                        {performance.testCount > 0 && (
                          <div className="text-sm text-gray-500 mt-1">
                            Avg: {performance.averageScore.toFixed(1)}/10
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="configurations" className="mt-6">
          <TestConfigurationManager />
        </TabsContent>

        <TabsContent value="testing" className="mt-6">
          <TestRunner />
        </TabsContent>

        <TabsContent value="results" className="mt-6">
          <ResultsAnalyzer />
        </TabsContent>
      </Tabs>
    </div>
  );
};


import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { TestConfigurationManager } from "./TestConfigurationManager";
import { TestQuestionManager } from "./TestQuestionManager";
import { TestRunner } from "./TestRunner";
import { ResultsAnalyzer } from "./ResultsAnalyzer";
import { InitializationControls } from "./InitializationControls";
import { DebugInfoCard } from "./DebugInfoCard";
import { StatsOverview } from "./StatsOverview";
import { BaselineResults } from "./BaselineResults";
import { archetypeTestingFramework } from "@/services/testing/archetypeTestingFramework";
import { initializeDefaultTestData } from "@/services/testing/defaultTestConfigurations";
import { FlaskConical } from "lucide-react";

export const ArchetypeTestingInterface = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRunningBaseline, setIsRunningBaseline] = useState(false);
  const [baselineResults, setBaselineResults] = useState<string>("");
  const { toast } = useToast();

  const initializeFramework = () => {
    try {
      console.log('Initializing archetype testing framework...');
      initializeDefaultTestData();
      setIsInitialized(true);
      console.log('Framework initialized successfully');
      toast({
        title: "Framework Initialized",
        description: "Default configurations and benchmark questions have been loaded.",
      });
    } catch (error) {
      console.error('Framework initialization failed:', error);
      toast({
        title: "Initialization Failed",
        description: "Failed to initialize the testing framework.",
        variant: "destructive"
      });
    }
  };

  const runBaselineTest = async () => {
    if (!isInitialized) {
      toast({
        title: "Initialize First",
        description: "Please initialize the framework before running tests.",
        variant: "destructive"
      });
      return;
    }

    console.log('Starting baseline test...');
    setIsRunningBaseline(true);
    setBaselineResults("");

    try {
      const results = await archetypeTestingFramework.runBaselineOptimizationTest();
      console.log('Baseline test completed:', results);
      setBaselineResults(results.summary);
      
      toast({
        title: "Baseline Test Complete",
        description: `Analyzed ${results.results.length} test cases. Check results below.`,
      });
    } catch (error) {
      console.error('Baseline test failed:', error);
      toast({
        title: "Baseline Test Failed", 
        description: "Check console for details. Some tests may have failed.",
        variant: "destructive"
      });
    } finally {
      setIsRunningBaseline(false);
    }
  };

  const resetFramework = () => {
    console.log('Resetting framework...');
    archetypeTestingFramework.clearAllData();
    setIsInitialized(false);
    setBaselineResults("");
    toast({
      title: "Framework Reset",
      description: "All test data has been cleared.",
    });
  };

  // Get stats with error handling
  let stats = { configurations: 0, questions: 0, results: 0 };
  try {
    stats = {
      configurations: archetypeTestingFramework.getConfigurations().length,
      questions: archetypeTestingFramework.getTestQuestions().length,
      results: archetypeTestingFramework.getTestResults().length
    };
    console.log('Current framework stats:', stats);
  } catch (error) {
    console.error('Error getting framework stats:', error);
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Archetype Testing Framework</h1>
          <p className="text-gray-600 mt-2">
            Scientific optimization of archetype configurations for breakthrough insights
          </p>
        </div>
        <InitializationControls
          isInitialized={isInitialized}
          isRunningBaseline={isRunningBaseline}
          onInitialize={initializeFramework}
          onRunBaseline={runBaselineTest}
          onReset={resetFramework}
        />
      </div>

      <DebugInfoCard 
        isInitialized={isInitialized}
        isRunningBaseline={isRunningBaseline}
        stats={stats}
      />

      <BaselineResults baselineResults={baselineResults} />

      <StatsOverview stats={stats} />

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
                {stats.configurations === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No configurations loaded. Click "Initialize Framework" to load default configurations.
                  </p>
                ) : (
                  archetypeTestingFramework.getConfigurations().map(config => {
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
                  })
                )}
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

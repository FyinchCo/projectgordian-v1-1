
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { externalValidationFramework, ValidationTestResult } from "@/services/testing/externalValidation/externalValidationFramework";
import { archetypeTestingFramework } from "@/services/testing/archetypeTestingFramework";
import { TestQuestion } from "@/services/testing/types";
import { Play, Download, Eye, BarChart3, Users, RefreshCw, Bug } from "lucide-react";

export const ExternalValidationTester = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [currentTest, setCurrentTest] = useState("");
  const [results, setResults] = useState<ValidationTestResult[]>([]);
  const [selectedTestSet, setSelectedTestSet] = useState<string>("benchmark");
  const { toast } = useToast();

  // Load results on component mount with detailed logging
  useEffect(() => {
    console.log("🔄 ExternalValidationTester: Loading results on mount...");
    const loadedResults = externalValidationFramework.loadResults();
    console.log("📊 Loaded results:", loadedResults.length, loadedResults);
    setResults(loadedResults);
    
    if (loadedResults.length > 0) {
      console.log(`✅ Successfully loaded ${loadedResults.length} previous results on mount`);
      toast({
        title: "Previous Results Found",
        description: `Loaded ${loadedResults.length} previous validation test results.`,
      });
    } else {
      console.log("ℹ️ No previous results found on mount");
    }
  }, []);

  const questions = archetypeTestingFramework.getTestQuestions();
  const benchmarkQuestions = questions.filter(q => q.category === 'philosophical' || q.difficulty === 'hard');

  const debugFrameworkState = () => {
    console.log("🔍 DEBUG: Framework state check initiated");
    externalValidationFramework.debugState();
    
    // Also check the current state in this component
    console.log("🔍 DEBUG: Component state:");
    console.log("- Results in component state:", results.length);
    console.log("- Results details:", results);
    
    // Force reload from localStorage
    const freshResults = externalValidationFramework.loadResults();
    console.log("🔍 DEBUG: Fresh load results:", freshResults.length);
    
    if (freshResults.length !== results.length) {
      console.log("⚠️ DEBUG: Mismatch detected, updating component state");
      setResults(freshResults);
    }
    
    toast({
      title: "Debug Info",
      description: `Component: ${results.length} results, Storage: ${freshResults.length} results. Check console for details.`,
    });
  };

  const runValidationTest = async () => {
    setIsRunning(true);
    setProgress({ current: 0, total: 0 });
    setCurrentTest("Initializing validation test...");
    
    try {
      let testQuestions: TestQuestion[] = [];
      
      switch (selectedTestSet) {
        case 'benchmark':
          testQuestions = benchmarkQuestions.slice(0, 3);
          break;
        case 'creative':
          testQuestions = questions.filter(q => q.category === 'creative').slice(0, 2);
          break;
        case 'analytical':
          testQuestions = questions.filter(q => q.category === 'technical' || q.category === 'scientific').slice(0, 2);
          break;
        default:
          testQuestions = questions.slice(0, 2);
      }

      if (testQuestions.length === 0) {
        toast({
          title: "No Test Questions Available",
          description: "Please initialize the framework with test questions first.",
          variant: "destructive"
        });
        return;
      }

      setProgress({ current: 0, total: testQuestions.length });
      setCurrentTest(`Starting validation test with ${testQuestions.length} questions...`);
      console.log(`🎯 Starting External Validation Test with ${testQuestions.length} questions`);

      // Actually run the validation test
      const testResults = await externalValidationFramework.runComparisonTest(testQuestions);
      
      console.log("✅ Test completed, setting results:", testResults.length);
      setResults(testResults);
      setProgress({ current: testQuestions.length, total: testQuestions.length });
      setCurrentTest("");

      toast({
        title: "External Validation Complete",
        description: `Successfully tested ${testResults.length} questions across 4 AI systems. Check the Results tab.`,
      });

    } catch (error) {
      console.error('❌ Validation test failed:', error);
      setCurrentTest("");
      toast({
        title: "Validation Test Failed",
        description: `Test failed: ${error.message}. Check console for details.`,
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const loadPreviousResults = () => {
    console.log("🔄 Manual load previous results triggered");
    const stored = externalValidationFramework.loadResults();
    console.log("📊 Manually loaded results:", stored.length, stored);
    setResults(stored);
    
    if (stored.length > 0) {
      toast({
        title: "Results Loaded",
        description: `Loaded ${stored.length} previous validation test results.`,
      });
    } else {
      toast({
        title: "No Previous Results",
        description: "No previous validation test results found in storage.",
        variant: "destructive"
      });
    }
  };

  const clearAllResults = () => {
    console.log("🗑️ Clearing all results");
    externalValidationFramework.clearResults();
    setResults([]);
    toast({
      title: "Results Cleared",
      description: "All validation test results have been cleared.",
    });
  };

  const generateBlindEvaluation = async () => {
    if (results.length === 0) {
      toast({
        title: "No Results Available",
        description: "Run a validation test first to generate blind evaluation data.",
        variant: "destructive"
      });
      return;
    }

    try {
      const blindData = await externalValidationFramework.generateBlindEvaluationData(results);
      
      // Export for external evaluation
      const blob = new Blob([JSON.stringify(blindData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `blind-evaluation-${Date.now()}.json`;
      a.click();

      toast({
        title: "Blind Evaluation Data Generated",
        description: "Downloaded blind evaluation dataset for external reviewers.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to generate blind evaluation data.",
        variant: "destructive"
      });
    }
  };

  const metrics = results.length > 0 ? externalValidationFramework.calculateValidationMetrics(results) : null;

  console.log("🖼️ Rendering component with", results.length, "results");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>External Validation Testing</span>
          </CardTitle>
          <CardDescription>
            Compare Genius Machine (3-layer processing) vs External LLMs (single-pass): GPT-4o-mini, Claude-3.5-Sonnet, Gemini-1.5-Pro
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Test Question Set</label>
              <Select value={selectedTestSet} onValueChange={setSelectedTestSet}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="benchmark">Benchmark Questions (3 tests × 4 AIs)</SelectItem>
                  <SelectItem value="creative">Creative Challenges (2 tests × 4 AIs)</SelectItem>
                  <SelectItem value="analytical">Analytical Problems (2 tests × 4 AIs)</SelectItem>
                  <SelectItem value="mixed">Mixed Sample (2 tests × 4 AIs)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end space-x-2">
              <Button variant="outline" size="sm" onClick={debugFrameworkState}>
                <Bug className="w-4 h-4 mr-1" />
                Debug State
              </Button>
              <Button variant="outline" size="sm" onClick={clearAllResults}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            </div>
          </div>

          {isRunning && (
            <div className="space-y-3">
              <Progress value={(progress.current / progress.total) * 100} />
              <div className="text-sm text-gray-600">
                Progress: {progress.current}/{progress.total} questions tested across 4 AI systems
              </div>
              {currentTest && (
                <div className="text-sm text-blue-600">
                  {currentTest}
                </div>
              )}
            </div>
          )}

          <div className="flex space-x-3">
            <Button 
              onClick={runValidationTest}
              disabled={isRunning}
              className="flex-1"
            >
              {isRunning ? (
                <>
                  <Play className="w-4 h-4 mr-2 animate-spin" />
                  Running 4-Way AI Comparison...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start 4-Way External Validation
                </>
              )}
            </Button>
            
            <Button variant="outline" onClick={loadPreviousResults}>
              Load Previous Results
            </Button>
          </div>

          {/* Results Preview - Enhanced with debugging */}
          {results.length > 0 ? (
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">
                ✅ Validation Results Available ({results.length} tests)
              </h4>
              <p className="text-sm text-green-700">
                {results.length} questions tested across {results.length > 0 ? results[0].externalResults.length + 1 : 4} AI systems. 
                View detailed results in the tabs below.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-600 mb-2">
                📋 No Results Available
              </h4>
              <p className="text-sm text-gray-600">
                Run a validation test or load previous results to see comparisons.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Tabs defaultValue="results" className="space-y-4">
          <TabsList>
            <TabsTrigger value="results">Test Results ({results.length})</TabsTrigger>
            <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
            <TabsTrigger value="evaluation">Blind Evaluation</TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Validation Test Results</CardTitle>
                <CardDescription>
                  Comparison of Genius Machine (3-layer) vs External LLMs (single-pass)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {results.map((result, index) => (
                    <div key={result.questionId} className="border rounded-lg p-4">
                      <div className="mb-3">
                        <Badge variant="outline" className="text-xs mb-2">
                          Question {index + 1}
                        </Badge>
                        <h4 className="font-medium text-sm">{result.question}</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Genius Machine Result */}
                        <div className="border rounded p-3 bg-blue-50">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className="text-xs bg-blue-600">Genius Machine (3-layer)</Badge>
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
                          </div>
                          <p className="text-sm text-gray-700 mb-2">
                            {result.geniusMachineResult.insight.substring(0, 150)}...
                          </p>
                          <div className="text-xs text-gray-500">
                            {result.geniusMachineResult.processingDepth} layers, {Math.round(result.geniusMachineResult.confidence * 100)}% confidence
                          </div>
                        </div>

                        {/* External LLM Results */}
                        {result.externalResults.map((ext, extIndex) => (
                          <div key={extIndex} className="border rounded p-3">
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
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics">
            {metrics && (
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>
                    Statistical analysis of validation test results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Genius Machine Performance</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Average Confidence:</span>
                          <Badge>{(metrics.averageGeniusMetrics.confidence * 100).toFixed(1)}%</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Average Novelty Score:</span>
                          <Badge>{metrics.averageGeniusMetrics.noveltyScore.toFixed(1)}/10</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Emergence Rate:</span>
                          <Badge>{(metrics.averageGeniusMetrics.emergenceRate * 100).toFixed(1)}%</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Avg Processing Depth:</span>
                          <Badge>{metrics.averageGeniusMetrics.averageProcessingDepth.toFixed(1)} layers</Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">External LLM Performance</h4>
                      <div className="space-y-2">
                        {Object.entries(metrics.externalProviderStats).map(([provider, stats]) => (
                          <div key={provider} className="border rounded p-2">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium">{provider}</span>
                              <Badge variant="outline">
                                {(stats.successRate * 100).toFixed(0)}% success
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-600">
                              Avg Response Time: {stats.averageResponseTime.toFixed(0)}ms
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="evaluation">
            <Card>
              <CardHeader>
                <CardTitle>Blind Evaluation Setup</CardTitle>
                <CardDescription>
                  Generate anonymized data for external human evaluation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Human Evaluation Protocol
                    </h4>
                    <p className="text-sm text-gray-700 mb-3">
                      Export anonymized responses for external evaluators to assess quality, novelty, and practical value 
                      without knowing which AI generated each response.
                    </p>
                    <Button onClick={generateBlindEvaluation} className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Generate Blind Evaluation Dataset
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded">
                      <div className="text-2xl font-bold text-blue-600">{results.length}</div>
                      <div className="text-sm text-gray-600">Questions Tested</div>
                    </div>
                    <div className="text-center p-4 border rounded">
                      <div className="text-2xl font-bold text-green-600">
                        {results.reduce((sum, r) => sum + r.externalResults.length + 1, 0)}
                      </div>
                      <div className="text-sm text-gray-600">Total Responses</div>
                    </div>
                    <div className="text-center p-4 border rounded">
                      <div className="text-2xl font-bold text-purple-600">
                        {metrics ? Object.keys(metrics.externalProviderStats).length + 1 : 1}
                      </div>
                      <div className="text-sm text-gray-600">AI Systems Compared</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

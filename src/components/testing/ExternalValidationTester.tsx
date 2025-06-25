
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
import { Play, Download, Eye, BarChart3, Users, RefreshCw, Bug, AlertTriangle } from "lucide-react";

// Define proper types for debug info
interface DetailedAnalysis {
  totalResults: number;
  geniusMachineErrors: number;
  externalErrors: Record<string, number>;
  partialResults: number;
  completeResults: number;
  issues: string[];
}

interface SimpleAnalysis {
  message: string;
  resultsCount: number;
  hasData?: boolean;
  error?: string;
  hasIssue?: boolean;
}

type DebugInfo = DetailedAnalysis | SimpleAnalysis;

// Type guard to check if debug info is detailed analysis
const isDetailedAnalysis = (debugInfo: DebugInfo): debugInfo is DetailedAnalysis => {
  return 'totalResults' in debugInfo;
};

export const ExternalValidationTester = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [currentTest, setCurrentTest] = useState("");
  const [results, setResults] = useState<ValidationTestResult[]>([]);
  const [selectedTestSet, setSelectedTestSet] = useState<string>("benchmark");
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const { toast } = useToast();

  // Load results on component mount with enhanced debugging
  useEffect(() => {
    console.log("🔄 ExternalValidationTester: Component mounting, loading results...");
    loadAndAnalyzeResults();
  }, []);

  const loadAndAnalyzeResults = () => {
    try {
      // Get raw localStorage data
      const rawData = localStorage.getItem('external-validation-results');
      console.log("📊 Raw localStorage data:", rawData ? rawData.substring(0, 200) + '...' : 'null');
      
      // Load through framework
      const loadedResults = externalValidationFramework.loadResults();
      console.log("📋 Framework loaded results:", loadedResults.length, loadedResults);
      
      // Analyze the results for issues
      const analysisResults = analyzeResults(loadedResults);
      setDebugInfo(analysisResults);
      
      setResults(loadedResults);
      
      if (loadedResults.length > 0) {
        console.log(`✅ Successfully loaded ${loadedResults.length} results`);
        
        // Check for failed tests
        const failedTests = loadedResults.filter(r => 
          r.geniusMachineResult.insight.startsWith('Error:') || 
          r.externalResults.every(ext => ext.error)
        );
        
        if (failedTests.length > 0) {
          toast({
            title: "Previous Results Found (with Issues)",
            description: `Loaded ${loadedResults.length} results, ${failedTests.length} had errors. Check Results tab for details.`,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Previous Results Found",
            description: `Successfully loaded ${loadedResults.length} validation test results.`,
          });
        }
      } else {
        console.log("ℹ️ No previous results found");
        setDebugInfo({ message: "No results in localStorage", hasData: false, resultsCount: 0 });
      }
    } catch (error) {
      console.error("❌ Error loading results:", error);
      setDebugInfo({ 
        error: error instanceof Error ? error.message : String(error), 
        hasIssue: true, 
        message: "Error loading results",
        resultsCount: 0 
      });
      toast({
        title: "Error Loading Results",
        description: "There was an issue loading previous results. Check console for details.",
        variant: "destructive"
      });
    }
  };

  const analyzeResults = (results: ValidationTestResult[]): DebugInfo => {
    if (!results || results.length === 0) {
      return { message: "No results to analyze", resultsCount: 0 };
    }

    const analysis: DetailedAnalysis = {
      totalResults: results.length,
      geniusMachineErrors: 0,
      externalErrors: {},
      partialResults: 0,
      completeResults: 0,
      issues: []
    };

    results.forEach((result, index) => {
      // Check Genius Machine issues
      if (result.geniusMachineResult.insight.startsWith('Error:')) {
        analysis.geniusMachineErrors++;
        analysis.issues.push(`Result ${index + 1}: Genius Machine failed`);
      }

      // Check external LLM issues
      result.externalResults.forEach(ext => {
        if (!analysis.externalErrors[ext.provider]) {
          analysis.externalErrors[ext.provider] = 0;
        }
        if (ext.error) {
          analysis.externalErrors[ext.provider]++;
        }
      });

      // Check if result is complete
      const hasGeniusResult = !result.geniusMachineResult.insight.startsWith('Error:');
      const hasExternalResults = result.externalResults.some(ext => !ext.error);
      
      if (hasGeniusResult && hasExternalResults) {
        analysis.completeResults++;
      } else {
        analysis.partialResults++;
        analysis.issues.push(`Result ${index + 1}: Partial data (Genius: ${hasGeniusResult ? 'OK' : 'FAILED'}, External: ${hasExternalResults ? 'PARTIAL' : 'ALL FAILED'})`);
      }
    });

    console.log("📊 Results Analysis:", analysis);
    return analysis;
  };

  const questions = archetypeTestingFramework.getTestQuestions();
  const benchmarkQuestions = questions.filter(q => q.category === 'philosophical' || q.difficulty === 'hard');

  const debugFrameworkState = () => {
    console.log("🔍 DEBUG: Complete framework state check");
    
    // Framework debug
    externalValidationFramework.debugState();
    
    // Component state debug
    console.log("🔍 DEBUG: Component Analysis:");
    console.log("- Results in state:", results.length);
    console.log("- Debug info:", debugInfo);
    
    // localStorage deep dive
    const rawData = localStorage.getItem('external-validation-results');
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        console.log("🔍 DEBUG: Parsed localStorage structure:", {
          hasResults: !!parsed.results,
          resultsCount: parsed.results?.length || 0,
          hasTimestamp: !!parsed.timestamp,
          hasVersion: !!parsed.version,
          keys: Object.keys(parsed)
        });
        
        if (parsed.results && parsed.results.length > 0) {
          console.log("🔍 DEBUG: First result sample:", {
            questionId: parsed.results[0].questionId,
            hasGeniusResult: !!parsed.results[0].geniusMachineResult,
            externalResultsCount: parsed.results[0].externalResults?.length || 0,
            geniusInsightPreview: parsed.results[0].geniusMachineResult?.insight?.substring(0, 50) + '...'
          });
        }
      } catch (e) {
        console.log("🔍 DEBUG: Failed to parse localStorage data:", e);
      }
    }
    
    // Force reload and reanalyze
    loadAndAnalyzeResults();
    
    const issuesCount = debugInfo && isDetailedAnalysis(debugInfo) ? debugInfo.issues?.length || 0 : 0;
    toast({
      title: "Debug Complete",
      description: `Found ${results.length} results. ${issuesCount} issues detected. Check console for full details.`,
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
      console.log(`🎯 Starting NEW External Validation Test with ${testQuestions.length} questions`);

      // Clear previous results before starting new test
      console.log("🗑️ Clearing previous results before new test");
      externalValidationFramework.clearResults();
      setResults([]);

      // Run the new test
      const testResults = await externalValidationFramework.runComparisonTest(testQuestions);
      
      console.log("✅ NEW Test completed, got results:", testResults.length);
      
      // Analyze new results immediately
      const newAnalysis = analyzeResults(testResults);
      setDebugInfo(newAnalysis);
      setResults(testResults);
      
      setProgress({ current: testQuestions.length, total: testQuestions.length });
      setCurrentTest("");

      // Better success reporting
      const completeResults = isDetailedAnalysis(newAnalysis) ? newAnalysis.completeResults : 0;
      const partialResults = isDetailedAnalysis(newAnalysis) ? newAnalysis.partialResults : 0;
      
      if (completeResults > 0) {
        toast({
          title: "External Validation Complete",
          description: `${completeResults} complete results, ${partialResults} partial results. Check Results tab.`,
        });
      } else {
        toast({
          title: "Test Completed with Issues",
          description: `All ${testResults.length} tests had errors. Check Results tab for details.`,
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('❌ Validation test failed:', error);
      setCurrentTest("");
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast({
        title: "Validation Test Failed",
        description: `Test failed: ${errorMessage}. Check console for details.`,
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const clearAllResults = () => {
    console.log("🗑️ Clearing all results and debug info");
    externalValidationFramework.clearResults();
    setResults([]);
    setDebugInfo(null);
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

  console.log("🖼️ Rendering component with", results.length, "results and debug info:", debugInfo);

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
                  Start NEW 4-Way Validation Test
                </>
              )}
            </Button>
            
            <Button variant="outline" onClick={loadAndAnalyzeResults}>
              Reload & Analyze Results
            </Button>
          </div>

          {/* Enhanced Results Status with Debug Info */}
          {debugInfo && (
            <Card className="p-4 border-2">
              {results.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-green-800 flex items-center">
                      ✅ Validation Results Available ({results.length} tests)
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
                    {debugInfo.message || "Run a validation test to see comparisons."}
                  </p>
                  {'error' in debugInfo && debugInfo.error && (
                    <p className="text-sm text-red-600 mt-2">
                      Error: {debugInfo.error}
                    </p>
                  )}
                </div>
              )}
            </Card>
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

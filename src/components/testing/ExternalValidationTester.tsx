
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { externalValidationFramework, ValidationTestResult } from "@/services/testing/externalValidation/externalValidationFramework";
import { archetypeTestingFramework } from "@/services/testing/archetypeTestingFramework";
import { TestQuestion } from "@/services/testing/types";
import { BarChart3 } from "lucide-react";

// Import the new focused components
import { DebugInfoCard } from "./external-validation/DebugInfoCard";
import { TestControls } from "./external-validation/TestControls";
import { ValidationResultsDisplay } from "./external-validation/ValidationResultsDisplay";
import { ValidationMetrics } from "./external-validation/ValidationMetrics";
import { BlindEvaluationTab } from "./external-validation/BlindEvaluationTab";
import { DebugInfo, isDetailedAnalysis } from "./external-validation/types";

export const ExternalValidationTester = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [currentTest, setCurrentTest] = useState("");
  const [results, setResults] = useState<ValidationTestResult[]>([]);
  const [selectedTestSet, setSelectedTestSet] = useState<string>("benchmark");
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    console.log("🔄 ExternalValidationTester: Component mounting, loading results...");
    loadAndAnalyzeResults();
  }, []);

  const loadAndAnalyzeResults = () => {
    try {
      const rawData = localStorage.getItem('external-validation-results');
      console.log("📊 Raw localStorage data:", rawData ? rawData.substring(0, 200) + '...' : 'null');
      
      const loadedResults = externalValidationFramework.loadResults();
      console.log("📋 Framework loaded results:", loadedResults.length, loadedResults);
      
      const analysisResults = analyzeResults(loadedResults);
      setDebugInfo(analysisResults);
      setResults(loadedResults);
      
      if (loadedResults.length > 0) {
        console.log(`✅ Successfully loaded ${loadedResults.length} results`);
        
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

    const analysis = {
      totalResults: results.length,
      geniusMachineErrors: 0,
      externalErrors: {} as Record<string, number>,
      partialResults: 0,
      completeResults: 0,
      issues: [] as string[]
    };

    results.forEach((result, index) => {
      if (result.geniusMachineResult.insight.startsWith('Error:')) {
        analysis.geniusMachineErrors++;
        analysis.issues.push(`Result ${index + 1}: Genius Machine failed`);
      }

      result.externalResults.forEach(ext => {
        if (!analysis.externalErrors[ext.provider]) {
          analysis.externalErrors[ext.provider] = 0;
        }
        if (ext.error) {
          analysis.externalErrors[ext.provider]++;
        }
      });

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
    externalValidationFramework.debugState();
    
    console.log("🔍 DEBUG: Component Analysis:");
    console.log("- Results in state:", results.length);
    console.log("- Debug info:", debugInfo);
    
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

      console.log("🗑️ Clearing previous results before new test");
      externalValidationFramework.clearResults();
      setResults([]);

      const testResults = await externalValidationFramework.runComparisonTest(testQuestions);
      
      console.log("✅ NEW Test completed, got results:", testResults.length);
      
      const newAnalysis = analyzeResults(testResults);
      setDebugInfo(newAnalysis);
      setResults(testResults);
      
      setProgress({ current: testQuestions.length, total: testQuestions.length });
      setCurrentTest("");

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
        <CardContent>
          <TestControls
            selectedTestSet={selectedTestSet}
            setSelectedTestSet={setSelectedTestSet}
            isRunning={isRunning}
            progress={progress}
            currentTest={currentTest}
            onRunTest={runValidationTest}
            onReloadResults={loadAndAnalyzeResults}
            onDebugState={debugFrameworkState}
            onClearResults={clearAllResults}
          />

          <DebugInfoCard debugInfo={debugInfo} resultsCount={results.length} />
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
            <ValidationResultsDisplay results={results} />
          </TabsContent>

          <TabsContent value="metrics">
            <ValidationMetrics metrics={metrics} />
          </TabsContent>

          <TabsContent value="evaluation">
            <BlindEvaluationTab
              results={results}
              metrics={metrics}
              onGenerateBlindEvaluation={generateBlindEvaluation}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

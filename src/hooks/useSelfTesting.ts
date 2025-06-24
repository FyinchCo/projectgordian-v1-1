
import { useState, useCallback } from 'react';
import { selfTestingEngine, TestResult, PerformanceMetrics, TestScenario } from '@/services/testing/selfTestingEngine';
import { autoImprovementEngine, ImprovementPlan } from '@/services/testing/autoImprovementEngine';
import { ProcessingResult } from '@/components/processing/types';
import { useToast } from './use-toast';

export const useSelfTesting = () => {
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [improvementPlan, setImprovementPlan] = useState<ImprovementPlan | null>(null);
  const [currentTestProgress, setCurrentTestProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [testStatus, setTestStatus] = useState<string>('');
  const [testErrors, setTestErrors] = useState<string[]>([]);
  const { toast } = useToast();

  const evaluateResult = useCallback((scenario: TestScenario, result: ProcessingResult): TestResult => {
    const testResult = selfTestingEngine.evaluateResult(scenario, result);
    
    // Update local state
    const updatedResults = [...selfTestingEngine.getTestHistory()];
    setTestResults(updatedResults);
    
    // Update performance metrics
    const metrics = selfTestingEngine.analyzePerformance();
    setPerformanceMetrics(metrics);
    
    // Generate improvement suggestions if performance is below threshold
    if (metrics.overallScore < 75) {
      const plan = autoImprovementEngine.analyzeAndSuggestImprovements(metrics);
      setImprovementPlan(plan);
    }
    
    return testResult;
  }, []);

  const runAutomaticQualityCheck = useCallback((result: ProcessingResult, question: string): TestResult | null => {
    // Find the most appropriate test scenario for this question
    const scenarios = selfTestingEngine.getTestScenarios();
    
    // Simple matching logic - can be enhanced with better classification
    let bestMatch: TestScenario | null = null;
    
    const questionLower = question.toLowerCase();
    if (questionLower.includes('conscious') || questionLower.includes('philosophy') || questionLower.includes('meaning')) {
      bestMatch = scenarios.find(s => s.category === 'Philosophy') || null;
    } else if (questionLower.includes('creative') || questionLower.includes('design') || questionLower.includes('imagine')) {
      bestMatch = scenarios.find(s => s.category === 'Creative') || null;
    } else if (questionLower.includes('business') || questionLower.includes('strategy') || questionLower.includes('market')) {
      bestMatch = scenarios.find(s => s.category === 'Business') || null;
    } else if (questionLower.includes('technical') || questionLower.includes('algorithm') || questionLower.includes('ai')) {
      bestMatch = scenarios.find(s => s.category === 'Technical') || null;
    } else if (questionLower.includes('social') || questionLower.includes('people') || questionLower.includes('society')) {
      bestMatch = scenarios.find(s => s.category === 'Social') || null;
    }
    
    if (bestMatch) {
      return evaluateResult(bestMatch, result);
    }
    
    return null;
  }, [evaluateResult]);

  const runFullTestSuite = useCallback(async (
    processFunction: (question: string) => Promise<ProcessingResult>
  ) => {
    console.log('useSelfTesting: Starting full test suite...');
    setIsRunningTests(true);
    setTestErrors([]);
    setTestStatus('Initializing test suite...');
    
    const scenarios = selfTestingEngine.getTestScenarios();
    const results: TestResult[] = [];
    
    setCurrentTestProgress({ current: 0, total: scenarios.length });
    
    try {
      for (let i = 0; i < scenarios.length; i++) {
        const scenario = scenarios[i];
        console.log(`useSelfTesting: Running test ${i + 1}/${scenarios.length}: ${scenario.description}`);
        
        setCurrentTestProgress({ current: i + 1, total: scenarios.length });
        setTestStatus(`Testing ${scenario.category}: ${scenario.description}`);
        
        toast({
          title: "Running Test",
          description: `Testing scenario ${i + 1}/${scenarios.length}: ${scenario.category}`,
          variant: "default",
        });
        
        try {
          console.log(`useSelfTesting: Calling processFunction for: ${scenario.question}`);
          
          // Add timeout to prevent hanging
          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('Test timeout after 60 seconds')), 60000);
          });
          
          const processingResult = await Promise.race([
            processFunction(scenario.question),
            timeoutPromise
          ]);
          
          console.log(`useSelfTesting: Processing completed for scenario ${i + 1}:`, processingResult);
          
          // Validate the result structure
          if (!processingResult || typeof processingResult.confidence !== 'number') {
            throw new Error('Invalid processing result structure');
          }
          
          const testResult = evaluateResult(scenario, processingResult);
          results.push(testResult);
          
          console.log(`useSelfTesting: Test result for scenario ${i + 1}:`, testResult);
          
          // Show individual test result
          toast({
            title: testResult.passed ? "Test Passed ✓" : "Test Failed ✗",
            description: `${scenario.category}: Quality ${testResult.qualityScore}%`,
            variant: testResult.passed ? "default" : "destructive",
          });
          
        } catch (testError) {
          console.error(`useSelfTesting: Error in test ${i + 1}:`, testError);
          
          const errorMessage = testError instanceof Error ? testError.message : 'Unknown error';
          setTestErrors(prev => [...prev, `Test ${i + 1} (${scenario.category}): ${errorMessage}`]);
          
          // Create a failed test result for this scenario
          const failedResult: TestResult = {
            scenarioId: scenario.id,
            passed: false,
            actualResult: {
              insight: `Test failed to execute: ${errorMessage}`,
              confidence: 0,
              tensionPoints: 0,
              noveltyScore: 0,
              emergenceDetected: false
            },
            qualityScore: 0,
            issues: [`Test execution failed: ${errorMessage}`],
            recommendations: ['Check system configuration and try again'],
            timestamp: Date.now()
          };
          
          results.push(failedResult);
          
          toast({
            title: "Test Error",
            description: `Failed to run ${scenario.category} test: ${errorMessage}`,
            variant: "destructive",
          });
        }
        
        // Small delay between tests to prevent overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Final analysis
      setTestStatus('Analyzing results...');
      const metrics = selfTestingEngine.analyzePerformance();
      setPerformanceMetrics(metrics);
      
      const passedCount = results.filter(r => r.passed).length;
      const totalCount = results.length;
      
      console.log(`useSelfTesting: Test suite completed. ${passedCount}/${totalCount} passed`);
      
      setTestStatus(`Test suite complete: ${passedCount}/${totalCount} passed`);
      
      toast({
        title: "Test Suite Complete",
        description: `Results: ${passedCount}/${totalCount} tests passed (${metrics.overallScore}% overall score)`,
        variant: metrics.overallScore >= 75 ? "default" : "destructive",
      });
      
    } catch (error) {
      console.error('useSelfTesting: Test suite failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setTestErrors(prev => [...prev, `Test suite failed: ${errorMessage}`]);
      setTestStatus(`Test suite failed: ${errorMessage}`);
      
      toast({
        title: "Test Suite Failed",
        description: `Error running automated tests: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsRunningTests(false);
      setCurrentTestProgress({ current: 0, total: 0 });
      console.log('useSelfTesting: Test suite finished');
    }
  }, [evaluateResult, toast]);

  const getPerformanceInsights = useCallback((): string[] => {
    if (!performanceMetrics) return [];
    
    const insights: string[] = [];
    
    if (performanceMetrics.overallScore >= 80) {
      insights.push(`🎯 Excellent performance (${performanceMetrics.overallScore}%)`);
    } else if (performanceMetrics.overallScore >= 60) {
      insights.push(`⚡ Good performance (${performanceMetrics.overallScore}%) with room for improvement`);
    } else {
      insights.push(`⚠️ Performance needs attention (${performanceMetrics.overallScore}%)`);
    }
    
    if (performanceMetrics.strongAreas.length > 0) {
      insights.push(`💪 Strong in: ${performanceMetrics.strongAreas.join(', ')}`);
    }
    
    if (performanceMetrics.weakAreas.length > 0) {
      insights.push(`🔧 Needs work: ${performanceMetrics.weakAreas.join(', ')}`);
    }
    
    return insights;
  }, [performanceMetrics]);

  const clearTestHistory = useCallback(() => {
    selfTestingEngine.clearTestHistory();
    setTestResults([]);
    setPerformanceMetrics(null);
    setImprovementPlan(null);
    setTestErrors([]);
    setTestStatus('');
    
    toast({
      title: "Test History Cleared",
      description: "All test data has been reset",
      variant: "default",
    });
  }, [toast]);

  return {
    evaluateResult,
    runAutomaticQualityCheck,
    runFullTestSuite,
    getPerformanceInsights,
    clearTestHistory,
    isRunningTests,
    testResults,
    performanceMetrics,
    improvementPlan,
    currentTestProgress,
    testStatus,
    testErrors,
    selfTestingEngine,
    autoImprovementEngine
  };
};

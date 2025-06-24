
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
    
    // Show toast notification
    if (testResult.passed) {
      toast({
        title: "Test Passed ✓",
        description: `Quality score: ${testResult.qualityScore}%`,
        variant: "default",
      });
    } else {
      toast({
        title: "Test Failed ✗",
        description: `Issues found: ${testResult.issues.length}`,
        variant: "destructive",
      });
    }
    
    return testResult;
  }, [toast]);

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
    setIsRunningTests(true);
    const scenarios = selfTestingEngine.getTestScenarios();
    const results: TestResult[] = [];
    
    try {
      for (const scenario of scenarios) {
        toast({
          title: "Running Test",
          description: `Testing: ${scenario.description}`,
          variant: "default",
        });
        
        const processingResult = await processFunction(scenario.question);
        const testResult = evaluateResult(scenario, processingResult);
        results.push(testResult);
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      const metrics = selfTestingEngine.analyzePerformance();
      setPerformanceMetrics(metrics);
      
      toast({
        title: "Test Suite Complete",
        description: `Overall score: ${metrics.overallScore}% (${results.filter(r => r.passed).length}/${results.length} passed)`,
        variant: metrics.overallScore >= 75 ? "default" : "destructive",
      });
      
    } catch (error) {
      toast({
        title: "Test Suite Failed",
        description: "Error running automated tests",
        variant: "destructive",
      });
    } finally {
      setIsRunningTests(false);
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
    selfTestingEngine,
    autoImprovementEngine
  };
};

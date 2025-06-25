
import { ArchetypeTestConfiguration, TestQuestion, TestResult, ComparisonResult, ArchetypeInsight } from './types';
import { dataManager } from './dataManager';
import { testRunner } from './testRunner';
import { qualityAnalyzer } from './qualityAnalyzer';
import { comparisonEngine } from './comparisonEngine';

export class ArchetypeTestingFramework {
  private testResults: TestResult[] = [];
  private configurations: ArchetypeTestConfiguration[] = [];
  private testQuestions: TestQuestion[] = [];

  constructor() {
    this.loadStoredData();
  }

  // Configuration Management
  addConfiguration(config: ArchetypeTestConfiguration): void {
    this.configurations.push(config);
    this.saveData();
  }

  getConfigurations(): ArchetypeTestConfiguration[] {
    return this.configurations;
  }

  // Test Question Management
  addTestQuestion(question: TestQuestion): void {
    this.testQuestions.push(question);
    this.saveData();
  }

  getTestQuestions(): TestQuestion[] {
    return this.testQuestions;
  }

  // Core Testing Function
  async runTest(
    configurationId: string, 
    questionId: string, 
    processingDepth: number = 1,
    maxRetries: number = 3
  ): Promise<TestResult> {
    const configuration = this.configurations.find(c => c.id === configurationId);
    const question = this.testQuestions.find(q => q.id === questionId);
    
    if (!configuration || !question) {
      throw new Error('Configuration or question not found');
    }

    const result = await testRunner.runTest(configuration, question, processingDepth, maxRetries);
    this.testResults.push(result);
    this.saveData();
    
    return result;
  }

  // Comparison and Analysis
  compareConfigurations(configIdA: string, configIdB: string): ComparisonResult {
    return comparisonEngine.compareConfigurations(configIdA, configIdB, this.testResults);
  }

  // Batch Testing
  async runBatchTest(
    configurationIds: string[], 
    questionIds: string[], 
    onProgress?: (current: number, total: number) => void
  ): Promise<TestResult[]> {
    const results = await testRunner.runBatchTest(
      this.configurations,
      this.testQuestions,
      configurationIds,
      questionIds,
      onProgress
    );
    
    this.testResults.push(...results);
    this.saveData();
    
    return results;
  }

  // Archetype Optimization Testing
  async runArchetypeOptimizationTest(
    configurationIds: string[],
    includeArchetypeSpecificQuestions: boolean = true,
    onProgress?: (current: number, total: number, status: string) => void
  ): Promise<{
    results: TestResult[];
    analysis: any;
    recommendations: any;
  }> {
    let questionsToTest = this.testQuestions;
    
    if (includeArchetypeSpecificQuestions) {
      const { allArchetypeSpecificQuestions } = await import('./archetypeSpecificQuestions');
      allArchetypeSpecificQuestions.forEach(question => {
        if (!this.testQuestions.find(q => q.id === question.id)) {
          this.addTestQuestion(question);
        }
      });
      questionsToTest = this.testQuestions;
    }

    // Run comprehensive tests
    const results: TestResult[] = [];
    const total = configurationIds.length * questionsToTest.length;
    let current = 0;

    for (const configId of configurationIds) {
      onProgress?.(current, total, `Testing configuration: ${configId}`);
      
      for (const question of questionsToTest) {
        try {
          onProgress?.(current, total, `Testing: ${question.question.substring(0, 50)}...`);
          
          const result = await this.runTest(configId, question.id, 1, 2);
          results.push(result);
          current++;
          
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Test failed for ${configId} + ${question.id}:`, error);
          current++;
        }
      }
    }

    // Analyze results
    const { archetypeAnalyzer } = await import('./archetypeAnalyzer');
    
    const analysis = configurationIds.map(configId => ({
      configurationId: configId,
      profiles: archetypeAnalyzer.analyzeArchetypePerformance(configId, 
        results.filter(r => r.configurationId === configId)
      )
    }));

    const recommendations = configurationIds.map(configId => 
      archetypeAnalyzer.generateOptimizationRecommendations(configId,
        results.filter(r => r.configurationId === configId)
      )
    );

    return { results, analysis, recommendations };
  }

  // Baseline Testing
  async runBaselineOptimizationTest(): Promise<{
    results: TestResult[];
    analysis: any;
    recommendations: any;
    summary: string;
  }> {
    console.log('Starting baseline optimization test...');
    
    const currentConfig = this.configurations.find(c => c.id === 'current-default');
    if (!currentConfig) {
      throw new Error('Current default configuration not found. Please initialize the framework first.');
    }

    const testResult = await this.runArchetypeOptimizationTest(
      ['current-default'], 
      true,
      (current, total, status) => {
        console.log(`Progress: ${current}/${total} - ${status}`);
      }
    );

    const summary = this.generateBaselineSummary(testResult);
    console.log('Baseline test completed:', summary);
    
    return { ...testResult, summary };
  }

  // Archetype Insights
  getArchetypeSpecificInsights(configurationId: string): ArchetypeInsight[] {
    const configuration = this.configurations.find(c => c.id === configurationId);
    if (!configuration) return [];

    return configuration.archetypes.map(archetype => {
      const targetedResults = this.testResults.filter(result => 
        this.testQuestions.find(q => q.id === result.questionId)?.archetypeTarget === archetype.name
      );

      const averagePerformance = targetedResults.length > 0 
        ? targetedResults.reduce((sum, r) => sum + r.qualityMetrics.overallScore, 0) / targetedResults.length
        : 0;

      let roleEffectiveness = 'Unknown';
      if (averagePerformance >= 8) roleEffectiveness = 'Excellent';
      else if (averagePerformance >= 7) roleEffectiveness = 'Good';
      else if (averagePerformance >= 6) roleEffectiveness = 'Fair';
      else roleEffectiveness = 'Needs Improvement';

      const specificWeaknesses: string[] = [];
      const optimizationSuggestions: string[] = [];

      if (targetedResults.length > 0) {
        const avgNovelty = targetedResults.reduce((sum, r) => sum + r.qualityMetrics.noveltyScore, 0) / targetedResults.length;
        const avgCoherence = targetedResults.reduce((sum, r) => sum + r.qualityMetrics.coherenceScore, 0) / targetedResults.length;
        const avgInsight = targetedResults.reduce((sum, r) => sum + r.qualityMetrics.insightQuality, 0) / targetedResults.length;

        if (archetype.name === 'The Visionary' && avgNovelty < 7) {
          specificWeaknesses.push('Low novelty generation for visionary role');
          optimizationSuggestions.push('Consider increasing imagination parameter');
        }
        if (archetype.name === 'The Skeptic' && avgCoherence < 7) {
          specificWeaknesses.push('Insufficient analytical rigor');
          optimizationSuggestions.push('Consider increasing skepticism parameter');
        }
        if (avgInsight < 6) {
          specificWeaknesses.push('Below-average insight quality');
          optimizationSuggestions.push('Review language style and emotional settings');
        }
      }

      return {
        archetypeName: archetype.name,
        targetedQuestions: targetedResults.length,
        averagePerformance: Math.round(averagePerformance * 10) / 10,
        roleEffectiveness,
        specificWeaknesses,
        optimizationSuggestions
      };
    });
  }

  // Data Management
  getTestResults(): TestResult[] {
    return this.testResults;
  }

  getConfigurationPerformance(configId: string) {
    return qualityAnalyzer.getConfigurationPerformance(configId, this.testResults);
  }

  clearAllData(): void {
    this.configurations = [];
    this.testQuestions = [];
    this.testResults = [];
    dataManager.clearAllData();
  }

  // Private methods
  private generateBaselineSummary(testResult: any): string {
    const { results, analysis, recommendations } = testResult;
    
    if (results.length === 0) {
      return 'No test results generated. Check for errors in test execution.';
    }

    const avgOverallScore = results.reduce((sum: number, r: TestResult) => sum + r.qualityMetrics.overallScore, 0) / results.length;
    const emergenceRate = results.filter((r: TestResult) => r.results.emergenceDetected).length / results.length;
    const avgNovelty = results.reduce((sum: number, r: TestResult) => sum + r.qualityMetrics.noveltyScore, 0) / results.length;
    const avgCoherence = results.reduce((sum: number, r: TestResult) => sum + r.qualityMetrics.coherenceScore, 0) / results.length;

    let summary = `BASELINE PERFORMANCE ANALYSIS:\n\n`;
    summary += `Overall Quality: ${avgOverallScore.toFixed(1)}/10 `;
    if (avgOverallScore >= 8) summary += '(Excellent)\n';
    else if (avgOverallScore >= 7) summary += '(Good)\n';
    else if (avgOverallScore >= 6) summary += '(Fair)\n';
    else summary += '(Needs Improvement)\n';

    summary += `Emergence Rate: ${(emergenceRate * 100).toFixed(1)}% `;
    if (emergenceRate >= 0.3) summary += '(High breakthrough potential)\n';
    else if (emergenceRate >= 0.2) summary += '(Moderate breakthrough potential)\n';
    else summary += '(Low breakthrough potential)\n';

    summary += `Novelty Score: ${avgNovelty.toFixed(1)}/10\n`;
    summary += `Coherence Score: ${avgCoherence.toFixed(1)}/10\n`;
    summary += `Total Tests: ${results.length}\n\n`;

    if (analysis && analysis.length > 0) {
      summary += `ARCHETYPE PERFORMANCE:\n`;
      const profiles = analysis[0].profiles || [];
      profiles.forEach((profile: any) => {
        summary += `• ${profile.archetypeName}: ${profile.overallOptimization}/10 (${profile.roleEffectiveness}/10 role effectiveness)\n`;
      });
    }

    if (recommendations && recommendations.length > 0 && recommendations[0].archetypeAdjustments) {
      summary += `\nKEY OPTIMIZATION OPPORTUNITIES:\n`;
      recommendations[0].archetypeAdjustments.forEach((adj: any) => {
        if (adj.recommendedSettings.reasoning) {
          summary += `• ${adj.archetypeName}: ${adj.recommendedSettings.reasoning}\n`;
        }
      });
    }

    return summary;
  }

  private saveData(): void {
    dataManager.saveData(this.configurations, this.testQuestions, this.testResults);
  }

  private loadStoredData(): void {
    const data = dataManager.loadStoredData();
    this.configurations = data.configurations;
    this.testQuestions = data.testQuestions;
    this.testResults = data.testResults;
  }
}

// Export types for backward compatibility
export type {
  ArchetypeTestConfiguration,
  TestQuestion,
  TestResult,
  ComparisonResult
};

// Singleton instance
export const archetypeTestingFramework = new ArchetypeTestingFramework();

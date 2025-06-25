
import { testRunner } from './testRunner';
import { archetypeTestingFramework } from './archetypeTestingFramework';
import { marketViabilityQuestions, getMarketViabilityStats } from './questions/marketViabilityQuestions';
import { TestResult } from './types';

export class MarketViabilityTester {
  
  private async ensureFrameworkInitialized() {
    const configurations = archetypeTestingFramework.getConfigurations();
    console.log('Current configurations:', configurations.length);
    
    if (!configurations || configurations.length === 0) {
      console.log('No configurations found, initializing framework...');
      
      // Import individual configurations
      const {
        currentDefaultConfiguration,
        highCreativeConfiguration,
        balancedDefaultConfiguration,
        analyticalFocusConfiguration
      } = await import('./defaultTestConfigurations');
      
      const defaultConfigurations = [
        currentDefaultConfiguration,
        highCreativeConfiguration,
        balancedDefaultConfiguration,
        analyticalFocusConfiguration
      ];
      
      for (const config of defaultConfigurations) {
        archetypeTestingFramework.addConfiguration(config);
      }
      
      console.log('Framework initialized with', defaultConfigurations.length, 'configurations');
    }
  }
  
  async runMarketViabilityBatch(
    segmentFocus?: string, 
    onProgress?: (current: number, total: number, currentTest?: string) => void
  ): Promise<{
    results: TestResult[];
    summary: {
      totalTests: number;
      successfulTests: number;
      averageScore: number;
      segmentPerformance: Record<string, number>;
      highValuePerformance: number;
      marketReadiness: string;
    };
  }> {
    
    // Ensure framework is initialized
    await this.ensureFrameworkInitialized();
    
    const configurations = archetypeTestingFramework.getConfigurations();
    console.log('Available configurations:', configurations.length, configurations.map(c => c.name));
    
    if (!configurations || configurations.length === 0) {
      throw new Error('No test configurations available. Please ensure the archetype testing framework is properly initialized.');
    }
    
    const bestConfig = configurations.find(c => c.name.includes('Balanced Default')) || 
                      configurations.find(c => c.name.includes('Default')) ||
                      configurations[0];
    
    if (!bestConfig) {
      throw new Error('No suitable configuration found for market viability testing.');
    }
    
    // Filter questions by segment if specified
    const testQuestions = segmentFocus 
      ? marketViabilityQuestions.filter(q => q.marketSegment === segmentFocus)
      : marketViabilityQuestions;
    
    console.log(`Starting market viability test: ${testQuestions.length} questions with ${bestConfig.name}`);
    
    const results: TestResult[] = [];
    let successfulTests = 0;
    
    for (let i = 0; i < testQuestions.length; i++) {
      const question = testQuestions[i];
      
      try {
        onProgress?.(i + 1, testQuestions.length, `${question.marketSegment}: ${question.question.substring(0, 50)}...`);
        
        const result = await testRunner.runTest(bestConfig, question, 2, 2); // Depth 2, max 2 retries for speed
        results.push(result);
        successfulTests++;
        
        console.log(`✅ Market test ${i + 1}/${testQuestions.length}: Score ${result.qualityMetrics?.overallScore || 'N/A'}`);
        
        // Brief pause between tests
        await new Promise(resolve => setTimeout(resolve, 300));
        
      } catch (error) {
        console.error(`❌ Market test ${i + 1} failed:`, error);
      }
    }
    
    // Calculate summary metrics
    const validResults = results.filter(r => r.qualityMetrics);
    const averageScore = validResults.length > 0 
      ? validResults.reduce((sum, r) => sum + r.qualityMetrics.overallScore, 0) / validResults.length 
      : 0;
    
    // Segment performance breakdown
    const segmentPerformance: Record<string, number> = {};
    const segments = [...new Set(testQuestions.map(q => q.marketSegment))];
    
    segments.forEach(segment => {
      const segmentResults = results.filter(r => {
        const question = testQuestions.find(q => q.id === r.questionId);
        return question?.marketSegment === segment;
      });
      const segmentScores = segmentResults.filter(r => r.qualityMetrics);
      segmentPerformance[segment] = segmentScores.length > 0
        ? segmentScores.reduce((sum, r) => sum + r.qualityMetrics.overallScore, 0) / segmentScores.length
        : 0;
    });
    
    // High-value question performance
    const highValueQuestions = testQuestions.filter(q => 
      q.typicalCost && parseInt(q.typicalCost.split('-')[1].replace(/\D/g, '')) >= 5000
    );
    const highValueResults = results.filter(r => 
      highValueQuestions.find(q => q.id === r.questionId)
    ).filter(r => r.qualityMetrics);
    
    const highValuePerformance = highValueResults.length > 0
      ? highValueResults.reduce((sum, r) => sum + r.qualityMetrics.overallScore, 0) / highValueResults.length
      : 0;
    
    // Market readiness assessment
    const marketReadiness = averageScore >= 8.5 ? 'Ready' 
      : averageScore >= 7.0 ? 'Near Ready' 
      : averageScore >= 6.0 ? 'Needs Work'
      : 'Not Ready';
    
    return {
      results,
      summary: {
        totalTests: testQuestions.length,
        successfulTests,
        averageScore: Math.round(averageScore * 10) / 10,
        segmentPerformance,
        highValuePerformance: Math.round(highValuePerformance * 10) / 10,
        marketReadiness
      }
    };
  }
  
  // Quick single-question test for immediate feedback
  async testSingleMarketQuestion(questionId: string): Promise<TestResult | null> {
    const question = marketViabilityQuestions.find(q => q.id === questionId);
    if (!question) return null;
    
    // Ensure framework is initialized
    await this.ensureFrameworkInitialized();
    
    const configurations = archetypeTestingFramework.getConfigurations();
    if (!configurations || configurations.length === 0) {
      console.error('No configurations available for single question test');
      return null;
    }
    
    const bestConfig = configurations.find(c => c.name.includes('Balanced Default')) || configurations[0];
    
    try {
      return await testRunner.runTest(bestConfig, question, 2, 1);
    } catch (error) {
      console.error('Single market question test failed:', error);
      return null;
    }
  }
}

export const marketViabilityTester = new MarketViabilityTester();

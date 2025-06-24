
import { supabase } from "@/integrations/supabase/client";

export interface ArchetypeTestConfiguration {
  id: string;
  name: string;
  description: string;
  archetypes: Array<{
    name: string;
    description: string;
    languageStyle: string;
    imagination: number;
    skepticism: number;
    aggression: number;
    emotionality: number;
    constraint?: string;
  }>;
  metadata: {
    version: string;
    hypothesis: string;
    expectedImprovements: string[];
  };
}

export interface TestQuestion {
  id: string;
  question: string;
  domain: string;
  expectedOutcomes: string[];
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  category: 'philosophical' | 'technical' | 'creative' | 'social' | 'business' | 'scientific';
}

export interface TestResult {
  configurationId: string;
  questionId: string;
  timestamp: number;
  processingTime: number;
  results: {
    insight: string;
    confidence: number;
    tensionPoints: number;
    noveltyScore: number;
    emergenceDetected: boolean;
    questionQuality: any;
    layers: any[];
  };
  qualityMetrics: {
    insightQuality: number; // 1-10
    noveltyScore: number; // 1-10
    coherenceScore: number; // 1-10
    breakthroughPotential: number; // 1-10
    practicalValue: number; // 1-10
    overallScore: number; // 1-10
  };
}

export interface ComparisonResult {
  configurationComparison: {
    configA: string;
    configB: string;
    winner: string;
    confidenceLevel: number;
    significantDifferences: string[];
  };
  statisticalAnalysis: {
    averageScores: Record<string, number>;
    standardDeviations: Record<string, number>;
    sampleSize: number;
    pValue?: number;
  };
  qualitativeAnalysis: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
}

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
    processingDepth: number = 3
  ): Promise<TestResult> {
    const configuration = this.configurations.find(c => c.id === configurationId);
    const question = this.testQuestions.find(q => q.id === questionId);
    
    if (!configuration || !question) {
      throw new Error('Configuration or question not found');
    }

    const startTime = Date.now();
    
    try {
      // Run the genius machine with the specific configuration
      const { data, error } = await supabase.functions.invoke('genius-machine', {
        body: {
          question: question.question,
          processingDepth,
          circuitType: 'sequential',
          customArchetypes: configuration.archetypes,
          enhancedMode: true
        }
      });

      if (error) throw error;

      const processingTime = Date.now() - startTime;
      
      // Calculate quality metrics
      const qualityMetrics = this.calculateQualityMetrics(data, question);
      
      const testResult: TestResult = {
        configurationId,
        questionId,
        timestamp: Date.now(),
        processingTime,
        results: data,
        qualityMetrics
      };

      this.testResults.push(testResult);
      this.saveData();
      
      return testResult;
    } catch (error) {
      console.error('Test execution failed:', error);
      throw error;
    }
  }

  // Quality Metrics Calculation
  private calculateQualityMetrics(results: any, question: TestQuestion): TestResult['qualityMetrics'] {
    // Insight Quality (based on length, depth, specificity)
    const insightQuality = Math.min(10, Math.max(1, 
      (results.insight?.length || 0) / 50 + 
      (results.confidence * 5) +
      (results.tensionPoints * 0.5) + 
      2
    ));

    // Novelty Score (from AI + emergence detection)
    const noveltyScore = Math.min(10, 
      (results.noveltyScore || 5) + 
      (results.emergenceDetected ? 2 : 0)
    );

    // Coherence Score (based on confidence and layer consistency)
    const coherenceScore = Math.min(10, 
      results.confidence * 8 + 
      (results.layers?.length > 0 ? 2 : 0)
    );

    // Breakthrough Potential (emergence + high novelty + question quality)
    const breakthroughPotential = Math.min(10,
      (results.emergenceDetected ? 4 : 0) +
      (results.noveltyScore >= 8 ? 3 : results.noveltyScore >= 6 ? 2 : 1) +
      (results.questionQuality?.overallScore >= 8 ? 3 : results.questionQuality?.overallScore >= 6 ? 2 : 1)
    );

    // Practical Value (based on insight actionability and domain relevance)
    const practicalValue = Math.min(10,
      insightQuality * 0.6 +
      coherenceScore * 0.4 +
      (question.difficulty === 'expert' ? 1 : 0)
    );

    // Overall Score (weighted average)
    const overallScore = Math.round(
      (insightQuality * 0.25) +
      (noveltyScore * 0.20) +
      (coherenceScore * 0.20) +
      (breakthroughPotential * 0.20) +
      (practicalValue * 0.15)
    );

    return {
      insightQuality: Math.round(insightQuality * 10) / 10,
      noveltyScore: Math.round(noveltyScore * 10) / 10,
      coherenceScore: Math.round(coherenceScore * 10) / 10,
      breakthroughPotential: Math.round(breakthroughPotential * 10) / 10,
      practicalValue: Math.round(practicalValue * 10) / 10,
      overallScore
    };
  }

  // Comparison and Analysis
  compareConfigurations(configIdA: string, configIdB: string): ComparisonResult {
    const resultsA = this.testResults.filter(r => r.configurationId === configIdA);
    const resultsB = this.testResults.filter(r => r.configurationId === configIdB);

    if (resultsA.length === 0 || resultsB.length === 0) {
      throw new Error('Insufficient test data for comparison');
    }

    // Calculate average scores
    const avgA = this.calculateAverageScores(resultsA);
    const avgB = this.calculateAverageScores(resultsB);

    // Determine winner
    const winner = avgA.overallScore > avgB.overallScore ? configIdA : configIdB;
    const confidenceLevel = Math.abs(avgA.overallScore - avgB.overallScore) / 10;

    // Identify significant differences
    const significantDifferences: string[] = [];
    const metrics = ['insightQuality', 'noveltyScore', 'coherenceScore', 'breakthroughPotential', 'practicalValue'];
    
    metrics.forEach(metric => {
      const diff = Math.abs(avgA[metric] - avgB[metric]);
      if (diff > 1.0) {
        const better = avgA[metric] > avgB[metric] ? 'A' : 'B';
        significantDifferences.push(`${metric}: Config ${better} is ${diff.toFixed(1)} points higher`);
      }
    });

    return {
      configurationComparison: {
        configA: configIdA,
        configB: configIdB,
        winner,
        confidenceLevel,
        significantDifferences
      },
      statisticalAnalysis: {
        averageScores: { A: avgA.overallScore, B: avgB.overallScore },
        standardDeviations: this.calculateStandardDeviations(resultsA, resultsB),
        sampleSize: resultsA.length + resultsB.length
      },
      qualitativeAnalysis: this.generateQualitativeAnalysis(resultsA, resultsB, avgA, avgB)
    };
  }

  private calculateAverageScores(results: TestResult[]): TestResult['qualityMetrics'] {
    if (results.length === 0) {
      return { insightQuality: 0, noveltyScore: 0, coherenceScore: 0, breakthroughPotential: 0, practicalValue: 0, overallScore: 0 };
    }

    const totals = results.reduce((acc, result) => {
      acc.insightQuality += result.qualityMetrics.insightQuality;
      acc.noveltyScore += result.qualityMetrics.noveltyScore;
      acc.coherenceScore += result.qualityMetrics.coherenceScore;
      acc.breakthroughPotential += result.qualityMetrics.breakthroughPotential;
      acc.practicalValue += result.qualityMetrics.practicalValue;
      acc.overallScore += result.qualityMetrics.overallScore;
      return acc;
    }, { insightQuality: 0, noveltyScore: 0, coherenceScore: 0, breakthroughPotential: 0, practicalValue: 0, overallScore: 0 });

    const count = results.length;
    return {
      insightQuality: Math.round((totals.insightQuality / count) * 10) / 10,
      noveltyScore: Math.round((totals.noveltyScore / count) * 10) / 10,
      coherenceScore: Math.round((totals.coherenceScore / count) * 10) / 10,
      breakthroughPotential: Math.round((totals.breakthroughPotential / count) * 10) / 10,
      practicalValue: Math.round((totals.practicalValue / count) * 10) / 10,
      overallScore: Math.round((totals.overallScore / count) * 10) / 10
    };
  }

  private calculateStandardDeviations(resultsA: TestResult[], resultsB: TestResult[]): Record<string, number> {
    // Simplified standard deviation calculation
    const allScores = [...resultsA, ...resultsB].map(r => r.qualityMetrics.overallScore);
    const mean = allScores.reduce((a, b) => a + b, 0) / allScores.length;
    const variance = allScores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / allScores.length;
    return { overall: Math.sqrt(variance) };
  }

  private generateQualitativeAnalysis(
    resultsA: TestResult[], 
    resultsB: TestResult[], 
    avgA: TestResult['qualityMetrics'], 
    avgB: TestResult['qualityMetrics']
  ): ComparisonResult['qualitativeAnalysis'] {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recommendations: string[] = [];

    // Analyze strengths and weaknesses
    if (avgA.noveltyScore > avgB.noveltyScore + 0.5) {
      strengths.push('Configuration A generates more novel insights');
    }
    if (avgB.coherenceScore > avgA.coherenceScore + 0.5) {
      strengths.push('Configuration B produces more coherent results');
    }
    if (avgA.breakthroughPotential > avgB.breakthroughPotential + 0.5) {
      strengths.push('Configuration A has higher breakthrough potential');
    }

    // Generate recommendations
    if (avgA.overallScore > avgB.overallScore) {
      recommendations.push('Consider adopting Configuration A as the new default');
      if (avgB.coherenceScore > avgA.coherenceScore) {
        recommendations.push('Investigate ways to improve coherence in Configuration A');
      }
    } else {
      recommendations.push('Configuration B shows promise but needs more testing');
    }

    return { strengths, weaknesses, recommendations };
  }

  // Batch Testing
  async runBatchTest(
    configurationIds: string[], 
    questionIds: string[], 
    onProgress?: (current: number, total: number) => void
  ): Promise<TestResult[]> {
    const results: TestResult[] = [];
    const total = configurationIds.length * questionIds.length;
    let current = 0;

    for (const configId of configurationIds) {
      for (const questionId of questionIds) {
        try {
          const result = await this.runTest(configId, questionId);
          results.push(result);
          current++;
          onProgress?.(current, total);
          
          // Add small delay to prevent overwhelming the API
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Test failed for config ${configId}, question ${questionId}:`, error);
          current++;
          onProgress?.(current, total);
        }
      }
    }

    return results;
  }

  // Data Persistence
  private saveData(): void {
    localStorage.setItem('archetype-testing-framework', JSON.stringify({
      configurations: this.configurations,
      testQuestions: this.testQuestions,
      testResults: this.testResults
    }));
  }

  private loadStoredData(): void {
    const stored = localStorage.getItem('archetype-testing-framework');
    if (stored) {
      const data = JSON.parse(stored);
      this.configurations = data.configurations || [];
      this.testQuestions = data.testQuestions || [];
      this.testResults = data.testResults || [];
    }
  }

  // Get Results and Analytics
  getTestResults(): TestResult[] {
    return this.testResults;
  }

  getConfigurationPerformance(configId: string): {
    averageScore: number;
    testCount: number;
    strengths: string[];
    improvements: string[];
  } {
    const results = this.testResults.filter(r => r.configurationId === configId);
    if (results.length === 0) {
      return { averageScore: 0, testCount: 0, strengths: [], improvements: [] };
    }

    const avgMetrics = this.calculateAverageScores(results);
    const strengths: string[] = [];
    const improvements: string[] = [];

    // Identify strengths (scores > 7)
    if (avgMetrics.noveltyScore > 7) strengths.push('High novelty generation');
    if (avgMetrics.coherenceScore > 7) strengths.push('Strong coherence');
    if (avgMetrics.breakthroughPotential > 7) strengths.push('High breakthrough potential');
    if (avgMetrics.practicalValue > 7) strengths.push('Strong practical value');

    // Identify improvements (scores < 6)
    if (avgMetrics.noveltyScore < 6) improvements.push('Increase novelty generation');
    if (avgMetrics.coherenceScore < 6) improvements.push('Improve coherence');
    if (avgMetrics.breakthroughPotential < 6) improvements.push('Enhance breakthrough potential');
    if (avgMetrics.practicalValue < 6) improvements.push('Increase practical value');

    return {
      averageScore: avgMetrics.overallScore,
      testCount: results.length,
      strengths,
      improvements
    };
  }

  clearAllData(): void {
    this.configurations = [];
    this.testQuestions = [];
    this.testResults = [];
    localStorage.removeItem('archetype-testing-framework');
  }
}

// Singleton instance
export const archetypeTestingFramework = new ArchetypeTestingFramework();

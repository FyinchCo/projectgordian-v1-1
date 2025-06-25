
import { TestResult, ComparisonResult } from './types';
import { qualityAnalyzer } from './qualityAnalyzer';

export class ComparisonEngine {
  compareConfigurations(configIdA: string, configIdB: string, testResults: TestResult[]): ComparisonResult {
    const resultsA = testResults.filter(r => r.configurationId === configIdA);
    const resultsB = testResults.filter(r => r.configurationId === configIdB);

    if (resultsA.length === 0 || resultsB.length === 0) {
      throw new Error('Insufficient test data for comparison');
    }

    // Calculate average scores
    const avgA = qualityAnalyzer.calculateAverageScores(resultsA);
    const avgB = qualityAnalyzer.calculateAverageScores(resultsB);

    // Determine winner
    const winner = avgA.overallScore > avgB.overallScore ? configIdA : configIdB;
    const confidenceLevel = Math.abs(avgA.overallScore - avgB.overallScore) / 10;

    // Identify significant differences
    const significantDifferences: string[] = [];
    const metrics = ['insightQuality', 'noveltyScore', 'coherenceScore', 'breakthroughPotential', 'practicalValue'];
    
    metrics.forEach(metric => {
      const diff = Math.abs(avgA[metric as keyof typeof avgA] - avgB[metric as keyof typeof avgB]);
      if (diff > 1.0) {
        const better = avgA[metric as keyof typeof avgA] > avgB[metric as keyof typeof avgB] ? 'A' : 'B';
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

  private calculateStandardDeviations(resultsA: TestResult[], resultsB: TestResult[]): Record<string, number> {
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
}

export const comparisonEngine = new ComparisonEngine();

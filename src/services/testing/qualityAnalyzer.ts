
import { TestResult, TestQuestion, ArchetypeInsight, ConfigurationPerformance } from './types';

export class QualityAnalyzer {
  calculateQualityMetrics(results: any, question: TestQuestion): TestResult['qualityMetrics'] {
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

  calculateAverageScores(results: TestResult[]): TestResult['qualityMetrics'] {
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

  getConfigurationPerformance(configId: string, testResults: TestResult[]): ConfigurationPerformance {
    const results = testResults.filter(r => r.configurationId === configId);
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
}

export const qualityAnalyzer = new QualityAnalyzer();

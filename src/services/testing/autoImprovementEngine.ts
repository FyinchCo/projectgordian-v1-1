
import { selfTestingEngine, PerformanceMetrics } from './selfTestingEngine';
import { ProcessingResult } from '@/components/processing/types';

export interface ConfigurationSuggestion {
  parameter: string;
  currentValue: any;
  suggestedValue: any;
  reason: string;
  confidence: number;
  expectedImprovement: number;
}

export interface ImprovementPlan {
  suggestions: ConfigurationSuggestion[];
  priority: 'low' | 'medium' | 'high';
  expectedOverallImprovement: number;
  reasoning: string;
}

export class AutoImprovementEngine {
  private improvementHistory: Array<{
    timestamp: number;
    suggestions: ConfigurationSuggestion[];
    beforeMetrics: PerformanceMetrics;
    afterMetrics?: PerformanceMetrics;
  }> = [];

  analyzeAndSuggestImprovements(metrics: PerformanceMetrics): ImprovementPlan {
    const suggestions: ConfigurationSuggestion[] = [];
    let totalExpectedImprovement = 0;

    // Analyze confidence issues
    if (metrics.averageConfidence < 70) {
      suggestions.push({
        parameter: 'processingDepth',
        currentValue: 5,
        suggestedValue: Math.min(7, 5 + Math.ceil((70 - metrics.averageConfidence) / 10)),
        reason: `Low average confidence (${metrics.averageConfidence}%) suggests need for deeper processing`,
        confidence: 0.8,
        expectedImprovement: 10
      });
      totalExpectedImprovement += 10;
    }

    // Analyze novelty issues
    if (metrics.averageNoveltyScore < 6) {
      suggestions.push({
        parameter: 'circuitType',
        currentValue: 'sequential',
        suggestedValue: 'parallel',
        reason: `Low novelty score (${metrics.averageNoveltyScore}) suggests parallel processing might generate more diverse insights`,
        confidence: 0.7,
        expectedImprovement: 8
      });
      totalExpectedImprovement += 8;

      suggestions.push({
        parameter: 'archetypeEmphasis',
        currentValue: 'balanced',
        suggestedValue: 'creative-heavy',
        reason: 'Increase emphasis on Visionary and Contrarian archetypes to boost novelty',
        confidence: 0.75,
        expectedImprovement: 6
      });
      totalExpectedImprovement += 6;
    }

    // Analyze emergence detection issues
    if (metrics.emergenceDetectionRate < 40) {
      suggestions.push({
        parameter: 'tensionThreshold',
        currentValue: 5,
        suggestedValue: 7,
        reason: `Low emergence detection (${metrics.emergenceDetectionRate}%) suggests need for higher tension threshold`,
        confidence: 0.65,
        expectedImprovement: 12
      });
      totalExpectedImprovement += 12;
    }

    // Category-specific improvements
    Object.entries(metrics.categoryPerformance).forEach(([category, score]) => {
      if (score < 60) {
        switch (category) {
          case 'Philosophy':
            suggestions.push({
              parameter: 'mysticEmphasis',
              currentValue: 6,
              suggestedValue: 8,
              reason: `Poor ${category} performance (${score}%) - increase Mystic archetype emphasis`,
              confidence: 0.7,
              expectedImprovement: 8
            });
            break;
          case 'Creative':
            suggestions.push({
              parameter: 'visionaryEmphasis',
              currentValue: 7,
              suggestedValue: 9,
              reason: `Poor ${category} performance (${score}%) - increase Visionary archetype emphasis`,
              confidence: 0.75,
              expectedImprovement: 10
            });
            break;
          case 'Business':
            suggestions.push({
              parameter: 'realistEmphasis',
              currentValue: 6,
              suggestedValue: 8,
              reason: `Poor ${category} performance (${score}%) - increase Realist archetype emphasis`,
              confidence: 0.8,
              expectedImprovement: 7
            });
            break;
        }
        totalExpectedImprovement += 5;
      }
    });

    // Determine priority
    let priority: 'low' | 'medium' | 'high' = 'low';
    if (metrics.overallScore < 50) priority = 'high';
    else if (metrics.overallScore < 70) priority = 'medium';

    const reasoning = this.generateImprovementReasoning(metrics, suggestions);

    return {
      suggestions,
      priority,
      expectedOverallImprovement: Math.min(totalExpectedImprovement, 25), // Cap at 25%
      reasoning
    };
  }

  private generateImprovementReasoning(metrics: PerformanceMetrics, suggestions: ConfigurationSuggestion[]): string {
    const issues = [];
    
    if (metrics.overallScore < 70) {
      issues.push(`Overall performance (${metrics.overallScore}%) is below target`);
    }
    
    if (metrics.averageConfidence < 70) {
      issues.push(`Confidence levels (${metrics.averageConfidence}%) need improvement`);
    }
    
    if (metrics.averageNoveltyScore < 6) {
      issues.push(`Novelty generation (${metrics.averageNoveltyScore}/10) is insufficient`);
    }
    
    if (metrics.weakAreas.length > 0) {
      issues.push(`Weak performance in: ${metrics.weakAreas.join(', ')}`);
    }

    const topSuggestions = suggestions
      .sort((a, b) => b.expectedImprovement - a.expectedImprovement)
      .slice(0, 3)
      .map(s => s.reason);

    return `Analysis reveals ${issues.length} key issues: ${issues.join('; ')}. 
    Top recommendations: ${topSuggestions.join('; ')}. 
    These changes should improve overall performance by approximately ${Math.round(suggestions.reduce((sum, s) => sum + s.expectedImprovement, 0))}%.`;
  }

  recordImprovementAttempt(suggestions: ConfigurationSuggestion[], beforeMetrics: PerformanceMetrics): void {
    this.improvementHistory.push({
      timestamp: Date.now(),
      suggestions,
      beforeMetrics
    });
  }

  updateImprovementResults(afterMetrics: PerformanceMetrics): void {
    const lastAttempt = this.improvementHistory[this.improvementHistory.length - 1];
    if (lastAttempt && !lastAttempt.afterMetrics) {
      lastAttempt.afterMetrics = afterMetrics;
    }
  }

  getImprovementEffectiveness(): Array<{
    suggestion: string;
    expectedImprovement: number;
    actualImprovement: number;
    effectiveness: number;
  }> {
    return this.improvementHistory
      .filter(attempt => attempt.afterMetrics)
      .flatMap(attempt => 
        attempt.suggestions.map(suggestion => ({
          suggestion: suggestion.parameter,
          expectedImprovement: suggestion.expectedImprovement,
          actualImprovement: (attempt.afterMetrics!.overallScore - attempt.beforeMetrics.overallScore),
          effectiveness: Math.min(100, Math.max(0, 
            ((attempt.afterMetrics!.overallScore - attempt.beforeMetrics.overallScore) / suggestion.expectedImprovement) * 100
          ))
        }))
      );
  }

  getLearningInsights(): string[] {
    const effectiveness = this.getImprovementEffectiveness();
    const insights: string[] = [];

    // Analyze which types of improvements work best
    const parameterEffectiveness = effectiveness.reduce((acc, item) => {
      if (!acc[item.suggestion]) acc[item.suggestion] = [];
      acc[item.suggestion].push(item.effectiveness);
      return acc;
    }, {} as Record<string, number[]>);

    Object.entries(parameterEffectiveness).forEach(([parameter, scores]) => {
      const avgEffectiveness = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      if (avgEffectiveness > 80) {
        insights.push(`${parameter} adjustments are highly effective (${Math.round(avgEffectiveness)}% success rate)`);
      } else if (avgEffectiveness < 40) {
        insights.push(`${parameter} adjustments show limited effectiveness (${Math.round(avgEffectiveness)}% success rate)`);
      }
    });

    if (insights.length === 0) {
      insights.push('Insufficient data for learning insights - continue testing to build knowledge base');
    }

    return insights;
  }
}

export const autoImprovementEngine = new AutoImprovementEngine();

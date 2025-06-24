
import { SystemEvolution } from './types';

export class SystemEvolutionAnalyzer {
  getSystemEvolution(stats: any): SystemEvolution {
    return {
      totalLearningCycles: stats.totalRecords,
      qualityTrend: stats.improvementTrend > 0 ? 'improving' : 'stable',
      learningVelocity: stats.learningEfficiency,
      maturity: Math.min(stats.totalRecords / 100, 1) // 0-1 scale
    };
  }

  generateSystemRecommendations(stats: any): string[] {
    const recommendations: string[] = [];
    
    if (stats.totalRecords < 10) {
      recommendations.push('System is in early learning phase - more data needed for optimal performance');
    }
    
    if (stats.improvementTrend < 0) {
      recommendations.push('Quality trend is declining - consider reviewing recent configuration changes');
    }
    
    if (stats.learningEfficiency > 0.1) {
      recommendations.push('System is learning rapidly - current approach is highly effective');
    }
    
    if (stats.bestDomains.length > 0) {
      const topDomain = stats.bestDomains[0];
      recommendations.push(`System performs best on ${topDomain.domain} questions (${Math.round(topDomain.averageQuality * 10) / 10}/10 avg)`);
    }
    
    return recommendations;
  }
}

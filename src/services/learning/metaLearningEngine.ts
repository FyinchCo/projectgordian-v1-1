
import { learningDatabase, LearningDatabase } from '../learningDatabase';
import { LearningConfiguration } from './types';
import { MetaInsightsGenerator } from './metaInsightsGenerator';
import { ConfigurationOptimizer } from './configurationOptimizer';
import { SystemEvolutionAnalyzer } from './systemEvolutionAnalyzer';

export class MetaLearningEngine {
  private database: LearningDatabase;
  private insightsGenerator: MetaInsightsGenerator;
  private configOptimizer: ConfigurationOptimizer;
  private evolutionAnalyzer: SystemEvolutionAnalyzer;
  
  constructor() {
    this.database = learningDatabase;
    this.insightsGenerator = new MetaInsightsGenerator();
    this.configOptimizer = new ConfigurationOptimizer();
    this.evolutionAnalyzer = new SystemEvolutionAnalyzer();
  }

  // Main method: Generate optimized configuration based on learning
  async generateOptimizedConfiguration(
    question: string, 
    baseAssessment: any,
    fallbackConfig: any
  ): Promise<LearningConfiguration> {
    console.log('Meta-learning engine analyzing question...');
    
    try {
      // Find similar successful questions
      const similarQuestions = this.database.findSimilarQuestions(question, 10);
      const bestConfig = this.database.getBestConfigurationFor(
        baseAssessment.domainType, 
        baseAssessment.complexityScore
      );
      
      // Analyze patterns for this type of question
      const patterns = this.database.analyzeConfigurationPatterns();
      const relevantPatterns = patterns.filter(p => 
        p.applicableDomains.includes(baseAssessment.domainType) || 
        p.applicableDomains.includes('General')
      );
      
      // Generate meta-insights
      const metaInsights = this.insightsGenerator.generateMetaInsights(similarQuestions, patterns);
      
      let optimizedConfig = { ...fallbackConfig };
      let confidence = 0.3; // Base confidence for new system
      let reasoning = 'Base configuration with meta-learning enhancements: ';
      let expectedImprovement = 0;
      
      // Apply learned optimizations
      if (bestConfig && bestConfig.confidence > 0.5) {
        optimizedConfig = this.configOptimizer.mergeConfigurations(optimizedConfig, bestConfig.configuration);
        confidence += bestConfig.confidence * 0.4;
        reasoning += `Applied proven configuration for ${baseAssessment.domainType} domain (${Math.round(bestConfig.confidence * 100)}% confidence). `;
        expectedImprovement += 1.5;
      }
      
      // Apply pattern-based optimizations
      if (relevantPatterns.length > 0) {
        const bestPattern = relevantPatterns[0];
        optimizedConfig = this.configOptimizer.applyPatternOptimizations(optimizedConfig, bestPattern);
        confidence += bestPattern.confidence * 0.3;
        reasoning += `Applied pattern optimizations from ${bestPattern.sampleSize} similar cases. `;
        expectedImprovement += 1.0;
      }
      
      // Apply meta-insights
      metaInsights.forEach(insight => {
        optimizedConfig = this.configOptimizer.applyMetaInsight(optimizedConfig, insight);
        confidence += insight.confidence * 0.1;
        reasoning += `${insight.insight}. `;
        expectedImprovement += 0.5;
      });
      
      // Evolutionary improvements
      optimizedConfig = this.configOptimizer.applyEvolutionaryImprovements(optimizedConfig, baseAssessment);
      confidence = Math.min(confidence, 0.95); // Cap confidence
      reasoning += 'Applied evolutionary refinements based on system learning.';
      
      console.log('Meta-learning optimization complete:', {
        confidence: Math.round(confidence * 100),
        expectedImprovement: Math.round(expectedImprovement * 100) / 100,
        similarCases: similarQuestions.length,
        patterns: relevantPatterns.length
      });
      
      return {
        originalConfig: fallbackConfig,
        optimizedConfig,
        confidence,
        reasoning: reasoning.trim(),
        expectedImprovement
      };
    } catch (error) {
      console.warn('Meta-learning optimization failed, returning fallback:', error);
      return {
        originalConfig: fallbackConfig,
        optimizedConfig: fallbackConfig,
        confidence: 0.3,
        reasoning: 'Fallback configuration used due to meta-learning system error',
        expectedImprovement: 0
      };
    }
  }

  // Learn from results and update the system
  recordLearningCycle(
    question: string,
    assessment: any,
    configuration: any,
    results: any,
    qualityMetrics: any
  ): void {
    try {
      // Calculate configuration effectiveness (how well it performed vs baseline)
      const baseline = 5; // Average expected quality
      const configurationEffectiveness = (qualityMetrics.overallScore - baseline) / 5;
      
      // Generate learning tags for pattern recognition
      const learningTags: string[] = [];
      
      // Quality-based tags
      if (qualityMetrics.overallScore >= 8) learningTags.push('high-quality');
      if (qualityMetrics.overallScore <= 4) learningTags.push('low-quality');
      if (results.emergenceDetected) learningTags.push('emergent');
      if (results.noveltyScore >= 8) learningTags.push('novel');
      
      // Configuration tags
      if (configuration.enhancedMode) learningTags.push('enhanced');
      if (configuration.processingDepth >= 10) learningTags.push('deep-processing');
      
      // Domain tags
      learningTags.push(`domain-${assessment.domainType.toLowerCase()}`);
      learningTags.push(`complexity-${assessment.complexityScore}`);
      
      this.database.addLearningRecord({
        question,
        domainType: assessment.domainType,
        complexity: assessment.complexityScore,
        configuration,
        results: {
          insight: results.insight,
          confidence: results.confidence,
          tensionPoints: results.tensionPoints,
          noveltyScore: results.noveltyScore || 5,
          emergenceDetected: results.emergenceDetected || false,
          processingTime: Date.now() // Simplified for now
        },
        qualityMetrics,
        configurationEffectiveness,
        learningTags
      });
      
      console.log('Learning cycle recorded for future optimization');
    } catch (error) {
      console.warn('Failed to record learning cycle:', error);
    }
  }

  // Get current learning statistics
  getLearningDashboard() {
    try {
      const stats = this.database.getLearningStats();
      const patterns = this.database.analyzeConfigurationPatterns().slice(0, 5);
      
      return {
        learningStats: stats,
        topPatterns: patterns,
        systemEvolution: this.evolutionAnalyzer.getSystemEvolution(stats),
        recommendations: this.evolutionAnalyzer.generateSystemRecommendations(stats)
      };
    } catch (error) {
      console.warn('Failed to generate learning dashboard:', error);
      return {
        learningStats: {
          totalRecords: 0,
          averageQuality: 0,
          improvementTrend: 0,
          bestDomains: [],
          learningEfficiency: 0
        },
        topPatterns: [],
        systemEvolution: {
          maturity: 'nascent',
          qualityTrend: 0,
          learningVelocity: 0
        },
        recommendations: []
      };
    }
  }
}

// Singleton instance
export const metaLearningEngine = new MetaLearningEngine();

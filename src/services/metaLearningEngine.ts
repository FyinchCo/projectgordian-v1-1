
import { learningDatabase, LearningDatabase } from './learningDatabase';

interface LearningConfiguration {
  originalConfig: any;
  optimizedConfig: any;
  confidence: number;
  reasoning: string;
  expectedImprovement: number;
}

interface MetaInsight {
  type: 'archetype_tuning' | 'circuit_optimization' | 'depth_adjustment' | 'tension_calibration';
  insight: string;
  evidence: string;
  confidence: number;
  applicability: string[];
}

export class MetaLearningEngine {
  private database: LearningDatabase;
  
  constructor() {
    this.database = learningDatabase;
  }

  // Main method: Generate optimized configuration based on learning
  async generateOptimizedConfiguration(
    question: string, 
    baseAssessment: any,
    fallbackConfig: any
  ): Promise<LearningConfiguration> {
    console.log('Meta-learning engine analyzing question...');
    
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
    const metaInsights = this.generateMetaInsights(similarQuestions, patterns);
    
    let optimizedConfig = { ...fallbackConfig };
    let confidence = 0.3; // Base confidence for new system
    let reasoning = 'Base configuration with meta-learning enhancements: ';
    let expectedImprovement = 0;
    
    // Apply learned optimizations
    if (bestConfig && bestConfig.confidence > 0.5) {
      optimizedConfig = this.mergeConfigurations(optimizedConfig, bestConfig.configuration);
      confidence += bestConfig.confidence * 0.4;
      reasoning += `Applied proven configuration for ${baseAssessment.domainType} domain (${Math.round(bestConfig.confidence * 100)}% confidence). `;
      expectedImprovement += 1.5;
    }
    
    // Apply pattern-based optimizations
    if (relevantPatterns.length > 0) {
      const bestPattern = relevantPatterns[0];
      optimizedConfig = this.applyPatternOptimizations(optimizedConfig, bestPattern);
      confidence += bestPattern.confidence * 0.3;
      reasoning += `Applied pattern optimizations from ${bestPattern.sampleSize} similar cases. `;
      expectedImprovement += 1.0;
    }
    
    // Apply meta-insights
    metaInsights.forEach(insight => {
      optimizedConfig = this.applyMetaInsight(optimizedConfig, insight);
      confidence += insight.confidence * 0.1;
      reasoning += `${insight.insight}. `;
      expectedImprovement += 0.5;
    });
    
    // Evolutionary improvements
    optimizedConfig = this.applyEvolutionaryImprovements(optimizedConfig, baseAssessment);
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
  }

  // Learn from results and update the system
  recordLearningCycle(
    question: string,
    assessment: any,
    configuration: any,
    results: any,
    qualityMetrics: any
  ): void {
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
  }

  // Get current learning statistics
  getLearningDashboard() {
    const stats = this.database.getLearningStats();
    const patterns = this.database.analyzeConfigurationPatterns().slice(0, 5);
    
    return {
      learningStats: stats,
      topPatterns: patterns,
      systemEvolution: this.getSystemEvolution(),
      recommendations: this.generateSystemRecommendations(stats)
    };
  }

  private generateMetaInsights(similarQuestions: any[], patterns: any[]): MetaInsight[] {
    const insights: MetaInsight[] = [];
    
    // Archetype effectiveness analysis
    if (similarQuestions.length >= 3) {
      const archetypePerformance = this.analyzeArchetypePerformance(similarQuestions);
      if (archetypePerformance.insight) {
        insights.push({
          type: 'archetype_tuning',
          insight: archetypePerformance.insight,
          evidence: `Based on ${similarQuestions.length} similar questions`,
          confidence: archetypePerformance.confidence,
          applicability: ['similar_domain']
        });
      }
    }
    
    // Circuit type optimization
    if (patterns.length >= 2) {
      const circuitInsight = this.analyzeCircuitEffectiveness(patterns);
      if (circuitInsight.insight) {
        insights.push({
          type: 'circuit_optimization',
          insight: circuitInsight.insight,
          evidence: `Pattern analysis across ${patterns.length} configuration types`,
          confidence: circuitInsight.confidence,
          applicability: ['general']
        });
      }
    }
    
    return insights;
  }

  private analyzeArchetypePerformance(questions: any[]) {
    // Analyze which archetype configurations led to highest quality
    const archetypeScores = new Map();
    
    questions.forEach(q => {
      if (q.configuration.archetypeConfigurations) {
        q.configuration.archetypeConfigurations.forEach((arch: any) => {
          const key = `${arch.name}-${arch.emphasis}`;
          if (!archetypeScores.has(key)) {
            archetypeScores.set(key, []);
          }
          archetypeScores.get(key).push(q.qualityMetrics.overallScore);
        });
      }
    });
    
    let bestArchetype = '';
    let bestScore = 0;
    
    archetypeScores.forEach((scores, key) => {
      const avg = scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length;
      if (avg > bestScore) {
        bestScore = avg;
        bestArchetype = key;
      }
    });
    
    if (bestScore > 6) {
      return {
        insight: `Emphasis on ${bestArchetype} archetype shows superior results`,
        confidence: Math.min(questions.length / 10, 0.8)
      };
    }
    
    return { insight: null, confidence: 0 };
  }

  private analyzeCircuitEffectiveness(patterns: any[]) {
    const circuitPerformance = new Map();
    
    patterns.forEach(pattern => {
      const circuit = pattern.pattern.split('-')[0];
      if (!circuitPerformance.has(circuit)) {
        circuitPerformance.set(circuit, []);
      }
      circuitPerformance.get(circuit).push(pattern.averageQuality);
    });
    
    let bestCircuit = '';
    let bestScore = 0;
    
    circuitPerformance.forEach((scores, circuit) => {
      const avg = scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length;
      if (avg > bestScore) {
        bestScore = avg;
        bestCircuit = circuit;
      }
    });
    
    if (bestScore > 6) {
      return {
        insight: `${bestCircuit} circuit type consistently outperforms alternatives`,
        confidence: 0.7
      };
    }
    
    return { insight: null, confidence: 0 };
  }

  private mergeConfigurations(base: any, learned: any): any {
    return {
      ...base,
      processingDepth: learned.processingDepth || base.processingDepth,
      circuitType: learned.circuitType || base.circuitType,
      enhancedMode: learned.enhancedMode !== undefined ? learned.enhancedMode : base.enhancedMode,
      archetypeConfigurations: learned.archetypeConfigurations || base.archetypeConfigurations,
      tensionParameters: { ...base.tensionParameters, ...learned.tensionParameters }
    };
  }

  private applyPatternOptimizations(config: any, pattern: any): any {
    // Apply optimizations based on successful patterns
    const optimized = { ...config };
    
    if (pattern.averageQuality > 7) {
      // Extract circuit type from pattern
      const [circuitType, mode, depth] = pattern.pattern.split('-');
      optimized.circuitType = circuitType;
      optimized.enhancedMode = mode === 'enhanced';
      
      const depthMatch = depth.match(/depth(\d+)/);
      if (depthMatch) {
        const suggestedDepth = parseInt(depthMatch[1]);
        if (suggestedDepth > 0) {
          optimized.processingDepth = Math.min(suggestedDepth, optimized.processingDepth + 2);
        }
      }
    }
    
    return optimized;
  }

  private applyMetaInsight(config: any, insight: MetaInsight): any {
    const optimized = { ...config };
    
    switch (insight.type) {
      case 'circuit_optimization':
        if (insight.insight.includes('parallel')) {
          optimized.circuitType = 'parallel';
        } else if (insight.insight.includes('sequential')) {
          optimized.circuitType = 'sequential';
        }
        break;
        
      case 'depth_adjustment':
        if (insight.insight.includes('deeper')) {
          optimized.processingDepth = Math.min(optimized.processingDepth + 2, 15);
        } else if (insight.insight.includes('shallow')) {
          optimized.processingDepth = Math.max(optimized.processingDepth - 1, 2);
        }
        break;
        
      case 'archetype_tuning':
        // Apply archetype emphasis adjustments based on insights
        if (optimized.archetypeConfigurations && insight.confidence > 0.6) {
          optimized.archetypeConfigurations = optimized.archetypeConfigurations.map((arch: any) => {
            if (insight.insight.includes(arch.name)) {
              return { ...arch, emphasis: Math.min(arch.emphasis + 1, 10) };
            }
            return arch;
          });
        }
        break;
    }
    
    return optimized;
  }

  private applyEvolutionaryImprovements(config: any, assessment: any): any {
    const optimized = { ...config };
    
    // Evolutionary rule: High complexity + philosophical domain = deeper processing
    if (assessment.complexityScore >= 7 && assessment.domainType === 'Philosophy') {
      optimized.processingDepth = Math.max(optimized.processingDepth, 5);
      optimized.enhancedMode = true;
    }
    
    // Evolutionary rule: Creative domains benefit from higher imagination
    if (assessment.domainType === 'Creative' && optimized.archetypeConfigurations) {
      optimized.archetypeConfigurations = optimized.archetypeConfigurations.map((arch: any) => {
        if (arch.name === 'The Visionary' || arch.name === 'The Mystic') {
          return {
            ...arch,
            personalityAdjustments: {
              ...arch.personalityAdjustments,
              imagination: Math.min(arch.personalityAdjustments.imagination + 1, 10)
            }
          };
        }
        return arch;
      });
    }
    
    return optimized;
  }

  private getSystemEvolution() {
    const stats = this.database.getLearningStats();
    
    return {
      totalLearningCycles: stats.totalRecords,
      qualityTrend: stats.improvementTrend > 0 ? 'improving' : 'stable',
      learningVelocity: stats.learningEfficiency,
      maturity: Math.min(stats.totalRecords / 100, 1) // 0-1 scale
    };
  }

  private generateSystemRecommendations(stats: any): string[] {
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

// Singleton instance
export const metaLearningEngine = new MetaLearningEngine();

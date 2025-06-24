
import { TestResult, ArchetypeTestConfiguration } from './archetypeTestingFramework';

export interface ArchetypePerformanceProfile {
  archetypeName: string;
  roleEffectiveness: number; // How well it performs its intended role (1-10)
  synthesisContribution: number; // How much it contributes to final synthesis (1-10)
  constructiveTension: number; // Quality of disagreements it creates (1-10)
  emergenceEnabling: number; // How often it enables breakthrough insights (1-10)
  overallOptimization: number; // Combined effectiveness score (1-10)
  specificInsights: string[];
  recommendedAdjustments: {
    imagination?: number;
    skepticism?: number;
    aggression?: number;
    emotionality?: number;
    reasoning: string;
  };
}

export interface OptimizationRecommendation {
  configurationId: string;
  confidence: number; // 0-1, how confident we are in this recommendation
  archetypeAdjustments: {
    archetypeName: string;
    currentSettings: any;
    recommendedSettings: any;
    expectedImprovements: string[];
  }[];
  testingEvidence: {
    strongPerformers: string[];
    weakPerformers: string[];
    synthesisQuality: number;
    emergenceFrequency: number;
  };
}

export class ArchetypeAnalyzer {
  
  analyzeArchetypePerformance(
    configurationId: string, 
    testResults: TestResult[]
  ): ArchetypePerformanceProfile[] {
    const configuration = this.getConfiguration(configurationId);
    if (!configuration) return [];

    return configuration.archetypes.map(archetype => {
      // Analyze specific test results for this archetype
      const targetedResults = testResults.filter(result => 
        this.isArchetypeTargeted(result.questionId, archetype.name)
      );

      const roleEffectiveness = this.calculateRoleEffectiveness(archetype, targetedResults);
      const synthesisContribution = this.calculateSynthesisContribution(archetype, testResults);
      const constructiveTension = this.calculateConstructiveTension(archetype, testResults);
      const emergenceEnabling = this.calculateEmergenceEnabling(archetype, testResults);

      const overallOptimization = Math.round(
        (roleEffectiveness * 0.3) +
        (synthesisContribution * 0.25) +
        (constructiveTension * 0.25) +
        (emergenceEnabling * 0.2)
      );

      return {
        archetypeName: archetype.name,
        roleEffectiveness,
        synthesisContribution,
        constructiveTension,
        emergenceEnabling,
        overallOptimization,
        specificInsights: this.generateSpecificInsights(archetype, testResults),
        recommendedAdjustments: this.calculateRecommendedAdjustments(archetype, {
          roleEffectiveness,
          synthesisContribution,
          constructiveTension,
          emergenceEnabling
        })
      };
    });
  }

  generateOptimizationRecommendations(
    configurationId: string,
    testResults: TestResult[]
  ): OptimizationRecommendation {
    const profiles = this.analyzeArchetypePerformance(configurationId, testResults);
    const configuration = this.getConfiguration(configurationId);

    if (!configuration) {
      throw new Error('Configuration not found');
    }

    // Calculate overall performance metrics
    const overallScores = testResults.map(r => r.qualityMetrics.overallScore);
    const avgOverallScore = overallScores.reduce((a, b) => a + b, 0) / overallScores.length;
    const emergenceCount = testResults.filter(r => r.results.emergenceDetected).length;
    const emergenceFrequency = emergenceCount / testResults.length;

    // Identify strong and weak performers
    const strongPerformers = profiles
      .filter(p => p.overallOptimization >= 7)
      .map(p => p.archetypeName);
    
    const weakPerformers = profiles
      .filter(p => p.overallOptimization < 6)
      .map(p => p.archetypeName);

    // Generate specific adjustments
    const archetypeAdjustments = profiles.map(profile => {
      const currentArchetype = configuration.archetypes.find(a => a.name === profile.archetypeName);
      if (!currentArchetype) throw new Error(`Archetype ${profile.archetypeName} not found`);

      return {
        archetypeName: profile.archetypeName,
        currentSettings: {
          imagination: currentArchetype.imagination,
          skepticism: currentArchetype.skepticism,
          aggression: currentArchetype.aggression,
          emotionality: currentArchetype.emotionality
        },
        recommendedSettings: profile.recommendedAdjustments,
        expectedImprovements: this.predictImprovements(profile, currentArchetype)
      };
    });

    // Calculate confidence based on sample size and consistency
    const confidence = Math.min(1, (testResults.length / 20) * 0.8 + 0.2);

    return {
      configurationId,
      confidence,
      archetypeAdjustments,
      testingEvidence: {
        strongPerformers,
        weakPerformers,
        synthesisQuality: avgOverallScore,
        emergenceFrequency
      }
    };
  }

  private calculateRoleEffectiveness(archetype: any, targetedResults: TestResult[]): number {
    if (targetedResults.length === 0) return 5; // Default middle score if no targeted tests

    // Analyze how well the archetype performed on questions designed for its role
    const roleScores = targetedResults.map(result => {
      switch (archetype.name) {
        case 'The Visionary':
          return result.qualityMetrics.noveltyScore * 0.6 + result.qualityMetrics.breakthroughPotential * 0.4;
        case 'The Mystic':
          return result.qualityMetrics.insightQuality * 0.5 + result.qualityMetrics.noveltyScore * 0.3 + result.qualityMetrics.coherenceScore * 0.2;
        case 'The Skeptic':
          return result.qualityMetrics.coherenceScore * 0.6 + result.qualityMetrics.practicalValue * 0.4;
        case 'The Realist':
          return result.qualityMetrics.practicalValue * 0.7 + result.qualityMetrics.coherenceScore * 0.3;
        case 'The Contrarian':
          return result.qualityMetrics.noveltyScore * 0.4 + result.qualityMetrics.breakthroughPotential * 0.6;
        default:
          return result.qualityMetrics.overallScore;
      }
    });

    return Math.round(roleScores.reduce((a, b) => a + b, 0) / roleScores.length);
  }

  private calculateSynthesisContribution(archetype: any, allResults: TestResult[]): number {
    // Measure how much this archetype contributes to synthesis quality
    // This is inferred from overall result quality when this archetype is present
    const synthesisResults = allResults.filter(r => r.results.layers && r.results.layers.length > 2);
    if (synthesisResults.length === 0) return 5;

    const synthesisScores = synthesisResults.map(r => r.qualityMetrics.overallScore);
    return Math.round(synthesisScores.reduce((a, b) => a + b, 0) / synthesisScores.length);
  }

  private calculateConstructiveTension(archetype: any, allResults: TestResult[]): number {
    // Measure quality of disagreements and tension points
    const tensionResults = allResults.filter(r => r.results.tensionPoints > 0);
    if (tensionResults.length === 0) return 5;

    // Higher tension points with good final quality = constructive tension
    const tensionQuality = tensionResults.map(r => {
      const tensionRatio = Math.min(r.results.tensionPoints / 5, 1); // Normalize to 0-1
      const qualityRatio = r.qualityMetrics.overallScore / 10;
      return tensionRatio * qualityRatio * 10;
    });

    return Math.round(tensionQuality.reduce((a, b) => a + b, 0) / tensionQuality.length);
  }

  private calculateEmergenceEnabling(archetype: any, allResults: TestResult[]): number {
    // Measure how often emergence is detected when this archetype is involved
    const emergenceResults = allResults.filter(r => r.results.emergenceDetected);
    const emergenceRate = emergenceResults.length / allResults.length;
    
    // Also consider breakthrough potential scores
    const breakthroughScores = allResults.map(r => r.qualityMetrics.breakthroughPotential);
    const avgBreakthrough = breakthroughScores.reduce((a, b) => a + b, 0) / breakthroughScores.length;
    
    return Math.round((emergenceRate * 5) + (avgBreakthrough * 0.5));
  }

  private calculateRecommendedAdjustments(archetype: any, performance: any): any {
    const adjustments: any = {};
    let reasoning = '';

    // Logic for adjusting personality parameters based on performance
    if (performance.roleEffectiveness < 6) {
      switch (archetype.name) {
        case 'The Visionary':
          if (archetype.imagination < 8) {
            adjustments.imagination = Math.min(10, archetype.imagination + 1);
            reasoning += 'Increase imagination to improve visionary role. ';
          }
          if (archetype.skepticism > 3) {
            adjustments.skepticism = Math.max(1, archetype.skepticism - 1);
            reasoning += 'Reduce skepticism to enable more creative thinking. ';
          }
          break;
        case 'The Skeptic':
          if (archetype.skepticism < 9) {
            adjustments.skepticism = Math.min(10, archetype.skepticism + 1);
            reasoning += 'Increase skepticism for better analytical rigor. ';
          }
          if (archetype.imagination > 4) {
            adjustments.imagination = Math.max(1, archetype.imagination - 1);
            reasoning += 'Reduce imagination to focus on evidence-based thinking. ';
          }
          break;
      }
    }

    if (performance.constructiveTension < 6) {
      if (archetype.aggression < 5) {
        adjustments.aggression = Math.min(8, archetype.aggression + 1);
        reasoning += 'Increase aggression for better constructive tension. ';
      }
    }

    if (performance.synthesisContribution < 6) {
      if (archetype.aggression > 7) {
        adjustments.aggression = Math.max(3, archetype.aggression - 1);
        reasoning += 'Reduce aggression to improve synthesis cooperation. ';
      }
    }

    return { ...adjustments, reasoning: reasoning.trim() };
  }

  private generateSpecificInsights(archetype: any, testResults: TestResult[]): string[] {
    const insights: string[] = [];
    const avgQuality = testResults.reduce((sum, r) => sum + r.qualityMetrics.overallScore, 0) / testResults.length;

    if (avgQuality > 8) {
      insights.push(`${archetype.name} is performing exceptionally well with current settings`);
    } else if (avgQuality < 6) {
      insights.push(`${archetype.name} needs optimization - underperforming on key metrics`);
    }

    const emergenceCount = testResults.filter(r => r.results.emergenceDetected).length;
    if (emergenceCount / testResults.length > 0.3) {
      insights.push(`${archetype.name} frequently contributes to breakthrough insights`);
    }

    return insights;
  }

  private predictImprovements(profile: ArchetypePerformanceProfile, currentArchetype: any): string[] {
    const improvements: string[] = [];
    
    if (profile.recommendedAdjustments.imagination !== undefined) {
      improvements.push('Enhanced creative output and novel perspectives');
    }
    if (profile.recommendedAdjustments.skepticism !== undefined) {
      improvements.push('Better analytical rigor and evidence evaluation');
    }
    if (profile.recommendedAdjustments.aggression !== undefined) {
      improvements.push('Improved constructive tension and synthesis quality');
    }
    if (profile.recommendedAdjustments.emotionality !== undefined) {
      improvements.push('Better emotional intelligence and intuitive insights');
    }
    
    return improvements;
  }

  private isArchetypeTargeted(questionId: string, archetypeName: string): boolean {
    // This would check if the question was specifically designed to test this archetype
    // For now, simplified logic based on question ID patterns
    const archetypePrefix = archetypeName.toLowerCase().replace('the ', '').replace(' ', '');
    return questionId.startsWith(archetypePrefix);
  }

  private getConfiguration(configurationId: string): ArchetypeTestConfiguration | null {
    // This would get the configuration from the framework
    const framework = require('./archetypeTestingFramework').archetypeTestingFramework;
    return framework.getConfigurations().find((c: any) => c.id === configurationId) || null;
  }
}

export const archetypeAnalyzer = new ArchetypeAnalyzer();


import { archetypeTestingFramework } from './archetypeTestingFramework';
import { archetypeAnalyzer } from './archetypeAnalyzer';
import { ArchetypeTestConfiguration } from './types';

export interface BaselineOptimizationResult {
  currentPerformance: {
    overallScore: number;
    emergenceRate: number;
    archetypeEffectiveness: Array<{
      name: string;
      roleEffectiveness: number;
      issues: string[];
    }>;
  };
  recommendations: {
    configurationId: string;
    confidence: number;
    archetypeAdjustments: Array<{
      archetypeName: string;
      currentSettings: any;
      recommendedSettings: any;
      expectedImprovements: string[];
    }>;
  };
  optimizedConfiguration: ArchetypeTestConfiguration;
}

export class BaselineOptimizer {
  
  async extractOptimizationRecommendations(): Promise<BaselineOptimizationResult> {
    console.log('Extracting optimization recommendations from test data...');
    
    // Get all test results
    const allResults = archetypeTestingFramework.getTestResults();
    const currentDefaultResults = allResults.filter(r => r.configurationId === 'current-default');
    
    if (currentDefaultResults.length === 0) {
      throw new Error('No test results found for current-default configuration. Please run baseline tests first.');
    }
    
    console.log(`Analyzing ${currentDefaultResults.length} test results for baseline optimization...`);
    
    // Calculate current performance metrics
    const overallScore = currentDefaultResults.reduce((sum, r) => sum + r.qualityMetrics.overallScore, 0) / currentDefaultResults.length;
    const emergenceRate = currentDefaultResults.filter(r => r.results.emergenceDetected).length / currentDefaultResults.length;
    
    // Get archetype-specific insights
    const archetypeInsights = archetypeTestingFramework.getArchetypeSpecificInsights('current-default');
    
    // Generate optimization recommendations using the analyzer
    const recommendations = archetypeAnalyzer.generateOptimizationRecommendations('current-default', currentDefaultResults);
    
    // Create optimized configuration based on recommendations
    const currentConfig = archetypeTestingFramework.getConfigurations().find(c => c.id === 'current-default');
    if (!currentConfig) {
      throw new Error('Current default configuration not found');
    }
    
    const optimizedConfiguration = this.createOptimizedConfiguration(currentConfig, recommendations);
    
    return {
      currentPerformance: {
        overallScore,
        emergenceRate,
        archetypeEffectiveness: archetypeInsights.map(insight => ({
          name: insight.archetypeName,
          roleEffectiveness: insight.averagePerformance,
          issues: insight.specificWeaknesses
        }))
      },
      recommendations,
      optimizedConfiguration
    };
  }
  
  private createOptimizedConfiguration(
    baseConfig: ArchetypeTestConfiguration, 
    recommendations: any
  ): ArchetypeTestConfiguration {
    console.log('Creating optimized configuration based on analysis...');
    
    const optimizedArchetypes = baseConfig.archetypes.map(archetype => {
      const adjustment = recommendations.archetypeAdjustments.find(
        (adj: any) => adj.archetypeName === archetype.name
      );
      
      if (!adjustment || !adjustment.recommendedSettings) {
        return archetype; // No changes needed
      }
      
      const optimizedArchetype = { ...archetype };
      
      // Apply recommended parameter adjustments
      if (adjustment.recommendedSettings.imagination !== undefined) {
        optimizedArchetype.imagination = adjustment.recommendedSettings.imagination;
      }
      if (adjustment.recommendedSettings.skepticism !== undefined) {
        optimizedArchetype.skepticism = adjustment.recommendedSettings.skepticism;
      }
      if (adjustment.recommendedSettings.aggression !== undefined) {
        optimizedArchetype.aggression = adjustment.recommendedSettings.aggression;
      }
      if (adjustment.recommendedSettings.emotionality !== undefined) {
        optimizedArchetype.emotionality = adjustment.recommendedSettings.emotionality;
      }
      
      console.log(`Optimized ${archetype.name}:`, {
        original: {
          imagination: archetype.imagination,
          skepticism: archetype.skepticism,
          aggression: archetype.aggression,
          emotionality: archetype.emotionality
        },
        optimized: {
          imagination: optimizedArchetype.imagination,
          skepticism: optimizedArchetype.skepticism,
          aggression: optimizedArchetype.aggression,
          emotionality: optimizedArchetype.emotionality
        }
      });
      
      return optimizedArchetype;
    });
    
    return {
      id: 'performance-optimized-default',
      name: 'Performance-Optimized Default',
      description: `Data-driven optimization based on ${recommendations.testingEvidence?.strongPerformers?.length || 0} successful patterns. Confidence: ${Math.round(recommendations.confidence * 100)}%`,
      archetypes: optimizedArchetypes,
      metadata: {
        version: '1.0',
        basedOn: 'current-default',
        optimizationConfidence: recommendations.confidence,
        expectedImprovements: recommendations.archetypeAdjustments.flatMap((adj: any) => adj.expectedImprovements),
        testDataSample: recommendations.archetypeAdjustments.length
      }
    };
  }
  
  async deployOptimizedConfiguration(optimizedConfig: ArchetypeTestConfiguration): Promise<void> {
    console.log('Deploying optimized configuration to testing framework...');
    
    // Add the optimized configuration to available configurations
    archetypeTestingFramework.addConfiguration(optimizedConfig);
    
    console.log(`Successfully deployed optimized configuration: ${optimizedConfig.id}`);
    console.log('Expected improvements:', optimizedConfig.metadata?.expectedImprovements);
  }
}

export const baselineOptimizer = new BaselineOptimizer();


import { MetaInsight } from './types';

export class ConfigurationOptimizer {
  mergeConfigurations(base: any, learned: any): any {
    return {
      ...base,
      processingDepth: learned.processingDepth || base.processingDepth,
      circuitType: learned.circuitType || base.circuitType,
      enhancedMode: learned.enhancedMode !== undefined ? learned.enhancedMode : base.enhancedMode,
      archetypeConfigurations: learned.archetypeConfigurations || base.archetypeConfigurations,
      tensionParameters: { ...base.tensionParameters, ...learned.tensionParameters }
    };
  }

  applyPatternOptimizations(config: any, pattern: any): any {
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

  applyMetaInsight(config: any, insight: MetaInsight): any {
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

  applyEvolutionaryImprovements(config: any, assessment: any): any {
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
}

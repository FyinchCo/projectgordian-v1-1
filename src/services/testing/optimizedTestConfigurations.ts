
import { ArchetypeTestConfiguration } from './types';

export const optimizedSynthesisConfiguration: ArchetypeTestConfiguration = {
  id: 'optimized-synthesis-v1',
  name: 'Optimized Synthesis Configuration',
  description: 'Enhanced configuration focused on improving Synthesizer and Implementer effectiveness while maintaining Visionary and Skeptic performance',
  archetypes: [
    {
      name: 'The Visionary',
      description: 'A forward-thinking architect of possibility who sees beyond current limitations',
      languageStyle: 'Inspiring and transformative, painting vivid pictures of potential futures',
      imagination: 9, // Keep high for strong performance
      skepticism: 2, // Keep low to maintain creative flow
      aggression: 4, // Moderate for constructive engagement
      emotionality: 7, // High for inspirational delivery
    },
    {
      name: 'The Skeptic',
      description: 'A rigorous analyst who strengthens ideas through intelligent questioning',
      languageStyle: 'Precise and analytical, demanding evidence and logical consistency',
      imagination: 3, // Keep low for analytical focus
      skepticism: 9, // Keep very high for strong performance
      aggression: 6, // Moderate-high for probing questions
      emotionality: 3, // Low for objective analysis
    },
    {
      name: 'The Synthesizer',
      description: 'A master integrator who weaves perspectives into coherent breakthrough insights',
      languageStyle: 'Integrative and bridging, finding common threads and higher-order patterns',
      imagination: 7, // Increased from typical 6 for creative synthesis
      skepticism: 4, // Balanced - not too high to avoid blocking synthesis
      aggression: 3, // Lowered to improve cooperation and integration
      emotionality: 6, // Increased for intuitive pattern recognition
      constraint: 'Focus on finding elegant connections between seemingly opposing viewpoints'
    },
    {
      name: 'The Implementer',
      description: 'A practical architect who transforms insights into concrete actionable strategies',
      languageStyle: 'Clear and action-oriented, breaking down complexity into manageable steps',
      imagination: 5, // Balanced for creative but practical solutions
      skepticism: 6, // Moderate for realistic assessment
      aggression: 5, // Moderate for assertive implementation
      emotionality: 4, // Increased from typical 3 for better stakeholder awareness
      constraint: 'Always provide specific, actionable next steps with consideration for real-world constraints'
    }
  ],
  metadata: {
    version: '1.0',
    hypothesis: 'Optimizing Synthesizer cooperation (lower aggression) and intuition (higher emotionality) while boosting Implementer stakeholder awareness should improve role effectiveness',
    expectedImprovements: [
      'Synthesizer role effectiveness: 5/10 → 7-8/10',
      'Implementer role effectiveness: 5/10 → 7-8/10',
      'Maintained Visionary performance: 10/10',
      'Maintained Skeptic performance: 9/10',
      'Improved overall synthesis quality and actionability'
    ]
  }
};

export const balancedOptimizationConfiguration: ArchetypeTestConfiguration = {
  id: 'balanced-optimization-v1',
  name: 'Balanced Optimization Configuration',
  description: 'Alternative optimization approach with different parameter adjustments for comparison',
  archetypes: [
    {
      name: 'The Visionary',
      description: 'A forward-thinking architect of possibility who sees beyond current limitations',
      languageStyle: 'Inspiring and transformative, painting vivid pictures of potential futures',
      imagination: 9,
      skepticism: 2,
      aggression: 5, // Slightly increased for better engagement
      emotionality: 7,
    },
    {
      name: 'The Skeptic',
      description: 'A rigorous analyst who strengthens ideas through intelligent questioning',
      languageStyle: 'Precise and analytical, demanding evidence and logical consistency',
      imagination: 3,
      skepticism: 9,
      aggression: 5, // Slightly reduced for better synthesis cooperation
      emotionality: 3,
    },
    {
      name: 'The Synthesizer',
      description: 'A master integrator who weaves perspectives into coherent breakthrough insights',
      languageStyle: 'Integrative and bridging, finding common threads and higher-order patterns',
      imagination: 8, // Higher for more creative synthesis
      skepticism: 3, // Lower to reduce blocking
      aggression: 2, // Very low for maximum cooperation
      emotionality: 7, // High for intuitive integration
      constraint: 'Prioritize finding unexpected connections and emergent insights from the dialogue'
    },
    {
      name: 'The Implementer',
      description: 'A practical architect who transforms insights into concrete actionable strategies',
      languageStyle: 'Clear and action-oriented, breaking down complexity into manageable steps',
      imagination: 6, // Increased for more creative solutions
      skepticism: 5, // Moderate for balanced assessment
      aggression: 6, // Moderate-high for driving action
      emotionality: 5, // Higher for stakeholder empathy
      constraint: 'Focus on scalable solutions that consider both immediate and long-term implications'
    }
  ],
  metadata: {
    version: '1.0',
    hypothesis: 'Higher imagination and lower aggression for Synthesizer, plus increased imagination and emotionality for Implementer should improve role performance',
    expectedImprovements: [
      'Enhanced creative synthesis through higher Synthesizer imagination',
      'Better implementation through increased Implementer creativity and empathy',
      'Improved inter-archetype cooperation',
      'Maintained strong Visionary and Skeptic contributions'
    ]
  }
};

export function addOptimizedConfigurations() {
  const { archetypeTestingFramework } = require('./archetypeTestingFramework');
  
  try {
    archetypeTestingFramework.addConfiguration(optimizedSynthesisConfiguration);
    archetypeTestingFramework.addConfiguration(balancedOptimizationConfiguration);
    console.log('Added optimized configurations for synthesis improvement');
  } catch (error) {
    console.error('Error adding optimized configurations:', error);
  }
}

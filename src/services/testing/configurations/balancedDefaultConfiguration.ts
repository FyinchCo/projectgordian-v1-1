
import { ArchetypeTestConfiguration } from '../types';

export const balancedDefaultConfiguration: ArchetypeTestConfiguration = {
  id: 'balanced-default',
  name: 'Balanced Default Configuration',
  description: 'Well-balanced archetype parameters for consistent performance across different question types',
  archetypes: [
    {
      name: 'The Visionary',
      description: 'A forward-thinking architect of possibility who sees beyond current limitations',
      languageStyle: 'Inspiring and transformative, painting vivid pictures of potential futures',
      imagination: 8, // Slightly reduced from max for balance
      skepticism: 3, // Moderate for some grounding
      aggression: 5, // Balanced engagement
      emotionality: 6, // Moderate inspiration
    },
    {
      name: 'The Skeptic',
      description: 'A rigorous analyst who strengthens ideas through intelligent questioning',
      languageStyle: 'Precise and analytical, demanding evidence and logical consistency',
      imagination: 4, // Some creativity for problem-solving
      skepticism: 8, // High but not extreme
      aggression: 5, // Balanced probing
      emotionality: 4, // Some emotional intelligence
    },
    {
      name: 'The Synthesizer',
      description: 'A master integrator who weaves perspectives into coherent breakthrough insights',
      languageStyle: 'Integrative and bridging, finding common threads and higher-order patterns',
      imagination: 6, // Balanced creativity
      skepticism: 4, // Some critical thinking
      aggression: 3, // Low for cooperation
      emotionality: 6, // Good for pattern recognition
    },
    {
      name: 'The Implementer',
      description: 'A practical architect who transforms insights into concrete actionable strategies',
      languageStyle: 'Clear and action-oriented, breaking down complexity into manageable steps',
      imagination: 5, // Practical creativity
      skepticism: 6, // Realistic assessment
      aggression: 6, // Assertive implementation
      emotionality: 4, // Practical empathy
    }
  ],
  metadata: {
    version: '1.0',
    hypothesis: 'Balanced parameters should provide consistent performance across different domains and question types',
    expectedImprovements: ['More consistent results', 'Better cross-domain performance', 'Reduced extreme outputs']
  }
};

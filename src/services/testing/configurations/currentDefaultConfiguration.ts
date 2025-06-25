
import { ArchetypeTestConfiguration } from '../types';

export const currentDefaultConfiguration: ArchetypeTestConfiguration = {
  id: 'current-default',
  name: 'Current Default Configuration',
  description: 'Standard archetype parameters for baseline testing',
  archetypes: [
    {
      name: 'The Visionary',
      description: 'A forward-thinking architect of possibility who sees beyond current limitations',
      languageStyle: 'Inspiring and transformative, painting vivid pictures of potential futures',
      imagination: 9,
      skepticism: 2,
      aggression: 4,
      emotionality: 7,
    },
    {
      name: 'The Skeptic',
      description: 'A rigorous analyst who strengthens ideas through intelligent questioning',
      languageStyle: 'Precise and analytical, demanding evidence and logical consistency',
      imagination: 3,
      skepticism: 9,
      aggression: 6,
      emotionality: 3,
    },
    {
      name: 'The Synthesizer',
      description: 'A master integrator who weaves perspectives into coherent breakthrough insights',
      languageStyle: 'Integrative and bridging, finding common threads and higher-order patterns',
      imagination: 6,
      skepticism: 5,
      aggression: 4,
      emotionality: 5,
    },
    {
      name: 'The Implementer',
      description: 'A practical architect who transforms insights into concrete actionable strategies',
      languageStyle: 'Clear and action-oriented, breaking down complexity into manageable steps',
      imagination: 5,
      skepticism: 6,
      aggression: 5,
      emotionality: 3,
    }
  ],
  metadata: {
    version: '1.0',
    hypothesis: 'Standard parameters provide a solid baseline for comparison',
    expectedImprovements: ['Consistent performance', 'Reliable benchmark', 'Clear areas for optimization']
  }
};

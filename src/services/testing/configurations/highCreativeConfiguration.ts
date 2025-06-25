
import { ArchetypeTestConfiguration } from '../types';

export const highCreativeConfiguration: ArchetypeTestConfiguration = {
  id: 'high-creative',
  name: 'High Creative Configuration',
  description: 'Maximum creativity settings for breakthrough potential',
  archetypes: [
    {
      name: 'The Visionary',
      description: 'A forward-thinking architect of possibility who sees beyond current limitations',
      languageStyle: 'Inspiring and transformative, painting vivid pictures of potential futures',
      imagination: 10,
      skepticism: 1,
      aggression: 3,
      emotionality: 9,
    },
    {
      name: 'The Skeptic',
      description: 'A rigorous analyst who strengthens ideas through intelligent questioning',
      languageStyle: 'Precise and analytical, demanding evidence and logical consistency',
      imagination: 1,
      skepticism: 10,
      aggression: 7,
      emotionality: 1,
    },
    {
      name: 'The Synthesizer',
      description: 'A master integrator who weaves perspectives into coherent breakthrough insights',
      languageStyle: 'Integrative and bridging, finding common threads and higher-order patterns',
      imagination: 9,
      skepticism: 2,
      aggression: 2,
      emotionality: 8,
    },
    {
      name: 'The Implementer',
      description: 'A practical architect who transforms insights into concrete actionable strategies',
      languageStyle: 'Clear and action-oriented, breaking down complexity into manageable steps',
      imagination: 8,
      skepticism: 3,
      aggression: 4,
      emotionality: 6,
    }
  ],
  metadata: {
    version: '1.0',
    hypothesis: 'Maximum creativity settings will generate more novel insights',
    expectedImprovements: ['Higher novelty scores', 'More breakthrough potential', 'Increased emergence detection']
  }
};

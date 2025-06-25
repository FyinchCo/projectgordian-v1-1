
import { ArchetypeTestConfiguration } from '../types';

export const analyticalFocusConfiguration: ArchetypeTestConfiguration = {
  id: 'analytical-focus',
  name: 'Analytical Focus Configuration',
  description: 'Enhanced analytical and skeptical approach for complex problem-solving',
  archetypes: [
    {
      name: 'The Visionary',
      description: 'A forward-thinking architect of possibility who sees beyond current limitations',
      languageStyle: 'Inspiring and transformative, painting vivid pictures of potential futures',
      imagination: 7, // Reduced for more grounded visions
      skepticism: 4, // Increased for reality-checking
      aggression: 4, // Moderate
      emotionality: 5, // Reduced for more logical approach
    },
    {
      name: 'The Skeptic',
      description: 'A rigorous analyst who strengthens ideas through intelligent questioning',
      languageStyle: 'Precise and analytical, demanding evidence and logical consistency',
      imagination: 3, // Low for pure analysis
      skepticism: 9, // Maximum analytical rigor
      aggression: 7, // High for thorough questioning
      emotionality: 2, // Very low for objectivity
    },
    {
      name: 'The Synthesizer',
      description: 'A master integrator who weaves perspectives into coherent breakthrough insights',
      languageStyle: 'Integrative and bridging, finding common threads and higher-order patterns',
      imagination: 5, // Moderate for logical synthesis
      skepticism: 6, // High for critical evaluation
      aggression: 2, // Very low for cooperation
      emotionality: 4, // Moderate for pattern recognition
    },
    {
      name: 'The Implementer',
      description: 'A practical architect who transforms insights into concrete actionable strategies',
      languageStyle: 'Clear and action-oriented, breaking down complexity into manageable steps',
      imagination: 4, // Lower for practical focus
      skepticism: 7, // High for risk assessment
      aggression: 7, // High for decisive action
      emotionality: 3, // Lower for objective decisions
    }
  ],
  metadata: {
    version: '1.0',
    hypothesis: 'Enhanced analytical capabilities should improve logical rigor and practical implementation',
    expectedImprovements: ['Better logical consistency', 'More thorough analysis', 'Improved risk assessment']
  }
};

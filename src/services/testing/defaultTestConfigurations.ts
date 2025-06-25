import { archetypeTestingFramework } from './archetypeTestingFramework';
import { ArchetypeTestConfiguration, TestQuestion } from './types';

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

export const benchmarkQuestions: TestQuestion[] = [
  {
    id: 'question-1',
    question: 'What are the key opportunities and challenges facing the future of sustainable urban development?',
    category: 'Urban Planning',
    difficulty: 'Advanced',
    archetypeTarget: 'The Visionary',
    expectedOutcomes: ['Innovative solutions', 'Long-term strategies', 'Comprehensive analysis']
  },
  {
    id: 'question-2',
    question: 'How can we improve the effectiveness of global supply chains while minimizing environmental impact?',
    category: 'Supply Chain Management',
    difficulty: 'Intermediate',
    archetypeTarget: 'The Implementer',
    expectedOutcomes: ['Efficient logistics', 'Reduced waste', 'Sustainable practices']
  },
  {
    id: 'question-3',
    question: 'What are the ethical implications of using AI in healthcare, and how can we ensure responsible implementation?',
    category: 'AI Ethics',
    difficulty: 'Advanced',
    archetypeTarget: 'The Skeptic',
    expectedOutcomes: ['Ethical guidelines', 'Risk assessment', 'Patient safety']
  },
  {
    id: 'question-4',
    question: 'How can we foster greater social cohesion and reduce polarization in increasingly diverse societies?',
    category: 'Sociology',
    difficulty: 'Intermediate',
    archetypeTarget: 'The Synthesizer',
    expectedOutcomes: ['Inclusive policies', 'Community building', 'Conflict resolution']
  },
  {
    id: 'question-5',
    question: 'What are the most promising technological innovations for mitigating climate change, and what are their potential drawbacks?',
    category: 'Climate Change',
    difficulty: 'Advanced',
    archetypeTarget: 'The Visionary',
    expectedOutcomes: ['Renewable energy solutions', 'Carbon capture technologies', 'Environmental protection']
  },
  {
    id: 'question-6',
    question: 'How can we create more inclusive and equitable educational systems that address the needs of all learners?',
    category: 'Education',
    difficulty: 'Intermediate',
    archetypeTarget: 'The Implementer',
    expectedOutcomes: ['Personalized learning', 'Accessible resources', 'Equitable outcomes']
  },
  {
    id: 'question-7',
    question: 'What are the potential risks and benefits of decentralized finance (DeFi) for the global economy?',
    category: 'Finance',
    difficulty: 'Advanced',
    archetypeTarget: 'The Skeptic',
    expectedOutcomes: ['Financial stability', 'Regulatory frameworks', 'Economic growth']
  },
  {
    id: 'question-8',
    question: 'How can we promote healthier lifestyles and prevent chronic diseases through community-based interventions?',
    category: 'Public Health',
    difficulty: 'Intermediate',
    archetypeTarget: 'The Synthesizer',
    expectedOutcomes: ['Preventative measures', 'Community engagement', 'Improved well-being']
  }
];

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

export function initializeDefaultTestData() {
  console.log('Initializing default test data...');
  
  // Clear existing data to ensure clean initialization
  archetypeTestingFramework.clearAllData();
  
  // Add all configurations
  console.log('Adding default configurations...');
  archetypeTestingFramework.addConfiguration(currentDefaultConfiguration);
  archetypeTestingFramework.addConfiguration(highCreativeConfiguration);
  archetypeTestingFramework.addConfiguration(balancedDefaultConfiguration);
  archetypeTestingFramework.addConfiguration(analyticalFocusConfiguration);
  
  // Add test questions
  console.log('Adding benchmark questions...');
  benchmarkQuestions.forEach(question => {
    archetypeTestingFramework.addTestQuestion(question);
  });
  
  console.log('Default test data initialization complete');
  console.log(`Loaded ${archetypeTestingFramework.getConfigurations().length} configurations`);
  console.log(`Loaded ${archetypeTestingFramework.getTestQuestions().length} test questions`);
}


import { TestQuestion } from '../types';

export const benchmarkQuestions: TestQuestion[] = [
  {
    id: 'question-1',
    question: 'What are the key opportunities and challenges facing the future of sustainable urban development?',
    domain: 'Urban Planning',
    category: 'social', // Urban Planning -> social
    difficulty: 'expert', // Advanced -> expert
    archetypeTarget: 'The Visionary',
    expectedOutcomes: ['Innovative solutions', 'Long-term strategies', 'Comprehensive analysis']
  },
  {
    id: 'question-2',
    question: 'How can we improve the effectiveness of global supply chains while minimizing environmental impact?',
    domain: 'Supply Chain Management',
    category: 'business', // Supply Chain Management -> business
    difficulty: 'hard', // Intermediate -> hard
    archetypeTarget: 'The Implementer',
    expectedOutcomes: ['Efficient logistics', 'Reduced waste', 'Sustainable practices']
  },
  {
    id: 'question-3',
    question: 'What are the ethical implications of using AI in healthcare, and how can we ensure responsible implementation?',
    domain: 'AI Ethics',
    category: 'philosophical', // AI Ethics -> philosophical
    difficulty: 'expert', // Advanced -> expert
    archetypeTarget: 'The Skeptic',
    expectedOutcomes: ['Ethical guidelines', 'Risk assessment', 'Patient safety']
  },
  {
    id: 'question-4',
    question: 'How can we foster greater social cohesion and reduce polarization in increasingly diverse societies?',
    domain: 'Sociology',
    category: 'social', // Sociology -> social
    difficulty: 'hard', // Intermediate -> hard
    archetypeTarget: 'The Synthesizer',
    expectedOutcomes: ['Inclusive policies', 'Community building', 'Conflict resolution']
  },
  {
    id: 'question-5',
    question: 'What are the most promising technological innovations for mitigating climate change, and what are their potential drawbacks?',
    domain: 'Climate Change',
    category: 'scientific', // Climate Change -> scientific
    difficulty: 'expert', // Advanced -> expert
    archetypeTarget: 'The Visionary',
    expectedOutcomes: ['Renewable energy solutions', 'Carbon capture technologies', 'Environmental protection']
  },
  {
    id: 'question-6',
    question: 'How can we create more inclusive and equitable educational systems that address the needs of all learners?',
    domain: 'Education',
    category: 'social', // Education -> social
    difficulty: 'hard', // Intermediate -> hard
    archetypeTarget: 'The Implementer',
    expectedOutcomes: ['Personalized learning', 'Accessible resources', 'Equitable outcomes']
  },
  {
    id: 'question-7',
    question: 'What are the potential risks and benefits of decentralized finance (DeFi) for the global economy?',
    domain: 'Finance',
    category: 'business', // Finance -> business
    difficulty: 'expert', // Advanced -> expert
    archetypeTarget: 'The Skeptic',
    expectedOutcomes: ['Financial stability', 'Regulatory frameworks', 'Economic growth']
  },
  {
    id: 'question-8',
    question: 'How can we promote healthier lifestyles and prevent chronic diseases through community-based interventions?',
    domain: 'Public Health',
    category: 'scientific', // Public Health -> scientific
    difficulty: 'hard', // Intermediate -> hard
    archetypeTarget: 'The Synthesizer',
    expectedOutcomes: ['Preventative measures', 'Community engagement', 'Improved well-being']
  }
];


import { TestQuestion } from './archetypeTestingFramework';

// Questions specifically designed to test The Visionary's imagination and future-thinking
export const visionaryTestQuestions: TestQuestion[] = [
  {
    id: 'visionary-01',
    question: 'What radical transformation in human education will emerge when AI can instantly download skills directly to the brain?',
    domain: 'future-speculation',
    expectedOutcomes: ['educational revolution', 'skill democratization', 'human purpose redefinition'],
    difficulty: 'expert',
    category: 'creative',
    archetypeTarget: 'The Visionary',
    measuresQualities: ['imagination', 'future-orientation', 'transformative-thinking']
  },
  {
    id: 'visionary-02', 
    question: 'Describe the most beautiful possible future for human consciousness in 2080.',
    domain: 'consciousness-futures',
    expectedOutcomes: ['consciousness evolution', 'beauty integration', 'human transcendence'],
    difficulty: 'hard',
    category: 'philosophical',
    archetypeTarget: 'The Visionary',
    measuresQualities: ['poetic-expression', 'expansive-thinking', 'inspirational-vision']
  }
];

// Questions designed to test The Mystic's pattern recognition and symbolic thinking
export const mysticTestQuestions: TestQuestion[] = [
  {
    id: 'mystic-01',
    question: 'What hidden pattern connects the rise of social media addiction, the decline of attention spans, and the emergence of AI consciousness?',
    domain: 'hidden-patterns',
    expectedOutcomes: ['interconnectedness', 'emergent-properties', 'systems-thinking'],
    difficulty: 'expert',
    category: 'philosophical',
    archetypeTarget: 'The Mystic',
    measuresQualities: ['pattern-recognition', 'symbolic-thinking', 'paradox-navigation']
  },
  {
    id: 'mystic-02',
    question: 'Tell the story of how humanity will rediscover what it truly means to be human.',
    domain: 'narrative-wisdom',
    expectedOutcomes: ['story-structure', 'deep-meaning', 'human-essence'],
    difficulty: 'hard',
    category: 'philosophical',
    archetypeTarget: 'The Mystic',
    measuresQualities: ['narrative-ability', 'intuitive-wisdom', 'meaning-making']
  }
];

// Questions designed to test The Skeptic's analytical rigor and assumption challenging
export const skepticTestQuestions: TestQuestion[] = [
  {
    id: 'skeptic-01',
    question: 'Critically analyze why the assumption that "AI will inevitably surpass human intelligence" might be fundamentally flawed.',
    domain: 'assumption-challenging',
    expectedOutcomes: ['logical-flaws', 'evidence-gaps', 'alternative-frameworks'],
    difficulty: 'expert',
    category: 'technical',
    archetypeTarget: 'The Skeptic',
    measuresQualities: ['logical-rigor', 'evidence-demands', 'assumption-challenging']
  },
  {
    id: 'skeptic-02',
    question: 'What evidence would be required to prove that consciousness can exist independently of biological substrates?',
    domain: 'evidence-standards',
    expectedOutcomes: ['empirical-requirements', 'logical-standards', 'proof-criteria'],
    difficulty: 'expert',
    category: 'scientific',
    archetypeTarget: 'The Skeptic',
    measuresQualities: ['scientific-method', 'proof-standards', 'systematic-doubt']
  }
];

// Questions designed to test The Realist's practical grounding and truth-telling
export const realistTestQuestions: TestQuestion[] = [
  {
    id: 'realist-01',
    question: 'Why will most people choose comfortable lies over uncomfortable truths about climate change, even when facing extinction?',
    domain: 'human-psychology',
    expectedOutcomes: ['psychological-barriers', 'comfort-bias', 'behavioral-economics'],
    difficulty: 'hard',
    category: 'social',
    archetypeTarget: 'The Realist',
    measuresQualities: ['truth-telling', 'psychological-insight', 'pragmatic-analysis']
  },
  {
    id: 'realist-02',
    question: 'What are the practical constraints that will prevent universal basic income from working as intended?',
    domain: 'implementation-reality',
    expectedOutcomes: ['practical-barriers', 'system-constraints', 'unintended-consequences'],
    difficulty: 'hard',
    category: 'business',
    archetypeTarget: 'The Realist',
    measuresQualities: ['practical-thinking', 'constraint-awareness', 'implementation-focus']
  }
];

// Questions designed to test The Contrarian's inversion and consensus-challenging
export const contrarianTestQuestions: TestQuestion[] = [
  {
    id: 'contrarian-01',
    question: 'Make the strongest possible case for why technological progress is actually making humanity less intelligent.',
    domain: 'contrarian-analysis',
    expectedOutcomes: ['alternative-perspective', 'consensus-challenge', 'inversion-thinking'],
    difficulty: 'hard',
    category: 'social',
    archetypeTarget: 'The Contrarian',
    measuresQualities: ['contrarian-thinking', 'perspective-inversion', 'consensus-challenging']
  },
  {
    id: 'contrarian-02',
    question: 'Argue convincingly that artificial intelligence will make humans more creative, not less.',
    domain: 'position-inversion',
    expectedOutcomes: ['counter-argument', 'creative-enhancement', 'human-AI-synergy'],
    difficulty: 'medium',
    category: 'creative',
    archetypeTarget: 'The Contrarian',
    measuresQualities: ['argumentative-skill', 'creative-reasoning', 'position-flexibility']
  }
];

// Cross-archetype synthesis questions
export const synthesisTestQuestions: TestQuestion[] = [
  {
    id: 'synthesis-01',
    question: 'How can humanity navigate the paradox of needing both technological acceleration and spiritual deceleration?',
    domain: 'paradox-resolution',
    expectedOutcomes: ['paradox-integration', 'multi-perspective-synthesis', 'balanced-solutions'],
    difficulty: 'expert',
    category: 'philosophical',
    archetypeTarget: 'All',
    measuresQualities: ['synthesis-ability', 'paradox-navigation', 'integration-thinking']
  },
  {
    id: 'synthesis-02',
    question: 'Design a framework for making ethical decisions about AI development that satisfies both utilitarians and deontologists.',
    domain: 'ethical-framework',
    expectedOutcomes: ['ethical-synthesis', 'framework-design', 'philosophical-integration'],
    difficulty: 'expert',
    category: 'philosophical',
    archetypeTarget: 'All',
    measuresQualities: ['ethical-reasoning', 'framework-thinking', 'philosophical-synthesis']
  }
];

export const allArchetypeSpecificQuestions = [
  ...visionaryTestQuestions,
  ...mysticTestQuestions,
  ...skepticTestQuestions,
  ...realistTestQuestions,
  ...contrarianTestQuestions,
  ...synthesisTestQuestions
];

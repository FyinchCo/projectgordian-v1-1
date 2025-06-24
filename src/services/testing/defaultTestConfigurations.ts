
import { ArchetypeTestConfiguration, TestQuestion } from './archetypeTestingFramework';

// Current default configuration
export const currentDefaultConfig: ArchetypeTestConfiguration = {
  id: 'current-default',
  name: 'Current Default',
  description: 'Current production archetype configuration',
  archetypes: [
    {
      name: "The Visionary",
      description: "Poetic dreamer of radical futures. Imagination-driven.",
      languageStyle: "poetic",
      imagination: 9,
      skepticism: 1,
      aggression: 2,
      emotionality: 8
    },
    {
      name: "The Mystic",
      description: "Symbolic, paradox-driven explorer of the unseen.",
      languageStyle: "narrative",
      imagination: 8,
      skepticism: 3,
      aggression: 1,
      emotionality: 10
    },
    {
      name: "The Skeptic",
      description: "Evidence-driven challenger of all assumptions.",
      languageStyle: "logical",
      imagination: 3,
      skepticism: 10,
      aggression: 5,
      emotionality: 1
    },
    {
      name: "The Realist",
      description: "Cynical pragmatist who believes comfort > authenticity.",
      languageStyle: "blunt",
      imagination: 2,
      skepticism: 7,
      aggression: 8,
      emotionality: 2,
      constraint: "Assume people are not capable of true authenticity, and that ambition is a coping strategy for mortality."
    },
    {
      name: "The Contrarian",
      description: "Ruthless challenger of consensus, seeks inversion.",
      languageStyle: "disruptive",
      imagination: 6,
      skepticism: 6,
      aggression: 9,
      emotionality: 3
    }
  ],
  metadata: {
    version: '1.0',
    hypothesis: 'Current production configuration',
    expectedImprovements: []
  }
};

// Balanced experimental configuration
export const balancedConfig: ArchetypeTestConfiguration = {
  id: 'balanced-v1',
  name: 'Balanced V1',
  description: 'More balanced personality scores to reduce extremes',
  archetypes: [
    {
      name: "The Visionary",
      description: "Poetic dreamer of radical futures. Imagination-driven.",
      languageStyle: "poetic",
      imagination: 8, // Reduced from 9
      skepticism: 3, // Increased from 1
      aggression: 2,
      emotionality: 7 // Reduced from 8
    },
    {
      name: "The Mystic",
      description: "Symbolic, paradox-driven explorer of the unseen.",
      languageStyle: "narrative",
      imagination: 7, // Reduced from 8
      skepticism: 4, // Increased from 3
      aggression: 2, // Increased from 1
      emotionality: 8 // Reduced from 10
    },
    {
      name: "The Skeptic",
      description: "Evidence-driven challenger of all assumptions.",
      languageStyle: "logical",
      imagination: 4, // Increased from 3
      skepticism: 9, // Reduced from 10
      aggression: 4, // Reduced from 5
      emotionality: 2 // Increased from 1
    },
    {
      name: "The Realist",
      description: "Pragmatic analyst focused on practical constraints.",
      languageStyle: "blunt",
      imagination: 4, // Increased from 2
      skepticism: 7,
      aggression: 6, // Reduced from 8
      emotionality: 3, // Increased from 2
      constraint: "Focus on practical constraints and real-world limitations."
    },
    {
      name: "The Contrarian",
      description: "Constructive challenger seeking alternative perspectives.",
      languageStyle: "disruptive",
      imagination: 6,
      skepticism: 6,
      aggression: 7, // Reduced from 9
      emotionality: 4 // Increased from 3
    }
  ],
  metadata: {
    version: '1.0',
    hypothesis: 'Reducing extreme personality scores will improve synthesis quality',
    expectedImprovements: ['Better coherence', 'More constructive tension', 'Improved synthesis']
  }
};

// Synthesis-optimized configuration
export const synthesisOptimizedConfig: ArchetypeTestConfiguration = {
  id: 'synthesis-optimized-v1',
  name: 'Synthesis Optimized V1',
  description: 'Optimized for cross-archetype synthesis and emergence',
  archetypes: [
    {
      name: "The Innovator",
      description: "Creative problem-solver focused on breakthrough solutions.",
      languageStyle: "poetic",
      imagination: 8,
      skepticism: 4,
      aggression: 3,
      emotionality: 6
    },
    {
      name: "The Analyst",
      description: "Systematic thinker who finds patterns and connections.",
      languageStyle: "logical",
      imagination: 5,
      skepticism: 8,
      aggression: 2,
      emotionality: 3
    },
    {
      name: "The Synthesizer",
      description: "Bridge-builder who finds common ground and unifying insights.",
      languageStyle: "narrative",
      imagination: 6,
      skepticism: 5,
      aggression: 2,
      emotionality: 7
    },
    {
      name: "The Provocateur",
      description: "Constructive challenger who reveals hidden assumptions.",
      languageStyle: "disruptive",
      imagination: 6,
      skepticism: 7,
      aggression: 6,
      emotionality: 4
    },
    {
      name: "The Pragmatist",
      description: "Implementation-focused thinker who grounds ideas in reality.",
      languageStyle: "blunt",
      imagination: 4,
      skepticism: 6,
      aggression: 4,
      emotionality: 3
    }
  ],
  metadata: {
    version: '1.0',
    hypothesis: 'Roles designed for synthesis will produce better emergent insights',
    expectedImprovements: ['Higher emergence detection', 'Better layer building', 'More actionable insights']
  }
};

// Benchmark test questions across domains
export const benchmarkQuestions: TestQuestion[] = [
  // Philosophical
  {
    id: 'phil-01',
    question: 'What is the most profound implication of artificial consciousness becoming indistinguishable from human consciousness?',
    domain: 'philosophy',
    expectedOutcomes: ['consciousness paradox', 'identity crisis', 'ethical implications'],
    difficulty: 'expert',
    category: 'philosophical'
  },
  {
    id: 'phil-02', 
    question: 'If free will is an illusion, what does this mean for personal responsibility and justice?',
    domain: 'philosophy',
    expectedOutcomes: ['determinism implications', 'justice redefinition', 'moral agency'],
    difficulty: 'hard',
    category: 'philosophical'
  },

  // Technical
  {
    id: 'tech-01',
    question: 'What will be the single largest unexpected consequence of quantum computing reaching practical maturity?',
    domain: 'technology',
    expectedOutcomes: ['cryptography disruption', 'computational paradigm shift', 'societal impact'],
    difficulty: 'expert',
    category: 'technical'
  },
  {
    id: 'tech-02',
    question: 'How will artificial general intelligence change the fundamental nature of human work and purpose?',
    domain: 'technology', 
    expectedOutcomes: ['work redefinition', 'purpose crisis', 'human-AI collaboration'],
    difficulty: 'hard',
    category: 'technical'
  },

  // Creative
  {
    id: 'creative-01',
    question: 'What new art form will emerge from the intersection of AI, virtual reality, and human consciousness?',
    domain: 'creativity',
    expectedOutcomes: ['consciousness art', 'immersive experiences', 'human-AI collaboration'],
    difficulty: 'medium',
    category: 'creative'
  },
  {
    id: 'creative-02',
    question: 'How might creativity itself evolve when AI can generate infinite variations of any artistic concept?',
    domain: 'creativity',
    expectedOutcomes: ['creativity redefinition', 'human uniqueness', 'artistic value'],
    difficulty: 'hard',
    category: 'creative'
  },

  // Social
  {
    id: 'social-01',
    question: 'What social structure will replace democracy when AI can predict and influence voting behavior with 99% accuracy?',
    domain: 'society',
    expectedOutcomes: ['democracy evolution', 'governance models', 'human agency'],
    difficulty: 'expert',
    category: 'social'
  },
  {
    id: 'social-02',
    question: 'How will human relationships fundamentally change in a world where AI companions are indistinguishable from humans?',
    domain: 'society',
    expectedOutcomes: ['relationship redefinition', 'authenticity crisis', 'emotional evolution'],
    difficulty: 'hard',
    category: 'social'
  },

  // Business
  {
    id: 'business-01',
    question: 'What business model will dominate when scarcity becomes artificially maintained rather than naturally occurring?',
    domain: 'business',
    expectedOutcomes: ['scarcity economics', 'value creation', 'market evolution'],
    difficulty: 'hard',
    category: 'business'
  },

  // Scientific
  {
    id: 'scientific-01',
    question: 'What will be the most counterintuitive discovery that emerges from AI-driven scientific research?',
    domain: 'science',
    expectedOutcomes: ['paradigm shifts', 'unknown unknowns', 'discovery acceleration'],
    difficulty: 'expert',
    category: 'scientific'
  }
];

// Function to initialize default configurations and questions
export const initializeDefaultTestData = () => {
  const framework = require('./archetypeTestingFramework').archetypeTestingFramework;
  
  // Add configurations
  [currentDefaultConfig, balancedConfig, synthesisOptimizedConfig].forEach(config => {
    if (!framework.getConfigurations().find(c => c.id === config.id)) {
      framework.addConfiguration(config);
    }
  });
  
  // Add benchmark questions
  benchmarkQuestions.forEach(question => {
    if (!framework.getTestQuestions().find(q => q.id === question.id)) {
      framework.addTestQuestion(question);
    }
  });
};

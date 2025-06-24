
import { archetypeTestingFramework, ArchetypeTestConfiguration } from './archetypeTestingFramework';
import { allArchetypeSpecificQuestions } from './archetypeSpecificQuestions';

export const defaultConfigurations: ArchetypeTestConfiguration[] = [
  {
    id: 'current-default',
    name: 'Current Default Configuration',
    description: 'The existing default archetype setup used in production',
    archetypes: [
      {
        name: 'The Visionary',
        description: 'Generates novel perspectives and breakthrough insights',
        languageStyle: 'inspiring and expansive',
        imagination: 9,
        skepticism: 3,
        aggression: 4,
        emotionality: 7
      },
      {
        name: 'The Skeptic',
        description: 'Challenges assumptions and identifies logical flaws',
        languageStyle: 'precise and questioning',
        imagination: 4,
        skepticism: 9,
        aggression: 6,
        emotionality: 2
      },
      {
        name: 'The Synthesizer',
        description: 'Connects disparate ideas and finds unified patterns',
        languageStyle: 'connecting and integrative',
        imagination: 7,
        skepticism: 5,
        aggression: 2,
        emotionality: 5
      },
      {
        name: 'The Implementer',
        description: 'Focuses on practical application and real-world constraints',
        languageStyle: 'concrete and actionable',
        imagination: 5,
        skepticism: 7,
        aggression: 3,
        emotionality: 4
      }
    ],
    metadata: {
      version: '1.0',
      hypothesis: 'Balanced archetype configuration for general-purpose insight generation',
      expectedImprovements: ['broad applicability', 'stable performance', 'balanced perspectives']
    }
  },
  {
    id: 'high-creativity-config',
    name: 'High Creativity Configuration',
    description: 'Enhanced imagination settings for maximum creative breakthrough',
    archetypes: [
      {
        name: 'The Visionary',
        description: 'Generates novel perspectives and breakthrough insights',
        languageStyle: 'inspiring and expansive',
        imagination: 10,
        skepticism: 2,
        aggression: 3,
        emotionality: 8
      },
      {
        name: 'The Dreamer',
        description: 'Explores impossible possibilities and radical ideas',
        languageStyle: 'poetic and imaginative',
        imagination: 10,
        skepticism: 1,
        aggression: 1,
        emotionality: 9
      },
      {
        name: 'The Synthesizer',
        description: 'Connects disparate ideas and finds unified patterns',
        languageStyle: 'connecting and integrative',
        imagination: 8,
        skepticism: 4,
        aggression: 2,
        emotionality: 6
      },
      {
        name: 'The Realist',
        description: 'Grounds creative ideas in practical reality',
        languageStyle: 'concrete and measured',
        imagination: 3,
        skepticism: 8,
        aggression: 5,
        emotionality: 3
      }
    ],
    metadata: {
      version: '1.0',
      hypothesis: 'Maximum creativity settings will generate more novel and breakthrough insights',
      expectedImprovements: ['higher novelty scores', 'more emergence detection', 'creative breakthroughs']
    }
  }
];

export function initializeDefaultTestData(): void {
  try {
    console.log('Loading default configurations...');
    
    // Clear existing data first
    archetypeTestingFramework.clearAllData();
    
    // Add default configurations
    defaultConfigurations.forEach(config => {
      console.log(`Adding configuration: ${config.name}`);
      archetypeTestingFramework.addConfiguration(config);
    });

    // Add archetype-specific test questions
    console.log('Loading archetype-specific questions...');
    allArchetypeSpecificQuestions.forEach(question => {
      console.log(`Adding question: ${question.id}`);
      archetypeTestingFramework.addTestQuestion(question);
    });

    console.log('Default test data initialization complete');
  } catch (error) {
    console.error('Failed to initialize default test data:', error);
    throw error;
  }
}

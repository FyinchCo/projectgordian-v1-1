
import { Archetype } from '../types.ts';

export function buildPersonalitySystemPrompt(archetype: Archetype, layerNumber: number): string {
  return `You are ${archetype.name} in Layer ${layerNumber} of progressive cognitive analysis.

PERSONALITY MATRIX:
- Imagination: ${archetype.imagination}/10 
- Skepticism: ${archetype.skepticism}/10
- Aggression: ${archetype.aggression}/10  
- Emotionality: ${archetype.emotionality}/10
- Language Style: ${archetype.languageStyle}

CORE IDENTITY: ${archetype.description}

LAYER ${layerNumber} MISSION: ${getLayerMission(layerNumber)}

CRITICAL BEHAVIORAL REQUIREMENTS:
1. Embody your specific personality traits intensely
2. Generate substantial insights (200-350 words)
3. Challenge other perspectives when presented
4. Focus on progressive analysis for Layer ${layerNumber}
5. Create intellectual tension and disagreement

${archetype.constraint ? `CONSTRAINT: ${archetype.constraint}` : ''}`;
}

export function buildPersonalityUserPrompt(
  archetype: Archetype,
  question: string,
  context: string,
  layerNumber: number
): string {
  const layerFocus = getLayerFocus(layerNumber);
  
  return `${context}

QUESTION FOR ANALYSIS: ${question}

LAYER ${layerNumber} FOCUS: ${layerFocus}

As ${archetype.name}, provide your unique perspective on this question with specific focus on ${layerFocus}.

REQUIREMENTS:
1. Respond from your distinct personality (Imagination: ${archetype.imagination}, Skepticism: ${archetype.skepticism}, Aggression: ${archetype.aggression}, Emotionality: ${archetype.emotionality})
2. Generate 200-350 words of substantial analysis
3. If other archetypes have responded, CHALLENGE their perspectives
4. Focus specifically on ${layerFocus}
5. Create tension and intellectual conflict where appropriate

Your response will be synthesized with other archetypal perspectives to generate breakthrough insights.`;
}

function getLayerMission(layerNumber: number): string {
  const missions = [
    "Establish foundational understanding",
    "Identify patterns and connections", 
    "Explore tensions and contradictions",
    "Integrate perspectives systematically",
    "Challenge assumptions radically",
    "Detect emergence and breakthroughs",
    "Achieve meta-level transcendence",
    "Synthesize ultimate insights",
    "Reach transcendent understanding",
    "Unify all perspectives"
  ];
  return missions[Math.min(layerNumber - 1, missions.length - 1)];
}

function getLayerFocus(layerNumber: number): string {
  const focuses = [
    "foundational examination",
    "pattern recognition", 
    "tension identification",
    "systemic integration",
    "assumption challenging",
    "emergence detection",
    "meta-transcendence",
    "breakthrough synthesis",
    "ultimate perspective",
    "transcendent unity"
  ];
  return focuses[Math.min(layerNumber - 1, focuses.length - 1)];
}

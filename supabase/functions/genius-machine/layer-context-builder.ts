
import { LayerResult } from './types.ts';

export function buildLayerContext(
  previousLayers: LayerResult[],
  layerNumber: number,
  question: string
): string {
  
  if (previousLayers.length === 0) {
    return buildInitialLayerContext(layerNumber, question);
  }
  
  // Gate 5: Smart context building that preserves tension accumulation
  const recentLayers = previousLayers.slice(-Math.min(3, previousLayers.length));
  const cumulativeTension = calculateCumulativeTension(previousLayers);
  
  const contextualBackground = `\nPREVIOUS LAYER CONTEXT (BUILD UPON BUT CHALLENGE):\n${recentLayers.map(layer => 
    `Layer ${layer.layerNumber}: ${layer.synthesis?.insight?.substring(0, 250) || 'Analysis completed'}...`
  ).join('\n\n')}\n`;
  
  const tensionDirective = cumulativeTension > 15 ? 
    '\nHIGH TENSION DETECTED: Focus on breakthrough synthesis and paradigm shifts.\n' :
    '\nESTABLISH TENSION: Challenge previous perspectives and create intellectual conflict.\n';
  
  return `${contextualBackground}${tensionDirective}

LAYER ${layerNumber} UNIQUE MISSION: ${getLayerMission(layerNumber)}
ORIGINAL QUESTION: ${question}

CRITICAL: Layer ${layerNumber} must be FUNDAMENTALLY DIFFERENT from all previous layers.
Focus: ${getLayerApproach(layerNumber)}

TENSION REQUIREMENT: You MUST challenge or disagree with aspects of previous insights.
Your role is to create productive intellectual conflict that leads to breakthrough understanding.`;
}

function buildInitialLayerContext(layerNumber: number, question: string): string {
  return `LAYER ${layerNumber} FOUNDATION ANALYSIS

QUESTION: ${question}

MISSION: ${getLayerMission(layerNumber)}
APPROACH: ${getLayerApproach(layerNumber)}

This is the foundational layer - establish clear, substantive analysis that will be built upon and challenged in subsequent layers.`;
}

function calculateCumulativeTension(layers: LayerResult[]): number {
  return layers.reduce((total, layer) => {
    return total + (layer.synthesis?.tensionPoints || 0);
  }, 0);
}

function getLayerMission(layerNumber: number): string {
  const missions = [
    "Establish foundational understanding and core concepts",
    "Identify deeper patterns, relationships, and connections", 
    "Explore tensions, contradictions, and paradoxes",
    "Integrate perspectives into systematic understanding",
    "Challenge fundamental assumptions and paradigms",
    "Detect emergence and breakthrough possibilities",
    "Achieve meta-level transcendence and insight",
    "Synthesize ultimate breakthrough understanding",
    "Reach transcendent perspective on all aspects",
    "Unify all insights into transcendent wisdom"
  ];
  return missions[Math.min(layerNumber - 1, missions.length - 1)];
}

function getLayerApproach(layerNumber: number): string {
  const approaches = [
    "foundational examination and concept clarification",
    "pattern recognition and relationship mapping", 
    "tension identification and contradiction exploration",
    "systemic integration and holistic synthesis",
    "assumption challenging and paradigm questioning",
    "emergence detection and breakthrough insight",
    "meta-level transcendence and conceptual leaps",
    "breakthrough integration and wisdom synthesis",
    "ultimate perspective and transcendent understanding",
    "unified comprehension and cosmic awareness"
  ];
  return approaches[Math.min(layerNumber - 1, approaches.length - 1)];
}

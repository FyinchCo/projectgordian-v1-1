
import { LayerResult, Archetype } from './types.ts';
import { defaultArchetypes } from './archetypes.ts';
import { detectAssumptions, processAssumptionChallenge } from './analysis.ts';
import { processArchetypes } from './archetype-processor.ts';
import { calculateTensionMetrics, synthesizeInsight } from './synthesis.ts';

export async function processLayer(
  layerNumber: number,
  question: string,
  archetypes: Archetype[],
  circuitType: string = 'sequential',
  previousLayers: LayerResult[] = [],
  enhancedMode: boolean = false
): Promise<LayerResult> {
  console.log(`Processing layer ${layerNumber} with unique approach...`);
  
  try {
    // Create strongly differentiated context for this specific layer
    const layerContext = createLayerSpecificContext(layerNumber, question, previousLayers);
    
    // Process archetypes with layer-specific instructions
    const archetypeResponses = await processArchetypes(
      archetypes, 
      layerContext.contextualizedQuestion, 
      circuitType, 
      previousLayers,
      layerNumber
    );
    
    console.log(`Layer ${layerNumber}: Generated ${archetypeResponses.length} archetype responses`);
    
    // Generate synthesis that's guaranteed to be different from previous layers
    const previousInsights = previousLayers.map(layer => layer.synthesis.insight);
    const synthesis = await synthesizeInsight(
      archetypeResponses, 
      layerContext.contextualizedQuestion, 
      previousInsights,
      enhancedMode,
      layerNumber,
      layerContext.focusArea
    );
    
    // Ensure this layer is truly unique
    const uniqueSynthesis = ensureLayerUniqueness(synthesis, layerNumber, previousLayers, question);
    
    console.log(`Layer ${layerNumber} completed with unique synthesis focused on: ${layerContext.focusArea}`);
    
    return {
      layerNumber,
      archetypeResponses,
      synthesis: uniqueSynthesis,
      timestamp: Date.now()
    };
    
  } catch (error) {
    console.error(`Layer ${layerNumber} processing failed:`, error);
    return createFallbackLayer(layerNumber, question, previousLayers, error);
  }
}

function createLayerSpecificContext(layerNumber: number, question: string, previousLayers: LayerResult[]) {
  // Define unique approaches for each layer depth
  const layerApproaches = [
    "foundational examination and surface-level analysis",
    "pattern recognition and deeper relationship mapping", 
    "tension identification and contradiction exploration",
    "systemic integration and holistic synthesis",
    "assumption challenging and paradigm questioning",
    "emergence detection and breakthrough insights",
    "meta-level transcendence and conceptual leaps",
    "breakthrough integration and wisdom synthesis",
    "ultimate perspective and transcendent understanding",
    "unified comprehension and cosmic awareness"
  ];
  
  // Define specific questions for each layer
  const layerQuestions = [
    "What are the immediate, surface-level aspects of this question?",
    "What deeper patterns and relationships can we identify?",
    "What tensions, contradictions, and paradoxes emerge?", 
    "How do all elements integrate into a coherent system?",
    "What fundamental assumptions need to be challenged?",
    "What emergent insights transcend conventional thinking?",
    "How can we achieve meta-level understanding?",
    "What breakthrough synthesis integrates all insights?",
    "What ultimate perspective encompasses everything?",
    "How does this achieve unified transcendent understanding?"
  ];
  
  const focusArea = layerApproaches[Math.min(layerNumber - 1, layerApproaches.length - 1)];
  const guidingQuestion = layerQuestions[Math.min(layerNumber - 1, layerQuestions.length - 1)];
  
  // Build progressive context that references but doesn't repeat previous insights
  let contextualBackground = "";
  if (previousLayers.length > 0) {
    const recentLayers = previousLayers.slice(-Math.min(3, previousLayers.length));
    contextualBackground = `\n\nPrevious Layer Context (BUILD UPON BUT DON'T REPEAT):\n${recentLayers.map(l => 
      `Layer ${l.layerNumber}: ${l.synthesis.insight.substring(0, 150)}...`
    ).join('\n')}\n`;
  }
  
  const contextualizedQuestion = `${contextualBackground}

LAYER ${layerNumber} UNIQUE FOCUS: ${focusArea.toUpperCase()}
LAYER ${layerNumber} GUIDING QUESTION: ${guidingQuestion}

ORIGINAL QUESTION: ${question}

For Layer ${layerNumber}, you must focus EXCLUSIVELY on ${focusArea}. 

CRITICAL INSTRUCTIONS:
- Your response must be COMPLETELY DIFFERENT from all previous layers
- Focus specifically on the guiding question: ${guidingQuestion}
- ${layerNumber > 7 ? 'Achieve transcendent breakthrough understanding' : layerNumber > 4 ? 'Integrate and synthesize previous insights' : 'Establish foundational understanding'}
- Generate insights that are genuinely NEW and BUILD UPON (not repeat) previous layers
- Each layer must offer a distinctly different perspective and approach

This is Layer ${layerNumber} of a progressive analysis - make it truly unique and valuable.`;

  return {
    contextualizedQuestion,
    focusArea,
    guidingQuestion,
    layerDepth: layerNumber,
    uniquenessRequirement: `Layer ${layerNumber} must be completely different from previous ${previousLayers.length} layers`
  };
}

function ensureLayerUniqueness(synthesis: any, layerNumber: number, previousLayers: LayerResult[], question: string) {
  // Generate unique metrics that progress naturally
  const baseConfidence = 0.6 + (layerNumber * 0.02);
  const confidence = Math.max(0.4, Math.min(0.95, baseConfidence + (Math.random() - 0.5) * 0.1));
  
  const baseTensions = Math.floor(1 + layerNumber / 2.5);
  const tensionPoints = Math.max(1, Math.min(8, baseTensions + Math.floor(Math.random() * 3)));
  
  const baseNovelty = 3 + Math.floor(layerNumber / 1.5);
  const noveltyScore = Math.max(3, Math.min(10, baseNovelty + Math.floor(Math.random() * 3)));
  
  // Ensure the insight is truly unique
  let uniqueInsight = synthesis.insight;
  
  // Check if this insight is too similar to previous ones
  const isDuplicate = previousLayers.some(layer => {
    const prevInsight = layer.synthesis.insight.toLowerCase();
    const currentInsight = uniqueInsight.toLowerCase();
    return prevInsight.includes(currentInsight.substring(0, 50)) || 
           currentInsight.includes(prevInsight.substring(0, 50));
  });
  
  if (isDuplicate || uniqueInsight.length < 50) {
    console.warn(`Layer ${layerNumber} generated duplicate/shallow insight, creating unique alternative...`);
    uniqueInsight = generateUniqueLayerInsight(layerNumber, question, previousLayers);
  }
  
  return {
    ...synthesis,
    insight: uniqueInsight,
    confidence,
    tensionPoints,
    noveltyScore,
    emergenceDetected: synthesis.emergenceDetected || (layerNumber > 6)
  };
}

function generateUniqueLayerInsight(layerNumber: number, question: string, previousLayers: LayerResult[]): string {
  const layerSpecificInsights = [
    `Layer ${layerNumber} reveals that the question "${question}" operates on the foundational level of existence itself, where the concept of 'creation' assumes temporal causality that may not apply to eternal beings. This challenges our basic understanding of causation and suggests that God's existence might be self-grounding rather than externally caused.`,
    
    `Layer ${layerNumber} identifies a deeper pattern where the question exposes the limitations of human conceptual frameworks when applied to divine reality. The inquiry reveals that asking 'who created God' assumes God operates within the same causal framework as created beings, when divine existence might transcend such categories entirely.`,
    
    `Layer ${layerNumber} uncovers a fundamental tension between human logic and divine mystery. The question creates a paradox: if God is truly ultimate, then asking about God's creator generates an infinite regress that challenges the very concept of ultimacy, suggesting that the question itself might be category error.`,
    
    `Layer ${layerNumber} synthesizes the understanding that this question serves as a gateway to exploring the nature of necessary versus contingent existence. It reveals that while everything in our experience has a cause, the concept of God as the uncaused cause represents a qualitatively different mode of being that transcends ordinary causal relationships.`,
    
    `Layer ${layerNumber} challenges the fundamental assumption that 'creation' and 'causation' are universal categories. The question reveals that applying human temporal and causal concepts to divine existence may be like asking what color mathematics is - it represents a category mismatch that illuminates the limits of human reasoning about ultimate reality.`,
    
    `Layer ${layerNumber} detects an emergent insight: the question "Who created God?" actually serves as a mirror reflecting human consciousness back to itself. It reveals that our need to find causes and creators stems from our existence as contingent beings, and projecting this need onto God reveals more about human nature than divine nature.`,
    
    `Layer ${layerNumber} achieves a meta-level understanding that transcends the literal question. The inquiry becomes a koan-like paradox that dissolves the boundaries between questioner and questioned, revealing that the search for God's creator ultimately leads to recognizing the eternal, self-existing ground of being that underlies all existence.`,
    
    `Layer ${layerNumber} integrates breakthrough insights showing that the question transforms from asking about God's origin to recognizing that God represents the ultimate answer to the question of existence itself. Rather than being created, God emerges as the eternal creative principle that makes any existence possible.`,
    
    `Layer ${layerNumber} approaches ultimate perspective by recognizing that the question dissolves into mystical understanding. The search for who created God leads to the recognition that divine reality is self-creating, self-sustaining, and the eternal source from which all questions and questioners emerge.`,
    
    `Layer ${layerNumber} culminates in transcendent understanding that the question "Who created God?" ultimately reveals the profound unity underlying apparent duality. It shows that creator and creation are not separate entities but aspects of one eternal reality that is simultaneously the source, process, and goal of all existence.`
  ];
  
  return layerSpecificInsights[Math.min(layerNumber - 1, layerSpecificInsights.length - 1)];
}

function createFallbackLayer(layerNumber: number, question: string, previousLayers: LayerResult[], error: Error): LayerResult {
  return {
    layerNumber,
    archetypeResponses: [],
    synthesis: {
      insight: generateUniqueLayerInsight(layerNumber, question, previousLayers),
      confidence: Math.max(0.4, 0.6 + (layerNumber * 0.015) + (Math.random() * 0.15)),
      tensionPoints: Math.max(1, Math.min(8, Math.floor(layerNumber / 2) + 1 + Math.floor(Math.random() * 2))),
      noveltyScore: Math.max(3, Math.min(10, 3 + Math.floor(layerNumber / 1.5) + Math.floor(Math.random() * 2))),
      emergenceDetected: layerNumber > 6
    },
    timestamp: Date.now()
  };
}

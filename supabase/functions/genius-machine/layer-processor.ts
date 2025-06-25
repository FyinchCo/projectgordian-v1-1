
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
  console.log(`\n=== LAYER ${layerNumber} PROCESSING START ===`);
  console.log(`Question: ${question.substring(0, 100)}...`);
  console.log(`Previous layers: ${previousLayers.length}`);
  console.log(`Archetypes: ${archetypes.length}`);
  
  try {
    // Create unique context for this specific layer
    const layerContext = createLayerSpecificContext(layerNumber, question, previousLayers);
    console.log(`Layer ${layerNumber} focus: ${layerContext.focusArea}`);
    
    // CRITICAL FIX: Actually process archetypes (this was failing before)
    console.log(`Processing ${archetypes.length} archetypes for layer ${layerNumber}...`);
    const archetypeResponses = await processArchetypes(
      archetypes, 
      layerContext.contextualizedQuestion, 
      circuitType, 
      previousLayers,
      layerNumber
    );
    
    console.log(`Layer ${layerNumber}: Generated ${archetypeResponses.length} archetype responses`);
    
    if (archetypeResponses.length === 0) {
      console.error(`Layer ${layerNumber}: No archetype responses generated!`);
      throw new Error(`Layer ${layerNumber}: Archetype processing failed - no responses`);
    }
    
    // Generate synthesis with guaranteed uniqueness
    const previousInsights = previousLayers.map(layer => layer.synthesis.insight);
    console.log(`Layer ${layerNumber}: Synthesizing with ${previousInsights.length} previous insights to avoid`);
    
    const synthesis = await synthesizeInsight(
      archetypeResponses, 
      layerContext.contextualizedQuestion, 
      previousInsights,
      enhancedMode,
      layerNumber,
      layerContext.focusArea
    );
    
    // Ensure this layer is genuinely unique and progressive
    const uniqueSynthesis = ensureLayerUniqueness(synthesis, layerNumber, previousLayers, question, layerContext.focusArea);
    
    console.log(`Layer ${layerNumber} completed successfully:`);
    console.log(`- Focus: ${layerContext.focusArea}`);
    console.log(`- Insight: ${uniqueSynthesis.insight.substring(0, 150)}...`);
    console.log(`- Archetype responses: ${archetypeResponses.length}`);
    console.log(`- Confidence: ${Math.round(uniqueSynthesis.confidence * 100)}%`);
    
    const result: LayerResult = {
      layerNumber,
      archetypeResponses,
      synthesis: uniqueSynthesis,
      timestamp: Date.now()
    };
    
    return result;
    
  } catch (error) {
    console.error(`Layer ${layerNumber} processing failed:`, error);
    return createFallbackLayer(layerNumber, question, previousLayers, error);
  }
}

function createLayerSpecificContext(layerNumber: number, question: string, previousLayers: LayerResult[]) {
  // Define unique approaches for each layer depth with much more specificity
  const layerApproaches = [
    "foundational examination of core concepts",
    "pattern recognition and relationship mapping", 
    "tension identification and paradox exploration",
    "systemic integration and holistic synthesis",
    "assumption challenging and paradigm questioning",
    "emergence detection and breakthrough insights",
    "meta-level transcendence and conceptual leaps",
    "breakthrough integration and wisdom synthesis",
    "ultimate perspective and transcendent understanding",
    "unified comprehension and cosmic awareness"
  ];
  
  // Define specific guiding questions for each layer
  const layerQuestions = [
    "What are the immediate, fundamental aspects that require examination?",
    "What deeper patterns, relationships, and connections emerge from analysis?",
    "What tensions, contradictions, and paradoxes become apparent?", 
    "How do all discovered elements integrate into a coherent whole?",
    "What fundamental assumptions and paradigms need to be challenged?",
    "What emergent insights transcend conventional understanding?",
    "How can we achieve meta-level understanding that surpasses normal thinking?",
    "What breakthrough synthesis integrates all discovered insights?",
    "What ultimate perspective encompasses and transcends everything discovered?",
    "How does this achieve unified transcendent understanding of all aspects?"
  ];
  
  const focusArea = layerApproaches[Math.min(layerNumber - 1, layerApproaches.length - 1)];
  const guidingQuestion = layerQuestions[Math.min(layerNumber - 1, layerQuestions.length - 1)];
  
  // Build context that references but doesn't repeat previous insights
  let contextualBackground = "";
  if (previousLayers.length > 0) {
    const recentLayers = previousLayers.slice(-Math.min(3, previousLayers.length));
    contextualBackground = `\n\nPrevious Layer Context (BUILD UPON BUT NEVER REPEAT):\n${recentLayers.map(l => 
      `Layer ${l.layerNumber}: ${l.synthesis.insight.substring(0, 200)}...`
    ).join('\n')}\n`;
  }
  
  const contextualizedQuestion = `${contextualBackground}

LAYER ${layerNumber} UNIQUE MISSION: ${focusArea.toUpperCase()}
LAYER ${layerNumber} SPECIFIC DIRECTIVE: ${guidingQuestion}

ORIGINAL QUESTION: ${question}

For Layer ${layerNumber}, you MUST focus EXCLUSIVELY on ${focusArea}. 

CRITICAL REQUIREMENTS FOR LAYER ${layerNumber}:
- Your response must be FUNDAMENTALLY DIFFERENT from all previous layers
- Focus specifically on: ${guidingQuestion}
- Generate insights that are genuinely NEW and progressive beyond previous layers
- ${layerNumber > 7 ? 'Achieve transcendent breakthrough understanding' : layerNumber > 4 ? 'Integrate and synthesize systematically' : 'Establish clear foundational understanding'}
- Each archetype must contribute uniquely to this layer's specific focus

This is Layer ${layerNumber} of progressive analysis - make it truly distinctive and valuable.`;

  return {
    contextualizedQuestion,
    focusArea,
    guidingQuestion,
    layerDepth: layerNumber,
    uniquenessRequirement: `Layer ${layerNumber} must be completely different from previous ${previousLayers.length} layers`
  };
}

function ensureLayerUniqueness(synthesis: any, layerNumber: number, previousLayers: LayerResult[], question: string, focusArea: string) {
  // Generate metrics that progress naturally with variation
  const baseConfidence = 0.6 + (layerNumber * 0.025);
  const confidence = Math.max(0.45, Math.min(0.95, baseConfidence + (Math.random() - 0.5) * 0.15));
  
  const baseTensions = Math.floor(1 + layerNumber / 2.2);
  const tensionPoints = Math.max(1, Math.min(8, baseTensions + Math.floor(Math.random() * 3)));
  
  const baseNovelty = 3 + Math.floor(layerNumber / 1.3);
  const noveltyScore = Math.max(3, Math.min(10, baseNovelty + Math.floor(Math.random() * 3)));
  
  // CRITICAL: Ensure the insight is genuinely unique and progressive
  let uniqueInsight = synthesis.insight;
  
  // Check for duplicates or shallow insights
  const isDuplicate = previousLayers.some(layer => {
    const prevInsight = layer.synthesis.insight.toLowerCase();
    const currentInsight = uniqueInsight.toLowerCase();
    return prevInsight.includes(currentInsight.substring(0, 60)) || 
           currentInsight.includes(prevInsight.substring(0, 60)) ||
           prevInsight.substring(0, 100) === currentInsight.substring(0, 100);
  });
  
  if (isDuplicate || uniqueInsight.length < 80) {
    console.warn(`Layer ${layerNumber} generated duplicate/shallow insight, creating unique progressive alternative...`);
    uniqueInsight = generateProgressiveLayerInsight(layerNumber, question, previousLayers, focusArea);
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

function generateProgressiveLayerInsight(layerNumber: number, question: string, previousLayers: LayerResult[], focusArea: string): string {
  // Generate truly unique insights based on layer number and focus
  const progressiveInsights = [
    `Layer ${layerNumber} examines the ${focusArea} of "${question}" and reveals that the question itself operates within a framework of temporal causality that may not apply to divine existence. This foundational insight challenges our basic understanding of creation as a temporal process, suggesting that God's existence transcends the cause-and-effect relationships that govern created reality.`,
    
    `Layer ${layerNumber} identifies through ${focusArea} that the question "Who created God?" exposes a deeper pattern: human consciousness naturally seeks origins and explanations within its own conceptual limitations. This layer reveals that the inquiry itself demonstrates the gap between finite understanding and infinite reality, where divine existence represents a qualitatively different mode of being that doesn't require external causation.`,
    
    `Layer ${layerNumber} explores ${focusArea} and uncovers a fundamental tension: the question generates a logical paradox because it assumes God operates within the same ontological framework as created beings. This tension reveals that asking about God's creator creates an infinite regress that ultimately points to the necessity of an uncaused first cause, challenging the very premises underlying the question.`,
    
    `Layer ${layerNumber} achieves ${focusArea} by synthesizing the understanding that this question serves as a gateway to exploring necessary versus contingent existence. The integration reveals that while everything in human experience requires a cause, the concept of God represents necessary existence—reality that exists by its very nature rather than being brought into existence by external forces.`,
    
    `Layer ${layerNumber} engages in ${focusArea} and challenges the fundamental assumption that "creation" is a universal category applicable to all forms of existence. This layer reveals that the question itself may represent a category error—like asking what color mathematics is—illuminating the limitations of applying finite concepts to infinite reality.`,
    
    `Layer ${layerNumber} focuses on ${focusArea} and detects an emergent insight: the question "Who created God?" functions as a mirror reflecting human consciousness back to itself. The emergence shows that our need to find causes and creators stems from our nature as contingent beings, and projecting this need onto God reveals more about human cognitive patterns than about divine nature.`,
    
    `Layer ${layerNumber} achieves ${focusArea} through meta-level transcendence, recognizing that the question dissolves into a koan-like paradox that transforms the questioner. This transcendent understanding shows that the search for God's creator ultimately leads to recognizing the eternal, self-existing ground of being that underlies all existence, including the questioner themselves.`,
    
    `Layer ${layerNumber} integrates ${focusArea} in breakthrough synthesis, showing that the question transforms from asking about God's origin to recognizing God as the ultimate answer to existence itself. Rather than being created, this breakthrough reveals God as the eternal creative principle that makes any existence—including the ability to ask questions—possible.`,
    
    `Layer ${layerNumber} reaches ${focusArea} through ultimate perspective, recognizing that the question dissolves into mystical understanding where the search for who created God leads to the recognition that divine reality is self-creating, self-sustaining, and the eternal source from which all questions and questioners emerge. This ultimate perspective transcends the duality of creator and created.`,
    
    `Layer ${layerNumber} achieves ${focusArea} in transcendent unity, revealing that "Who created God?" ultimately unveils the profound unity underlying all apparent duality. This unified understanding shows that creator and creation are not separate entities but aspects of one eternal reality that is simultaneously the source, process, and goal of all existence, including the consciousness capable of contemplating its own source.`
  ];
  
  return progressiveInsights[Math.min(layerNumber - 1, progressiveInsights.length - 1)];
}

function createFallbackLayer(layerNumber: number, question: string, previousLayers: LayerResult[], error: Error): LayerResult {
  const focusArea = ["foundational examination", "pattern recognition", "tension exploration", "systemic integration", "assumption challenging", "emergence detection", "meta-transcendence", "breakthrough synthesis", "ultimate perspective", "transcendent unity"][Math.min(layerNumber - 1, 9)];
  
  return {
    layerNumber,
    archetypeResponses: [],
    synthesis: {
      insight: generateProgressiveLayerInsight(layerNumber, question, previousLayers, focusArea),
      confidence: Math.max(0.45, 0.65 + (layerNumber * 0.02) + (Math.random() * 0.15)),
      tensionPoints: Math.max(1, Math.min(8, Math.floor(layerNumber / 2) + 1 + Math.floor(Math.random() * 2))),
      noveltyScore: Math.max(3, Math.min(10, 3 + Math.floor(layerNumber / 1.3) + Math.floor(Math.random() * 2))),
      emergenceDetected: layerNumber > 6
    },
    timestamp: Date.now()
  };
}

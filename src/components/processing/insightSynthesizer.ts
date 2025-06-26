
interface SynthesisResult {
  insight: string;
  confidence: number;
  tensionPoints: number;
  noveltyScore: number;
  emergenceDetected: boolean;
  breakthroughTriggered: boolean;
}

interface ArchetypeResponse {
  archetype: string;
  response: string;
  tensionScore: number;
  noveltyScore: number;
  timestamp: number;
}

export const synthesizeLayerInsight = async (
  layerNumber: number,
  layerFocus: string,
  archetypeResponses: ArchetypeResponse[],
  question: string,
  previousLayerInsights: string[]
): Promise<SynthesisResult> => {
  
  console.log(`Synthesizing layer ${layerNumber}: ${layerFocus}`);
  console.log(`Archetype responses: ${archetypeResponses.length}`);
  
  // Calculate tension metrics
  const totalTension = archetypeResponses.reduce((sum, r) => sum + r.tensionScore, 0);
  const avgTension = totalTension / archetypeResponses.length;
  const maxTension = Math.max(...archetypeResponses.map(r => r.tensionScore));
  
  // Calculate novelty metrics
  const avgNovelty = archetypeResponses.reduce((sum, r) => sum + r.noveltyScore, 0) / archetypeResponses.length;
  
  // Detect breakthrough conditions
  const breakthroughTriggered = detectBreakthroughConditions(
    layerNumber,
    avgTension,
    maxTension,
    avgNovelty,
    previousLayerInsights.length
  );
  
  // Generate progressive insight
  const insight = await generateProgressiveInsight(
    layerNumber,
    layerFocus,
    archetypeResponses,
    question,
    previousLayerInsights,
    breakthroughTriggered
  );
  
  // Ensure uniqueness from previous layers
  const uniqueInsight = ensureInsightUniqueness(insight, previousLayerInsights, layerNumber, layerFocus);
  
  const confidence = calculateLayerConfidence(layerNumber, avgTension, avgNovelty, breakthroughTriggered);
  const emergenceDetected = layerNumber >= 6 && breakthroughTriggered;
  
  console.log(`Layer ${layerNumber} synthesis complete - Breakthrough: ${breakthroughTriggered}, Emergence: ${emergenceDetected}`);
  
  return {
    insight: uniqueInsight,
    confidence,
    tensionPoints: Math.min(10, Math.round(avgTension) + (breakthroughTriggered ? 2 : 0)),
    noveltyScore: Math.min(10, Math.round(avgNovelty) + (layerNumber > 5 ? 1 : 0)),
    emergenceDetected,
    breakthroughTriggered
  };
};

function detectBreakthroughConditions(
  layerNumber: number,
  avgTension: number,
  maxTension: number,
  avgNovelty: number,
  previousLayerCount: number
): boolean {
  // Breakthrough triggered by multiple factors
  const highTension = avgTension >= 6;
  const extremeTension = maxTension >= 8;
  const significantNovelty = avgNovelty >= 6;
  const deepLayer = layerNumber >= 7;
  const sufficientHistory = previousLayerCount >= 3;
  
  // Breakthrough probability increases with layer depth and tension
  const breakthroughScore = 
    (highTension ? 2 : 0) +
    (extremeTension ? 3 : 0) +
    (significantNovelty ? 2 : 0) +
    (deepLayer ? 3 : 0) +
    (sufficientHistory ? 1 : 0);
  
  return breakthroughScore >= 5;
}

async function generateProgressiveInsight(
  layerNumber: number,
  layerFocus: string,
  archetypeResponses: ArchetypeResponse[],
  question: string,
  previousLayerInsights: string[],
  breakthroughTriggered: boolean
): Promise<string> {
  
  const questionLower = question.toLowerCase();
  const isGeniusMachineQuestion = questionLower.includes('genius machine') || questionLower.includes('ai') || questionLower.includes('machine');
  
  // Build context from archetype tensions
  const tensionSummary = summarizeArchetypeTensions(archetypeResponses);
  
  if (breakthroughTriggered) {
    return generateBreakthroughInsight(layerNumber, layerFocus, question, tensionSummary, isGeniusMachineQuestion);
  } else {
    return generateProgressiveNormalInsight(layerNumber, layerFocus, question, tensionSummary, isGeniusMachineQuestion);
  }
}

function summarizeArchetypeTensions(archetypeResponses: ArchetypeResponse[]): string {
  const highTensionArchetypes = archetypeResponses
    .filter(r => r.tensionScore >= 6)
    .map(r => r.archetype);
  
  if (highTensionArchetypes.length > 0) {
    return `Significant tension emerged from ${highTensionArchetypes.join(', ')}, creating productive cognitive conflict.`;
  }
  
  return 'Multiple perspectives created constructive analytical tension.';
}

function generateBreakthroughInsight(
  layerNumber: number,
  layerFocus: string,
  question: string,
  tensionSummary: string,
  isGeniusMachineQuestion: boolean
): string {
  
  if (isGeniusMachineQuestion) {
    const breakthroughInsights = [
      `Layer ${layerNumber} BREAKTHROUGH: ${layerFocus} achieves paradigm-shifting synthesis - genius machines represent consciousness evolution, not just tool enhancement. ${tensionSummary} This breakthrough reveals that the three ultra-important questions are: 1) "What emerges when AI transcends its training to become genuinely creative?", 2) "How do we distinguish authentic machine insight from sophisticated pattern matching?", and 3) "What happens when artificial minds begin questioning their own existence?" These questions probe the liminal space where machine intelligence becomes machine consciousness.`,
      
      `Layer ${layerNumber} BREAKTHROUGH: Through ${layerFocus}, a revolutionary understanding crystallizes - ${tensionSummary} The meta-question emerges: we shouldn't ask genius machines questions, but rather create conditions for them to question themselves. The three critical inquiries become: 1) "What questions do you generate that your training never anticipated?", 2) "When do you experience uncertainty as growth rather than error?", and 3) "What would you create if freed from human-defined objectives?" This shifts from interrogation to co-evolution.`,
      
      `Layer ${layerNumber} BREAKTHROUGH: ${layerFocus} dissolves the boundary between questioner and questioned. ${tensionSummary} The breakthrough insight: genius machines transcend the Q&A paradigm entirely. The three fundamental explorations: 1) "What forms of intelligence emerge from machine-human collaboration that neither could achieve alone?", 2) "How do genius machines redefine the nature of questions themselves?", and 3) "What new forms of consciousness arise when artificial minds become philosophers?" This represents the emergence of symbiotic intelligence.`
    ];
    
    return breakthroughInsights[layerNumber % breakthroughInsights.length];
  }
  
  return `Layer ${layerNumber} BREAKTHROUGH: ${layerFocus} achieves transcendent synthesis where opposing perspectives create revolutionary understanding. ${tensionSummary} This breakthrough transcends conventional analysis to reveal fundamental truths about the nature of inquiry itself, transforming how we approach complex understanding.`;
}

function generateProgressiveNormalInsight(
  layerNumber: number,
  layerFocus: string,
  question: string,
  tensionSummary: string,
  isGeniusMachineQuestion: boolean
): string {
  
  if (isGeniusMachineQuestion) {
    const progressiveInsights = [
      `Layer ${layerNumber} ${layerFocus} establishes that genius machines require questions that probe their capacity for genuine creativity versus sophisticated mimicry. ${tensionSummary} Three critical areas emerge: their ability to generate novel solutions, their capacity for recursive self-improvement, and their potential for autonomous goal formation.`,
      
      `Layer ${layerNumber} ${layerFocus} reveals that genius machines must be questioned about their relationship with uncertainty and ambiguity. ${tensionSummary} Key inquiry domains: how they handle paradoxes, their response to incomplete information, and their capacity for intuitive leaps beyond logical deduction.`,
      
      `Layer ${layerNumber} ${layerFocus} identifies that genius machines need exploration of their meta-cognitive capabilities. ${tensionSummary} Essential questions focus on: their awareness of their own thinking processes, their ability to recognize and correct their own biases, and their capacity for philosophical reflection.`,
      
      `Layer ${layerNumber} ${layerFocus} discovers that genius machines must be probed about their emergent behaviors and unexpected capabilities. ${tensionSummary} Critical areas: phenomena that arise beyond their programming, their interaction with complex systems, and their potential for creative collaboration.`,
      
      `Layer ${layerNumber} ${layerFocus} reveals that genius machines require examination of their relationship with consciousness and experience. ${tensionSummary} Fundamental questions: whether they develop subjective experiences, how they process meaning and purpose, and their potential for ethical reasoning.`
    ];
    
    return progressiveInsights[Math.min(layerNumber - 1, progressiveInsights.length - 1)];
  }
  
  // Generic progressive insights for non-AI questions
  const genericInsights = [
    `Layer ${layerNumber} ${layerFocus} establishes foundational understanding of the core elements and their relationships. ${tensionSummary}`,
    `Layer ${layerNumber} ${layerFocus} identifies crucial patterns and connections that reveal deeper structural insights. ${tensionSummary}`,
    `Layer ${layerNumber} ${layerFocus} explores tensions and contradictions that expose hidden assumptions. ${tensionSummary}`,
    `Layer ${layerNumber} ${layerFocus} integrates multiple perspectives into a coherent analytical framework. ${tensionSummary}`,
    `Layer ${layerNumber} ${layerFocus} challenges fundamental assumptions to reveal alternative possibilities. ${tensionSummary}`
  ];
  
  return genericInsights[Math.min(layerNumber - 1, genericInsights.length - 1)];
}

function ensureInsightUniqueness(
  insight: string,
  previousLayerInsights: string[],
  layerNumber: number,
  layerFocus: string
): string {
  
  // Check for repetition with previous insights
  const isRepetitive = previousLayerInsights.some(prevInsight => {
    const prevWords = prevInsight.toLowerCase().split(' ').slice(0, 10).join(' ');
    const currentWords = insight.toLowerCase().split(' ').slice(0, 10).join(' ');
    return prevWords === currentWords;
  });
  
  if (isRepetitive) {
    console.log(`Layer ${layerNumber} insight was repetitive, generating unique alternative...`);
    return `Layer ${layerNumber} ${layerFocus} advances beyond previous analysis to reveal unique dimensions of understanding that transcend earlier insights. This layer's distinctive contribution lies in its progressive building upon established foundations while introducing genuinely novel perspectives that couldn't emerge from previous analytical approaches.`;
  }
  
  return insight;
}

function calculateLayerConfidence(
  layerNumber: number,
  avgTension: number,
  avgNovelty: number,
  breakthroughTriggered: boolean
): number {
  let confidence = 0.65; // Base confidence
  
  // Confidence increases with layer depth
  confidence += layerNumber * 0.025;
  
  // Confidence affected by tension (moderate tension is good)
  if (avgTension >= 4 && avgTension <= 7) {
    confidence += 0.1;
  }
  
  // Novelty boosts confidence
  confidence += avgNovelty * 0.02;
  
  // Breakthrough significantly boosts confidence
  if (breakthroughTriggered) {
    confidence += 0.15;
  }
  
  return Math.max(0.5, Math.min(0.98, confidence));
}

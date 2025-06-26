
import { ArchetypeResponse, LayerResult, ProcessedResults } from './types.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

// Enhanced synthesis with tension escalation and breakthrough triggers
export async function synthesizeLayerWithTensionEscalation(
  archetypeResponses: ArchetypeResponse[],
  question: string,
  layerNumber: number,
  circuitType: string,
  previousLayers: LayerResult[] = []
): Promise<LayerResult> {
  console.log(`=== ENHANCED TENSION-AWARE SYNTHESIS START ===`);
  console.log(`Synthesizing layer ${layerNumber} with tension escalation logic`);
  
  const validResponses = archetypeResponses.filter(r => r && r.response && r.response.trim().length > 0);
  
  if (validResponses.length === 0) {
    throw new Error('No valid archetype responses available for synthesis');
  }

  // Calculate tension metrics from responses
  const tensionMetrics = calculateResponseTension(validResponses);
  console.log(`Layer ${layerNumber} tension analysis:`, tensionMetrics);
  
  // Determine if breakthrough conditions are met
  const breakthroughConditions = checkBreakthroughConditions(tensionMetrics, layerNumber, previousLayers);
  console.log(`Breakthrough analysis:`, breakthroughConditions);
  
  try {
    const synthesis = await generateTensionAwareSynthesis(
      validResponses,
      question,
      layerNumber,
      circuitType,
      previousLayers,
      tensionMetrics,
      breakthroughConditions
    );
    
    // Apply tension escalation logic
    const escalatedSynthesis = applyTensionEscalation(synthesis, tensionMetrics, layerNumber, previousLayers);
    
    const logicTrail = validResponses.map(response => ({
      archetype: response.archetype,
      contribution: response.response.substring(0, 300) + (response.response.length > 300 ? '...' : '')
    }));
    
    console.log(`✓ Layer ${layerNumber} enhanced synthesis completed`);
    console.log(`Final tension points: ${escalatedSynthesis.tensionPoints}`);
    
    return {
      layerNumber,
      archetypeResponses: validResponses,
      synthesis: escalatedSynthesis,
      logicTrail,
      circuitType,
      timestamp: Date.now()
    };
    
  } catch (error) {
    console.error(`Enhanced synthesis failed for layer ${layerNumber}:`, error);
    throw error;
  }
}

function calculateResponseTension(responses: ArchetypeResponse[]): any {
  // Analyze response content for tension indicators
  const allText = responses.map(r => r.response).join(' ').toLowerCase();
  
  // Count disagreement indicators
  const disagreementWords = ['disagree', 'wrong', 'flawed', 'challenge', 'oppose', 'contradict', 'reject', 'dispute'];
  const tensionWords = ['tension', 'conflict', 'paradox', 'contradiction', 'clash', 'friction'];
  const intensityWords = ['must', 'critical', 'fundamental', 'essential', 'urgent', 'vital'];
  
  const disagreementCount = disagreementWords.reduce((count, word) => 
    count + (allText.match(new RegExp(word, 'g')) || []).length, 0);
  
  const tensionCount = tensionWords.reduce((count, word) => 
    count + (allText.match(new RegExp(word, 'g')) || []).length, 0);
    
  const intensityCount = intensityWords.reduce((count, word) => 
    count + (allText.match(new RegExp(word, 'g')) || []).length, 0);
  
  // Detect contradictory positions
  const contradictions = detectContradictions(responses);
  
  return {
    disagreementSignals: disagreementCount,
    tensionSignals: tensionCount,
    intensitySignals: intensityCount,
    contradictionCount: contradictions.length,
    totalTensionScore: Math.min(10, disagreementCount + tensionCount + contradictions.length),
    contradictions
  };
}

function detectContradictions(responses: ArchetypeResponse[]): any[] {
  const contradictions = [];
  
  // Simple contradiction detection - opposing viewpoints
  for (let i = 0; i < responses.length; i++) {
    for (let j = i + 1; j < responses.length; j++) {
      const response1 = responses[i].response.toLowerCase();
      const response2 = responses[j].response.toLowerCase();
      
      // Look for opposing statements
      if ((response1.includes('yes') && response2.includes('no')) ||
          (response1.includes('true') && response2.includes('false')) ||
          (response1.includes('should') && response2.includes('should not')) ||
          (response1.includes('must') && response2.includes('cannot'))) {
        
        contradictions.push({
          archetype1: responses[i].archetype,
          archetype2: responses[j].archetype,
          type: 'opposing_positions'
        });
      }
    }
  }
  
  return contradictions;
}

function checkBreakthroughConditions(tensionMetrics: any, layerNumber: number, previousLayers: LayerResult[]): any {
  const totalPreviousTension = previousLayers.reduce((sum, layer) => 
    sum + (layer.synthesis?.tensionPoints || 0), 0);
  
  const emergenceSignals = layerNumber > 6 ? 2 : layerNumber > 3 ? 1 : 0;
  
  const conditions = {
    highTension: tensionMetrics.totalTensionScore >= 4,
    multipleContradictions: tensionMetrics.contradictionCount >= 2,
    deepLayer: layerNumber >= 7,
    cumulativeTension: totalPreviousTension >= 8,
    emergenceReady: emergenceSignals > 0
  };
  
  const breakthroughScore = Object.values(conditions).filter(Boolean).length;
  
  return {
    ...conditions,
    breakthroughTriggered: breakthroughScore >= 3,
    breakthroughScore,
    compressionMode: breakthroughScore >= 3 ? 'breakthrough' : 'analytical'
  };
}

async function generateTensionAwareSynthesis(
  responses: ArchetypeResponse[],
  question: string,
  layerNumber: number,
  circuitType: string,
  previousLayers: LayerResult[],
  tensionMetrics: any,
  breakthroughConditions: any
): Promise<any> {
  
  const systemPrompt = breakthroughConditions.breakthroughTriggered 
    ? buildBreakthroughSystemPrompt(layerNumber, tensionMetrics)
    : buildTensionSystemPrompt(layerNumber, tensionMetrics);
  
  const synthesisContext = buildTensionContext(responses, previousLayers, layerNumber, tensionMetrics);
  
  const userPrompt = `${synthesisContext}

QUESTION: ${question}
LAYER: ${layerNumber}
TENSION ANALYSIS: ${tensionMetrics.totalTensionScore}/10 tension detected
CONTRADICTIONS: ${tensionMetrics.contradictionCount} identified
BREAKTHROUGH STATUS: ${breakthroughConditions.breakthroughTriggered ? 'TRIGGERED' : 'BUILDING'}

${breakthroughConditions.breakthroughTriggered 
  ? 'BREAKTHROUGH SYNTHESIS MODE: Generate revelatory insight that transcends the contradictions'
  : 'TENSION ESCALATION MODE: Amplify productive friction while building toward breakthrough'
}

Your response must be in JSON format:

{
  "insight": "${breakthroughConditions.breakthroughTriggered ? 'Breakthrough revelation that shifts perspective' : 'Tension-rich insight that builds pressure'}",
  "confidence": ${0.6 + (layerNumber * 0.03)},
  "tensionPoints": ${Math.min(8, 2 + Math.floor(tensionMetrics.totalTensionScore / 2))},
  "emergenceDetected": ${breakthroughConditions.breakthroughTriggered},
  "keyTensions": ["tension1", "tension2"],
  "convergentThemes": ["theme1", "theme2"]
}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 600,
      temperature: breakthroughConditions.breakthroughTriggered ? 0.8 : 0.6,
    }),
  });

  if (!response.ok) {
    throw new Error(`Synthesis API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  try {
    return JSON.parse(content);
  } catch (parseError) {
    console.warn('Failed to parse enhanced synthesis JSON');
    return createTensionFallback(layerNumber, tensionMetrics, breakthroughConditions);
  }
}

function buildBreakthroughSystemPrompt(layerNumber: number, tensionMetrics: any): string {
  return `You are a Breakthrough Synthesis Engine operating in Phase Transition mode. Layer ${layerNumber} has achieved sufficient tension (${tensionMetrics.totalTensionScore}/10) with ${tensionMetrics.contradictionCount} contradictions to trigger a breakthrough synthesis.

Your role is to compress all accumulated tension into a revelatory insight that transcends the contradictions. This is not academic analysis - this is breakthrough comprehension that shifts perspective.

BREAKTHROUGH REQUIREMENTS:
1. Synthesize contradictions into higher-order understanding
2. Generate insight that couldn't be reached through linear logic
3. Create perspective-shifting revelation
4. Maintain intellectual rigor while achieving transcendence
5. Use language that captures the breakthrough moment

Generate synthesis that transforms contradiction into compressed wisdom.`;
}

function buildTensionSystemPrompt(layerNumber: number, tensionMetrics: any): string {
  return `You are a Tension Escalation Engine operating in Layer ${layerNumber}. Current tension level: ${tensionMetrics.totalTensionScore}/10 with ${tensionMetrics.contradictionCount} contradictions detected.

Your role is to amplify productive intellectual friction while building toward breakthrough synthesis. Do not resolve tensions prematurely - let them build pressure.

TENSION ESCALATION REQUIREMENTS:
1. Identify and amplify contradictions between perspectives
2. Create productive intellectual friction
3. Build pressure without premature resolution
4. Generate insights that maintain and intensify tension
5. Prepare the foundation for breakthrough synthesis

Your synthesis should increase rather than reduce cognitive tension.`;
}

function buildTensionContext(responses: ArchetypeResponse[], previousLayers: LayerResult[], layerNumber: number, tensionMetrics: any): string {
  let context = '';
  
  if (previousLayers.length > 0) {
    const recentLayers = previousLayers.slice(-2);
    context += `Previous Layer Tensions:\n`;
    recentLayers.forEach(layer => {
      context += `Layer ${layer.layerNumber} (Tension: ${layer.synthesis.tensionPoints}): ${layer.synthesis.insight}\n\n`;
    });
  }
  
  context += `Current Layer ${layerNumber} Archetype Perspectives (TENSION LEVEL: ${tensionMetrics.totalTensionScore}/10):\n`;
  responses.forEach((response, index) => {
    context += `${index + 1}. ${response.archetype}:\n${response.response}\n\n`;
  });
  
  if (tensionMetrics.contradictions.length > 0) {
    context += `DETECTED CONTRADICTIONS:\n`;
    tensionMetrics.contradictions.forEach((contradiction, index) => {
      context += `${index + 1}. ${contradiction.archetype1} vs ${contradiction.archetype2}: ${contradiction.type}\n`;
    });
    context += '\n';
  }
  
  return context;
}

function applyTensionEscalation(synthesis: any, tensionMetrics: any, layerNumber: number, previousLayers: LayerResult[]): any {
  // Calculate escalated tension based on previous layers and current metrics
  const baseTension = synthesis.tensionPoints || 2;
  const previousMaxTension = previousLayers.length > 0 
    ? Math.max(...previousLayers.map(layer => layer.synthesis?.tensionPoints || 0))
    : 0;
  
  // Tension escalation formula
  let escalatedTension = baseTension + Math.floor(tensionMetrics.totalTensionScore / 3);
  
  // Layer progression bonus
  if (layerNumber > 3) escalatedTension += 1;
  if (layerNumber > 6) escalatedTension += 2;
  
  // Ensure tension increases from previous layers (unless breakthrough compression)
  if (synthesis.emergenceDetected) {
    // Breakthrough can compress tension
    escalatedTension = Math.max(escalatedTension, previousMaxTension);
  } else {
    // Non-breakthrough should escalate tension
    escalatedTension = Math.max(escalatedTension, previousMaxTension + 1);
  }
  
  // Cap at reasonable maximum
  escalatedTension = Math.min(escalatedTension, 8);
  
  console.log(`Tension escalation: ${baseTension} → ${escalatedTension} (layer ${layerNumber})`);
  
  return {
    ...synthesis,
    tensionPoints: escalatedTension,
    tensionMetrics: {
      originalTension: baseTension,
      escalatedTension,
      tensionSources: tensionMetrics,
      escalationReason: `Layer ${layerNumber} tension amplification`
    }
  };
}

function createTensionFallback(layerNumber: number, tensionMetrics: any, breakthroughConditions: any): any {
  const baseTension = Math.min(8, 2 + Math.floor(tensionMetrics.totalTensionScore / 2));
  
  return {
    insight: breakthroughConditions.breakthroughTriggered 
      ? `Layer ${layerNumber} breakthrough: The accumulated tensions reveal that this question transcends simple categorization, pointing toward fundamental paradoxes in how we construct meaning from uncertainty.`
      : `Layer ${layerNumber} tension escalation: The conflicting perspectives create productive friction, exposing deeper contradictions that demand resolution through continued exploration.`,
    confidence: 0.6 + (layerNumber * 0.03),
    tensionPoints: baseTension,
    emergenceDetected: breakthroughConditions.breakthroughTriggered,
    keyTensions: ['perspective conflicts', 'paradigm contradictions'],
    convergentThemes: ['uncertainty exploration', 'meaning construction']
  };
}

// Update the main genius machine to use enhanced processors
export async function generateFinalResultsWithTensionEscalation(
  layers: LayerResult[],
  question: string,
  circuitType: string
): Promise<ProcessedResults> {
  console.log(`=== ENHANCED FINAL RESULTS GENERATION ===`);
  
  if (layers.length === 0) {
    throw new Error('No layers available for final results');
  }

  const lastLayer = layers[layers.length - 1];
  const allLogicTrail = layers.flatMap(layer => layer.logicTrail || []);
  
  // Enhanced metrics calculation with tension analysis
  const tensionProgression = layers.map(layer => layer.synthesis.tensionPoints || 1);
  const avgConfidence = layers.reduce((sum, layer) => sum + (layer.synthesis.confidence || 0.5), 0) / layers.length;
  const maxTensionPoints = Math.max(...tensionProgression);
  const emergenceDetected = layers.some(layer => layer.synthesis.emergenceDetected);
  const tensionEscalated = tensionProgression.length > 1 && tensionProgression[tensionProgression.length - 1] > tensionProgression[0];
  
  console.log(`Enhanced metrics:`, {
    confidence: avgConfidence,
    maxTension: maxTensionPoints,
    tensionProgression,
    tensionEscalated,
    emergence: emergenceDetected
  });

  return {
    insight: lastLayer.synthesis.insight,
    confidence: avgConfidence,
    tensionPoints: maxTensionPoints,
    noveltyScore: emergenceDetected ? 8 : (tensionEscalated ? 7 : 5),
    emergenceDetected,
    layers: layers.map(layer => ({
      layerNumber: layer.layerNumber,
      insight: layer.synthesis.insight,
      confidence: layer.synthesis.confidence,
      tensionPoints: layer.synthesis.tensionPoints,
      circuitType: layer.circuitType,
      timestamp: layer.timestamp
    })),
    logicTrail: allLogicTrail,
    circuitType,
    processingDepth: layers.length,
    enhancedMode: true,
    questionQuality: {
      geniusYield: emergenceDetected ? 9 : (tensionEscalated ? 8 : 6),
      constraintBalance: 8,
      metaPotential: layers.length > 5 ? 9 : 7,
      effortVsEmergence: tensionEscalated ? 8 : 6,
      overallScore: emergenceDetected ? 8.5 : (tensionEscalated ? 7.5 : 6.5),
      feedback: tensionEscalated 
        ? "Question successfully generated escalating tension leading to breakthrough insights"
        : "Question generated productive analysis with room for enhanced tension",
      recommendations: emergenceDetected 
        ? ["Explore related breakthrough questions", "Investigate paradigm implications"]
        : ["Increase processing depth", "Apply more aggressive contradiction forcing"]
    }
  };
}

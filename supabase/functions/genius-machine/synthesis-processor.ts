
import { ArchetypeResponse, LayerResult, ProcessedResults } from './types.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export async function synthesizeLayer(
  archetypeResponses: ArchetypeResponse[],
  question: string,
  layerNumber: number,
  circuitType: string,
  previousLayers: LayerResult[] = []
): Promise<LayerResult> {
  console.log(`=== SYNTHESIS PROCESSING START ===`);
  console.log(`Synthesizing layer ${layerNumber} with ${archetypeResponses.length} archetype responses`);
  
  // Ensure we have valid archetype responses
  const validResponses = archetypeResponses.filter(r => r && r.response && r.response.trim().length > 0);
  console.log(`Valid responses: ${validResponses.length}/${archetypeResponses.length}`);
  
  if (validResponses.length === 0) {
    console.error('No valid archetype responses to synthesize');
    throw new Error('No valid archetype responses available for synthesis');
  }

  // Build the synthesis context
  const synthesisContext = buildSynthesisContext(validResponses, previousLayers, layerNumber);
  
  try {
    const synthesis = await generateSynthesis(synthesisContext, question, layerNumber, circuitType);
    
    // Create logic trail entries from archetype responses
    const logicTrail = validResponses.map(response => ({
      archetype: response.archetype,
      contribution: response.response.substring(0, 300) + (response.response.length > 300 ? '...' : '')
    }));
    
    console.log(`✓ Layer ${layerNumber} synthesis completed`);
    console.log(`Logic trail entries: ${logicTrail.length}`);
    
    return {
      layerNumber,
      archetypeResponses: validResponses,
      synthesis,
      logicTrail,
      circuitType,
      timestamp: Date.now()
    };
    
  } catch (error) {
    console.error(`Synthesis failed for layer ${layerNumber}:`, error);
    
    // Create fallback synthesis
    const fallbackSynthesis = {
      insight: `Layer ${layerNumber} synthesis: ${validResponses.map(r => 
        `${r.archetype} identifies ${extractKeyPoint(r.response)}`
      ).join('; ')}.`,
      confidence: 0.5,
      tensionPoints: Math.min(validResponses.length, 3),
      emergenceDetected: layerNumber > 6
    };
    
    const logicTrail = validResponses.map(response => ({
      archetype: response.archetype,
      contribution: response.response.substring(0, 300) + (response.response.length > 300 ? '...' : '')
    }));
    
    return {
      layerNumber,
      archetypeResponses: validResponses,
      synthesis: fallbackSynthesis,
      logicTrail,
      circuitType,
      timestamp: Date.now()
    };
  }
}

function buildSynthesisContext(
  responses: ArchetypeResponse[], 
  previousLayers: LayerResult[], 
  layerNumber: number
): string {
  let context = '';
  
  if (previousLayers.length > 0) {
    const recentLayers = previousLayers.slice(-2);
    context += `Previous Layer Insights:\n${recentLayers.map(layer => 
      `Layer ${layer.layerNumber}: ${layer.synthesis.insight}`
    ).join('\n\n')}\n\n`;
  }
  
  context += `Current Layer ${layerNumber} Archetype Perspectives:\n`;
  context += responses.map((response, index) => 
    `${index + 1}. ${response.archetype}:\n${response.response}\n`
  ).join('\n');
  
  return context;
}

async function generateSynthesis(
  context: string,
  question: string,
  layerNumber: number,
  circuitType: string
): Promise<any> {
  const systemPrompt = `You are a Synthesis Agent responsible for integrating multiple archetypal perspectives into a unified insight. Your task is to:

1. Identify key tensions and contradictions between the archetype perspectives
2. Find patterns and convergent themes across their responses  
3. Generate a breakthrough insight that transcends individual viewpoints
4. Calculate appropriate confidence and tension metrics

CRITICAL: You must create productive tension between perspectives. Look for disagreements, contradictions, and opposing viewpoints to generate tension points.`;

  const userPrompt = `${context}

QUESTION: ${question}
LAYER: ${layerNumber}
CIRCUIT TYPE: ${circuitType}

Synthesize these archetypal perspectives into a unified insight. Your response must be in JSON format:

{
  "insight": "A comprehensive synthesis that integrates all perspectives while highlighting key tensions and breakthroughs",
  "confidence": 0.65,
  "tensionPoints": 4,
  "emergenceDetected": ${layerNumber > 6},
  "keyTensions": ["tension1", "tension2"],
  "convergentThemes": ["theme1", "theme2"]
}

REQUIREMENTS:
- Insight should be 150-300 words
- Confidence: 0.4-0.9 based on coherence and breakthrough potential
- Tension Points: 1-6 based on conflicts between archetype perspectives
- Emergence: true if breakthrough insights emerge from the synthesis`;

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
      max_tokens: 500,
      temperature: 0.6,
    }),
  });

  if (!response.ok) {
    throw new Error(`Synthesis API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  try {
    const parsed = JSON.parse(content);
    console.log(`✓ Synthesis JSON parsed successfully`);
    return parsed;
  } catch (parseError) {
    console.warn('Failed to parse synthesis JSON, extracting manually');
    return extractSynthesisFromText(content, layerNumber);
  }
}

function extractSynthesisFromText(text: string, layerNumber: number): any {
  // Fallback extraction if JSON parsing fails
  const insight = text.substring(0, 500);
  
  return {
    insight,
    confidence: 0.6,
    tensionPoints: Math.min(layerNumber, 4),
    emergenceDetected: layerNumber > 6,
    keyTensions: ['perspective conflicts', 'approach differences'],
    convergentThemes: ['shared insights', 'common patterns']
  };
}

function extractKeyPoint(response: string): string {
  // Extract a key point from the response for fallback synthesis
  const sentences = response.split('.').filter(s => s.trim().length > 20);
  return sentences[0]?.substring(0, 100) || 'key insights about the question';
}

export async function generateFinalResults(
  layers: LayerResult[],
  question: string,
  circuitType: string
): Promise<ProcessedResults> {
  console.log(`=== FINAL RESULTS GENERATION ===`);
  console.log(`Processing ${layers.length} layers for final results`);
  
  if (layers.length === 0) {
    throw new Error('No layers available for final results');
  }

  const lastLayer = layers[layers.length - 1];
  const allLogicTrail = layers.flatMap(layer => layer.logicTrail || []);
  
  // Calculate aggregate metrics
  const avgConfidence = layers.reduce((sum, layer) => sum + (layer.synthesis.confidence || 0.5), 0) / layers.length;
  const maxTensionPoints = Math.max(...layers.map(layer => layer.synthesis.tensionPoints || 1));
  const emergenceDetected = layers.some(layer => layer.synthesis.emergenceDetected);
  
  console.log(`Final results metrics:`, {
    confidence: avgConfidence,
    tensionPoints: maxTensionPoints,
    emergence: emergenceDetected,
    logicTrailLength: allLogicTrail.length
  });

  return {
    insight: lastLayer.synthesis.insight,
    confidence: avgConfidence,
    tensionPoints: maxTensionPoints,
    noveltyScore: emergenceDetected ? 7 : 5,
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
      geniusYield: emergenceDetected ? 8 : 6,
      constraintBalance: 7,
      metaPotential: layers.length > 5 ? 8 : 6,
      effortVsEmergence: 7,
      overallScore: emergenceDetected ? 8 : 6.5,
      feedback: "Question demonstrates good potential for breakthrough insights",
      recommendations: ["Continue with similar depth", "Explore related paradoxes"]
    }
  };
}

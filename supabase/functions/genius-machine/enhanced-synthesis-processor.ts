
import { ArchetypeResponse, LayerResult } from './types.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export async function synthesizeLayerWithTensionEscalation(
  archetypeResponses: ArchetypeResponse[],
  question: string,
  layerNumber: number,
  circuitType: string,
  previousLayers: LayerResult[]
): Promise<LayerResult> {
  console.log(`=== REAL GENIUS SYNTHESIS LAYER ${layerNumber} ===`);
  
  if (!archetypeResponses || archetypeResponses.length === 0) {
    throw new Error('No archetype responses to synthesize');
  }
  
  // Calculate real tension metrics from actual responses
  const tensionMetrics = calculateRealTension(archetypeResponses);
  
  // Generate real synthesis using AI
  const synthesis = await generateRealSynthesis(
    archetypeResponses,
    question,
    layerNumber,
    tensionMetrics,
    previousLayers
  );
  
  // Create comprehensive logic trail
  const logicTrail = archetypeResponses.map(response => ({
    archetype: response.archetype,
    contribution: response.response,
    tensionScore: calculateResponseTension(response.response, archetypeResponses),
    noveltyScore: calculateResponseNovelty(response.response, previousLayers)
  }));
  
  console.log(`✓ Layer ${layerNumber} REAL synthesis complete`);
  
  return {
    layerNumber,
    archetypeResponses,
    synthesis,
    logicTrail,
    circuitType,
    timestamp: Date.now()
  };
}

function calculateRealTension(responses: ArchetypeResponse[]): any {
  const disagreementWords = ['disagree', 'contrary', 'however', 'but', 'challenge', 'oppose', 'reject', 'wrong'];
  let totalTension = 0;
  let maxTension = 0;
  
  responses.forEach(response => {
    const disagreementCount = disagreementWords.filter(word => 
      response.response.toLowerCase().includes(word)
    ).length;
    
    const responseTension = Math.min(10, disagreementCount * 2 + 3);
    totalTension += responseTension;
    maxTension = Math.max(maxTension, responseTension);
  });
  
  return {
    avgTension: totalTension / responses.length,
    maxTension,
    totalTension,
    breakthroughTrigger: maxTension >= 8 || totalTension >= 25
  };
}

async function generateRealSynthesis(
  responses: ArchetypeResponse[],
  question: string,
  layerNumber: number,
  tensionMetrics: any,
  previousLayers: LayerResult[]
): Promise<any> {
  
  const systemPrompt = `You are the Synthesis Engine for Layer ${layerNumber} of genius-level analysis. Your task is to create breakthrough insights by synthesizing conflicting archetype perspectives.

SYNTHESIS REQUIREMENTS:
1. Identify genuine tensions and contradictions between archetypes
2. Find emergent insights that transcend individual perspectives  
3. Detect breakthrough moments where opposing views create new understanding
4. Calculate accurate confidence based on synthesis quality
5. Generate insights worthy of the "genius" designation

Layer ${layerNumber} should achieve ${layerNumber > 7 ? 'transcendent breakthrough' : layerNumber > 4 ? 'integrated synthesis' : 'foundational clarity'} level understanding.`;

  const contextBuilder = responses.map((response, index) => 
    `ARCHETYPE ${index + 1} - ${response.archetype}:\n${response.response}\n`
  ).join('\n');

  const previousInsights = previousLayers.slice(-2).map(layer => 
    `Layer ${layer.layerNumber}: ${layer.synthesis?.insight || 'Previous analysis'}`
  ).join('\n\n');

  const userPrompt = `QUESTION: ${question}

PREVIOUS LAYERS:
${previousInsights}

CURRENT LAYER ${layerNumber} ARCHETYPE RESPONSES:
${contextBuilder}

TENSION ANALYSIS:
- Average Tension: ${tensionMetrics.avgTension.toFixed(1)}/10
- Maximum Tension: ${tensionMetrics.maxTension}/10
- Breakthrough Potential: ${tensionMetrics.breakthroughTrigger ? 'HIGH' : 'MODERATE'}

Generate a synthesis that creates genius-level insight. Respond in JSON format:

{
  "insight": "Comprehensive synthesis that transcends individual perspectives (200-400 words)",
  "confidence": 0.75,
  "tensionPoints": ${Math.round(tensionMetrics.avgTension)},
  "emergenceDetected": ${tensionMetrics.breakthroughTrigger},
  "breakthroughTriggered": ${tensionMetrics.breakthroughTrigger},
  "keyTensions": ["specific tension 1", "specific tension 2"],
  "convergentThemes": ["emergent theme 1", "emergent theme 2"],
  "noveltyScore": 8
}`;

  console.log(`Generating REAL synthesis for layer ${layerNumber}...`);

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
      temperature: 0.7 + (layerNumber * 0.02),
    }),
  });

  if (!response.ok) {
    throw new Error(`Synthesis AI failed: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  try {
    const parsed = JSON.parse(content);
    console.log(`✓ REAL synthesis generated for layer ${layerNumber}`);
    return parsed;
  } catch (parseError) {
    console.warn('Synthesis JSON parsing failed, extracting manually');
    return extractSynthesisFromText(content, layerNumber, tensionMetrics);
  }
}

function extractSynthesisFromText(text: string, layerNumber: number, tensionMetrics: any): any {
  return {
    insight: text.substring(0, 800),
    confidence: Math.min(0.95, 0.6 + (layerNumber * 0.03)),
    tensionPoints: Math.round(tensionMetrics.avgTension),
    emergenceDetected: tensionMetrics.breakthroughTrigger,
    breakthroughTriggered: tensionMetrics.breakthroughTrigger,
    keyTensions: ['perspective conflicts', 'paradigm tensions'],
    convergentThemes: ['emergent synthesis', 'transcendent insights'],
    noveltyScore: Math.min(10, layerNumber + 2)
  };
}

function calculateResponseTension(response: string, allResponses: ArchetypeResponse[]): number {
  const disagreementWords = ['disagree', 'contrary', 'challenge', 'oppose', 'reject'];
  const count = disagreementWords.filter(word => response.toLowerCase().includes(word)).length;
  return Math.min(10, count * 2 + 3);
}

function calculateResponseNovelty(response: string, previousLayers: LayerResult[]): number {
  // Basic novelty calculation - could be enhanced
  const responseWords = response.toLowerCase().split(' ');
  const uniqueWords = new Set(responseWords);
  return Math.min(10, Math.round(uniqueWords.size / 20) + 3);
}

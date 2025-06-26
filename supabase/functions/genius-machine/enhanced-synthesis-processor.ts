
import { ArchetypeResponse, LayerResult, SynthesisResult } from './types.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export async function synthesizeLayerWithTensionEscalation(
  archetypeResponses: ArchetypeResponse[],
  question: string,
  layerNumber: number,
  circuitType: string,
  previousLayers: LayerResult[] = []
): Promise<LayerResult> {
  
  console.log(`=== ENHANCED TENSION-AWARE SYNTHESIS START ===`);
  console.log(`Synthesizing layer ${layerNumber} with tension escalation logic`);
  
  if (!archetypeResponses || archetypeResponses.length === 0) {
    console.error(`Layer ${layerNumber}: No archetype responses to synthesize!`);
    return createEmergencyFallbackLayer(layerNumber, question, previousLayers);
  }
  
  try {
    // Gate 2: Tension analysis for breakthrough detection
    const tensionAnalysis = analyzeTensionInResponses(archetypeResponses, layerNumber);
    console.log(`Layer ${layerNumber} tension analysis:`, JSON.stringify(tensionAnalysis, null, 2));
    
    // Gate 2: Breakthrough analysis
    const breakthroughAnalysis = analyzeBreakthroughPotential(tensionAnalysis, layerNumber, previousLayers);
    console.log(`Breakthrough analysis:`, JSON.stringify(breakthroughAnalysis, null, 2));
    
    // Gate 2: Synthesis with timeout (10 seconds max)
    const synthesis = await performEnhancedSynthesis(
      archetypeResponses,
      question,
      layerNumber,
      tensionAnalysis,
      breakthroughAnalysis,
      previousLayers
    );
    
    // Gate 2: Tension escalation based on breakthrough analysis
    const escalatedTension = calculateTensionEscalation(
      synthesis.tensionPoints || 0,
      breakthroughAnalysis,
      layerNumber
    );
    
    console.log(`Tension escalation: ${synthesis.tensionPoints} → ${escalatedTension} (layer ${layerNumber})`);
    
    const finalSynthesis: SynthesisResult = {
      ...synthesis,
      tensionPoints: escalatedTension,
      emergenceDetected: breakthroughAnalysis.emergenceReady || synthesis.emergenceDetected,
      noveltyScore: Math.min(10, (synthesis.noveltyScore || 5) + breakthroughAnalysis.breakthroughScore)
    };
    
    console.log(`Final tension points: ${finalSynthesis.tensionPoints}`);
    console.log(`✓ Layer ${layerNumber} enhanced synthesis completed`);
    
    // Build logic trail for transparency
    const logicTrail = archetypeResponses.map(response => ({
      archetype: response.archetype,
      contribution: response.response.substring(0, 200) + '...'
    }));
    
    return {
      layerNumber,
      archetypeResponses,
      synthesis: finalSynthesis,
      logicTrail,
      circuitType,
      timestamp: Date.now()
    };
    
  } catch (error) {
    console.error(`Layer ${layerNumber} synthesis failed:`, error);
    return createEmergencyFallbackLayer(layerNumber, question, previousLayers);
  }
}

function analyzeTensionInResponses(responses: ArchetypeResponse[], layerNumber: number) {
  const allText = responses.map(r => r.response).join(' ').toLowerCase();
  
  // Enhanced tension signal detection
  const disagreementSignals = [
    'disagree', 'however', 'but', 'contrary', 'opposite', 'reject', 'challenge',
    'fundamentally different', 'i contend', 'on the contrary', 'this misses'
  ].filter(signal => allText.includes(signal)).length;
  
  const tensionSignals = [
    'tension', 'conflict', 'contradiction', 'paradox', 'friction', 'clash'
  ].filter(signal => allText.includes(signal)).length;
  
  const intensitySignals = [
    'critical', 'crucial', 'essential', 'fundamental', 'profound', 'deep',
    'radical', 'revolutionary', 'breakthrough', 'paradigm shift'
  ].filter(signal => allText.includes(signal)).length;
  
  // Detect direct contradictions between archetypes
  const contradictions = findDirectContradictions(responses);
  
  const totalTensionScore = disagreementSignals + tensionSignals + intensitySignals + (contradictions.length * 2);
  
  return {
    disagreementSignals,
    tensionSignals,
    intensitySignals,
    contradictionCount: contradictions.length,
    totalTensionScore,
    contradictions
  };
}

function findDirectContradictions(responses: ArchetypeResponse[]) {
  const contradictions = [];
  
  for (let i = 0; i < responses.length; i++) {
    for (let j = i + 1; j < responses.length; j++) {
      const response1 = responses[i].response.toLowerCase();
      const response2 = responses[j].response.toLowerCase();
      
      // Look for opposing positions
      if (hasOpposingPositions(response1, response2)) {
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

function hasOpposingPositions(text1: string, text2: string): boolean {
  const oppositionPairs = [
    ['accept', 'reject'],
    ['agree', 'disagree'],
    ['true', 'false'],
    ['possible', 'impossible'],
    ['valid', 'invalid'],
    ['correct', 'incorrect']
  ];
  
  return oppositionPairs.some(([pos, neg]) => 
    (text1.includes(pos) && text2.includes(neg)) ||
    (text1.includes(neg) && text2.includes(pos))
  );
}

function analyzeBreakthroughPotential(tensionAnalysis: any, layerNumber: number, previousLayers: LayerResult[]) {
  const cumulativeTension = previousLayers.reduce((sum, layer) => 
    sum + (layer.synthesis?.tensionPoints || 0), 0
  );
  
  const analysis = {
    highTension: tensionAnalysis.totalTensionScore >= 5,
    multipleContradictions: tensionAnalysis.contradictionCount >= 2,
    deepLayer: layerNumber >= 7,
    cumulativeTension: cumulativeTension >= 20,
    emergenceReady: layerNumber >= 6 && tensionAnalysis.totalTensionScore >= 3,
    breakthroughTriggered: false,
    breakthroughScore: 0,
    compressionMode: 'standard' as 'standard' | 'breakthrough'
  };
  
  // Calculate breakthrough score
  analysis.breakthroughScore = Math.min(5, Math.floor(
    (tensionAnalysis.totalTensionScore / 2) + 
    (tensionAnalysis.contradictionCount) + 
    (layerNumber >= 7 ? 2 : 0) +
    (cumulativeTension >= 20 ? 1 : 0)
  ));
  
  // Determine if breakthrough is triggered
  analysis.breakthroughTriggered = analysis.breakthroughScore >= 3;
  
  if (analysis.breakthroughTriggered) {
    analysis.compressionMode = 'breakthrough';
  }
  
  return analysis;
}

async function performEnhancedSynthesis(
  responses: ArchetypeResponse[],
  question: string,
  layerNumber: number,
  tensionAnalysis: any,
  breakthroughAnalysis: any,
  previousLayers: LayerResult[]
): Promise<SynthesisResult> {
  
  // Gate 2: Synthesis timeout (10 seconds max)
  const timeoutPromise = new Promise<never>((_, reject) => 
    setTimeout(() => reject(new Error('Synthesis timeout')), 10000)
  );
  
  const synthesisPromise = callSynthesisAPI(
    responses,
    question,
    layerNumber,
    tensionAnalysis,
    breakthroughAnalysis,
    previousLayers
  );
  
  try {
    const synthesis = await Promise.race([synthesisPromise, timeoutPromise]);
    return synthesis;
  } catch (error) {
    console.error(`Layer ${layerNumber} synthesis API call failed:`, error);
    return createFallbackSynthesis(layerNumber, question, responses, tensionAnalysis);
  }
}

async function callSynthesisAPI(
  responses: ArchetypeResponse[],
  question: string,
  layerNumber: number,
  tensionAnalysis: any,
  breakthroughAnalysis: any,
  previousLayers: LayerResult[]
): Promise<SynthesisResult> {
  
  const responseText = responses.map(r => 
    `${r.archetype}: ${r.response}`
  ).join('\n\n');
  
  const previousInsights = previousLayers.map(l => 
    `Layer ${l.layerNumber}: ${l.synthesis?.insight || 'No insight'}`.substring(0, 300)
  ).join('\n');
  
  const synthesisMode = breakthroughAnalysis.breakthroughTriggered ? 'BREAKTHROUGH' : 'PROGRESSIVE';
  const targetConfidence = Math.min(0.95, 0.65 + (layerNumber * 0.03));
  
  const prompt = `You are a Layer ${layerNumber} ${synthesisMode} Synthesis Engine.

QUESTION: ${question}

TENSION ANALYSIS:
- Total Tension Score: ${tensionAnalysis.totalTensionScore}
- Contradictions Found: ${tensionAnalysis.contradictionCount}
- Breakthrough Triggered: ${breakthroughAnalysis.breakthroughTriggered}

PREVIOUS LAYERS (AVOID REPETITION):
${previousInsights}

ARCHETYPE RESPONSES TO SYNTHESIZE:
${responseText}

SYNTHESIS REQUIREMENTS:
1. Create ${synthesisMode} insight that is COMPLETELY NEW
2. ${breakthroughAnalysis.breakthroughTriggered ? 'Achieve paradigm-shifting breakthrough' : 'Build progressively toward breakthrough'}
3. Integrate tensions and contradictions productively
4. Generate insight that transcends individual archetype limitations
5. Focus on Layer ${layerNumber} mission: ${getLayerMission(layerNumber)}

Return ONLY valid JSON:
{
  "insight": "Substantial ${synthesisMode.toLowerCase()} insight (300-500 words)",
  "confidence": ${targetConfidence},
  "tensionPoints": ${Math.min(8, 2 + Math.floor(layerNumber / 2))},
  "noveltyScore": ${Math.min(10, 4 + Math.floor(layerNumber / 1.5))},
  "emergenceDetected": ${breakthroughAnalysis.emergenceReady}
}`;

  if (!openAIApiKey) {
    throw new Error('OpenAI API key not available for synthesis');
  }
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: `You are an advanced synthesis engine. Generate ${synthesisMode} insights. Return only valid JSON.` 
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.4 + (layerNumber * 0.05)
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Synthesis API error: ${response.status}`);
  }
  
  const data = await response.json();
  let rawResponse = data.choices[0]?.message?.content || '{}';
  
  // Clean JSON response
  rawResponse = rawResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  
  try {
    const result = JSON.parse(rawResponse);
    return {
      insight: result.insight || `Layer ${layerNumber} synthesis completed with ${synthesisMode.toLowerCase()} analysis`,
      confidence: result.confidence || targetConfidence,
      tensionPoints: result.tensionPoints || Math.min(8, 2 + Math.floor(layerNumber / 2)),
      noveltyScore: result.noveltyScore || Math.min(10, 4 + Math.floor(layerNumber / 1.5)),
      emergenceDetected: result.emergenceDetected || breakthroughAnalysis.emergenceReady
    };
  } catch (parseError) {
    console.error('Synthesis JSON parsing failed:', parseError);
    throw new Error('Synthesis response parsing failed');
  }
}

function calculateTensionEscalation(
  baseTension: number,
  breakthroughAnalysis: any,
  layerNumber: number
): number {
  let escalatedTension = baseTension;
  
  // Gate 2: Tension escalation rules
  if (breakthroughAnalysis.breakthroughTriggered) {
    escalatedTension = Math.min(8, baseTension + 3);
  } else if (breakthroughAnalysis.highTension) {
    escalatedTension = Math.min(8, baseTension + 2);
  } else if (layerNumber >= 5) {
    escalatedTension = Math.min(8, baseTension + 1);
  }
  
  return Math.max(1, escalatedTension);
}

function createFallbackSynthesis(
  layerNumber: number,
  question: string,
  responses: ArchetypeResponse[],
  tensionAnalysis: any
): SynthesisResult {
  
  const fallbackInsights = [
    `Layer ${layerNumber} reveals that ${question} exposes fundamental questions about the nature of inquiry itself. The tensions between the archetypal perspectives illuminate how different modes of knowing create productive conflict.`,
    
    `Layer ${layerNumber} synthesis: The question creates a conceptual fracture that reveals deeper assumptions about knowledge, certainty, and the limits of understanding. Each archetype contributes to mapping this terrain of uncertainty.`,
    
    `Layer ${layerNumber} analysis shows that ${question} functions as a lens through which we can examine the structure of questioning itself. The archetypal tensions reveal the productive nature of intellectual disagreement.`,
    
    `Layer ${layerNumber} demonstrates that this inquiry transcends its surface content to become an exploration of how consciousness encounters its own limitations. The archetypal perspectives map different approaches to this encounter.`,
    
    `Layer ${layerNumber} synthesis reveals that ${question} operates as a catalyst for examining the relationship between knowledge and wisdom. The tensions between perspectives suggest breakthrough insights await integration.`
  ];
  
  const insight = fallbackInsights[Math.min(layerNumber - 1, fallbackInsights.length - 1)];
  
  return {
    insight,
    confidence: 0.65 + (layerNumber * 0.02),
    tensionPoints: Math.min(8, Math.max(3, tensionAnalysis.totalTensionScore)),
    noveltyScore: Math.min(10, 4 + Math.floor(layerNumber / 1.5)),
    emergenceDetected: layerNumber > 6
  };
}

function createEmergencyFallbackLayer(
  layerNumber: number,
  question: string,
  previousLayers: LayerResult[]
): LayerResult {
  
  console.log(`Creating emergency fallback for layer ${layerNumber}`);
  
  const fallbackSynthesis = createFallbackSynthesis(layerNumber, question, [], { totalTensionScore: 3 });
  
  return {
    layerNumber,
    archetypeResponses: [],
    synthesis: fallbackSynthesis,
    logicTrail: [{
      archetype: 'System Fallback',
      contribution: `Layer ${layerNumber} maintained continuity through systematic fallback processing.`
    }],
    circuitType: 'fallback',
    timestamp: Date.now()
  };
}

function getLayerMission(layerNumber: number): string {
  const missions = [
    "foundational understanding",
    "pattern recognition", 
    "tension exploration",
    "systemic integration",
    "assumption challenging",
    "emergence detection",
    "meta-transcendence",
    "breakthrough synthesis",
    "ultimate perspective",
    "transcendent unity"
  ];
  return missions[Math.min(layerNumber - 1, missions.length - 1)];
}

export async function generateFinalResultsWithTensionEscalation(
  layers: LayerResult[],
  question: string,
  circuitType: string
): Promise<any> {
  
  console.log(`\n=== GENERATING FINAL RESULTS ===`);
  console.log(`Processing ${layers.length} layers for final synthesis`);
  
  if (layers.length === 0) {
    throw new Error('No layers available for final results generation');
  }
  
  // Calculate cumulative metrics
  const totalTensionPoints = layers.reduce((sum, layer) => 
    sum + (layer.synthesis?.tensionPoints || 0), 0
  );
  
  const avgConfidence = layers.reduce((sum, layer) => 
    sum + (layer.synthesis?.confidence || 0), 0
  ) / layers.length;
  
  const maxNoveltyScore = Math.max(...layers.map(layer => 
    layer.synthesis?.noveltyScore || 0
  ));
  
  const emergenceDetected = layers.some(layer => 
    layer.synthesis?.emergenceDetected
  );
  
  // Build comprehensive insight from all layers
  const finalInsight = layers.map(layer => 
    `Layer ${layer.layerNumber}: ${layer.synthesis?.insight || 'Analysis completed'}`
  ).join('\n\n');
  
  // Build logic trail
  const logicTrail = layers.flatMap(layer => 
    layer.logicTrail || []
  );
  
  return {
    layers,
    insight: finalInsight,
    confidence: Math.min(0.95, avgConfidence + 0.1),
    tensionPoints: Math.min(10, totalTensionPoints),
    noveltyScore: maxNoveltyScore,
    emergenceDetected,
    circuitType,
    processingDepth: layers.length,
    logicTrail,
    outputType: 'comprehensive'
  };
}

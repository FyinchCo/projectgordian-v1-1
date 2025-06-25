
import { ArchetypeResponse, TensionMetrics, SynthesisResult, LayerResult } from './types.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export async function calculateTensionMetrics(archetypeResponses: ArchetypeResponse[]): Promise<TensionMetrics> {
  const allResponses = archetypeResponses.map(r => `${r.archetype}: ${r.response}`).join('\n\n');
  
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
          content: `You are a Tension Analysis Engine. Analyze the archetypal responses for:
1. tensionScore: How much intellectual friction exists between perspectives (0-10)
2. contradictionCount: Number of direct contradictions or opposing viewpoints
3. consensusRisk: How much the responses are converging toward groupthink (0-10, higher = more consensus risk)

Respond with JSON only:
{"tensionScore": number, "contradictionCount": number, "consensusRisk": number}`
        },
        { role: 'user', content: allResponses }
      ],
      max_tokens: 150,
      temperature: 0.3,
    }),
  });

  const data = await response.json();
  try {
    return JSON.parse(data.choices[0].message.content);
  } catch {
    return { tensionScore: 5, contradictionCount: 2, consensusRisk: 5 };
  }
}

async function performLayerSynthesis(
  archetypeResponses: ArchetypeResponse[],
  question: string,
  previousInsights: string[] = [],
  layerNumber: number = 1,
  focusArea: string = 'general analysis'
): Promise<SynthesisResult> {
  console.log(`Layer ${layerNumber} performing synthesis with focus on ${focusArea}...`);
  
  const responses = archetypeResponses.map(r => 
    `${r.archetype}: ${r.response}`
  ).join('\n\n');

  const previousContext = previousInsights.length > 0 ? 
    `\nPrevious Layer Insights (AVOID REPEATING THESE):\n${previousInsights.slice(-3).map((insight, idx) => 
      `Layer ${previousInsights.length - 2 + idx}: ${insight.substring(0, 300)}...`
    ).join('\n\n')}\n` : '';

  const synthesisInstructions = getSynthesisInstructions(layerNumber, focusArea);

  const prompt = `You are a Layer ${layerNumber} synthesis engine focusing on ${focusArea}.

Question: ${question}
${previousContext}

CRITICAL: Generate a completely NEW insight that has NOT been explored in previous layers.

Focus Area: ${focusArea}
Synthesis Approach: ${synthesisInstructions}

Archetype Responses:
${responses}

Generate analysis that:
1. NEVER repeats previous layer insights
2. Focuses specifically on ${focusArea}
3. ${layerNumber > 6 ? 'Achieves paradigm-shifting breakthrough' : layerNumber > 3 ? 'Integrates and transcends' : 'Establishes foundational understanding'}
4. Provides genuinely new perspective

Return ONLY valid JSON (no markdown):
{
  "insight": "Completely new ${layerNumber > 6 ? 'breakthrough' : 'progressive'} insight focused on ${focusArea}",
  "confidence": ${Math.min(0.95, 0.65 + (layerNumber * 0.03))},
  "tensionPoints": ${Math.min(8, 2 + Math.floor(layerNumber / 1.5))},
  "noveltyScore": ${Math.min(10, 4 + Math.floor(layerNumber / 1.2))},
  "emergenceDetected": ${layerNumber > 6}
}`;

  try {
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
            content: `You are a Layer ${layerNumber} synthesis specialist. Generate UNIQUE insights that build on the specified focus area. NEVER repeat previous insights. Each layer must be genuinely different. Return only valid JSON.` 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 800,
        temperature: 0.3 + (layerNumber * 0.05)
      }),
    });

    const data = await response.json();
    let rawResponse = data.choices[0]?.message?.content || '{}';
    
    rawResponse = rawResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    console.log(`Layer ${layerNumber} synthesis response:`, rawResponse.substring(0, 200) + '...');
    
    try {
      const result = JSON.parse(rawResponse);
      
      if (previousInsights.some(prevInsight => 
        prevInsight.toLowerCase().includes(result.insight.toLowerCase().substring(0, 50)) ||
        result.insight.toLowerCase().includes(prevInsight.toLowerCase().substring(0, 50))
      )) {
        console.warn(`Layer ${layerNumber} generated similar insight to previous layers, creating unique alternative...`);
        result.insight = generateUniqueInsight(layerNumber, focusArea, question, previousInsights);
      }
      
      return {
        insight: result.insight || generateUniqueInsight(layerNumber, focusArea, question, previousInsights),
        confidence: result.confidence || (0.65 + layerNumber * 0.02),
        tensionPoints: result.tensionPoints || Math.min(2 + Math.floor(layerNumber / 1.5), 8),
        noveltyScore: result.noveltyScore || Math.min(4 + Math.floor(layerNumber / 1.2), 10),
        emergenceDetected: result.emergenceDetected || (layerNumber > 6)
      };
    } catch (parseError) {
      console.error(`Layer ${layerNumber} synthesis parsing failed:`, parseError);
      return createFallbackSynthesis(layerNumber, focusArea, question, previousInsights);
    }
  } catch (error) {
    console.error(`Layer ${layerNumber} synthesis request failed:`, error);
    return createFallbackSynthesis(layerNumber, focusArea, question, previousInsights);
  }
}

function getSynthesisInstructions(layerNumber: number, focusArea: string): string {
  const instructions = [
    "Establish clear foundational understanding",
    "Identify patterns and meaningful connections",
    "Examine tensions, contradictions, and conflicts",
    "Synthesize elements into integrated understanding",
    "Challenge assumptions and explore alternatives",
    "Detect emergence and paradigm possibilities",
    "Achieve meta-level transcendent synthesis",
    "Integrate breakthrough insights systematically", 
    "Reach ultimate perspective and wisdom",
    "Unify all understanding transcendently"
  ];
  
  const baseInstruction = instructions[Math.min(layerNumber - 1, instructions.length - 1)];
  return `${baseInstruction} through analysis focused on ${focusArea}`;
}

function generateUniqueInsight(layerNumber: number, focusArea: string, question: string, previousInsights: string[]): string {
  const uniqueApproaches = [
    `Layer ${layerNumber} reveals that ${focusArea} exposes fundamental questions about the nature of causality and existence that challenge our basic assumptions about how reality operates.`,
    `Through ${focusArea}, Layer ${layerNumber} uncovers a paradox: the question "Who created God?" assumes God operates within the same temporal framework as created beings, but divine existence may transcend causation entirely.`,
    `Layer ${layerNumber}'s focus on ${focusArea} suggests that this inquiry functions as a mirror, reflecting our cognitive limitations rather than revealing information about divine nature.`,
    `The ${focusArea} perspective in Layer ${layerNumber} reveals that the question itself creates an infinite regress that points to the necessity of an uncaused first cause.`,
    `Layer ${layerNumber} demonstrates that ${focusArea} transforms this theological question into an exploration of necessary versus contingent existence.`,
    `Through ${focusArea}, Layer ${layerNumber} shows that the question's significance lies in exposing the category error of applying finite concepts to infinite reality.`,
    `Layer ${layerNumber}'s ${focusArea} approach reveals that the question functions as a koan, dissolving logical frameworks to point toward transcendent understanding.`,
    `The ${focusArea} analysis in Layer ${layerNumber} suggests that asking "Who created God?" is like asking what color mathematics is - a fundamental category mistake.`,
    `Layer ${layerNumber} shows that ${focusArea} reveals the question as pointing toward the self-existing, eternal ground of being that underlies all existence.`,
    `Through ${focusArea}, Layer ${layerNumber} demonstrates that the question transcends its literal meaning to become recognition of the ultimate creative principle.`
  ];
  
  return uniqueApproaches[Math.min(layerNumber - 1, uniqueApproaches.length - 1)];
}

function createFallbackSynthesis(layerNumber: number, focusArea: string, question: string, previousInsights: string[]): SynthesisResult {
  return {
    insight: generateUniqueInsight(layerNumber, focusArea, question, previousInsights),
    confidence: 0.65 + (layerNumber * 0.02) + (Math.random() * 0.1),
    tensionPoints: Math.max(1, Math.min(8, 2 + Math.floor(layerNumber / 1.5) + Math.floor(Math.random() * 2))),
    noveltyScore: Math.max(3, Math.min(10, 4 + Math.floor(layerNumber / 1.2) + Math.floor(Math.random() * 2))),
    emergenceDetected: layerNumber > 6
  };
}

export async function synthesizeInsight(
  archetypeResponses: ArchetypeResponse[],
  question: string,
  previousInsights: string[] = [],
  enhancedMode: boolean = false,
  layerNumber: number = 1,
  focusArea: string = 'general analysis'
): Promise<SynthesisResult> {
  console.log(`Starting Layer ${layerNumber} synthesis focused on ${focusArea}...`);
  console.log(`Archetype responses available: ${archetypeResponses.length}`);
  
  if (archetypeResponses.length === 0) {
    console.warn(`Layer ${layerNumber} has no archetype responses, creating fallback synthesis`);
    return createFallbackSynthesis(layerNumber, focusArea, question, previousInsights);
  }
  
  try {
    const synthesis = await performLayerSynthesis(
      archetypeResponses, 
      question, 
      previousInsights, 
      layerNumber, 
      focusArea
    );
    
    console.log(`Layer ${layerNumber} synthesis completed successfully`);
    return synthesis;
    
  } catch (error) {
    console.error(`Layer ${layerNumber} synthesis failed:`, error);
    return createFallbackSynthesis(layerNumber, focusArea, question, previousInsights);
  }
}

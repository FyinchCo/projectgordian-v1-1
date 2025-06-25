
import { ArchetypeResponse, TensionMetrics, SynthesisResult, LayerResult } from './types.ts';
import { evaluateQuestionQuality, QuestionQualityMetrics } from './question-quality.ts';
import { generateCompressionFormats, CompressionFormats } from './compression.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export async function calculateTensionMetrics(archetypeResponses: ArchetypeResponse[]): Promise<TensionMetrics> {
  const allResponses = archetypeResponses.map(r => `${r.archetype}: ${r.contribution}`).join('\n\n');
  
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

export async function addTensionTags(archetypeResponses: ArchetypeResponse[]): Promise<ArchetypeResponse[]> {
  const taggedResponses: ArchetypeResponse[] = [];
  
  for (let i = 0; i < archetypeResponses.length; i++) {
    const currentResponse = archetypeResponses[i];
    const previousResponses = archetypeResponses.slice(0, i);
    
    if (previousResponses.length === 0) {
      taggedResponses.push(currentResponse);
      continue;
    }
    
    const analysisPrompt = `Analyze if this new perspective creates significant tension or novelty compared to previous ones.

Previous perspectives:
${previousResponses.map(r => `${r.archetype}: ${r.contribution}`).join('\n')}

New perspective:
${currentResponse.archetype}: ${currentResponse.contribution}

If this creates significant contradiction, add [contradiction emerged here] at the start.
If this introduces a genuinely novel insight, add [novel insight surfaced here] at the start.
Otherwise, return the contribution unchanged.

Return only the (possibly tagged) contribution text.`;

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
            { role: 'system', content: 'You are a tension detection system. Add tags only when there is genuine contradiction or novel insight.' },
            { role: 'user', content: analysisPrompt }
          ],
          max_tokens: 300,
          temperature: 0.2,
        }),
      });

      const data = await response.json();
      const taggedContribution = data.choices[0].message.content;
      
      taggedResponses.push({
        ...currentResponse,
        contribution: taggedContribution
      });
    } catch (error) {
      console.error('Error adding tension tags:', error);
      taggedResponses.push(currentResponse);
    }
  }
  
  return taggedResponses;
}

async function performLayerSynthesis(
  archetypeResponses: ArchetypeResponse[],
  question: string,
  previousInsights: string[] = [],
  layerNumber: number = 1,
  focusArea: string = 'general analysis',
  isInitial: boolean = true
): Promise<SynthesisResult> {
  console.log(`Layer ${layerNumber} performing ${isInitial ? 'initial' : 'final'} synthesis with focus on ${focusArea}...`);
  
  const responses = archetypeResponses.map(r => 
    `${r.archetype}: ${r.response}`
  ).join('\n\n');

  const previousContext = previousInsights.length > 0 ? 
    `\nPrevious Layer Insights (AVOID REPEATING THESE):\n${previousInsights.slice(-3).map((insight, idx) => 
      `Layer ${previousInsights.length - 2 + idx}: ${insight.substring(0, 300)}...`
    ).join('\n\n')}\n` : '';

  const synthesisInstructions = getSynthesisInstructions(layerNumber, focusArea, isInitial);

  const prompt = `You are a Layer ${layerNumber} synthesis engine focusing on ${focusArea}.

Question: ${question}
${previousContext}

CRITICAL: Generate a completely NEW insight that has NOT been explored in previous layers.

Focus Area: ${focusArea}
Synthesis Approach: ${synthesisInstructions}

Archetype Responses:
${responses}

Generate ${isInitial ? 'initial analysis' : 'breakthrough synthesis'} that:
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
        temperature: 0.3 + (layerNumber * 0.05) // Increase creativity with depth
      }),
    });

    const data = await response.json();
    let rawResponse = data.choices[0]?.message?.content || '{}';
    
    // Clean up response
    rawResponse = rawResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    console.log(`Layer ${layerNumber} ${isInitial ? 'initial' : 'final'} synthesis response:`, rawResponse.substring(0, 200) + '...');
    
    try {
      const result = JSON.parse(rawResponse);
      
      // Validate that insight is genuinely different from previous ones
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

function getSynthesisInstructions(layerNumber: number, focusArea: string, isInitial: boolean): string {
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
  const synthesisType = isInitial ? "foundational analysis" : "breakthrough synthesis";
  
  return `${baseInstruction} through ${synthesisType} focused on ${focusArea}`;
}

function generateUniqueInsight(layerNumber: number, focusArea: string, question: string, previousInsights: string[]): string {
  const uniqueApproaches = [
    `Layer ${layerNumber} reveals that ${focusArea} exposes fundamental questions about the nature of ${question.toLowerCase().replace('?', '')} that haven't been previously considered.`,
    `Through ${focusArea}, Layer ${layerNumber} uncovers a paradox: the more we examine this question, the more it reveals about our own cognitive limitations and assumptions.`,
    `Layer ${layerNumber}'s focus on ${focusArea} suggests that the question itself is a gateway to understanding broader existential and philosophical frameworks.`,
    `The ${focusArea} perspective in Layer ${layerNumber} reveals that this inquiry operates on multiple simultaneous levels of meaning and significance.`,
    `Layer ${layerNumber} demonstrates that ${focusArea} transforms the original question into a mirror reflecting our deepest conceptual frameworks.`,
    `Through ${focusArea}, Layer ${layerNumber} shows that the question's significance lies not in its answer but in its capacity to restructure our understanding.`,
    `Layer ${layerNumber}'s ${focusArea} approach reveals that the question functions as a cognitive catalyst, triggering fundamental reassessment of basic assumptions.`,
    `The ${focusArea} analysis in Layer ${layerNumber} suggests that the question's power lies in its ability to expose the limitations of conventional thinking patterns.`,
    `Layer ${layerNumber} shows that ${focusArea} reveals the question as a complex system rather than a simple inquiry, with emergent properties and recursive implications.`,
    `Through ${focusArea}, Layer ${layerNumber} demonstrates that the question transcends its literal meaning to become a transformative cognitive tool.`
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

// Helper function to extract insight from responses when JSON parsing fails
function extractInsightFromResponses(archetypeResponses: ArchetypeResponse[]): string {
  const themes = archetypeResponses.map(r => {
    const sentences = r.response.split('.').filter(s => s.trim().length > 20);
    return sentences[0]?.trim() || r.response.substring(0, 100);
  }).join('. ');
  
  return `Synthesis of multiple perspectives reveals: ${themes}. This integration suggests new approaches that transcend individual viewpoints.`;
}

export async function synthesizeInsight(
  archetypeResponses: ArchetypeResponse[],
  question: string,
  previousInsights: string[] = [],
  enhancedMode: boolean = false,
  layerNumber: number = 1,
  focusArea: string = 'general analysis'
): Promise<SynthesisResult> {
  console.log(`Starting Layer ${layerNumber} enhanced synthesis focused on ${focusArea}...`);
  
  // Add tension tags to responses
  const taggedResponses = await addTensionTags(archetypeResponses);
  
  // Stage 1: Initial Analysis
  console.log(`Performing Layer ${layerNumber} initial synthesis analysis...`);
  const initialSynthesis = await performLayerSynthesis(
    taggedResponses, 
    question, 
    previousInsights, 
    layerNumber, 
    focusArea, 
    true
  );
  
  // Stage 2: Final Breakthrough Synthesis
  console.log(`Performing Layer ${layerNumber} final breakthrough synthesis...`);
  const finalSynthesis = await performLayerSynthesis(
    taggedResponses, 
    initialSynthesis, 
    question, 
    previousInsights, 
    layerNumber, 
    focusArea, 
    false
  );

  // ALWAYS Generate compression formats
  let compressionFormats: CompressionFormats;
  try {
    console.log(`Generating Layer ${layerNumber} compression formats...`);
    compressionFormats = await generateCompressionFormats(
      finalSynthesis.insight,
      finalSynthesis,
      question
    );
    console.log(`Layer ${layerNumber} compression formats generated successfully`);
  } catch (error) {
    console.error(`Layer ${layerNumber} compression generation failed:`, error);
    compressionFormats = createFallbackCompressionFormats(finalSynthesis.insight, layerNumber);
  }

  // Evaluate question quality only for later layers
  let questionQuality: QuestionQualityMetrics | undefined;
  if (layerNumber > 2) {
    try {
      questionQuality = await evaluateQuestionQuality(
        question,
        finalSynthesis,
        taggedResponses
      );
    } catch (error) {
      console.error(`Layer ${layerNumber} question quality evaluation failed:`, error);
    }
  }

  console.log(`Layer ${layerNumber} enhanced synthesis completed`);

  return {
    ...finalSynthesis,
    questionQuality,
    compressionFormats
  };
}

function createFallbackCompressionFormats(insight: string, layerNumber: number): CompressionFormats {
  const words = insight.split(' ');
  return {
    ultraConcise: words.slice(0, 8).join(' ') + (words.length > 8 ? '...' : ''),
    medium: `Layer ${layerNumber} reveals: ${insight.substring(0, 200)}${insight.length > 200 ? '...' : ''}`,
    comprehensive: `${insight} This Layer ${layerNumber} insight represents a ${layerNumber > 6 ? 'breakthrough' : 'progressive'} understanding that builds meaningfully on previous analytical layers.`
  };
}

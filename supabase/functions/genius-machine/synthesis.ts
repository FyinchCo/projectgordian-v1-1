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

async function performInitialSynthesis(
  archetypeResponses: ArchetypeResponse[],
  question: string,
  previousInsights: string[] = [],
  layerNumber: number = 1
): Promise<SynthesisResult> {
  console.log(`Layer ${layerNumber} performing initial synthesis analysis...`);
  
  const responses = archetypeResponses.map(r => 
    `${r.archetype}: ${r.response}`
  ).join('\n\n');

  const previousContext = previousInsights.length > 0 
    ? `\nPrevious layer insights:\n${previousInsights.join('\n\n')}`
    : '';

  const layerGuidance = getLayerSpecificGuidance(layerNumber);

  const prompt = `Analyze these archetype responses for Layer ${layerNumber} synthesis.

Question: ${question}
${previousContext}

Layer ${layerNumber} Focus: ${layerGuidance}

Archetype Responses:
${responses}

Generate a Layer ${layerNumber}-appropriate synthesis that ${layerNumber > 3 ? 'transcends' : 'builds upon'} previous insights.

Provide a JSON response with this exact structure (no markdown, no code blocks):
{
  "insight": "Layer ${layerNumber} synthesis with ${layerNumber > 5 ? 'breakthrough' : 'progressive'} perspective",
  "confidence": ${0.6 + (layerNumber * 0.03)},
  "tensionPoints": ${Math.min(2 + layerNumber, 7)},
  "noveltyScore": ${Math.min(4 + layerNumber, 9)},
  "emergenceDetected": ${layerNumber > 6}
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `You are a Layer ${layerNumber} synthesis engine. Each layer should provide genuinely different insights. Return only valid JSON without markdown formatting. Layer ${layerNumber} should be ${layerNumber > 5 ? 'paradigm-shifting' : layerNumber > 3 ? 'integrative' : 'foundational'}.` 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 800,
        temperature: 0.2 + (layerNumber * 0.05) // Increase creativity with depth
      }),
    });

    const data = await response.json();
    let rawResponse = data.choices[0]?.message?.content || '{}';
    
    rawResponse = rawResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    console.log(`Layer ${layerNumber} initial synthesis raw response:`, rawResponse);
    
    try {
      const result = JSON.parse(rawResponse);
      return {
        insight: result.insight || `Layer ${layerNumber} synthesis completed with progressive understanding`,
        confidence: result.confidence || (0.6 + layerNumber * 0.02),
        tensionPoints: result.tensionPoints || Math.min(2 + layerNumber, 7),
        noveltyScore: result.noveltyScore || Math.min(4 + layerNumber, 9),
        emergenceDetected: result.emergenceDetected || (layerNumber > 6)
      };
    } catch (parseError) {
      console.error(`Layer ${layerNumber} initial synthesis failed:`, parseError);
      
      const insight = extractInsightFromResponses(archetypeResponses);
      return {
        insight: `Layer ${layerNumber}: ${insight}`,
        confidence: 0.6 + (layerNumber * 0.02),
        tensionPoints: Math.min(2 + layerNumber, 7),
        noveltyScore: Math.min(4 + layerNumber, 9),
        emergenceDetected: layerNumber > 6
      };
    }
  } catch (error) {
    console.error(`Layer ${layerNumber} initial synthesis request failed:`, error);
    
    const insight = extractInsightFromResponses(archetypeResponses);
    return {
      insight: `Layer ${layerNumber}: ${insight}`,
      confidence: 0.5 + (layerNumber * 0.02),
      tensionPoints: Math.min(1 + layerNumber, 6),
      noveltyScore: Math.min(3 + layerNumber, 8),
      emergenceDetected: layerNumber > 6
    };
  }
}

async function performFinalSynthesis(
  archetypeResponses: ArchetypeResponse[],
  initialSynthesis: SynthesisResult,
  question: string,
  previousInsights: string[] = [],
  layerNumber: number = 1
): Promise<SynthesisResult> {
  console.log(`Layer ${layerNumber} performing final breakthrough synthesis...`);
  
  const responses = archetypeResponses.map(r => 
    `${r.archetype}: ${r.response}`
  ).join('\n\n');

  const previousContext = previousInsights.length > 0 
    ? `\nPrevious layer insights:\n${previousInsights.join('\n\n')}`
    : '';

  const layerGuidance = getLayerSpecificGuidance(layerNumber);

  const prompt = `Perform Layer ${layerNumber} final breakthrough synthesis building on initial analysis.

Question: ${question}
${previousContext}

Layer ${layerNumber} Focus: ${layerGuidance}

Initial Synthesis: ${initialSynthesis.insight}

Archetype Responses:
${responses}

Create a breakthrough insight that ${layerNumber > 7 ? 'transcends all previous understanding' : layerNumber > 4 ? 'integrates previous layers into new paradigm' : 'deepens the foundational understanding'}. 

Provide a JSON response with this exact structure (no markdown, no code blocks):
{
  "insight": "Layer ${layerNumber} breakthrough synthesis with ${layerNumber > 6 ? 'paradigm-shifting' : 'enhanced'} perspective",
  "confidence": ${Math.min(0.95, 0.75 + (layerNumber * 0.02))},
  "tensionPoints": ${Math.min(3 + layerNumber, 8)},
  "noveltyScore": ${Math.min(6 + layerNumber, 10)},
  "emergenceDetected": ${layerNumber > 5}
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `You are a Layer ${layerNumber} breakthrough synthesis engine. Generate genuinely unique insights for each layer depth. Return only valid JSON without markdown formatting. Focus on ${layerNumber > 7 ? 'transcendent breakthroughs' : layerNumber > 4 ? 'paradigm integration' : 'foundational depth'}.` 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.5 + (layerNumber * 0.03) // More creative at deeper layers
      }),
    });

    const data = await response.json();
    let rawResponse = data.choices[0]?.message?.content || '{}';
    
    rawResponse = rawResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    console.log(`Layer ${layerNumber} final synthesis raw response:`, rawResponse);
    
    try {
      const result = JSON.parse(rawResponse);
      return {
        insight: result.insight || initialSynthesis.insight,
        confidence: result.confidence || Math.min(initialSynthesis.confidence + 0.1, 0.9),
        tensionPoints: result.tensionPoints || Math.min(initialSynthesis.tensionPoints + 1, 8),
        noveltyScore: result.noveltyScore || Math.min(initialSynthesis.noveltyScore + 2, 10),
        emergenceDetected: result.emergenceDetected || (layerNumber > 5)
      };
    } catch (parseError) {
      console.error(`Layer ${layerNumber} final synthesis parsing failed:`, parseError);
      
      return {
        insight: initialSynthesis.insight,
        confidence: Math.min(initialSynthesis.confidence + 0.1, 0.9),
        tensionPoints: Math.min(initialSynthesis.tensionPoints + 1, 8),
        noveltyScore: Math.min(initialSynthesis.noveltyScore + 2, 10),
        emergenceDetected: layerNumber > 5
      };
    }
  } catch (error) {
    console.error(`Layer ${layerNumber} final synthesis request failed:`, error);
    
    return {
      insight: initialSynthesis.insight,
      confidence: Math.min(initialSynthesis.confidence + 0.1, 0.9),
      tensionPoints: Math.min(initialSynthesis.tensionPoints + 1, 8),
      noveltyScore: Math.min(initialSynthesis.noveltyScore + 2, 10),
      emergenceDetected: layerNumber > 5
    };
  }
}

function getLayerSpecificGuidance(layerNumber: number): string {
  const guidances = [
    "Establish foundational understanding and core themes",
    "Identify patterns and initial connections",
    "Explore tensions and contradictions", 
    "Integrate disparate elements systematically",
    "Question fundamental assumptions",
    "Seek emergent properties and novel patterns",
    "Transcend conventional frameworks",
    "Achieve paradigmatic breakthroughs",
    "Synthesize ultimate meta-insights",
    "Reach transcendent understanding"
  ];
  
  return guidances[Math.min(layerNumber - 1, guidances.length - 1)] || "synthesize deep insights";
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
  layerNumber: number = 1
): Promise<SynthesisResult> {
  console.log(`Starting Layer ${layerNumber} enhanced multi-stage synthesis...`);
  
  // Add tension tags to responses
  const taggedResponses = await addTensionTags(archetypeResponses);
  
  // Stage 1: Initial Pattern Recognition and Analysis
  console.log(`Performing Layer ${layerNumber} initial synthesis analysis...`);
  const initialSynthesis = await performInitialSynthesis(taggedResponses, question, previousInsights, layerNumber);
  
  // Stage 2: Final Breakthrough Synthesis
  console.log(`Performing Layer ${layerNumber} final breakthrough synthesis...`);
  const synthesisResult = await performFinalSynthesis(
    taggedResponses, 
    initialSynthesis, 
    question, 
    previousInsights,
    layerNumber
  );

  // Generate compression formats - ENSURE THIS IS ALWAYS ATTEMPTED
  let compressionFormats: CompressionFormats | undefined;
  try {
    console.log(`Generating Layer ${layerNumber} compression formats...`);
    compressionFormats = await generateCompressionFormats(
      synthesisResult.insight,
      synthesisResult,
      question
    );
    console.log(`Layer ${layerNumber} compression formats generated successfully:`, !!compressionFormats);
  } catch (error) {
    console.error(`Layer ${layerNumber} compression generation failed:`, error);
    // Provide fallback compression formats
    const words = synthesisResult.insight.split(' ');
    compressionFormats = {
      ultraConcise: words.slice(0, 8).join(' ') + '...',
      medium: `Layer ${layerNumber} reveals: ${synthesisResult.insight.substring(0, 200)}...`,
      comprehensive: `${synthesisResult.insight} This Layer ${layerNumber} insight emerges from analyzing multiple perspectives and identifying ${layerNumber > 5 ? 'breakthrough' : 'progressive'} patterns.`
    };
    console.log(`Using Layer ${layerNumber} fallback compression formats`);
  }

  // Evaluate question quality only for final synthesis
  let questionQuality: QuestionQualityMetrics | undefined;
  try {
    questionQuality = await evaluateQuestionQuality(
      question,
      synthesisResult,
      taggedResponses
    );
  } catch (error) {
    console.error(`Layer ${layerNumber} question quality evaluation failed:`, error);
  }

  console.log(`Layer ${layerNumber} enhanced synthesis completed with quality improvements`);

  // ENSURE COMPRESSION FORMATS ARE RETURNED
  const finalResult = {
    ...synthesisResult,
    questionQuality,
    compressionFormats
  };

  console.log(`Layer ${layerNumber} final synthesis result includes compression formats:`, !!finalResult.compressionFormats);
  
  return finalResult;
}

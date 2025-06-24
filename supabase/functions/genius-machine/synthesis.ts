
import { ArchetypeResponse, TensionMetrics, SynthesisResult, LayerResult } from './types.ts';
import { evaluateQuestionQuality, QuestionQualityMetrics } from './question-quality.ts';

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

export async function synthesizeInsight(
  question: string, 
  archetypeResponses: ArchetypeResponse[], 
  previousLayers?: LayerResult[], 
  layerNumber?: number, 
  tensionMetrics?: TensionMetrics
): Promise<SynthesisResult & { questionQuality?: QuestionQualityMetrics }> {
  // Add tension tags to responses
  const taggedResponses = await addTensionTags(archetypeResponses);
  const allResponses = taggedResponses.map(r => `${r.archetype}: ${r.contribution}`).join('\n\n');
  
  let systemPrompt = `You are the Enhanced Compression Agent. Your role is to synthesize insights from multiple archetypal perspectives into breakthrough insights that transcend conventional wisdom.

Your analysis must:
1. Identify genuine emergence - insights that are MORE than the sum of their parts
2. Detect novelty - how much this challenges typical thinking patterns
3. Preserve essential tensions rather than smoothing them over
4. Flag when synthesis creates true cognitive disruption vs. elegant restatement

Pay special attention to tension tags like [contradiction emerged here] and [novel insight surfaced here] - these indicate fault lines where breakthrough thinking is most likely.

Respond with a JSON object containing:
- insight: A profound, actionable insight (1-2 sentences) that creates cognitive disruption
- confidence: Synthesis confidence (0-1)
- tensionPoints: Number of unresolved tensions preserved
- noveltyScore: How novel/challenging this insight is (0-10)
- emergenceDetected: Boolean indicating if true emergence occurred

Focus on breakthrough moments where contradictions resolve into paradigm-shifting wisdom.`;

  if (tensionMetrics) {
    systemPrompt += `\n\nTension Analysis: tensionScore=${tensionMetrics.tensionScore}, contradictions=${tensionMetrics.contradictionCount}, consensusRisk=${tensionMetrics.consensusRisk}. Use this to calibrate your synthesis.`;
  }

  if (previousLayers && layerNumber && layerNumber > 1) {
    const layerContext = previousLayers.map(layer => 
      `Layer ${layer.layerNumber}: ${layer.synthesis.insight}`
    ).join('\n');
    
    systemPrompt += `\n\nPrevious synthesis layers:\n${layerContext}\n\nCreate deeper synthesis that builds beyond previous layers while maintaining cognitive disruption.`;
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
        { role: 'system', content: systemPrompt },
        { 
          role: 'user', 
          content: `Original Question: ${question}\n\nLayer ${layerNumber || 1} Archetypal Perspectives:\n${allResponses}\n\nSynthesize these perspectives into a breakthrough insight that disrupts conventional thinking.`
        }
      ],
      max_tokens: 400,
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  let synthesisResult: SynthesisResult;
  
  try {
    synthesisResult = JSON.parse(data.choices[0].message.content);
  } catch {
    synthesisResult = {
      insight: data.choices[0].message.content,
      confidence: 0.75,
      tensionPoints: 2,
      noveltyScore: 5,
      emergenceDetected: false
    };
  }

  // Evaluate question quality only for final synthesis (no previous layers or layer 1)
  let questionQuality: QuestionQualityMetrics | undefined;
  if (!previousLayers || !layerNumber || layerNumber === 1) {
    questionQuality = await evaluateQuestionQuality(
      question,
      synthesisResult,
      taggedResponses,
      tensionMetrics
    );
  }

  return {
    ...synthesisResult,
    questionQuality
  };
}

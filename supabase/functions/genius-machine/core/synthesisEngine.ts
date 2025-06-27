
import { ArchetypeResponse } from '../types.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export async function synthesizeInsights(
  archetypeResponses: ArchetypeResponse[],
  question: string
): Promise<string> {
  console.log(`Synthesizing ${archetypeResponses.length} archetype responses`);
  
  if (!openAIApiKey) {
    throw new Error('OpenAI API key is required');
  }
  
  if (archetypeResponses.length === 0) {
    throw new Error('No archetype responses to synthesize');
  }
  
  const systemPrompt = `You are a synthesis engine that combines multiple perspectives into a coherent, useful answer.

Your task is to:
1. Analyze the different archetype perspectives provided
2. Identify key insights and points of agreement/disagreement
3. Synthesize them into a comprehensive answer to the user's question
4. Focus on providing practical, actionable insights

Respond with a clear, well-structured answer that directly addresses the user's question using the best insights from all perspectives.`;

  const contextBuilder = archetypeResponses.map((response, index) => 
    `PERSPECTIVE ${index + 1} - ${response.archetype}:\n${response.response}\n`
  ).join('\n');

  const userPrompt = `QUESTION: ${question}

ARCHETYPE PERSPECTIVES:
${contextBuilder}

Synthesize these perspectives into a comprehensive answer that directly addresses the user's question. Focus on providing genuine value and actionable insights.`;

  console.log('Calling OpenAI for synthesis...');

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
      temperature: 0.6,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Synthesis API failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const synthesizedAnswer = data.choices[0]?.message?.content || '';
  
  console.log(`✓ Synthesis completed: ${synthesizedAnswer.length} characters`);
  return synthesizedAnswer;
}

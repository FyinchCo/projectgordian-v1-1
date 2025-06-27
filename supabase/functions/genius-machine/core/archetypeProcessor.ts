
import { Archetype, ArchetypeResponse } from '../types.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export async function processArchetypes(
  archetypes: Archetype[],
  question: string
): Promise<ArchetypeResponse[]> {
  console.log(`Processing ${archetypes.length} archetypes for question: ${question.substring(0, 100)}...`);
  
  if (!openAIApiKey) {
    throw new Error('OpenAI API key is required');
  }
  
  const responses: ArchetypeResponse[] = [];
  
  for (const archetype of archetypes) {
    try {
      console.log(`Processing archetype: ${archetype.name}`);
      
      const response = await callOpenAIForArchetype(archetype, question);
      
      if (response && response.trim().length > 50) {
        responses.push({
          archetype: archetype.name,
          response: response.trim(),
          processingTime: 0,
          timestamp: Date.now()
        });
        console.log(`✓ ${archetype.name}: ${response.length} characters`);
      } else {
        console.warn(`⚠ ${archetype.name}: Response too short or empty`);
      }
      
      // Small delay between calls
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      console.error(`✗ ${archetype.name} failed:`, error);
      // Continue with other archetypes rather than failing completely
    }
  }
  
  console.log(`Completed processing: ${responses.length}/${archetypes.length} successful`);
  return responses;
}

async function callOpenAIForArchetype(archetype: Archetype, question: string): Promise<string> {
  const systemPrompt = `You are ${archetype.name}, representing a specific cognitive perspective.

PERSONALITY TRAITS:
- Imagination: ${archetype.imagination}/10
- Skepticism: ${archetype.skepticism}/10  
- Aggression: ${archetype.aggression}/10
- Emotionality: ${archetype.emotionality}/10
- Language Style: ${archetype.languageStyle}

${archetype.constraint ? `CONSTRAINT: ${archetype.constraint}` : ''}

Your task is to analyze the user's question from your unique perspective. Provide a thoughtful response that reflects your archetype's characteristics and viewpoint. Be authentic to your role while providing genuine insight.

Respond with 150-300 words that directly address the question from your perspective.`;

  const userPrompt = `Question: ${question}

Analyze this question from your perspective as ${archetype.name}. Provide your unique viewpoint and insights.`;

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
      max_tokens: 400,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

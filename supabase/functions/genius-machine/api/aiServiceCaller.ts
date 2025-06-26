
import { Archetype } from '../types.ts';
import { buildPersonalitySystemPrompt, buildPersonalityUserPrompt } from '../personality/personalityEngine.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export async function callOpenAIForPersonality(
  archetype: Archetype,
  question: string,
  context: string,
  layerNumber: number,
  archetypeIndex: number
): Promise<string> {
  
  const systemPrompt = buildPersonalitySystemPrompt(archetype, layerNumber);
  const userPrompt = buildPersonalityUserPrompt(archetype, question, context, layerNumber);
  
  console.log(`Calling OpenAI for personality-driven ${archetype.name} in layer ${layerNumber}...`);
  
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
      temperature: 0.8 + (layerNumber * 0.05) + (archetypeIndex * 0.03),
    }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`OpenAI API error for ${archetype.name}:`, response.status, errorText);
    throw new Error(`OpenAI API error: ${response.status}`);
  }
  
  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  
  console.log(`✓ OpenAI personality response received for ${archetype.name}: ${content?.length || 0} chars`);
  return content || '';
}

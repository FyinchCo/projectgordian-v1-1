
import { Archetype } from '../types.ts';
import { buildPersonalitySystemPrompt, buildPersonalityUserPrompt } from '../personality/personalityEngine.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

export function shouldUseOpenAI(archetype: Archetype): boolean {
  // Use OpenAI for more analytical/structured archetypes
  const openaiArchetypes = ['The Visionary', 'The Skeptic', 'The Realist', 'The Contrarian'];
  return openaiArchetypes.includes(archetype.name);
}

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

export async function callClaudeForPersonality(
  archetype: Archetype,
  question: string,
  context: string,
  layerNumber: number,
  archetypeIndex: number
): Promise<string> {
  
  const systemPrompt = buildPersonalitySystemPrompt(archetype, layerNumber);
  const userPrompt = buildPersonalityUserPrompt(archetype, question, context, layerNumber);
  
  console.log(`Calling Claude for personality-driven ${archetype.name} in layer ${layerNumber}...`);
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${anthropicApiKey}`,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 500,
      temperature: 0.8 + (layerNumber * 0.05),
      messages: [
        { role: 'user', content: `${systemPrompt}\n\n${userPrompt}` }
      ]
    }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Claude API error for ${archetype.name}:`, response.status, errorText);
    throw new Error(`Claude API error: ${response.status}`);
  }
  
  const data = await response.json();
  const content = data.content?.[0]?.text;
  
  console.log(`✓ Claude personality response received for ${archetype.name}: ${content?.length || 0} chars`);
  return content || '';
}

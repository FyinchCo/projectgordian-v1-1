
import { ArchetypeResponse, Archetype, LayerResult } from './types.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export function getArchetypeResponse(
  question: string,
  archetype: Archetype,
  previousLayers: LayerResult[] = [],
  layerNumber: number = 1,
  enhancedMode: boolean = true
): string {
  const previousContext = previousLayers.length > 0 
    ? previousLayers.map(layer => `Layer ${layer.layerNumber}: ${layer.synthesis?.insight || 'No insight available'}`).join('\n')
    : '';

  let prompt = `You are ${archetype.name}: ${archetype.description}

Question: "${question}"

${previousContext ? `Previous Analysis:\n${previousContext}\n\n` : ''}

Respond as ${archetype.name} would, using ${archetype.languageStyle} language style.
Personality settings: Imagination(${archetype.imagination}/10), Skepticism(${archetype.skepticism}/10), Aggression(${archetype.aggression}/10), Emotionality(${archetype.emotionality}/10)

${archetype.constraint ? `Special constraint: ${archetype.constraint}` : ''}

Provide a ${enhancedMode ? 'detailed' : 'concise'} response (2-3 sentences) that adds unique value to the analysis${layerNumber > 1 ? ' and builds on previous layers' : ''}.`;

  return prompt;
}

export async function processArchetypes(
  question: string,
  archetypes: Archetype[],
  circuitType: string,
  previousLayers: LayerResult[] = [],
  layerNumber: number = 1,
  enhancedMode: boolean = true
): Promise<ArchetypeResponse[]> {
  const responses: ArchetypeResponse[] = [];

  for (const archetype of archetypes) {
    try {
      const prompt = getArchetypeResponse(question, archetype, previousLayers, layerNumber, enhancedMode);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are an expert archetype responding to questions from your unique perspective.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: enhancedMode ? 300 : 150,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const contribution = data.choices[0].message.content;

      responses.push({
        archetype: archetype.name,
        contribution: contribution
      });

      console.log(`${archetype.name} response generated for layer ${layerNumber}`);
      
    } catch (error) {
      console.error(`Error processing archetype ${archetype.name}:`, error);
      
      // Fallback response to prevent complete failure
      responses.push({
        archetype: archetype.name,
        contribution: `${archetype.name} perspective: The question "${question}" requires deeper analysis from this viewpoint.`
      });
    }
  }

  return responses;
}


import { Archetype, ArchetypeResponse, LayerResult } from './types.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export async function processArchetypes(
  archetypes: Archetype[],
  question: string,
  circuitType: string,
  previousLayers: LayerResult[] = [],
  layerNumber: number = 1
): Promise<ArchetypeResponse[]> {
  console.log(`Processing ${archetypes.length} archetypes for layer ${layerNumber} with ${circuitType} circuit`);
  
  const responses: ArchetypeResponse[] = [];
  
  // Build context from previous layers for better archetype awareness
  const layerContext = previousLayers.length > 0 ? 
    `Previous Layer Insights:\n${previousLayers.map(l => `Layer ${l.layerNumber}: ${l.synthesis?.insight || 'Processing completed'}`).join('\n')}\n\n` : '';
  
  for (let i = 0; i < archetypes.length; i++) {
    const archetype = archetypes[i];
    
    // Build context of previous responses in this layer for better integration
    const previousResponsesContext = responses.length > 0 ? 
      `Previous Archetype Responses in this Layer:\n${responses.map(r => `${r.archetype}: ${r.response}`).join('\n\n')}\n\n` : '';
    
    try {
      const response = await generateArchetypeResponse(
        question,
        archetype,
        layerContext + previousResponsesContext,
        layerNumber
      );
      
      responses.push({
        archetype: archetype.name,
        response: response,
        processingTime: 0,
        timestamp: Date.now()
      });
      
      console.log(`${archetype.name} response generated for layer ${layerNumber}`);
      
    } catch (error) {
      console.error(`Error processing ${archetype.name}:`, error);
      responses.push({
        archetype: archetype.name,
        response: `${archetype.name} perspective: Processing completed with standard approach.`,
        processingTime: 0,
        timestamp: Date.now()
      });
    }
  }
  
  return responses;
}

async function generateArchetypeResponse(
  question: string,
  archetype: Archetype,
  context: string,
  layerNumber: number
): Promise<string> {
  
  // Use the archetype's system prompt or build one from personality traits
  const systemPrompt = archetype.systemPrompt || `You are ${archetype.name}. ${archetype.description || 'Provide your unique perspective on the question.'}`;
  
  const userPrompt = `${context}QUESTION: ${question}

Respond with your unique ${archetype.name} perspective. Your contribution should be substantial, specific, and designed to integrate well with other archetypal viewpoints.

Focus on quality insights that will contribute to breakthrough understanding.`;

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
      max_tokens: 300,
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

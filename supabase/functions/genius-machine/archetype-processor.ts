
import { Archetype, ArchetypeResponse, LayerResult } from './types.ts';
import { buildSystemPromptFromPersonality } from './archetypes.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export async function getArchetypeResponse(
  archetype: Archetype, 
  question: string, 
  previousLayer?: LayerResult[], 
  layerNumber?: number, 
  dialecticalMode?: boolean
): Promise<string> {
  let contextPrompt;
  
  if (archetype.systemPrompt) {
    contextPrompt = `${archetype.systemPrompt}\n\nProvide a focused 2-3 sentence perspective on the question. Be specific and insightful from your archetypal viewpoint.`;
  } else {
    contextPrompt = buildSystemPromptFromPersonality(
      archetype.name,
      archetype.description!,
      archetype.languageStyle!,
      archetype.imagination!,
      archetype.skepticism!,
      archetype.aggression!,
      archetype.emotionality!,
      archetype.constraint
    );
  }

  // Enhance dialectical tension when enabled
  if (dialecticalMode && Math.random() > 0.5) {
    contextPrompt += "\n\nDIALECTICAL MODE: Take a deliberately contrarian stance. If others are converging on similar insights, actively challenge that consensus. Create intellectual friction and force uncomfortable contradictions.";
  }
  
  if (previousLayer && layerNumber && layerNumber > 1) {
    const previousInsights = previousLayer.map(layer => 
      `Layer ${layer.layerNumber}: ${layer.synthesis.insight}\n` +
      layer.archetypeResponses.map(r => `${r.archetype}: ${r.contribution}`).join('\n')
    ).join('\n\n');
    
    contextPrompt += `\n\nPrevious analysis layers:\n${previousInsights}\n\nBuild upon these insights while maintaining your archetypal perspective. If you notice the insights becoming too comfortable or consensus-driven, inject disruption.`;
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
        { role: 'system', content: contextPrompt },
        { role: 'user', content: question }
      ],
      max_tokens: 250,
      temperature: dialecticalMode ? 0.9 : 0.8,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function processArchetypes(
  question: string,
  archetypes: Archetype[],
  circuitType: string,
  previousLayers: LayerResult[],
  layerNumber: number,
  enhancedMode: boolean
): Promise<ArchetypeResponse[]> {
  const archetypeResponses: ArchetypeResponse[] = [];
  const dialecticalMode = enhancedMode && (layerNumber > 1 || Math.random() > 0.3);
  
  if (circuitType === 'parallel') {
    // Process all archetypes simultaneously
    const promises = archetypes.map(archetype => 
      getArchetypeResponse(archetype, question, previousLayers, layerNumber, dialecticalMode)
    );
    const results = await Promise.all(promises);
    
    archetypes.forEach((archetype, index) => {
      archetypeResponses.push({
        archetype: archetype.name,
        contribution: results[index]
      });
    });
  } else {
    // Sequential processing with enhanced dialectical injection
    for (let i = 0; i < archetypes.length; i++) {
      const archetype = archetypes[i];
      // Inject more contrarian behavior in later archetypes
      const extraDialectical = dialecticalMode && i > archetypes.length / 2;
      const contribution = await getArchetypeResponse(archetype, question, previousLayers, layerNumber, extraDialectical);
      archetypeResponses.push({
        archetype: archetype.name,
        contribution
      });
    }
  }

  return archetypeResponses;
}

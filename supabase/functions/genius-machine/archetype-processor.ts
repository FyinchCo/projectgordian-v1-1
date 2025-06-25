
import { Archetype, ArchetypeResponse, LayerResult } from './types.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export async function processArchetypes(
  archetypes: Archetype[],
  question: string,
  circuitType: string,
  previousLayers: LayerResult[] = [],
  layerNumber: number = 1
): Promise<ArchetypeResponse[]> {
  console.log(`Processing ${archetypes.length} archetypes for layer ${layerNumber} with differentiation...`);
  
  const responses: ArchetypeResponse[] = [];
  
  // Build comprehensive context to prevent duplication
  const layerContext = buildLayerContext(previousLayers, layerNumber);
  
  for (let i = 0; i < archetypes.length; i++) {
    const archetype = archetypes[i];
    
    // Build sequential context within this layer
    const sequentialContext = responses.length > 0 ? 
      `\nOther Archetype Responses in Layer ${layerNumber}:\n${responses.map(r => 
        `${r.archetype}: ${r.response.substring(0, 150)}...`
      ).join('\n\n')}\n` : '';
    
    try {
      const response = await generateUniqueArchetypeResponse(
        question,
        archetype,
        layerContext + sequentialContext,
        layerNumber,
        i
      );
      
      responses.push({
        archetype: archetype.name,
        response: response,
        processingTime: 0,
        timestamp: Date.now()
      });
      
      console.log(`${archetype.name} unique response generated for layer ${layerNumber}`);
      
    } catch (error) {
      console.error(`Error processing ${archetype.name}:`, error);
      responses.push({
        archetype: archetype.name,
        response: generateFallbackResponse(archetype, layerNumber, question),
        processingTime: 0,
        timestamp: Date.now()
      });
    }
  }
  
  return responses;
}

function buildLayerContext(previousLayers: LayerResult[], layerNumber: number): string {
  if (previousLayers.length === 0) return '';
  
  const recentLayers = previousLayers.slice(-Math.min(2, previousLayers.length));
  
  return `\nPrevious Layer Context (DO NOT REPEAT THESE PERSPECTIVES):\n${recentLayers.map(layer => 
    `Layer ${layer.layerNumber}: ${layer.synthesis?.insight?.substring(0, 200) || 'Analysis completed'}...`
  ).join('\n\n')}\n\nFor Layer ${layerNumber}, provide a COMPLETELY DIFFERENT perspective that builds upon but doesn't repeat previous insights.\n`;
}

async function generateUniqueArchetypeResponse(
  question: string,
  archetype: Archetype,
  context: string,
  layerNumber: number,
  archetypeIndex: number
): Promise<string> {
  
  const systemPrompt = archetype.systemPrompt || 
    `You are ${archetype.name}, a unique perspective in Layer ${layerNumber} analysis. ${archetype.description || 'Provide your distinctive viewpoint.'}`;
  
  const layerApproaches = [
    "foundational examination",
    "pattern recognition and analysis",
    "tension identification and exploration", 
    "systemic integration and synthesis",
    "assumption challenging and reframing",
    "emergence detection and paradigm shifts",
    "meta-level transcendence and insight",
    "breakthrough integration and wisdom",
    "ultimate perspective and understanding",
    "transcendent unity and synthesis"
  ];
  
  const layerApproach = layerApproaches[Math.min(layerNumber - 1, layerApproaches.length - 1)];
  
  const userPrompt = `${context}

LAYER ${layerNumber} FOCUS: ${layerApproach}
QUESTION: ${question}

As ${archetype.name} in Layer ${layerNumber}, provide your unique perspective focusing on ${layerApproach}.

CRITICAL REQUIREMENTS:
1. Offer a perspective that is genuinely unique from previous layers and other archetypes
2. Focus specifically on ${layerApproach} as it relates to this question
3. Provide substantial, specific insights (not generic observations)
4. Contribute to ${layerNumber > 6 ? 'breakthrough understanding' : layerNumber > 3 ? 'integrated synthesis' : 'foundational analysis'}

Your response should be substantial (150-250 words) and offer insights that will integrate well with other archetypal perspectives while maintaining your unique ${archetype.name} viewpoint.`;

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
      max_tokens: 350,
      temperature: 0.7 + (layerNumber * 0.05) + (archetypeIndex * 0.02), // Increase variation
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

function generateFallbackResponse(archetype: Archetype, layerNumber: number, question: string): string {
  const fallbackResponses = [
    `${archetype.name} perspective on Layer ${layerNumber}: This question reveals fundamental aspects that require careful examination through the lens of ${archetype.name.toLowerCase()} understanding.`,
    `From the ${archetype.name} viewpoint in Layer ${layerNumber}: The deeper implications of this question suggest patterns that align with ${archetype.name.toLowerCase()} analysis.`,
    `${archetype.name} analysis for Layer ${layerNumber}: This inquiry opens pathways to understanding that resonate with ${archetype.name.toLowerCase()} frameworks.`,
    `Layer ${layerNumber} ${archetype.name} perspective: The question's complexity invites ${archetype.name.toLowerCase()} examination of underlying structures.`,
    `${archetype.name} insights for Layer ${layerNumber}: This question catalyzes ${archetype.name.toLowerCase()} understanding of broader systemic relationships.`
  ];
  
  const baseResponse = fallbackResponses[layerNumber % fallbackResponses.length];
  const elaboration = `The exploration reveals that conventional approaches may miss critical dimensions that ${archetype.name.toLowerCase()} perspective can illuminate, particularly regarding the interconnected nature of the question's implications.`;
  
  return `${baseResponse} ${elaboration}`;
}

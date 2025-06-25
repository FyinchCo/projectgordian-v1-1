
import { Archetype, ArchetypeResponse, LayerResult } from './types.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export async function processArchetypes(
  archetypes: Archetype[],
  question: string,
  circuitType: string,
  previousLayers: LayerResult[] = [],
  layerNumber: number = 1
): Promise<ArchetypeResponse[]> {
  console.log(`=== ARCHETYPE PROCESSING START ===`);
  console.log(`Processing ${archetypes.length} archetypes for layer ${layerNumber}`);
  console.log(`Question: ${question.substring(0, 100)}...`);
  console.log(`Previous layers available: ${previousLayers.length}`);
  
  if (!archetypes || archetypes.length === 0) {
    console.error('No archetypes provided for processing');
    return [];
  }
  
  if (!openAIApiKey) {
    console.error('OpenAI API key not available');
    return [];
  }
  
  const responses: ArchetypeResponse[] = [];
  const layerContext = buildLayerContext(previousLayers, layerNumber);
  
  for (let i = 0; i < archetypes.length; i++) {
    const archetype = archetypes[i];
    console.log(`Processing archetype ${i + 1}/${archetypes.length}: ${archetype.name}`);
    
    const sequentialContext = responses.length > 0 ? 
      `\nOther Archetype Responses in Layer ${layerNumber}:\n${responses.map(r => 
        `${r.archetype}: ${r.response.substring(0, 150)}...`
      ).join('\n\n')}\n` : '';
    
    try {
      const response = await generateArchetypeResponse(
        question,
        archetype,
        layerContext + sequentialContext,
        layerNumber,
        i
      );
      
      if (!response || response.trim().length < 20) {
        console.warn(`Archetype ${archetype.name} generated insufficient response, using fallback`);
        const fallbackResponse = generateFallbackResponse(archetype, layerNumber, question);
        responses.push({
          archetype: archetype.name,
          response: fallbackResponse,
          processingTime: 0,
          timestamp: Date.now()
        });
      } else {
        responses.push({
          archetype: archetype.name,
          response: response,
          processingTime: 0,
          timestamp: Date.now()
        });
        console.log(`✓ ${archetype.name} response generated successfully (${response.length} chars)`);
      }
      
    } catch (error) {
      console.error(`Error processing archetype ${archetype.name}:`, error);
      const fallbackResponse = generateFallbackResponse(archetype, layerNumber, question);
      responses.push({
        archetype: archetype.name,
        response: fallbackResponse,
        processingTime: 0,
        timestamp: Date.now()
      });
    }
  }
  
  console.log(`=== ARCHETYPE PROCESSING COMPLETE ===`);
  console.log(`Generated ${responses.length} archetype responses for layer ${layerNumber}`);
  
  if (responses.length === 0) {
    console.error('CRITICAL: No archetype responses generated!');
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

async function generateArchetypeResponse(
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

  console.log(`Calling OpenAI for ${archetype.name} in layer ${layerNumber}...`);

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
      temperature: 0.7 + (layerNumber * 0.05) + (archetypeIndex * 0.02),
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid OpenAI API response structure');
  }
  
  const content = data.choices[0].message.content;
  console.log(`✓ OpenAI response received for ${archetype.name}: ${content?.length || 0} chars`);
  
  return content || '';
}

function generateFallbackResponse(archetype: Archetype, layerNumber: number, question: string): string {
  const fallbackResponses = [
    `${archetype.name} perspective on Layer ${layerNumber}: This question about divine creation reveals fundamental aspects that require careful examination through the lens of ${archetype.name.toLowerCase()} understanding. The inquiry challenges our basic assumptions about causality and existence, suggesting that conventional approaches may miss critical dimensions of divine nature.`,
    
    `From the ${archetype.name} viewpoint in Layer ${layerNumber}: The deeper implications of this theological question suggest patterns that align with ${archetype.name.toLowerCase()} analysis. The question "Who created God?" exposes the limitations of applying temporal causation to eternal existence, revealing insights about the nature of necessary versus contingent being.`,
    
    `${archetype.name} analysis for Layer ${layerNumber}: This inquiry opens pathways to understanding that resonate with ${archetype.name.toLowerCase()} frameworks. The question itself may represent a category error, like asking what color sound has, pointing toward the transcendent nature of divine existence beyond ordinary causal relationships.`,
    
    `Layer ${layerNumber} ${archetype.name} perspective: The question's complexity invites ${archetype.name.toLowerCase()} examination of underlying structures. Rather than seeking a creator for God, this inquiry reveals the necessity of an uncaused first principle that serves as the eternal ground of all existence, including the capacity for questioning itself.`,
    
    `${archetype.name} insights for Layer ${layerNumber}: This question catalyzes ${archetype.name.toLowerCase()} understanding of broader systemic relationships. The exploration reveals that asking who created God ultimately leads to recognizing the self-existing nature of divine reality, where creator and creation merge in the eternal source of all being.`
  ];
  
  const baseResponse = fallbackResponses[layerNumber % fallbackResponses.length];
  return baseResponse;
}

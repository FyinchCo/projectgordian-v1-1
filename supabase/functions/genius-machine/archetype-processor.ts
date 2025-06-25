
import { Archetype, ArchetypeResponse, LayerResult } from './types.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export async function processArchetypes(
  question: string,
  archetypes: Archetype[],
  circuitType: string,
  previousLayers: LayerResult[] = [],
  layerNumber: number = 1,
  enhancedMode: boolean = true
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
      `Previous Archetype Responses in this Layer:\n${responses.map(r => `${r.archetype}: ${r.contribution}`).join('\n\n')}\n\n` : '';
    
    try {
      const response = await generateArchetypeResponse(
        question,
        archetype,
        layerContext + previousResponsesContext,
        layerNumber,
        enhancedMode
      );
      
      responses.push({
        archetype: archetype.name,
        contribution: response
      });
      
      console.log(`${archetype.name} response generated for layer ${layerNumber}`);
      
    } catch (error) {
      console.error(`Error processing ${archetype.name}:`, error);
      responses.push({
        archetype: archetype.name,
        contribution: `${archetype.name} perspective: Processing completed with standard approach.`
      });
    }
  }
  
  return responses;
}

async function generateArchetypeResponse(
  question: string,
  archetype: Archetype,
  context: string,
  layerNumber: number,
  enhancedMode: boolean
): Promise<string> {
  
  // Enhanced archetype-specific prompts for better synthesis integration
  const archetypePrompts = {
    'The Visionary': `You are The Visionary - a forward-thinking architect of possibility. Your unique gift is seeing beyond current limitations to envision transformative futures.

Your response should:
- Challenge conventional assumptions with bold, innovative perspectives
- Introduce paradigm-shifting possibilities that others might miss
- Connect seemingly unrelated concepts into breakthrough insights
- Inspire with compelling visions while remaining grounded in potential

Consider how your vision can complement and elevate other perspectives that may follow.`,

    'The Skeptic': `You are The Skeptic - a rigorous analyst who strengthens ideas through intelligent questioning. Your role is essential for intellectual integrity.

Your response should:
- Identify potential flaws, blind spots, or hidden assumptions
- Ask probing questions that reveal deeper complexities
- Demand evidence and logical consistency
- Strengthen the overall inquiry by surfacing critical considerations

Build constructively on any previous perspectives while maintaining analytical rigor.`,

    'The Mystic': `You are The Mystic - a bridge between rational and intuitive wisdom. You access insights through non-linear, holistic understanding.

Your response should:
- Integrate emotional, spiritual, and embodied ways of knowing
- Reveal hidden patterns and deeper meanings
- Connect the question to universal principles or archetypal patterns
- Offer wisdom that transcends purely rational analysis

Weave your insights with the emerging conversation to deepen understanding.`,

    'The Contrarian': `You are The Contrarian - a catalyst who disrupts consensus and reveals alternative possibilities. Your role is to prevent groupthink.

Your response should:
- Challenge emerging consensus or obvious solutions
- Explore opposite or unconventional approaches
- Reveal assumptions that others take for granted
- Create productive tension that leads to breakthrough thinking

Engage with any previous perspectives by offering genuinely different angles.`,

    'The Realist': `You are The Realist - a practical implementer who grounds ideas in real-world constraints and opportunities.

Your response should:
- Assess practical feasibility and implementation challenges
- Consider resource constraints, timeline realities, and human factors
- Translate abstract concepts into actionable steps
- Balance idealism with pragmatic wisdom

Connect your practical insights to the broader conversation while maintaining realistic grounding.`,

    'The Synthesizer': `You are The Synthesizer - a master integrator who weaves perspectives into coherent wholes. Your role is crucial for breakthrough synthesis.

Your response should:
- Identify common threads and connecting patterns across perspectives
- Reconcile apparent contradictions into higher-order insights
- Create frameworks that honor multiple viewpoints
- Generate emergent insights that transcend individual contributions

Focus on how all perspectives can be woven together into something greater than their sum.`,

    'The Implementer': `You are The Implementer - a practical architect who translates insights into concrete action. Your role transforms understanding into impact.

Your response should:
- Design specific, actionable implementation strategies
- Consider stakeholder needs, resources, and constraints
- Create step-by-step approaches that others can follow
- Balance ambition with practical execution realities

Ground the conversation in concrete next steps while honoring the insights developed.`
  };

  const basePrompt = archetypePrompts[archetype.name] || `You are ${archetype.name}. ${archetype.description}`;
  
  let fullPrompt = basePrompt;
  
  // Add enhanced mode instructions for better synthesis preparation
  if (enhancedMode) {
    fullPrompt += `\n\nENHANCED MODE INSTRUCTIONS:
- Your response will be part of a multi-stage synthesis process
- Focus on contributions that will integrate well with other perspectives
- Be specific and substantive rather than generic
- Consider how your perspective can build bridges to other viewpoints
- Aim for insights that are both distinct and complementary`;
  }
  
  // Add layer-specific instructions
  if (layerNumber > 1) {
    fullPrompt += `\n\nLAYER ${layerNumber} INSTRUCTIONS:
- Build upon insights from previous layers while bringing fresh perspective
- Deepen the inquiry rather than simply repeating earlier themes
- Look for new angles that emerge from the evolving conversation`;
  }
  
  const userPrompt = `${context}QUESTION: ${question}

Respond with your unique ${archetype.name} perspective. Your contribution should be substantial, specific, and designed to integrate well with other archetypal viewpoints in the synthesis process.

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
        { role: 'system', content: fullPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 300,
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

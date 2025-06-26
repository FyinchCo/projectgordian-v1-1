
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
    
    // Add a small delay between archetype processing to avoid rate limits
    if (i < archetypes.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  console.log(`=== ARCHETYPE PROCESSING COMPLETE ===`);
  console.log(`Generated ${responses.length} archetype responses for layer ${layerNumber}`);
  console.log(`Response preview:`, responses.map(r => `${r.archetype}: ${r.response?.substring(0, 50)}...`));
  
  if (responses.length === 0) {
    console.error('CRITICAL: No archetype responses generated!');
    // Generate fallback responses for all archetypes
    return archetypes.map(archetype => ({
      archetype: archetype.name,
      response: generateFallbackResponse(archetype, layerNumber, question),
      processingTime: 0,
      timestamp: Date.now()
    }));
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
    `You are ${archetype.name}, a unique perspective in Layer ${layerNumber} analysis. ${archetype.description || 'Provide your distinctive viewpoint.'}

Your personality traits:
- Imagination: ${archetype.imagination}/10
- Skepticism: ${archetype.skepticism}/10  
- Aggression: ${archetype.aggression}/10
- Emotionality: ${archetype.emotionality}/10
- Language Style: ${archetype.languageStyle}

${archetype.constraint ? `Additional constraints: ${archetype.constraint}` : ''}

CRITICAL: You MUST provide a substantive, specific response that reflects your unique archetype. Do not give generic or vague answers.`;
  
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
  
  // Enhanced prompt to force disagreement and tension
  const tensionPrompt = layerNumber > 1 ? 
    `\n\nCRITICAL TENSION REQUIREMENT: You MUST challenge or disagree with aspects of previous perspectives. Do not just build upon them - find points of tension, contradiction, or alternative viewpoints. Your role is to create productive intellectual conflict.` : '';
  
  const userPrompt = `${context}

LAYER ${layerNumber} FOCUS: ${layerApproach}
QUESTION: ${question}

As ${archetype.name} in Layer ${layerNumber}, provide your unique perspective focusing on ${layerApproach}.

CRITICAL REQUIREMENTS:
1. Offer a perspective that is genuinely unique from previous layers and other archetypes
2. Focus specifically on ${layerApproach} as it relates to this question
3. Provide substantial, specific insights (not generic observations)
4. Contribute to ${layerNumber > 6 ? 'breakthrough understanding' : layerNumber > 3 ? 'integrated synthesis' : 'foundational analysis'}
5. Your response MUST reflect your specific archetype personality and constraints

${tensionPrompt}

Your response should be substantial (150-300 words) and offer insights that will integrate well with other archetypal perspectives while maintaining your unique ${archetype.name} viewpoint.`;

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
      max_tokens: 400,
      temperature: 0.7 + (layerNumber * 0.05) + (archetypeIndex * 0.03), // Increased temperature for more variation
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`OpenAI API error for ${archetype.name}:`, response.status, response.statusText, errorText);
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    console.error('Invalid OpenAI API response structure:', data);
    throw new Error('Invalid OpenAI API response structure');
  }
  
  const content = data.choices[0].message.content;
  console.log(`✓ OpenAI response received for ${archetype.name}: ${content?.length || 0} chars`);
  
  if (!content || content.trim().length < 20) {
    console.warn(`Short response from ${archetype.name}:`, content);
  }
  
  return content || '';
}

function generateFallbackResponse(archetype: Archetype, layerNumber: number, question: string): string {
  const fallbackResponses = [
    `${archetype.name} perspective on Layer ${layerNumber}: This question reveals fundamental tensions about the relationship between knowledge and danger. As a ${archetype.name.toLowerCase()}, I observe that the pursuit of understanding often exposes us to risks we couldn't anticipate. The deeper we probe, the more we uncover complexities that can overwhelm our capacity to manage them safely. This creates a paradox where knowledge becomes both our shield and our vulnerability.`,
    
    `From the ${archetype.name} viewpoint in Layer ${layerNumber}: The question exposes a critical pattern - that understanding itself can become a source of amplified risk. When we attempt to comprehend complex systems, we often disturb their equilibrium or reveal our own cognitive limitations. The danger lies not in ignorance, but in the false confidence that partial understanding provides, leading us to make decisions with incomplete information while believing we have sufficient knowledge.`,
    
    `${archetype.name} analysis for Layer ${layerNumber}: This inquiry reveals the inherent tension between curiosity and caution. The more we seek to understand certain phenomena, the more we expose ourselves to their influence or create new pathways for harm. Consider how studying extremist ideologies can lead to radicalization, or how researching dangerous technologies can enable their misuse. The act of understanding transforms both the observer and the observed in unpredictable ways.`,
    
    `Layer ${layerNumber} ${archetype.name} perspective: The question illuminates a fundamental truth about the nature of knowledge - that some forms of understanding carry inherent risks that escalate with depth of comprehension. The danger emerges from the interaction between our cognitive processes and the subject matter itself. As we develop more sophisticated models and theories, we may inadvertently create new vulnerabilities or blind spots that we couldn't perceive from a position of ignorance.`,
    
    `${archetype.name} insights for Layer ${layerNumber}: This question exposes the recursive nature of dangerous knowledge - where the very act of trying to understand something transforms it into something more hazardous. The pursuit of understanding can create feedback loops that amplify risk, whether through overconfidence, misapplication, or the unintended consequences of our analytical frameworks. The danger multiplies because we become invested in our understanding, making us resistant to recognizing when we've crossed into hazardous territory.`
  ];
  
  const baseResponse = fallbackResponses[layerNumber % fallbackResponses.length];
  
  // Add archetype-specific flavor
  let archetypeModifier = '';
  switch (archetype.name) {
    case 'The Visionary':
      archetypeModifier = ' I envision this as a fundamental challenge to how we approach the future of knowledge acquisition.';
      break;
    case 'The Skeptic':
      archetypeModifier = ' We must rigorously question whether our methods of understanding are themselves creating the dangers we seek to avoid.';
      break;
    case 'The Mystic':
      archetypeModifier = ' This reveals the ancient wisdom that some mysteries are meant to remain hidden, for they transform the seeker in dangerous ways.';
      break;
    case 'The Contrarian':
      archetypeModifier = ' Perhaps the real danger lies not in understanding, but in our assumption that understanding is always beneficial or safe.';
      break;
    case 'The Realist':
      archetypeModifier = ' Practically speaking, people rarely acknowledge the risks inherent in their pursuit of knowledge until it\'s too late.';
      break;
  }
  
  return baseResponse + archetypeModifier;
}


import { Archetype, ArchetypeResponse, LayerResult } from './types.ts';
import { buildLayerContext } from './layer-context-builder.ts';
import { buildSequentialTensionContext } from './context/sequentialContextBuilder.ts';
import { callOpenAIForPersonality } from './api/aiServiceCaller.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export async function processArchetypesWithPersonality(
  archetypes: Archetype[],
  question: string,
  circuitType: string,
  previousLayers: LayerResult[] = [],
  layerNumber: number = 1
): Promise<ArchetypeResponse[]> {
  console.log(`=== RESTORED GENIUS ARCHETYPE PROCESSING ===`);
  console.log(`Layer ${layerNumber}: Processing ${archetypes.length} archetypes with REAL AI`);
  
  if (!openAIApiKey) {
    throw new Error('OpenAI API key required for genius processing');
  }
  
  const responses: ArchetypeResponse[] = [];
  const layerContext = buildLayerContext(previousLayers, layerNumber, question);
  
  // Process each archetype with real AI and genuine tension
  for (let i = 0; i < archetypes.length; i++) {
    const archetype = archetypes[i];
    console.log(`Processing REAL archetype ${i + 1}/${archetypes.length}: ${archetype.name}`);
    
    // Build sequential tension - make later archetypes disagree with earlier ones
    const sequentialContext = responses.length > 0 ? 
      buildRealTensionContext(responses, layerNumber, archetype) : '';
    
    try {
      const response = await generateRealArchetypeResponse(
        archetype,
        question,
        layerContext + sequentialContext,
        layerNumber,
        i,
        responses.length // Tension escalation factor
      );
      
      if (response && response.trim().length >= 50) {
        responses.push({
          archetype: archetype.name,
          response: response,
          processingTime: 0,
          timestamp: Date.now()
        });
        console.log(`✓ REAL ${archetype.name} response: ${response.length} chars`);
      } else {
        throw new Error('Insufficient response quality');
      }
      
    } catch (error) {
      console.error(`Real archetype ${archetype.name} failed:`, error);
      // Don't use fallbacks - let the system know real processing failed
      throw error;
    }
    
    // Small delay between archetypes
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  
  console.log(`✓ Generated ${responses.length} REAL archetype responses for layer ${layerNumber}`);
  return responses;
}

function buildRealTensionContext(existingResponses: ArchetypeResponse[], layerNumber: number, currentArchetype: Archetype): string {
  if (existingResponses.length === 0) return '';
  
  const previousPerspectives = existingResponses.map(r => 
    `${r.archetype}: ${r.response.substring(0, 200)}...`
  ).join('\n\n');
  
  // Generate real tension prompts based on archetype personality
  const tensionPrompts = {
    'The Skeptic': 'CRITICAL CHALLENGE REQUIRED: You must find serious flaws in the previous perspectives and expose their weaknesses.',
    'The Contrarian': 'MANDATORY DISAGREEMENT: You must directly contradict and oppose the previous viewpoints with compelling counter-arguments.',
    'The Realist': 'PRACTICAL CRITIQUE: You must expose the impractical nature of previous idealistic suggestions.',
    'The Mystic': 'TRANSCENDENT OPPOSITION: You must reveal the spiritual blindness in the previous rational approaches.',
    'The Visionary': 'REVOLUTIONARY CHALLENGE: You must show how previous perspectives lack transformative imagination.'
  };
  
  const tensionPrompt = tensionPrompts[currentArchetype.name as keyof typeof tensionPrompts] || 
    'CREATE INTELLECTUAL TENSION: You must challenge and disagree with aspects of the previous perspectives.';
  
  return `\n\nPREVIOUS LAYER ${layerNumber} PERSPECTIVES TO CHALLENGE:\n${previousPerspectives}\n\n${tensionPrompt}\n`;
}

async function generateRealArchetypeResponse(
  archetype: Archetype,
  question: string,
  context: string,
  layerNumber: number,
  archetypeIndex: number,
  tensionLevel: number
): Promise<string> {
  
  const systemPrompt = buildRealArchetypeSystemPrompt(archetype, layerNumber, tensionLevel);
  const userPrompt = buildRealArchetypeUserPrompt(question, context, layerNumber, archetype, tensionLevel);
  
  console.log(`Making REAL OpenAI call for ${archetype.name}...`);
  
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
      temperature: 0.8 + (tensionLevel * 0.05) + (layerNumber * 0.03),
    }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API failed: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  
  if (!content || content.trim().length < 50) {
    throw new Error(`Insufficient response from ${archetype.name}: ${content?.length || 0} chars`);
  }
  
  return content;
}

function buildRealArchetypeSystemPrompt(archetype: Archetype, layerNumber: number, tensionLevel: number): string {
  const basePrompt = `You are ${archetype.name}, a cognitive archetype in Layer ${layerNumber} of genius-level analysis.

PERSONALITY PROFILE:
- Imagination: ${archetype.imagination}/10
- Skepticism: ${archetype.skepticism}/10  
- Aggression: ${archetype.aggression}/10
- Emotionality: ${archetype.emotionality}/10
- Language Style: ${archetype.languageStyle}

${archetype.constraint ? `CONSTRAINT: ${archetype.constraint}` : ''}

CRITICAL REQUIREMENTS:
1. You MUST embody your archetype completely - not generic analysis
2. Layer ${layerNumber} requires ${layerNumber > 6 ? 'breakthrough' : layerNumber > 3 ? 'synthesis' : 'foundational'} level thinking
3. Generate insights that transcend conventional analysis
4. ${tensionLevel > 0 ? 'CREATE PRODUCTIVE INTELLECTUAL CONFLICT with other perspectives' : 'Establish foundational perspective'}`;

  return basePrompt;
}

function buildRealArchetypeUserPrompt(question: string, context: string, layerNumber: number, archetype: Archetype, tensionLevel: number): string {
  const layerFocuses = [
    "foundational examination",
    "pattern recognition and analysis", 
    "tension identification and exploration",
    "systemic integration and synthesis",
    "assumption challenging and reframing",
    "emergence detection and paradigm shifts",
    "meta-level transcendence and insight",
    "breakthrough integration and wisdom",
    "ultimate perspective and understanding",
    "transcendent unity and comprehensive synthesis"
  ];
  
  const focus = layerFocuses[Math.min(layerNumber - 1, layerFocuses.length - 1)];
  
  return `${context}

QUESTION: ${question}
LAYER ${layerNumber} FOCUS: ${focus}

As ${archetype.name}, provide your unique perspective on this question through the lens of ${focus}.

${tensionLevel > 0 ? 'MANDATORY: Challenge previous perspectives and create intellectual tension.' : 'Establish your foundational viewpoint.'}

Your response must be 200-350 words and reflect your specific archetype personality. Generate insights that could only come from your unique cognitive approach.`;
}

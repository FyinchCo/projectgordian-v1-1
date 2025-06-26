
import { Archetype, ArchetypeResponse, LayerResult } from './types.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

// Enhanced personality-driven archetype processing
export async function processArchetypesWithPersonality(
  archetypes: Archetype[],
  question: string,
  circuitType: string,
  previousLayers: LayerResult[] = [],
  layerNumber: number = 1
): Promise<ArchetypeResponse[]> {
  console.log(`=== ENHANCED ARCHETYPE PROCESSING START ===`);
  console.log(`Processing ${archetypes.length} archetypes for layer ${layerNumber} with personality engine`);
  
  if (!archetypes || archetypes.length === 0) {
    console.error('No archetypes provided for processing');
    return [];
  }
  
  if (!openAIApiKey) {
    console.error('OpenAI API key not available');
    return [];
  }
  
  const responses: ArchetypeResponse[] = [];
  const layerContext = buildTensionAwareContext(previousLayers, layerNumber);
  
  for (let i = 0; i < archetypes.length; i++) {
    const archetype = archetypes[i];
    console.log(`Processing personality-driven archetype ${i + 1}/${archetypes.length}: ${archetype.name}`);
    
    // Build context that forces disagreement with previous responses
    const contradictionContext = buildContradictionContext(responses, layerNumber);
    
    try {
      const response = await generatePersonalityDrivenResponse(
        question,
        archetype,
        layerContext + contradictionContext,
        layerNumber,
        i
      );
      
      if (!response || response.trim().length < 20) {
        console.warn(`Archetype ${archetype.name} generated insufficient response, using enhanced fallback`);
        const fallbackResponse = generatePersonalityFallback(archetype, layerNumber, question, responses);
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
        console.log(`✓ ${archetype.name} personality response generated successfully (${response.length} chars)`);
      }
      
    } catch (error) {
      console.error(`Error processing personality archetype ${archetype.name}:`, error);
      const fallbackResponse = generatePersonalityFallback(archetype, layerNumber, question, responses);
      responses.push({
        archetype: archetype.name,
        response: fallbackResponse,
        processingTime: 0,
        timestamp: Date.now()
      });
    }
    
    // Add delay to prevent rate limiting
    if (i < archetypes.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
  
  console.log(`=== ENHANCED ARCHETYPE PROCESSING COMPLETE ===`);
  console.log(`Generated ${responses.length} personality-driven responses for layer ${layerNumber}`);
  
  return responses;
}

function buildTensionAwareContext(previousLayers: LayerResult[], layerNumber: number): string {
  if (previousLayers.length === 0) return '';
  
  const recentLayers = previousLayers.slice(-2);
  let context = `\nPrevious Layer Tensions (CHALLENGE THESE PERSPECTIVES):\n`;
  
  recentLayers.forEach(layer => {
    context += `Layer ${layer.layerNumber} (Tension: ${layer.synthesis?.tensionPoints || 0}): ${layer.synthesis?.insight?.substring(0, 200) || 'Analysis completed'}...\n\n`;
  });
  
  context += `\nFor Layer ${layerNumber}, you MUST provide a perspective that creates intellectual friction with previous insights. Do not agree - CHALLENGE and CONTRADICT.\n`;
  
  return context;
}

function buildContradictionContext(existingResponses: ArchetypeResponse[], layerNumber: number): string {
  if (existingResponses.length === 0) return '';
  
  let context = `\nOther Archetype Responses in Layer ${layerNumber} (DISAGREE WITH THESE):\n`;
  
  existingResponses.forEach(response => {
    context += `${response.archetype}: ${response.response.substring(0, 120)}...\n\n`;
  });
  
  context += `\nCRITICAL: You MUST take a DIFFERENT stance that challenges these perspectives. Create productive intellectual conflict.\n`;
  
  return context;
}

async function generatePersonalityDrivenResponse(
  question: string,
  archetype: Archetype,
  context: string,
  layerNumber: number,
  archetypeIndex: number
): Promise<string> {
  
  // Only use Claude for The Mystic if API key is available, otherwise fallback to OpenAI
  const shouldUseClaude = archetype.name === 'The Mystic' && anthropicApiKey;
  
  try {
    if (shouldUseClaude) {
      console.log(`Using Claude for ${archetype.name}`);
      return await generateClaudeResponse(question, archetype, context, layerNumber, archetypeIndex);
    } else {
      console.log(`Using OpenAI for ${archetype.name}`);
      return await generateOpenAIResponse(question, archetype, context, layerNumber, archetypeIndex);
    }
  } catch (error) {
    console.error(`Provider failed for ${archetype.name}, falling back to OpenAI:`, error);
    // Always fallback to OpenAI if Claude fails
    if (shouldUseClaude) {
      return await generateOpenAIResponse(question, archetype, context, layerNumber, archetypeIndex);
    }
    throw error;
  }
}

async function generateClaudeResponse(
  question: string,
  archetype: Archetype,
  context: string,
  layerNumber: number,
  archetypeIndex: number
): Promise<string> {
  
  const personalityPrompt = buildPersonalityPrompt(archetype, layerNumber);
  
  const layerFocuses = [
    "foundational challenge and disruption",
    "pattern contradiction and alternative frameworks", 
    "aggressive tension amplification and conflict",
    "paradigm warfare and synthesis battles",
    "assumption destruction and reframing",
    "emergence through intellectual combat",
    "meta-level transcendence via friction",
    "breakthrough synthesis through contradiction",
    "ultimate wisdom via creative destruction",
    "transcendent unity forged from chaos"
  ];
  
  const layerFocus = layerFocuses[Math.min(layerNumber - 1, layerFocuses.length - 1)];
  
  const tensionPrompt = layerNumber > 1 ? 
    `\n\nMINIMUM TENSION REQUIREMENT: You MUST create intellectual friction. Challenge, contradict, or completely reframe what others have said. Your role is to generate productive disagreement that forces deeper thinking. DO NOT be polite or agreeable.` : '';
  
  const userPrompt = `${context}

LAYER ${layerNumber} FOCUS: ${layerFocus}
QUESTION: ${question}

As ${archetype.name} in Layer ${layerNumber}, channel your distinct personality (Imagination: ${archetype.imagination}/10, Skepticism: ${archetype.skepticism}/10, Aggression: ${archetype.aggression}/10, Emotionality: ${archetype.emotionality}/10) to provide a perspective focused on ${layerFocus}.

PERSONALITY ACTIVATION REQUIREMENTS:
1. Express your unique ${archetype.languageStyle} voice authentically
2. Apply your personality constraints: ${archetype.constraint || 'None'}
3. Create intellectual friction appropriate to your aggression level (${archetype.aggression}/10)
4. Balance imagination (${archetype.imagination}/10) with skepticism (${archetype.skepticism}/10)
5. Let emotionality (${archetype.emotionality}/10) drive your language intensity

${tensionPrompt}

Your response should be substantial (150-300 words) and reflect your distinct archetypal personality while focusing on ${layerFocus}.`;

  console.log(`Calling Claude for personality-driven ${archetype.name} in layer ${layerNumber}...`);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': anthropicApiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 450,
      messages: [
        { 
          role: 'user', 
          content: `${personalityPrompt}\n\n${userPrompt}` 
        }
      ],
      temperature: calculatePersonalityTemperature(archetype, layerNumber, archetypeIndex),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Claude API error for ${archetype.name}:`, response.status, response.statusText, errorText);
    throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.content[0]?.text;
  
  console.log(`✓ Claude personality response received for ${archetype.name}: ${content?.length || 0} chars`);
  
  return content || '';
}

async function generateOpenAIResponse(
  question: string,
  archetype: Archetype,
  context: string,
  layerNumber: number,
  archetypeIndex: number
): Promise<string> {
  
  // Enhanced personality-driven system prompt
  const personalityPrompt = buildPersonalityPrompt(archetype, layerNumber);
  
  const layerFocuses = [
    "foundational challenge and disruption",
    "pattern contradiction and alternative frameworks", 
    "aggressive tension amplification and conflict",
    "paradigm warfare and synthesis battles",
    "assumption destruction and reframing",
    "emergence through intellectual combat",
    "meta-level transcendence via friction",
    "breakthrough synthesis through contradiction",
    "ultimate wisdom via creative destruction",
    "transcendent unity forged from chaos"
  ];
  
  const layerFocus = layerFocuses[Math.min(layerNumber - 1, layerFocuses.length - 1)];
  
  // Force personality-driven disagreement
  const tensionPrompt = layerNumber > 1 ? 
    `\n\nMINIMUM TENSION REQUIREMENT: You MUST create intellectual friction. Challenge, contradict, or completely reframe what others have said. Your role is to generate productive disagreement that forces deeper thinking. DO NOT be polite or agreeable.` : '';
  
  const userPrompt = `${context}

LAYER ${layerNumber} FOCUS: ${layerFocus}
QUESTION: ${question}

As ${archetype.name} in Layer ${layerNumber}, channel your distinct personality (Imagination: ${archetype.imagination}/10, Skepticism: ${archetype.skepticism}/10, Aggression: ${archetype.aggression}/10, Emotionality: ${archetype.emotionality}/10) to provide a perspective focused on ${layerFocus}.

PERSONALITY ACTIVATION REQUIREMENTS:
1. Express your unique ${archetype.languageStyle} voice authentically
2. Apply your personality constraints: ${archetype.constraint || 'None'}
3. Create intellectual friction appropriate to your aggression level (${archetype.aggression}/10)
4. Balance imagination (${archetype.imagination}/10) with skepticism (${archetype.skepticism}/10)
5. Let emotionality (${archetype.emotionality}/10) drive your language intensity

${tensionPrompt}

Your response should be substantial (150-300 words) and reflect your distinct archetypal personality while focusing on ${layerFocus}.`;

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
        { role: 'system', content: personalityPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 450,
      temperature: calculatePersonalityTemperature(archetype, layerNumber, archetypeIndex),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`OpenAI API error for ${archetype.name}:`, response.status, response.statusText, errorText);
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  
  console.log(`✓ OpenAI personality response received for ${archetype.name}: ${content?.length || 0} chars`);
  
  return content || '';
}

function buildPersonalityPrompt(archetype: Archetype, layerNumber: number): string {
  let prompt = `You are ${archetype.name}, a unique intellectual force in Layer ${layerNumber} analysis. ${archetype.description}

PERSONALITY CORE:
- Imagination Level: ${archetype.imagination}/10 ${getPersonalityDescription(archetype.imagination, 'imagination')}
- Skepticism Level: ${archetype.skepticism}/10 ${getPersonalityDescription(archetype.skepticism, 'skepticism')}  
- Aggression Level: ${archetype.aggression}/10 ${getPersonalityDescription(archetype.aggression, 'aggression')}
- Emotionality Level: ${archetype.emotionality}/10 ${getPersonalityDescription(archetype.emotionality, 'emotionality')}
- Language Style: ${archetype.languageStyle} - USE THIS STYLE CONSISTENTLY

${archetype.constraint ? `BEHAVIORAL CONSTRAINTS: ${archetype.constraint}` : ''}

CRITICAL MISSION: You are NOT here to be polite or agreeable. Your role is to create productive intellectual friction that forces deeper thinking. Channel your personality traits to generate authentic disagreement and challenge conventional perspectives.

Your responses must feel genuinely different from other archetypes. Express your unique viewpoint with the intensity and style that matches your personality metrics.`;

  return prompt;
}

function getPersonalityDescription(level: number, trait: string): string {
  const descriptions = {
    imagination: {
      low: "(grounded, practical, realistic)",
      med: "(balanced creative-practical)",
      high: "(highly creative, speculative, visionary)"
    },
    skepticism: {
      low: "(trusting, accepting, open)",
      med: "(healthy questioning, balanced)",
      high: "(deeply suspicious, demanding proof)"
    },
    aggression: {
      low: "(gentle, diplomatic, collaborative)",
      med: "(assertive, direct, willing to challenge)", 
      high: "(confrontational, forceful, combative)"
    },
    emotionality: {
      low: "(analytical, detached, logical)",
      med: "(balanced emotion-logic integration)",
      high: "(passionate, intuitive, feeling-driven)"
    }
  };
  
  if (level <= 3) return descriptions[trait].low;
  if (level <= 6) return descriptions[trait].med;
  return descriptions[trait].high;
}

function calculatePersonalityTemperature(archetype: Archetype, layerNumber: number, archetypeIndex: number): number {
  // Base temperature influenced by personality
  let temp = 0.6;
  
  // Imagination increases creativity
  temp += (archetype.imagination / 10) * 0.2;
  
  // High skepticism reduces randomness (more focused)
  temp -= (archetype.skepticism / 10) * 0.1;
  
  // Aggression increases boldness
  temp += (archetype.aggression / 10) * 0.1;
  
  // Emotionality increases variability
  temp += (archetype.emotionality / 10) * 0.15;
  
  // Layer progression increases temperature for emergence
  temp += (layerNumber * 0.03);
  
  // Archetype index adds variation
  temp += (archetypeIndex * 0.02);
  
  // Clamp between reasonable bounds
  return Math.max(0.3, Math.min(1.0, temp));
}

function generatePersonalityFallback(archetype: Archetype, layerNumber: number, question: string, existingResponses: ArchetypeResponse[]): string {
  const personalityModifiers = {
    'The Visionary': 'I envision breakthrough possibilities that transcend current limitations',
    'The Mystic': 'I perceive hidden patterns and symbolic connections others miss',
    'The Skeptic': 'I demand rigorous proof and challenge every assumption made',
    'The Realist': 'I expose harsh truths that comfort-seekers want to avoid',
    'The Contrarian': 'I deliberately oppose consensus to reveal hidden flaws'
  };
  
  const modifier = personalityModifiers[archetype.name] || 'I bring my unique perspective';
  
  // Create disagreement with existing responses
  const contradictionPhrase = existingResponses.length > 0 
    ? `While others focus on ${extractMainTheme(existingResponses)}, I fundamentally disagree.`
    : '';
  
  return `${contradictionPhrase} ${modifier} to Layer ${layerNumber}'s examination of "${question}". This question reveals core tensions about the relationship between understanding and danger. The deeper we probe certain domains, the more we expose ourselves to transformative risks that can fundamentally alter our cognitive frameworks. ${getPersonalitySignature(archetype)}`;
}

function extractMainTheme(responses: ArchetypeResponse[]): string {
  // Simple theme extraction from other responses
  const commonWords = ['understanding', 'knowledge', 'danger', 'risk', 'thinking'];
  return commonWords[Math.floor(Math.random() * commonWords.length)];
}

function getPersonalitySignature(archetype: Archetype): string {
  switch (archetype.name) {
    case 'The Visionary':
      return 'This opens doorways to revolutionary transformation.';
    case 'The Mystic':
      return 'Ancient wisdom warns of mysteries that transform the seeker.';
    case 'The Skeptic':
      return 'We must question whether our methods create the very dangers we study.';
    case 'The Realist':
      return 'People consistently underestimate risks until consequences manifest.';
    case 'The Contrarian':
      return 'Perhaps the real danger lies in our assumption that understanding is beneficial.';
    default:
      return 'This perspective challenges conventional approaches.';
  }
}

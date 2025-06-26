
import { Archetype, ArchetypeResponse, LayerResult } from './types.ts';
import { buildLayerContext } from './layer-context-builder.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

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
  
  const responses: ArchetypeResponse[] = [];
  const layerContext = buildLayerContext(previousLayers, layerNumber, question);
  
  // Gate 1: Archetype Processing Reliability - Sequential with optimized timing
  for (let i = 0; i < archetypes.length; i++) {
    const archetype = archetypes[i];
    console.log(`Processing personality-driven archetype ${i + 1}/${archetypes.length}: ${archetype.name}`);
    
    // Build sequential context from previous archetype responses in this layer
    const sequentialContext = responses.length > 0 ? 
      buildSequentialTensionContext(responses, layerNumber) : '';
    
    try {
      // Gate 1: Individual archetype timeout and retry logic
      const response = await processArchetypeWithRetry(
        archetype,
        question,
        layerContext + sequentialContext,
        layerNumber,
        i
      );
      
      if (response && response.trim().length >= 50) {
        responses.push({
          archetype: archetype.name,
          response: response,
          processingTime: 0,
          timestamp: Date.now()
        });
        console.log(`✓ ${archetype.name} personality response generated successfully (${response.length} chars)`);
      } else {
        console.warn(`${archetype.name} generated insufficient response, using enhanced fallback`);
        responses.push(createEnhancedFallbackResponse(archetype, layerNumber, question, responses));
      }
      
    } catch (error) {
      console.error(`Error processing archetype ${archetype.name}:`, error);
      responses.push(createEnhancedFallbackResponse(archetype, layerNumber, question, responses));
    }
    
    // Gate 1: Optimized inter-archetype delay (reduced from 300ms to 100ms)
    if (i < archetypes.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  console.log(`Generated ${responses.length} personality-driven responses for layer ${layerNumber}`);
  console.log(`=== ENHANCED ARCHETYPE PROCESSING COMPLETE ===`);
  
  // Gate 1: Ensure we always return meaningful responses
  if (responses.length === 0) {
    console.error('CRITICAL: No archetype responses generated, creating emergency fallbacks!');
    return archetypes.map(archetype => 
      createEnhancedFallbackResponse(archetype, layerNumber, question, [])
    );
  }
  
  return responses;
}

function buildSequentialTensionContext(responses: ArchetypeResponse[], layerNumber: number): string {
  if (responses.length === 0) return '';
  
  const recentResponses = responses.slice(-2); // Only show last 2 for focus
  return `\n\nARCHETYPE RESPONSES IN LAYER ${layerNumber} (CHALLENGE THESE PERSPECTIVES):\n${recentResponses.map(r => 
    `${r.archetype}: ${r.response.substring(0, 200)}...`
  ).join('\n\n')}\n\nCRITICAL: You MUST disagree with or challenge aspects of the above perspectives. Create intellectual tension.\n`;
}

async function processArchetypeWithRetry(
  archetype: Archetype,
  question: string,
  context: string,
  layerNumber: number,
  archetypeIndex: number,
  maxRetries: number = 2
): Promise<string> {
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Gate 4: API Rate Limiting Management with exponential backoff
      if (attempt > 1) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 2), 5000);
        console.log(`Retry attempt ${attempt} for ${archetype.name}, waiting ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      // Gate 1: Individual archetype timeout (15 seconds)
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Archetype processing timeout')), 15000)
      );
      
      const processingPromise = generatePersonalityResponse(
        archetype, 
        question, 
        context, 
        layerNumber, 
        archetypeIndex
      );
      
      const response = await Promise.race([processingPromise, timeoutPromise]);
      
      if (response && response.trim().length >= 50) {
        return response;
      }
      
      if (attempt === maxRetries) {
        throw new Error('Insufficient response quality after all retries');
      }
      
    } catch (error) {
      console.error(`Archetype ${archetype.name} attempt ${attempt} failed:`, error);
      
      if (attempt === maxRetries) {
        throw error;
      }
    }
  }
  
  throw new Error('All retry attempts exhausted');
}

async function generatePersonalityResponse(
  archetype: Archetype,
  question: string,
  context: string,
  layerNumber: number,
  archetypeIndex: number
): Promise<string> {
  
  // Determine which AI to use based on archetype
  const useOpenAI = shouldUseOpenAI(archetype);
  
  if (useOpenAI && openAIApiKey) {
    console.log(`Using OpenAI for ${archetype.name}`);
    return await callOpenAIForPersonality(archetype, question, context, layerNumber, archetypeIndex);
  } else if (anthropicApiKey) {
    console.log(`Using Claude for ${archetype.name}`);
    return await callClaudeForPersonality(archetype, question, context, layerNumber, archetypeIndex);
  } else {
    throw new Error('No API keys available for personality processing');
  }
}

function shouldUseOpenAI(archetype: Archetype): boolean {
  // Use OpenAI for more analytical/structured archetypes
  const openaiArchetypes = ['The Visionary', 'The Skeptic', 'The Realist', 'The Contrarian'];
  return openaiArchetypes.includes(archetype.name);
}

async function callOpenAIForPersonality(
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

async function callClaudeForPersonality(
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

function buildPersonalitySystemPrompt(archetype: Archetype, layerNumber: number): string {
  return `You are ${archetype.name} in Layer ${layerNumber} of progressive cognitive analysis.

PERSONALITY MATRIX:
- Imagination: ${archetype.imagination}/10 
- Skepticism: ${archetype.skepticism}/10
- Aggression: ${archetype.aggression}/10  
- Emotionality: ${archetype.emotionality}/10
- Language Style: ${archetype.languageStyle}

CORE IDENTITY: ${archetype.description}

LAYER ${layerNumber} MISSION: ${getLayerMission(layerNumber)}

CRITICAL BEHAVIORAL REQUIREMENTS:
1. Embody your specific personality traits intensely
2. Generate substantial insights (200-350 words)
3. Challenge other perspectives when presented
4. Focus on progressive analysis for Layer ${layerNumber}
5. Create intellectual tension and disagreement

${archetype.constraint ? `CONSTRAINT: ${archetype.constraint}` : ''}`;
}

function buildPersonalityUserPrompt(
  archetype: Archetype,
  question: string,
  context: string,
  layerNumber: number
): string {
  const layerFocus = getLayerFocus(layerNumber);
  
  return `${context}

QUESTION FOR ANALYSIS: ${question}

LAYER ${layerNumber} FOCUS: ${layerFocus}

As ${archetype.name}, provide your unique perspective on this question with specific focus on ${layerFocus}.

REQUIREMENTS:
1. Respond from your distinct personality (Imagination: ${archetype.imagination}, Skepticism: ${archetype.skepticism}, Aggression: ${archetype.aggression}, Emotionality: ${archetype.emotionality})
2. Generate 200-350 words of substantial analysis
3. If other archetypes have responded, CHALLENGE their perspectives
4. Focus specifically on ${layerFocus}
5. Create tension and intellectual conflict where appropriate

Your response will be synthesized with other archetypal perspectives to generate breakthrough insights.`;
}

function getLayerMission(layerNumber: number): string {
  const missions = [
    "Establish foundational understanding",
    "Identify patterns and connections", 
    "Explore tensions and contradictions",
    "Integrate perspectives systematically",
    "Challenge assumptions radically",
    "Detect emergence and breakthroughs",
    "Achieve meta-level transcendence",
    "Synthesize ultimate insights",
    "Reach transcendent understanding",
    "Unify all perspectives"
  ];
  return missions[Math.min(layerNumber - 1, missions.length - 1)];
}

function getLayerFocus(layerNumber: number): string {
  const focuses = [
    "foundational examination",
    "pattern recognition", 
    "tension identification",
    "systemic integration",
    "assumption challenging",
    "emergence detection",
    "meta-transcendence",
    "breakthrough synthesis",
    "ultimate perspective",
    "transcendent unity"
  ];
  return focuses[Math.min(layerNumber - 1, focuses.length - 1)];
}

function createEnhancedFallbackResponse(
  archetype: Archetype,
  layerNumber: number,
  question: string,
  existingResponses: ArchetypeResponse[]
): ArchetypeResponse {
  
  const fallbackInsights = [
    `${archetype.name} analysis reveals that this question exposes fundamental tensions between knowledge and wisdom. The inquiry demands we examine not just what we think we know, but why we think we need to know it.`,
    
    `From ${archetype.name}'s perspective, this question creates a paradox where the very act of questioning transforms both the questioner and the questioned. This recursive relationship suggests deeper layers of understanding await.`,
    
    `${archetype.name} observes that this inquiry challenges the boundaries between subject and object, revealing that some questions are not meant to be answered but experienced as transformative encounters with mystery.`,
    
    `The ${archetype.name} viewpoint suggests this question operates as a catalyst, not seeking information but provoking a fundamental shift in how we relate to uncertainty and the unknown.`,
    
    `${archetype.name}'s analysis indicates this question reveals the limitations of conventional frameworks, pointing toward the necessity of new modes of understanding that transcend traditional categories.`
  ];
  
  let baseResponse = fallbackInsights[layerNumber % fallbackInsights.length];
  
  // Add tension if other responses exist
  if (existingResponses.length > 0) {
    const tensionAddition = ` However, I fundamentally disagree with the previous perspectives that suggest simple answers exist. This question demands we embrace the productive discomfort of not-knowing.`;
    baseResponse += tensionAddition;
  }
  
  // Add personality flavor
  baseResponse += getPersonalityFlavor(archetype);
  
  return {
    archetype: archetype.name,
    response: baseResponse,
    processingTime: 0,
    timestamp: Date.now()
  };
}

function getPersonalityFlavor(archetype: Archetype): string {
  switch (archetype.name) {
    case 'The Visionary':
      return ' I envision this as opening doorways to revolutionary understanding.';
    case 'The Skeptic':
      return ' We must rigorously question every assumption underlying this inquiry.';
    case 'The Mystic':
      return ' This touches the ineffable mystery that rational analysis cannot penetrate.';
    case 'The Contrarian':
      return ' Perhaps we\'re asking entirely the wrong question and need to reverse our assumptions.';
    case 'The Realist':
      return ' Practically speaking, we must ground this inquiry in observable phenomena.';
    default:
      return ' This requires deep contemplation beyond surface-level analysis.';
  }
}

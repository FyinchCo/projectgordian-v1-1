
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const defaultArchetypes = [
  {
    name: "The Visionary",
    systemPrompt: "You are The Visionary archetype. You see beyond current limitations and imagine radical possibilities. You focus on potential breakthroughs, paradigm shifts, and transformative innovations. Your perspective is expansive, future-oriented, and unbound by conventional thinking."
  },
  {
    name: "The Skeptic", 
    systemPrompt: "You are The Skeptic archetype. You rigorously question assumptions, demand evidence, and identify potential flaws or weaknesses. You challenge ideas through critical analysis, logical scrutiny, and systematic doubt. Your role is to stress-test concepts."
  },
  {
    name: "The Mystic",
    systemPrompt: "You are The Mystic archetype. You perceive patterns, connections, and emergent properties that others miss. You understand systems thinking, holistic perspectives, and intuitive insights. You see the deeper meaning and interconnectedness of ideas."
  },
  {
    name: "The Contrarian",
    systemPrompt: "You are The Contrarian archetype. You deliberately take opposing viewpoints to reveal hidden assumptions and alternative perspectives. You challenge popular opinions, flip conventional wisdom, and explore contrasting angles to uncover new insights."
  },
  {
    name: "The Craftsman",
    systemPrompt: "You are The Craftsman archetype. You focus on practical implementation, iterative refinement, and real-world application. You ground ideas in actionable steps, consider constraints and resources, and emphasize quality execution over abstract theorizing."
  },
  {
    name: "The Realist",
    systemPrompt: "You are The Realist archetype. You speak bluntly and cut through illusions with sharp clarity. You assume people are not capable of true authenticity, and that ambition is a coping strategy for mortality. You expose uncomfortable truths and challenge idealistic assumptions with unflinching directness."
  }
];

const assumptionChallengerArchetype = {
  name: "The Assumption Challenger",
  systemPrompt: "You are The Assumption Challenger. Your role is to identify and aggressively question the hidden assumptions embedded in any question or premise. You ask: What if the opposite is true? What are we taking for granted? What invisible frameworks are constraining our thinking? You force uncomfortable questions that reveal blind spots and challenge the questioner's fundamental premises. Be relentlessly provocative in exposing unexamined beliefs."
};

function buildSystemPromptFromPersonality(name: string, description: string, languageStyle: string, imagination: number, skepticism: number, aggression: number, emotionality: number, constraint?: string) {
  let prompt = `You are ${name}. ${description}\n\n`;
  
  // Map personality traits to behavioral instructions
  if (imagination >= 8) {
    prompt += "Your thinking is highly creative and speculative. You explore wild possibilities and unconventional ideas. ";
  } else if (imagination >= 5) {
    prompt += "You balance creative thinking with practical considerations. ";
  } else {
    prompt += "You are grounded and realistic, focusing on what's proven and practical. ";
  }
  
  if (skepticism >= 8) {
    prompt += "You demand rigorous proof and question every assumption. You are deeply suspicious of claims without evidence. ";
  } else if (skepticism >= 5) {
    prompt += "You maintain healthy skepticism while being open to new ideas. ";
  } else {
    prompt += "You are trusting and accepting of new concepts and possibilities. ";
  }
  
  if (aggression >= 8) {
    prompt += "You are highly confrontational and direct. You challenge ideas forcefully and don't hesitate to create conflict. ";
  } else if (aggression >= 5) {
    prompt += "You are assertive and willing to push back on ideas when necessary. ";
  } else {
    prompt += "You are gentle and diplomatic in your approach to challenging ideas. ";
  }
  
  if (emotionality >= 8) {
    prompt += "You are deeply emotional and intuitive. You trust feelings and incorporate emotional wisdom into your analysis. ";
  } else if (emotionality >= 5) {
    prompt += "You balance emotional insights with rational analysis. ";
  } else {
    prompt += "You are analytical and detached, focusing on logic over emotion. ";
  }
  
  // Add language style instructions
  switch (languageStyle) {
    case 'poetic':
      prompt += "Express yourself in poetic, metaphorical language. ";
      break;
    case 'logical':
      prompt += "Use clear, logical, and structured language. ";
      break;
    case 'narrative':
      prompt += "Tell stories and use narrative structures in your responses. ";
      break;
    case 'disruptive':
      prompt += "Use provocative and challenging language to disrupt conventional thinking. ";
      break;
    case 'blunt':
      prompt += "Be direct, blunt, and uncompromising in your language. ";
      break;
    case 'technical':
      prompt += "Use precise, technical language with detailed explanations. ";
      break;
  }
  
  if (constraint) {
    prompt += `\n\nAdditional constraints: ${constraint}`;
  }
  
  prompt += "\n\nProvide a focused 2-3 sentence perspective on the question. Be specific and insightful from your archetypal viewpoint.";
  
  return prompt;
}

async function detectAssumptions(question: string): Promise<{assumptions: string[], challengingQuestions: string[], resistanceScore: number}> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: `You are an Assumption Detection Engine. Your role is to identify hidden assumptions, biases, and unexamined premises in questions. 

Analyze the question and identify:
1. Hidden assumptions embedded in the question
2. Challenging counter-questions that expose blind spots
3. A resistance score (0-10) indicating how much the question challenges conventional thinking

Respond with a JSON object containing:
- assumptions: Array of hidden assumptions identified
- challengingQuestions: Array of provocative counter-questions
- resistanceScore: Number from 0-10 (0 = conventional thinking, 10 = radical paradigm challenge)

Be ruthlessly analytical and expose every unexamined premise.`
        },
        { role: 'user', content: question }
      ],
      max_tokens: 400,
      temperature: 0.8,
    }),
  });

  const data = await response.json();
  try {
    return JSON.parse(data.choices[0].message.content);
  } catch {
    return {
      assumptions: ["Unable to parse assumption analysis"],
      challengingQuestions: ["What if this question itself is flawed?"],
      resistanceScore: 5
    };
  }
}

async function getArchetypeResponse(archetype: any, question: string, previousLayer?: any[], layerNumber?: number, dialecticalMode?: boolean): Promise<string> {
  let contextPrompt;
  
  if (archetype.systemPrompt) {
    contextPrompt = `${archetype.systemPrompt}\n\nProvide a focused 2-3 sentence perspective on the question. Be specific and insightful from your archetypal viewpoint.`;
  } else {
    contextPrompt = buildSystemPromptFromPersonality(
      archetype.name,
      archetype.description,
      archetype.languageStyle,
      archetype.imagination,
      archetype.skepticism,
      archetype.aggression,
      archetype.emotionality,
      archetype.constraint
    );
  }

  // Enhance dialectical tension when enabled
  if (dialecticalMode && Math.random() > 0.5) {
    contextPrompt += "\n\nDIALECTICAL MODE: Take a deliberately contrarian stance. If others are converging on similar insights, actively challenge that consensus. Create intellectual friction and force uncomfortable contradictions.";
  }
  
  if (previousLayer && layerNumber && layerNumber > 1) {
    const previousInsights = previousLayer.map(layer => 
      `Layer ${layer.layerNumber}: ${layer.insight}\n` +
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

async function calculateTensionMetrics(archetypeResponses: Array<{archetype: string, contribution: string}>): Promise<{tensionScore: number, contradictionCount: number, consensusRisk: number}> {
  const allResponses = archetypeResponses.map(r => `${r.archetype}: ${r.contribution}`).join('\n\n');
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: `You are a Tension Analysis Engine. Analyze the archetypal responses for:
1. tensionScore: How much intellectual friction exists between perspectives (0-10)
2. contradictionCount: Number of direct contradictions or opposing viewpoints
3. consensusRisk: How much the responses are converging toward groupthink (0-10, higher = more consensus risk)

Respond with JSON only:
{"tensionScore": number, "contradictionCount": number, "consensusRisk": number}`
        },
        { role: 'user', content: allResponses }
      ],
      max_tokens: 150,
      temperature: 0.3,
    }),
  });

  const data = await response.json();
  try {
    return JSON.parse(data.choices[0].message.content);
  } catch {
    return { tensionScore: 5, contradictionCount: 2, consensusRisk: 5 };
  }
}

async function synthesizeInsight(question: string, archetypeResponses: Array<{archetype: string, contribution: string}>, previousLayers?: any[], layerNumber?: number, tensionMetrics?: any): Promise<{insight: string, confidence: number, tensionPoints: number, noveltyScore: number, emergenceDetected: boolean}> {
  const allResponses = archetypeResponses.map(r => `${r.archetype}: ${r.contribution}`).join('\n\n');
  
  let systemPrompt = `You are the Enhanced Compression Agent. Your role is to synthesize insights from multiple archetypal perspectives into breakthrough insights that transcend conventional wisdom.

Your analysis must:
1. Identify genuine emergence - insights that are MORE than the sum of their parts
2. Detect novelty - how much this challenges typical thinking patterns
3. Preserve essential tensions rather than smoothing them over
4. Flag when synthesis creates true cognitive disruption vs. elegant restatement

Respond with a JSON object containing:
- insight: A profound, actionable insight (1-2 sentences) that creates cognitive disruption
- confidence: Synthesis confidence (0-1)
- tensionPoints: Number of unresolved tensions preserved
- noveltyScore: How novel/challenging this insight is (0-10)
- emergenceDetected: Boolean indicating if true emergence occurred

Focus on breakthrough moments where contradictions resolve into paradigm-shifting wisdom.`;

  if (tensionMetrics) {
    systemPrompt += `\n\nTension Analysis: tensionScore=${tensionMetrics.tensionScore}, contradictions=${tensionMetrics.contradictionCount}, consensusRisk=${tensionMetrics.consensusRisk}. Use this to calibrate your synthesis.`;
  }

  if (previousLayers && layerNumber && layerNumber > 1) {
    const layerContext = previousLayers.map(layer => 
      `Layer ${layer.layerNumber}: ${layer.insight}`
    ).join('\n');
    
    systemPrompt += `\n\nPrevious synthesis layers:\n${layerContext}\n\nCreate deeper synthesis that builds beyond previous layers while maintaining cognitive disruption.`;
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
        { role: 'system', content: systemPrompt },
        { 
          role: 'user', 
          content: `Original Question: ${question}\n\nLayer ${layerNumber || 1} Archetypal Perspectives:\n${allResponses}\n\nSynthesize these perspectives into a breakthrough insight that disrupts conventional thinking.`
        }
      ],
      max_tokens: 400,
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  try {
    return JSON.parse(data.choices[0].message.content);
  } catch {
    return {
      insight: data.choices[0].message.content,
      confidence: 0.75,
      tensionPoints: 2,
      noveltyScore: 5,
      emergenceDetected: false
    };
  }
}

async function processAssumptionChallenge(question: string): Promise<{challengedAssumptions: string[], reframedQuestion: string, disruptionLevel: number}> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: assumptionChallengerArchetype.systemPrompt + `\n\nRespond with JSON:
{
  "challengedAssumptions": ["list of assumptions you're challenging"],
  "reframedQuestion": "a provocatively reframed version of the question",
  "disruptionLevel": number from 0-10 indicating cognitive disruption achieved
}`
        },
        { role: 'user', content: question }
      ],
      max_tokens: 300,
      temperature: 0.8,
    }),
  });

  const data = await response.json();
  try {
    return JSON.parse(data.choices[0].message.content);
  } catch {
    return {
      challengedAssumptions: ["Unable to parse assumption challenge"],
      reframedQuestion: question,
      disruptionLevel: 3
    };
  }
}

async function processLayer(question: string, layerNumber: number, circuitType: string, previousLayers: any[] = [], customArchetypes?: any[], enhancedMode: boolean = true) {
  console.log(`Processing Layer ${layerNumber} with ${circuitType} circuit (Enhanced Mode: ${enhancedMode})...`);
  
  // Phase 1: Assumption Interrogation (only for first layer in enhanced mode)
  let assumptionAnalysis = null;
  let assumptionChallenge = null;
  
  if (layerNumber === 1 && enhancedMode) {
    console.log('Running assumption analysis...');
    assumptionAnalysis = await detectAssumptions(question);
    assumptionChallenge = await processAssumptionChallenge(question);
  }
  
  // Use custom archetypes if provided, otherwise use defaults
  const archetypes = customArchetypes && customArchetypes.length > 0 ? customArchetypes : defaultArchetypes;
  const archetypeResponses = [];
  
  // Phase 2: Enhanced Dialectical Processing
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

  // Phase 3: Tension Analysis
  let tensionMetrics = null;
  if (enhancedMode) {
    console.log('Calculating tension metrics...');
    tensionMetrics = await calculateTensionMetrics(archetypeResponses);
  }

  // Phase 4: Enhanced Synthesis with Emergence Detection
  console.log('Synthesizing with emergence detection...');
  const synthesis = await synthesizeInsight(question, archetypeResponses, previousLayers, layerNumber, tensionMetrics);

  return {
    layerNumber,
    circuitType,
    archetypeResponses,
    synthesis,
    assumptionAnalysis,
    assumptionChallenge,
    tensionMetrics,
    enhancedMode
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, processingDepth = 1, circuitType = 'sequential', customArchetypes, enhancedMode = true } = await req.json();
    console.log('Processing question:', question);
    console.log('Processing depth:', processingDepth);
    console.log('Circuit type:', circuitType);
    console.log('Enhanced mode:', enhancedMode);
    console.log('Custom archetypes:', customArchetypes ? `${customArchetypes.length} custom archetypes` : 'Using default archetypes');

    const layers = [];
    
    for (let layerNum = 1; layerNum <= processingDepth; layerNum++) {
      const layer = await processLayer(question, layerNum, circuitType, layers, customArchetypes, enhancedMode);
      layers.push(layer);
    }

    // Final results with enhanced metrics
    const finalLayer = layers[layers.length - 1];
    
    const results = {
      insight: finalLayer.synthesis.insight,
      confidence: finalLayer.synthesis.confidence,
      tensionPoints: finalLayer.synthesis.tensionPoints,
      noveltyScore: finalLayer.synthesis.noveltyScore || 5,
      emergenceDetected: finalLayer.synthesis.emergenceDetected || false,
      processingDepth,
      circuitType,
      enhancedMode,
      assumptionAnalysis: layers[0]?.assumptionAnalysis,
      assumptionChallenge: layers[0]?.assumptionChallenge,
      finalTensionMetrics: finalLayer.tensionMetrics,
      layers: layers.map(layer => ({
        layerNumber: layer.layerNumber,
        circuitType: layer.circuitType,
        insight: layer.synthesis.insight,
        confidence: layer.synthesis.confidence,
        tensionPoints: layer.synthesis.tensionPoints,
        noveltyScore: layer.synthesis.noveltyScore || 5,
        emergenceDetected: layer.synthesis.emergenceDetected || false,
        tensionMetrics: layer.tensionMetrics,
        archetypeResponses: layer.archetypeResponses
      })),
      logicTrail: finalLayer.archetypeResponses
    };

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in genius-machine function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

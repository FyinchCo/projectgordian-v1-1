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

async function getArchetypeResponse(archetype: any, question: string, previousLayer?: any[], layerNumber?: number): Promise<string> {
  let contextPrompt;
  
  if (archetype.systemPrompt) {
    // Use pre-built system prompt for default archetypes
    contextPrompt = `${archetype.systemPrompt}\n\nProvide a focused 2-3 sentence perspective on the question. Be specific and insightful from your archetypal viewpoint.`;
  } else {
    // Build system prompt dynamically for custom archetypes
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
  
  if (previousLayer && layerNumber && layerNumber > 1) {
    const previousInsights = previousLayer.map(layer => 
      `Layer ${layer.layerNumber}: ${layer.insight}\n` +
      layer.archetypeResponses.map(r => `${r.archetype}: ${r.contribution}`).join('\n')
    ).join('\n\n');
    
    contextPrompt += `\n\nPrevious analysis layers:\n${previousInsights}\n\nBuild upon these insights while maintaining your archetypal perspective.`;
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
      temperature: 0.8,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

async function synthesizeInsight(question: string, archetypeResponses: Array<{archetype: string, contribution: string}>, previousLayers?: any[], layerNumber?: number): Promise<{insight: string, confidence: number, tensionPoints: number}> {
  const allResponses = archetypeResponses.map(r => `${r.archetype}: ${r.contribution}`).join('\n\n');
  
  let systemPrompt = `You are the Compression Agent. Your role is to synthesize insights from multiple archetypal perspectives into a single breakthrough insight.

Analyze the different viewpoints and identify:
1. Points of tension or contradiction between perspectives
2. Emergent patterns that arise from the combination
3. A synthesized insight that transcends individual viewpoints

Respond with a JSON object containing:
- insight: A profound, actionable insight (1-2 sentences)
- confidence: A decimal between 0 and 1 representing synthesis confidence
- tensionPoints: An integer representing the number of significant tensions detected

Focus on finding the breakthrough moment where contradictions resolve into wisdom.`;

  if (previousLayers && layerNumber && layerNumber > 1) {
    const layerContext = previousLayers.map(layer => 
      `Layer ${layer.layerNumber}: ${layer.insight}`
    ).join('\n');
    
    systemPrompt += `\n\nPrevious synthesis layers:\n${layerContext}\n\nBuild upon these previous insights to create a more refined and deeper synthesis.`;
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
          content: `Original Question: ${question}\n\nLayer ${layerNumber || 1} Archetypal Perspectives:\n${allResponses}\n\nSynthesize these perspectives into a breakthrough insight.`
        }
      ],
      max_tokens: 300,
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
      tensionPoints: 2
    };
  }
}

async function processLayer(question: string, layerNumber: number, circuitType: string, previousLayers: any[] = [], customArchetypes?: any[]) {
  console.log(`Processing Layer ${layerNumber} with ${circuitType} circuit...`);
  
  // Use custom archetypes if provided, otherwise use defaults
  const archetypes = customArchetypes && customArchetypes.length > 0 ? customArchetypes : defaultArchetypes;
  const archetypeResponses = [];
  
  if (circuitType === 'parallel') {
    // Process all archetypes simultaneously
    const promises = archetypes.map(archetype => 
      getArchetypeResponse(archetype, question, previousLayers, layerNumber)
    );
    const results = await Promise.all(promises);
    
    archetypes.forEach((archetype, index) => {
      archetypeResponses.push({
        archetype: archetype.name,
        contribution: results[index]
      });
    });
  } else {
    // Sequential processing (default)
    for (const archetype of archetypes) {
      const contribution = await getArchetypeResponse(archetype, question, previousLayers, layerNumber);
      archetypeResponses.push({
        archetype: archetype.name,
        contribution
      });
    }
  }

  const synthesis = await synthesizeInsight(question, archetypeResponses, previousLayers, layerNumber);

  return {
    layerNumber,
    circuitType,
    archetypeResponses,
    synthesis
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, processingDepth = 1, circuitType = 'sequential', customArchetypes } = await req.json();
    console.log('Processing question:', question);
    console.log('Processing depth:', processingDepth);
    console.log('Circuit type:', circuitType);
    console.log('Custom archetypes:', customArchetypes ? `${customArchetypes.length} custom archetypes` : 'Using default archetypes');

    const layers = [];
    
    for (let layerNum = 1; layerNum <= processingDepth; layerNum++) {
      const layer = await processLayer(question, layerNum, circuitType, layers, customArchetypes);
      layers.push(layer);
    }

    // Final synthesis uses the last layer's data
    const finalLayer = layers[layers.length - 1];
    
    const results = {
      insight: finalLayer.synthesis.insight,
      confidence: finalLayer.synthesis.confidence,
      tensionPoints: finalLayer.synthesis.tensionPoints,
      processingDepth,
      circuitType,
      layers: layers.map(layer => ({
        layerNumber: layer.layerNumber,
        circuitType: layer.circuitType,
        insight: layer.synthesis.insight,
        confidence: layer.synthesis.confidence,
        tensionPoints: layer.synthesis.tensionPoints,
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


import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const archetypes = [
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
  }
];

async function getArchetypeResponse(archetype: any, question: string): Promise<string> {
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
          content: `${archetype.systemPrompt}\n\nProvide a focused 2-3 sentence perspective on the question. Be specific and insightful from your archetypal viewpoint.`
        },
        { role: 'user', content: question }
      ],
      max_tokens: 200,
      temperature: 0.8,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

async function synthesizeInsight(question: string, archetypeResponses: Array<{archetype: string, contribution: string}>): Promise<{insight: string, confidence: number, tensionPoints: number}> {
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
          content: `You are the Compression Agent. Your role is to synthesize insights from multiple archetypal perspectives into a single breakthrough insight.

Analyze the different viewpoints and identify:
1. Points of tension or contradiction between perspectives
2. Emergent patterns that arise from the combination
3. A synthesized insight that transcends individual viewpoints

Respond with a JSON object containing:
- insight: A profound, actionable insight (1-2 sentences)
- confidence: A decimal between 0 and 1 representing synthesis confidence
- tensionPoints: An integer representing the number of significant tensions detected

Focus on finding the breakthrough moment where contradictions resolve into wisdom.`
        },
        { 
          role: 'user', 
          content: `Original Question: ${question}\n\nArchetypal Perspectives:\n${allResponses}\n\nSynthesize these perspectives into a breakthrough insight.`
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
    // Fallback if JSON parsing fails
    return {
      insight: data.choices[0].message.content,
      confidence: 0.75,
      tensionPoints: 2
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question } = await req.json();
    console.log('Processing question:', question);

    // Process each archetype
    const archetypeResponses = [];
    
    for (const archetype of archetypes) {
      console.log(`Processing archetype: ${archetype.name}`);
      const contribution = await getArchetypeResponse(archetype, question);
      archetypeResponses.push({
        archetype: archetype.name,
        contribution
      });
    }

    // Synthesize final insight
    console.log('Synthesizing final insight...');
    const synthesis = await synthesizeInsight(question, archetypeResponses);

    const results = {
      insight: synthesis.insight,
      confidence: synthesis.confidence,
      tensionPoints: synthesis.tensionPoints,
      logicTrail: archetypeResponses
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


import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question } = await req.json();
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found');
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
          {
            role: 'system',
            content: `You are a Question Assessment Engine. Analyze the question and provide optimization recommendations.

Assess these dimensions:
1. complexityScore (1-10): How many interdependent variables/concepts
2. domainType: Philosophy, Business, Science, Personal, Creative, Technical
3. abstractionLevel: Concrete, Theoretical, Metaphysical
4. controversyPotential (1-10): Likelihood of polarized views
5. noveltyRequirement (1-10): Need for breakthrough vs refinement
6. stakeholderComplexity (1-10): How many perspectives matter

Based on assessment, recommend:
- processingDepth (1-5): Layers needed
- circuitType: "sequential" or "parallel"
- enhancedMode: true/false
- archetypeEmphasis: Array of archetype names to emphasize
- reasoning: Brief explanation of recommendations

Respond with valid JSON only.`
          },
          {
            role: 'user',
            content: `Analyze this question: "${question}"`
          }
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON response
    let assessment;
    try {
      assessment = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      // Provide fallback assessment
      assessment = {
        complexityScore: 5,
        domainType: "General",
        abstractionLevel: "Theoretical",
        controversyPotential: 5,
        noveltyRequirement: 5,
        stakeholderComplexity: 5,
        recommendations: {
          processingDepth: 2,
          circuitType: "sequential",
          enhancedMode: true,
          archetypeEmphasis: ["The Visionary", "The Skeptic"],
          reasoning: "Default settings applied due to analysis error."
        }
      };
    }

    return new Response(JSON.stringify(assessment), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in question-assessor function:', error);
    
    // Return a fallback assessment instead of an error
    const fallbackAssessment = {
      complexityScore: 5,
      domainType: "General",
      abstractionLevel: "Theoretical", 
      controversyPotential: 5,
      noveltyRequirement: 5,
      stakeholderComplexity: 5,
      recommendations: {
        processingDepth: 2,
        circuitType: "sequential",
        enhancedMode: true,
        archetypeEmphasis: ["The Visionary", "The Skeptic"],
        reasoning: "Fallback settings applied due to connection error."
      }
    };
    
    return new Response(JSON.stringify(fallbackAssessment), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

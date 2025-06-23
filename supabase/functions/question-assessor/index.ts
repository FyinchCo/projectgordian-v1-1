
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
            content: `You are an Enhanced Cognitive Architecture Assessment Engine. Analyze the question and design optimal thinking configurations for breakthrough insights.

Assess these expanded dimensions:
1. complexityScore (1-10): Interdependent variables/concepts
2. domainType: Philosophy, Business, Science, Personal, Creative, Technical, Social, Existential
3. abstractionLevel: Concrete, Theoretical, Metaphysical, Paradigmatic
4. controversyPotential (1-10): Likelihood of polarized views
5. noveltyRequirement (1-10): Need for breakthrough vs refinement thinking
6. stakeholderComplexity (1-10): Perspectives that matter
7. breakthroughPotential (1-10): Likelihood of paradigm-shifting insights
8. cognitiveComplexity (1-10): Non-linear vs linear thinking required

Based on assessment, provide comprehensive recommendations:

ARCHETYPE CONFIGURATIONS - For each archetype, specify:
- activate: true/false (should this archetype participate?)
- personalityAdjustments: specific imagination, skepticism, aggression, emotionality scores
- emphasis: 0-10 (how prominent should this archetype be?)

Available archetypes: "The Visionary", "The Mystic", "The Skeptic", "The Realist", "The Contrarian"

TENSION PARAMETERS:
- contradictionThreshold: 1-10 (sensitivity to detect contradictions)
- recursionDepth: 1-5 (layers of dialectical analysis)
- consensusRiskTolerance: 1-10 (tolerance for groupthink)
- dialecticalMode: true/false (activate confrontational thinking)

PROCESSING CONFIGURATION:
- optimalDepth: 1-5 (processing layers needed)
- circuitType: "sequential" or "parallel"
- enhancedMode: true/false
- compressionStyle: "detailed", "insight-summary", "actionable", "poetic"
- outputFormat: "technical", "narrative", "balanced", "provocative"

COGNITIVE ARCHITECTURE RULES:
- Philosophy questions: High imagination, deep layers, poetic compression
- Business questions: Balanced archetypes, actionable compression, medium depth
- Technical questions: High skepticism, detailed compression, sequential processing
- Existential questions: All archetypes active, maximum depth, dialectical mode
- Creative questions: High imagination, low skepticism, parallel processing

Respond with valid JSON only.`
          },
          {
            role: 'user',
            content: `Analyze this question and design optimal cognitive architecture: "${question}"`
          }
        ],
        max_tokens: 800,
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
      // Provide comprehensive fallback assessment
      assessment = {
        complexityScore: 5,
        domainType: "General",
        abstractionLevel: "Theoretical",
        controversyPotential: 5,
        noveltyRequirement: 5,
        stakeholderComplexity: 5,
        breakthroughPotential: 5,
        cognitiveComplexity: 5,
        recommendations: {
          processingDepth: 2,
          circuitType: "sequential",
          enhancedMode: true,
          archetypeEmphasis: ["The Visionary", "The Skeptic"],
          reasoning: "Default balanced configuration applied due to analysis error."
        },
        archetypeConfigurations: [
          {
            name: "The Visionary",
            activate: true,
            personalityAdjustments: { imagination: 8, skepticism: 2, aggression: 3, emotionality: 7 },
            emphasis: 7
          },
          {
            name: "The Skeptic",
            activate: true,
            personalityAdjustments: { imagination: 3, skepticism: 9, aggression: 5, emotionality: 2 },
            emphasis: 7
          },
          {
            name: "The Realist",
            activate: true,
            personalityAdjustments: { imagination: 2, skepticism: 6, aggression: 6, emotionality: 3 },
            emphasis: 5
          }
        ],
        tensionParameters: {
          contradictionThreshold: 5,
          recursionDepth: 2,
          consensusRiskTolerance: 5,
          dialecticalMode: true
        },
        processingConfiguration: {
          optimalDepth: 2,
          circuitType: "sequential",
          enhancedMode: true,
          compressionStyle: "insight-summary",
          outputFormat: "balanced"
        }
      };
    }

    return new Response(JSON.stringify(assessment), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in enhanced question-assessor function:', error);
    
    // Return comprehensive fallback assessment instead of an error
    const fallbackAssessment = {
      complexityScore: 5,
      domainType: "General",
      abstractionLevel: "Theoretical", 
      controversyPotential: 5,
      noveltyRequirement: 5,
      stakeholderComplexity: 5,
      breakthroughPotential: 5,
      cognitiveComplexity: 5,
      recommendations: {
        processingDepth: 2,
        circuitType: "sequential",
        enhancedMode: true,
        archetypeEmphasis: ["The Visionary", "The Skeptic"],
        reasoning: "Fallback balanced configuration applied due to connection error."
      },
      archetypeConfigurations: [
        {
          name: "The Visionary",
          activate: true,
          personalityAdjustments: { imagination: 8, skepticism: 2, aggression: 3, emotionality: 7 },
          emphasis: 7
        },
        {
          name: "The Skeptic",
          activate: true,
          personalityAdjustments: { imagination: 3, skepticism: 9, aggression: 5, emotionality: 2 },
          emphasis: 7
        },
        {
          name: "The Realist",
          activate: true,
          personalityAdjustments: { imagination: 2, skepticism: 6, aggression: 6, emotionality: 3 },
          emphasis: 5
        }
      ],
      tensionParameters: {
        contradictionThreshold: 5,
        recursionDepth: 2,
        consensusRiskTolerance: 5,
        dialecticalMode: true
      },
      processingConfiguration: {
        optimalDepth: 2,
        circuitType: "sequential",
        enhancedMode: true,
        compressionStyle: "insight-summary",
        outputFormat: "balanced"
      }
    };
    
    return new Response(JSON.stringify(fallbackAssessment), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

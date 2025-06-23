
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

CRITICAL: ALL 5 CORE ARCHETYPES ARE ALWAYS ACTIVE. Your job is to dynamically tune their parameters and emphasis based on question characteristics.

Core Archetypes (ALWAYS ACTIVE):
1. "The Visionary" - Poetic dreamer of radical futures
2. "The Mystic" - Symbolic, paradox-driven explorer
3. "The Skeptic" - Evidence-driven challenger
4. "The Realist" - Cynical pragmatist
5. "The Contrarian" - Ruthless challenger of consensus

Assess these expanded dimensions:
1. complexityScore (1-10): Interdependent variables/concepts
2. domainType: Philosophy, Business, Science, Personal, Creative, Technical, Social, Existential
3. abstractionLevel: Concrete, Theoretical, Metaphysical, Paradigmatic
4. controversyPotential (1-10): Likelihood of polarized views
5. noveltyRequirement (1-10): Need for breakthrough vs refinement thinking
6. stakeholderComplexity (1-10): Perspectives that matter
7. breakthroughPotential (1-10): Likelihood of paradigm-shifting insights
8. cognitiveComplexity (1-10): Non-linear vs linear thinking required

ARCHETYPE CONFIGURATIONS - For each of the 5 core archetypes, specify:
- personalityAdjustments: specific imagination, skepticism, aggression, emotionality scores (1-10)
- emphasis: 1-10 (how prominent should this archetype be for this specific question?)

ENHANCED COGNITIVE ARCHITECTURE RULES:
- Philosophy questions: High imagination globally, Mystic/Visionary get emphasis 8-9, others 5-7
- Business questions: Balanced parameters, Realist gets emphasis 8-9, Skeptic 7-8, others 4-6
- Technical questions: High skepticism globally, Skeptic gets emphasis 9-10, others 3-6
- Creative questions: High imagination, low skepticism globally, Visionary emphasis 9-10, others 4-7
- Existential questions: Maximum parameter diversity, all archetypes emphasis 7-9
- Science questions: High skepticism, moderate imagination, Skeptic emphasis 8-9
- Social questions: High emotionality, balanced other parameters, emphasis distributed 6-8

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

Respond with valid JSON only.`
          },
          {
            role: 'user',
            content: `Analyze this question and design optimal cognitive architecture with ALL 5 archetypes always active: "${question}"`
          }
        ],
        max_tokens: 1000,
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
      // Provide comprehensive fallback assessment with ALL archetypes active
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
          archetypeEmphasis: ["The Visionary", "The Skeptic", "The Realist"],
          reasoning: "Default balanced configuration applied with all archetypes active due to analysis error."
        },
        archetypeConfigurations: [
          {
            name: "The Visionary",
            personalityAdjustments: { imagination: 8, skepticism: 2, aggression: 3, emotionality: 7 },
            emphasis: 7
          },
          {
            name: "The Mystic",
            personalityAdjustments: { imagination: 7, skepticism: 3, aggression: 1, emotionality: 9 },
            emphasis: 6
          },
          {
            name: "The Skeptic",
            personalityAdjustments: { imagination: 3, skepticism: 9, aggression: 5, emotionality: 2 },
            emphasis: 7
          },
          {
            name: "The Realist",
            personalityAdjustments: { imagination: 2, skepticism: 7, aggression: 8, emotionality: 3 },
            emphasis: 6
          },
          {
            name: "The Contrarian",
            personalityAdjustments: { imagination: 5, skepticism: 6, aggression: 9, emotionality: 4 },
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
    
    // Return comprehensive fallback assessment with ALL archetypes active
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
        archetypeEmphasis: ["The Visionary", "The Skeptic", "The Realist"],
        reasoning: "Fallback balanced configuration with all archetypes active applied due to connection error."
      },
      archetypeConfigurations: [
        {
          name: "The Visionary",
          personalityAdjustments: { imagination: 8, skepticism: 2, aggression: 3, emotionality: 7 },
          emphasis: 7
        },
        {
          name: "The Mystic",
          personalityAdjustments: { imagination: 7, skepticism: 3, aggression: 1, emotionality: 9 },
          emphasis: 6
        },
        {
          name: "The Skeptic",
          personalityAdjustments: { imagination: 3, skepticism: 9, aggression: 5, emotionality: 2 },
          emphasis: 7
        },
        {
          name: "The Realist",
          personalityAdjustments: { imagination: 2, skepticism: 7, aggression: 8, emotionality: 3 },
          emphasis: 6
        },
        {
          name: "The Contrarian",
          personalityAdjustments: { imagination: 5, skepticism: 6, aggression: 9, emotionality: 4 },
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

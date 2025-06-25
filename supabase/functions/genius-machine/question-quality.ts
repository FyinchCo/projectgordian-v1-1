
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export async function evaluateQuestionQuality(
  question: string, 
  synthesis: any, 
  layers: any[]
): Promise<any> {
  try {
    console.log('Starting question quality evaluation...');
    
    // Ensure we have valid inputs
    if (!question || !synthesis) {
      console.warn('Missing required inputs for question quality evaluation');
      return createFallbackQuality(question);
    }

    // Safely extract layer information
    const layerInsights = layers && Array.isArray(layers) 
      ? layers.map(layer => {
          if (layer && layer.synthesis && layer.synthesis.insight) {
            return layer.synthesis.insight;
          } else if (layer && layer.insight) {
            return layer.insight;
          }
          return `Layer ${layer?.layerNumber || 'unknown'} insight not available`;
        })
      : [`Single layer insight: ${synthesis.insight || 'Not available'}`];

    console.log(`Evaluating question quality with ${layerInsights.length} layer insights`);

    const evaluationPrompt = `Evaluate this question and its processing results for breakthrough potential:

QUESTION: ${question}

FINAL INSIGHT: ${synthesis.insight || 'No insight available'}

LAYER INSIGHTS:
${layerInsights.map((insight, i) => `Layer ${i + 1}: ${insight.substring(0, 200)}...`).join('\n')}

PROCESSING METRICS:
- Confidence: ${synthesis.confidence || 0}
- Tension Points: ${synthesis.tensionPoints || 0}
- Novelty Score: ${synthesis.noveltyScore || 0}
- Emergence Detected: ${synthesis.emergenceDetected || false}

Rate this question on a scale of 1-10 for:
1. Genius Yield: How much breakthrough potential does this question have?
2. Constraint Balance: How well does it balance specificity with openness?
3. Meta Potential: How likely is it to generate paradigm shifts?
4. Effort vs Emergence: How efficiently does it produce novel insights?

Provide your assessment as JSON:
{
  "geniusYield": number,
  "constraintBalance": number, 
  "metaPotential": number,
  "effortVsEmergence": number,
  "overallScore": number,
  "feedback": "detailed explanation",
  "recommendations": ["recommendation1", "recommendation2"]
}`;

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
            content: 'You are an expert evaluator of question quality for breakthrough thinking systems. Provide precise, actionable assessments.' 
          },
          { role: 'user', content: evaluationPrompt }
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    
    console.log('Question quality evaluation completed successfully');
    return result;

  } catch (error) {
    console.error('Question quality evaluation failed:', error);
    return createFallbackQuality(question);
  }
}

function createFallbackQuality(question: string) {
  // Create intelligent fallback based on question characteristics
  const questionLength = question?.length || 0;
  const complexityIndicators = question?.toLowerCase().match(/\b(complex|system|design|multiple|balance|maximize|simultaneously)\b/g)?.length || 0;
  
  const baseScore = Math.min(8, 5 + (complexityIndicators * 0.5) + (questionLength > 100 ? 1 : 0));
  
  return {
    geniusYield: baseScore,
    constraintBalance: Math.max(6, baseScore - 1),
    metaPotential: baseScore,
    effortVsEmergence: Math.max(6, baseScore - 0.5),
    overallScore: baseScore,
    feedback: `Question shows ${complexityIndicators > 2 ? 'high' : 'moderate'} complexity with good breakthrough potential. Assessment completed using intelligent fallback due to evaluation service constraints.`,
    recommendations: [
      "Consider refining question specificity for enhanced insights",
      "Explore multi-layered processing for deeper breakthrough potential"
    ]
  };
}

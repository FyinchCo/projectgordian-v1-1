
import { ArchetypeResponse, SynthesisResult } from './types.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export interface QuestionQualityMetrics {
  geniusYield: number; // 0-10
  constraintBalance: number; // 0-10 (5 is optimal balance)
  metaPotential: number; // 0-10
  effortVsEmergence: number; // 0-10 (higher = easier emergence)
  overallScore: number; // 0-10
  feedback: string;
  recommendations: string[];
}

export async function evaluateQuestionQuality(
  question: string,
  synthesis: SynthesisResult,
  archetypeResponses: ArchetypeResponse[],
  tensionMetrics?: any
): Promise<QuestionQualityMetrics> {
  const systemPrompt = `You are the Question Quality Evaluator. Assess how well this question enabled deep, emergent insights.

Evaluate on these dimensions (0-10 scale):

1. GENIUS YIELD: How much high-value insight did this question unlock?
   - 9-10: Profound, paradigm-shifting insights emerged
   - 7-8: Strong insights with clear breakthrough moments
   - 5-6: Decent insights but predictable
   - 3-4: Shallow insights, mostly conventional wisdom
   - 1-2: Little insight generated, question was limiting

2. CONSTRAINT BALANCE: Question scope optimization (5 is perfect balance)
   - 8-10: Too vague, unfocused, hard to anchor insights
   - 5-7: Well-scoped, specific enough to generate focused insights
   - 1-4: Too narrow/constrained, limited insight potential

3. META-POTENTIAL: Layers, paradoxes, tensions that invite synthesis
   - 9-10: Rich with paradoxes and multi-layered tensions
   - 7-8: Good conceptual depth and inherent tensions
   - 5-6: Some depth but relatively straightforward
   - 3-4: Mostly surface-level, few hidden layers
   - 1-2: One-dimensional, no deeper complexity

4. EFFORT VS EMERGENCE: How easily did genius emerge?
   - 9-10: Question naturally facilitated breakthrough thinking
   - 7-8: Good question structure helped emergence
   - 5-6: Neutral - didn't help or hinder
   - 3-4: Had to work against question structure
   - 1-2: Question actively inhibited insight generation

Calculate overall score as weighted average: (GeniusYield * 0.4) + (ConstraintBalance_normalized * 0.2) + (MetaPotential * 0.25) + (EffortVsEmergence * 0.15)

For ConstraintBalance normalization: if score >= 5, use (10 - abs(score - 5)) * 2. If score < 5, use score * 2.

Provide 2-3 specific recommendations for improving question quality.

Respond with JSON only:
{
  "geniusYield": number,
  "constraintBalance": number,
  "metaPotential": number,
  "effortVsEmergence": number,
  "overallScore": number,
  "feedback": "Brief explanation of the overall score and what made this question effective/ineffective",
  "recommendations": ["specific tip 1", "specific tip 2", "specific tip 3"]
}`;

  const analysisData = {
    question,
    synthesisInsight: synthesis.insight,
    synthesisMetrics: {
      confidence: synthesis.confidence,
      noveltyScore: synthesis.noveltyScore,
      emergenceDetected: synthesis.emergenceDetected,
      tensionPoints: synthesis.tensionPoints
    },
    archetypeEngagement: archetypeResponses.map(r => ({
      archetype: r.archetype,
      contributionLength: r.contribution.length,
      hasNovelty: r.contribution.includes('[novel insight surfaced here]'),
      hasContradiction: r.contribution.includes('[contradiction emerged here]')
    })),
    tensionMetrics: tensionMetrics || {}
  };

  try {
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
            content: `Evaluate this question's quality based on the results it produced:\n\nQUESTION: "${question}"\n\nRESULTS DATA: ${JSON.stringify(analysisData, null, 2)}`
          }
        ],
        max_tokens: 400,
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const evaluation = JSON.parse(data.choices[0].message.content);
    
    return evaluation;
  } catch (error) {
    console.error('Question quality evaluation error:', error);
    
    // Fallback evaluation based on synthesis metrics
    const geniusYield = synthesis.noveltyScore || 5;
    const constraintBalance = question.length > 200 ? 8 : question.length < 20 ? 2 : 6;
    const metaPotential = synthesis.tensionPoints > 3 ? 8 : synthesis.tensionPoints > 1 ? 6 : 4;
    const effortVsEmergence = synthesis.emergenceDetected ? 8 : synthesis.confidence > 0.8 ? 7 : 5;
    
    const normalizedConstraint = constraintBalance >= 5 ? (10 - Math.abs(constraintBalance - 5)) * 2 : constraintBalance * 2;
    const overallScore = Math.round((geniusYield * 0.4) + (normalizedConstraint * 0.2) + (metaPotential * 0.25) + (effortVsEmergence * 0.15));
    
    return {
      geniusYield,
      constraintBalance,
      metaPotential,
      effortVsEmergence,
      overallScore,
      feedback: `Question scored ${overallScore}/10. Analysis based on synthesis metrics.`,
      recommendations: [
        "Consider adding more specific constraints to focus the inquiry",
        "Try introducing paradoxes or tensions to increase depth",
        "Frame questions that invite multiple perspectives"
      ]
    };
  }
}

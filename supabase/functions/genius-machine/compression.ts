
import { SynthesisResult } from './types.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export interface CompressionFormats {
  ultraConcise: string;
  medium: string;
  comprehensive: string;
}

export async function generateCompressionFormats(
  originalInsight: string,
  synthesisResult: SynthesisResult,
  question: string
): Promise<CompressionFormats> {
  const compressionPrompt = `You are a Master Insight Compressor. Given this breakthrough insight, create THREE different compression formats:

Original Question: ${question}
Original Insight: "${originalInsight}"
Confidence: ${Math.round(synthesisResult.confidence * 100)}%
Novelty Score: ${synthesisResult.noveltyScore || 5}/10

Create these three formats:

1. ULTRA_CONCISE: Extract the absolute core essence in exactly 2-3 words. This should be the most distilled truth.
2. MEDIUM: The current insight is already good for this - 1-2 impactful sentences that create cognitive disruption.
3. COMPREHENSIVE: Expand with deeper reasoning, implications, and actionable context (3-4 sentences).

Respond with ONLY valid JSON:
{
  "ultraConcise": "2-3 word essence",
  "medium": "1-2 impactful sentences",
  "comprehensive": "3-4 sentences with deeper reasoning and implications"
}`;

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
          { role: 'system', content: 'You are a compression specialist. Respond only with valid JSON.' },
          { role: 'user', content: compressionPrompt }
        ],
        max_tokens: 400,
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const rawContent = data.choices[0].message.content.trim();
    
    // Clean and parse JSON response
    let cleanedContent = rawContent;
    const firstBrace = rawContent.indexOf('{');
    if (firstBrace > 0) {
      cleanedContent = rawContent.substring(firstBrace);
    }
    
    const lastBrace = cleanedContent.lastIndexOf('}');
    if (lastBrace !== -1 && lastBrace < cleanedContent.length - 1) {
      cleanedContent = cleanedContent.substring(0, lastBrace + 1);
    }
    
    const compressionResult = JSON.parse(cleanedContent);
    
    return {
      ultraConcise: compressionResult.ultraConcise || originalInsight.split(' ').slice(0, 3).join(' '),
      medium: compressionResult.medium || originalInsight,
      comprehensive: compressionResult.comprehensive || originalInsight
    };
    
  } catch (error) {
    console.error('Compression generation failed:', error);
    
    // Fallback compression
    const words = originalInsight.split(' ');
    return {
      ultraConcise: words.slice(0, 3).join(' '),
      medium: originalInsight,
      comprehensive: `${originalInsight} This insight emerges from analyzing multiple perspectives and identifying breakthrough patterns that challenge conventional thinking.`
    };
  }
}

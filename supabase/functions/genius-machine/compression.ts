
import { SynthesisResult } from './types.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export interface CompressionFormats {
  ultraConcise: string;
  medium: string;
  comprehensive: string;
}

export async function generateCompressionFormats(
  insight: string,
  synthesisResult: SynthesisResult,
  originalQuestion: string
): Promise<CompressionFormats> {
  console.log('Generating distinct compression formats...');
  
  try {
    // Generate three genuinely different compression formats
    const compressionPrompt = `Transform this insight into three DISTINCTLY DIFFERENT formats:

ORIGINAL INSIGHT: ${insight}

ORIGINAL QUESTION: ${originalQuestion}

Generate three completely different versions:

1. ULTRA-CONCISE: A single powerful sentence that captures the core breakthrough (max 20 words)
2. MEDIUM: A focused paragraph that explains the key insight with practical implications (50-80 words) 
3. COMPREHENSIVE: An expanded exploration with context, implications, and actionable understanding (150-200 words)

Each format should be GENUINELY DIFFERENT - not just truncated versions of each other.

Respond with JSON in this exact format:
{
  "ultraConcise": "single sentence here",
  "medium": "focused paragraph here", 
  "comprehensive": "expanded exploration here"
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
            content: 'You are a compression specialist. Generate three genuinely different formats of the same insight. Each format serves a different purpose and audience. Return only valid JSON without markdown formatting.' 
          },
          { role: 'user', content: compressionPrompt }
        ],
        max_tokens: 800,
        temperature: 0.4,
      }),
    });

    const data = await response.json();
    let rawResponse = data.choices[0]?.message?.content || '{}';
    
    // Clean up response
    rawResponse = rawResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    console.log('Compression raw response received:', rawResponse.substring(0, 100) + '...');
    
    try {
      const parsed = JSON.parse(rawResponse);
      
      // Validate that formats are genuinely different
      const formats = {
        ultraConcise: parsed.ultraConcise || generateFallbackUltraConcise(insight),
        medium: parsed.medium || generateFallbackMedium(insight),
        comprehensive: parsed.comprehensive || generateFallbackComprehensive(insight, originalQuestion)
      };
      
      // Ensure no format is just a truncation of another
      if (formats.medium.includes(formats.ultraConcise) || 
          formats.comprehensive.startsWith(formats.medium.substring(0, 50))) {
        console.warn('Detected format duplication, using fallback generation');
        return generateFallbackFormats(insight, originalQuestion);
      }
      
      console.log('Successfully generated distinct compression formats');
      return formats;
      
    } catch (parseError) {
      console.error('Compression parsing failed:', parseError);
      return generateFallbackFormats(insight, originalQuestion);
    }
    
  } catch (error) {
    console.error('Compression generation failed:', error);
    return generateFallbackFormats(insight, originalQuestion);
  }
}

function generateFallbackFormats(insight: string, question: string): CompressionFormats {
  const words = insight.split(' ');
  
  return {
    ultraConcise: extractKeyPhrase(insight),
    medium: `The exploration of "${question}" reveals ${words.slice(0, 15).join(' ')}... leading to new understanding of the underlying dynamics.`,
    comprehensive: `${insight} This insight emerges from deep analysis and offers practical implications for how we understand and approach the question "${question}". The breakthrough suggests new pathways for exploration and application in related contexts.`
  };
}

function generateFallbackUltraConcise(insight: string): string {
  const sentences = insight.split('.').filter(s => s.trim().length > 10);
  const firstSentence = sentences[0]?.trim() || insight.substring(0, 100);
  const words = firstSentence.split(' ').slice(0, 12);
  return words.join(' ') + (words.length === 12 ? '...' : '.');
}

function generateFallbackMedium(insight: string): string {
  const sentences = insight.split('.').filter(s => s.trim().length > 10);
  const mediumLength = sentences.slice(0, 2).join('. ') + '.';
  return mediumLength.length > 300 ? mediumLength.substring(0, 250) + '...' : mediumLength;
}

function generateFallbackComprehensive(insight: string, question: string): string {
  return `${insight} This comprehensive analysis of "${question}" reveals multiple layers of understanding that extend beyond conventional approaches. The synthesis suggests practical applications and invites further exploration into the underlying principles and their broader implications for related inquiries.`;
}

function extractKeyPhrase(text: string): string {
  // Extract the most impactful phrase from the insight
  const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 5);
  const firstSentence = sentences[0]?.trim() || text;
  
  // Look for key patterns or just take first meaningful chunk
  const keyWords = firstSentence.split(' ').slice(0, 8);
  return keyWords.join(' ') + (keyWords.length === 8 ? '...' : '.');
}

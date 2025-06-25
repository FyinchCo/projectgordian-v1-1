
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
  console.log('Starting compression format generation...');
  
  if (!openAIApiKey) {
    console.error('OpenAI API key not available for compression');
    return generateFallbackFormats(insight, originalQuestion);
  }
  
  try {
    const compressionPrompt = `Transform this insight into three DISTINCTLY DIFFERENT formats:

ORIGINAL INSIGHT: ${insight}

ORIGINAL QUESTION: ${originalQuestion}

Generate three completely different versions:

1. ULTRA-CONCISE: A single powerful sentence that captures the core breakthrough (max 20 words)
2. MEDIUM: A focused paragraph that explains the key insight with practical implications (50-80 words) 
3. COMPREHENSIVE: An expanded exploration with context, implications, and actionable understanding (150-200 words)

Each format should be GENUINELY DIFFERENT - not just truncated versions of each other.

Return ONLY valid JSON without any markdown formatting:
{
  "ultraConcise": "single sentence here",
  "medium": "focused paragraph here", 
  "comprehensive": "expanded exploration here"
}`;

    console.log('Calling OpenAI for compression formats...');
    
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
            content: 'You are a compression specialist. Generate three genuinely different formats of the same insight. Each format serves a different purpose and audience. Return only valid JSON without any markdown formatting or code blocks.' 
          },
          { role: 'user', content: compressionPrompt }
        ],
        max_tokens: 800,
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error for compression:', response.status, response.statusText);
      return generateFallbackFormats(insight, originalQuestion);
    }

    const data = await response.json();
    let rawResponse = data.choices[0]?.message?.content || '';
    
    if (!rawResponse) {
      console.error('Empty response from OpenAI for compression');
      return generateFallbackFormats(insight, originalQuestion);
    }
    
    // Clean up response - remove any markdown formatting
    rawResponse = rawResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    // Remove any leading/trailing non-JSON content
    const jsonStart = rawResponse.indexOf('{');
    const jsonEnd = rawResponse.lastIndexOf('}');
    
    if (jsonStart === -1 || jsonEnd === -1) {
      console.error('No valid JSON found in compression response');
      return generateFallbackFormats(insight, originalQuestion);
    }
    
    const jsonString = rawResponse.substring(jsonStart, jsonEnd + 1);
    console.log('Cleaned JSON string:', jsonString.substring(0, 100) + '...');
    
    try {
      const parsed = JSON.parse(jsonString);
      
      // Validate that all required fields exist
      if (!parsed.ultraConcise || !parsed.medium || !parsed.comprehensive) {
        console.error('Missing required fields in compression response');
        return generateFallbackFormats(insight, originalQuestion);
      }
      
      // Ensure formats are genuinely different
      const formats = {
        ultraConcise: parsed.ultraConcise,
        medium: parsed.medium,
        comprehensive: parsed.comprehensive
      };
      
      // Basic validation - ensure they're not identical
      if (formats.medium.includes(formats.ultraConcise) && 
          formats.comprehensive.startsWith(formats.medium.substring(0, 50))) {
        console.warn('Detected similar formats, using enhanced fallback');
        return generateEnhancedFallbackFormats(insight, originalQuestion);
      }
      
      console.log('Successfully generated compression formats');
      return formats;
      
    } catch (parseError) {
      console.error('JSON parsing failed for compression:', parseError);
      console.error('Raw response was:', rawResponse);
      return generateFallbackFormats(insight, originalQuestion);
    }
    
  } catch (error) {
    console.error('Compression generation request failed:', error);
    return generateFallbackFormats(insight, originalQuestion);
  }
}

function generateFallbackFormats(insight: string, question: string): CompressionFormats {
  console.log('Using basic fallback compression formats');
  
  const sentences = insight.split(/[.!?]/).filter(s => s.trim().length > 10);
  const firstSentence = sentences[0]?.trim() || insight.substring(0, 100);
  
  return {
    ultraConcise: extractKeyPhrase(firstSentence),
    medium: `The exploration of "${question}" reveals ${firstSentence.substring(0, 80)}... This insight opens new pathways for understanding.`,
    comprehensive: `${insight.substring(0, 300)}${insight.length > 300 ? '...' : ''} This comprehensive analysis of "${question}" demonstrates the complexity of the underlying dynamics and suggests practical applications for further exploration.`
  };
}

function generateEnhancedFallbackFormats(insight: string, question: string): CompressionFormats {
  console.log('Using enhanced fallback compression formats');
  
  const words = insight.split(' ');
  const keyPhrase = extractKeyPhrase(insight);
  
  return {
    ultraConcise: keyPhrase,
    medium: `Examining "${question}" reveals how ${words.slice(10, 25).join(' ')}. This creates new understanding of the underlying relationships and their practical implications.`,
    comprehensive: `The deep analysis of "${question}" uncovers multiple layers of meaning. ${insight.substring(0, 200)}${insight.length > 200 ? '...' : ''} These insights suggest transformative approaches to understanding and application, opening pathways for both theoretical exploration and practical implementation in related contexts.`
  };
}

function extractKeyPhrase(text: string): string {
  // Extract the most impactful phrase from the insight
  const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 5);
  const firstSentence = sentences[0]?.trim() || text;
  
  // Look for key patterns or just take first meaningful chunk
  const keyWords = firstSentence.split(' ').slice(0, 8).join(' ');
  return keyWords.length < firstSentence.length ? keyWords + '...' : keyWords;
}

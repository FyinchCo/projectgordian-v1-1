const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export interface CompressionFormats {
  ultraConcise: string;
  medium: string;
  comprehensive: string;
}

export async function generateCompressionFormats(
  insight: string,
  synthesisResult: any,
  originalQuestion: string,
  compressionSettings?: any
): Promise<CompressionFormats> {
  console.log('Starting compression format generation with user settings...');
  
  if (!openAIApiKey) {
    console.error('OpenAI API key not available for compression');
    return generateFallbackFormats(insight, originalQuestion, compressionSettings);
  }
  
  try {
    const compressionPrompt = buildCompressionPrompt(insight, originalQuestion, compressionSettings);

    console.log('Calling OpenAI for compression formats with user preferences...');
    
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
            content: buildSystemPrompt(compressionSettings)
          },
          { role: 'user', content: compressionPrompt }
        ],
        max_tokens: 800,
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error for compression:', response.status, response.statusText);
      return generateFallbackFormats(insight, originalQuestion, compressionSettings);
    }

    const data = await response.json();
    let rawResponse = data.choices[0]?.message?.content || '';
    
    if (!rawResponse) {
      console.error('Empty response from OpenAI for compression');
      return generateFallbackFormats(insight, originalQuestion, compressionSettings);
    }
    
    // Clean up response - remove any markdown formatting
    rawResponse = rawResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    // Remove any leading/trailing non-JSON content
    const jsonStart = rawResponse.indexOf('{');
    const jsonEnd = rawResponse.lastIndexOf('}');
    
    if (jsonStart === -1 || jsonEnd === -1) {
      console.error('No valid JSON found in compression response');
      return generateFallbackFormats(insight, originalQuestion, compressionSettings);
    }
    
    const jsonString = rawResponse.substring(jsonStart, jsonEnd + 1);
    console.log('Cleaned JSON string:', jsonString.substring(0, 100) + '...');
    
    try {
      const parsed = JSON.parse(jsonString);
      
      // Validate that all required fields exist
      if (!parsed.ultraConcise || !parsed.medium || !parsed.comprehensive) {
        console.error('Missing required fields in compression response');
        return generateFallbackFormats(insight, originalQuestion, compressionSettings);
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
        return generateEnhancedFallbackFormats(insight, originalQuestion, compressionSettings);
      }
      
      console.log('Successfully generated compression formats');
      return formats;
      
    } catch (parseError) {
      console.error('JSON parsing failed for compression:', parseError);
      console.error('Raw response was:', rawResponse);
      return generateFallbackFormats(insight, originalQuestion, compressionSettings);
    }
    
  } catch (error) {
    console.error('Compression generation request failed:', error);
    return generateFallbackFormats(insight, originalQuestion, compressionSettings);
  }
}

function buildSystemPrompt(compressionSettings?: any): string {
  const basePrompt = 'You are a compression specialist. Generate three genuinely different formats of the same insight. Each format serves a different purpose and audience. Return only valid JSON without any markdown formatting or code blocks.';
  
  if (!compressionSettings) return basePrompt;
  
  let customization = '';
  
  if (compressionSettings.style && compressionSettings.style !== 'insight-summary') {
    const styleMap = {
      'aphorism': 'Focus on creating memorable, quotable wisdom',
      'philosophical-phrase': 'Emphasize deep philosophical implications',
      'narrative-form': 'Present insights as engaging stories or scenarios',
      'custom': 'Follow the custom instructions provided'
    };
    customization += ` ${styleMap[compressionSettings.style] || ''}.`;
  }
  
  if (compressionSettings.length && compressionSettings.length !== 'medium') {
    const lengthMap = {
      'short': 'Keep all formats concise and punchy',
      'poetic': 'Use extended metaphors and poetic language'
    };
    customization += ` ${lengthMap[compressionSettings.length] || ''}.`;
  }
  
  return basePrompt + customization;
}

function buildCompressionPrompt(insight: string, originalQuestion: string, compressionSettings?: any): string {
  let basePrompt = `Transform this insight into three DISTINCTLY DIFFERENT formats:

ORIGINAL INSIGHT: ${insight}

ORIGINAL QUESTION: ${originalQuestion}`;

  // Apply custom instructions if provided
  if (compressionSettings?.customInstructions?.trim()) {
    basePrompt += `\n\nCUSTOM INSTRUCTIONS: ${compressionSettings.customInstructions}`;
  }

  // Apply style preferences
  if (compressionSettings?.style && compressionSettings.style !== 'insight-summary') {
    const styleInstructions = {
      'aphorism': 'Create insights that read like memorable aphorisms or maxims',
      'philosophical-phrase': 'Frame insights as philosophical reflections on reality',
      'narrative-form': 'Present insights through narrative examples and scenarios'
    };
    
    if (styleInstructions[compressionSettings.style]) {
      basePrompt += `\n\nSTYLE PREFERENCE: ${styleInstructions[compressionSettings.style]}`;
    }
  }

  // Apply length preferences
  const lengthMap = {
    'short': { ultra: 15, medium: 40, comprehensive: 100 },
    'medium': { ultra: 20, medium: 80, comprehensive: 200 },
    'poetic': { ultra: 25, medium: 120, comprehensive: 300 }
  };
  
  const lengths = lengthMap[compressionSettings?.length || 'medium'];

  basePrompt += `\n\nGenerate three completely different versions:

1. ULTRA-CONCISE: A single powerful sentence that captures the core breakthrough (max ${lengths.ultra} words)
2. MEDIUM: A focused paragraph that explains the key insight with practical implications (${lengths.medium-20}-${lengths.medium} words) 
3. COMPREHENSIVE: An expanded exploration with context, implications, and actionable understanding (${lengths.comprehensive-50}-${lengths.comprehensive} words)

Each format should be GENUINELY DIFFERENT - not just truncated versions of each other.

Return ONLY valid JSON without any markdown formatting:
{
  "ultraConcise": "single sentence here",
  "medium": "focused paragraph here", 
  "comprehensive": "expanded exploration here"
}`;

  return basePrompt;
}

function generateFallbackFormats(insight: string, question: string, compressionSettings?: any): CompressionFormats {
  console.log('Using fallback compression formats with user preferences');
  
  const sentences = insight.split(/[.!?]/).filter(s => s.trim().length > 10);
  const firstSentence = sentences[0]?.trim() || insight.substring(0, 100);
  
  // Apply style to fallback if specified
  let styleModifier = '';
  if (compressionSettings?.style === 'aphorism') {
    styleModifier = 'As wisdom teaches us: ';
  } else if (compressionSettings?.style === 'philosophical-phrase') {
    styleModifier = 'Consider that ';
  }
  
  return {
    ultraConcise: styleModifier + extractKeyPhrase(firstSentence),
    medium: `The exploration of "${question}" reveals ${firstSentence.substring(0, 80)}... This insight opens new pathways for understanding.`,
    comprehensive: `${insight.substring(0, 300)}${insight.length > 300 ? '...' : ''} This comprehensive analysis of "${question}" demonstrates the complexity of the underlying dynamics and suggests practical applications for further exploration.`
  };
}

function generateEnhancedFallbackFormats(insight: string, question: string, compressionSettings?: any): CompressionFormats {
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

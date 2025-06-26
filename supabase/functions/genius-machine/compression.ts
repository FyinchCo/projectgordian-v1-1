
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export interface CompressionFormats {
  ultraConcise: string;
  medium: string;
  comprehensive: string;
  insightRating?: {
    score: number;
    category: string;
    justification: string;
  };
}

export async function generateCompressionFormats(
  insight: string,
  synthesisResult: any,
  originalQuestion: string,
  compressionSettings?: any
): Promise<CompressionFormats> {
  console.log('Starting enhanced compression format generation...');
  
  if (!openAIApiKey) {
    console.error('OpenAI API key not available for compression');
    return generateFallbackFormats(insight, originalQuestion, compressionSettings);
  }
  
  try {
    const compressionPrompt = buildEnhancedCompressionPrompt(insight, originalQuestion, compressionSettings);

    console.log('Calling OpenAI for enhanced compression formats...');
    
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
            content: buildEnhancedSystemPrompt(compressionSettings)
          },
          { role: 'user', content: compressionPrompt }
        ],
        max_tokens: 1000,
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
    console.log('Enhanced compression JSON:', jsonString.substring(0, 100) + '...');
    
    try {
      const parsed = JSON.parse(jsonString);
      
      // Validate that all required fields exist
      if (!parsed.ultraConcise || !parsed.medium || !parsed.comprehensive) {
        console.error('Missing required fields in compression response');
        return generateFallbackFormats(insight, originalQuestion, compressionSettings);
      }
      
      // Extract insight rating if present
      let insightRating = null;
      if (parsed.insightRating) {
        insightRating = {
          score: parsed.insightRating.score || 3,
          category: parsed.insightRating.category || 'Competent',
          justification: parsed.insightRating.justification || 'Standard analysis quality'
        };
      }
      
      const formats = {
        ultraConcise: parsed.ultraConcise,
        medium: parsed.medium,
        comprehensive: parsed.comprehensive,
        insightRating
      };
      
      console.log('Successfully generated enhanced compression formats with rating');
      return formats;
      
    } catch (parseError) {
      console.error('JSON parsing failed for compression:', parseError);
      console.error('Raw response was:', rawResponse);
      return generateFallbackFormats(insight, originalQuestion, compressionSettings);
    }
    
  } catch (error) {
    console.error('Enhanced compression generation request failed:', error);
    return generateFallbackFormats(insight, originalQuestion, compressionSettings);
  }
}

function buildEnhancedSystemPrompt(compressionSettings?: any): string {
  const basePrompt = 'You are an expert compression specialist. Your task is to distill insights into their most essential form while preserving their conceptual power. Always include an insight strength rating. Return only valid JSON without any markdown formatting.';
  
  if (!compressionSettings) return basePrompt;
  
  let customization = '';
  
  if (compressionSettings.style && compressionSettings.style !== 'insight-summary') {
    const styleMap = {
      'aphorism': 'Craft compact, punchy statements that could live in a philosopher\'s notebook',
      'philosophical-phrase': 'Condense into evocative sentences with conceptual gravity and paradox',
      'narrative-form': 'Retell as allegorical micro-stories that embody truth through metaphor',
      'custom': 'Follow the custom instructions provided exactly'
    };
    customization += ` ${styleMap[compressionSettings.style] || ''}.`;
  }
  
  return basePrompt + customization;
}

function buildEnhancedCompressionPrompt(insight: string, originalQuestion: string, compressionSettings?: any): string {
  let basePrompt = `Transform this insight using enhanced compression techniques:

ORIGINAL INSIGHT: ${insight}

ORIGINAL QUESTION: ${originalQuestion}`;

  // Apply custom instructions if provided
  if (compressionSettings?.customInstructions?.trim()) {
    basePrompt += `\n\nCUSTOM INSTRUCTIONS: ${compressionSettings.customInstructions}`;
  }

  // Apply enhanced style instructions
  const styleInstructions = getEnhancedStyleInstructions(compressionSettings?.style);
  if (styleInstructions) {
    basePrompt += `\n\nSTYLE INSTRUCTIONS: ${styleInstructions}`;
  }

  // Apply length preferences with enhanced targeting
  const lengthMap = {
    'short': { ultra: 15, medium: 40, comprehensive: 80 },
    'medium': { ultra: 20, medium: 60, comprehensive: 120 },
    'poetic': { ultra: 25, medium: 80, comprehensive: 150 }
  };
  
  const lengths = lengthMap[compressionSettings?.length || 'medium'];

  basePrompt += `\n\nGenerate three formats following these enhanced guidelines:

**ULTRA-CONCISE (${lengths.ultra} words max):**
Compress into a single, high-impact statement. Prioritize clarity and emotional weight. Don't summarize—distill. Cut all fluff.

**MEDIUM (${lengths.medium} words max):**
Compress into a single paragraph. Prioritize clarity, emotional resonance, and emergent conceptual novelty. Reveal the deepest underlying pattern as if it were always there. Deliver insight that feels etched in stone.

**COMPREHENSIVE (${lengths.comprehensive} words max):**
Expand with context and implications while maintaining the distilled essence. Focus on actionable understanding and deeper patterns.

**INSIGHT STRENGTH RATING:**
Rate the insight quality (1-6) and provide one-sentence justification:
1 = Weak | 2 = Basic | 3 = Competent | 4 = Insightful | 5 = Sharp | 6 = Profound

Return ONLY valid JSON:
{
  "ultraConcise": "distilled essence here",
  "medium": "core insight paragraph here", 
  "comprehensive": "expanded understanding here",
  "insightRating": {
    "score": 4,
    "category": "Insightful",
    "justification": "One sentence explaining the rating"
  }
}`;

  return basePrompt;
}

function getEnhancedStyleInstructions(style?: string): string | null {
  const styleMap = {
    'aphorism': 'Craft a compact, punchy statement that could live on the margin of a philosopher\'s notebook. Avoid platitudes. Say something sharp, strange, or slightly dangerous.',
    'philosophical-phrase': 'Condense into a single, evocative sentence. Prioritize conceptual gravity, paradox, and metaphorical depth. Think less summary, more koan.',
    'narrative-form': 'Retell as a short, allegorical story or micro-fable. Use metaphor and character to embody the concept. Focus on emotional truth over entertainment.',
    'insight-summary': 'Compress into a single, high-impact paragraph. Prioritize clarity, emotional resonance, and emergent conceptual novelty. Don\'t summarize—distill.'
  };
  
  return styleMap[style || 'insight-summary'] || null;
}

function generateFallbackFormats(insight: string, question: string, compressionSettings?: any): CompressionFormats {
  console.log('Using enhanced fallback compression formats');
  
  const sentences = insight.split(/[.!?]/).filter(s => s.trim().length > 10);
  const firstSentence = sentences[0]?.trim() || insight.substring(0, 100);
  
  // Apply enhanced style to fallback
  const styleModifier = getStyleModifier(compressionSettings?.style);
  
  return {
    ultraConcise: styleModifier + extractKeyPhrase(firstSentence),
    medium: `The exploration of "${question}" reveals a fundamental pattern: ${firstSentence.substring(0, 80)}... This insight cuts through surface complexity to reveal the underlying structure.`,
    comprehensive: `${insight.substring(0, 200)}${insight.length > 200 ? '...' : ''} This comprehensive analysis of "${question}" demonstrates how seemingly complex dynamics often reduce to elegant principles, suggesting transformative approaches for both theoretical understanding and practical application.`,
    insightRating: {
      score: 3,
      category: 'Competent',
      justification: 'Standard processing quality with clear analysis but limited breakthrough potential.'
    }
  };
}

function getStyleModifier(style?: string): string {
  const modifiers = {
    'aphorism': 'Truth carved in stone: ',
    'philosophical-phrase': 'Consider the paradox: ',
    'narrative-form': 'Imagine a seeker who discovers that ',
    'insight-summary': 'The core insight emerges: '
  };
  
  return modifiers[style || 'insight-summary'] || '';
}

function extractKeyPhrase(text: string): string {
  // Extract the most impactful phrase from the insight
  const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 5);
  const firstSentence = sentences[0]?.trim() || text;
  
  // Look for key patterns or just take first meaningful chunk
  const keyWords = firstSentence.split(' ').slice(0, 10).join(' ');
  return keyWords.length < firstSentence.length ? keyWords + '...' : keyWords;
}

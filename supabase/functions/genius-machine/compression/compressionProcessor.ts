
import { CompressionFormats, CompressionSettings } from './types.ts';
import { buildEnhancedSystemPrompt, buildEnhancedCompressionPrompt } from './promptBuilders.ts';
import { generateFallbackFormats } from './fallbackGenerator.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export async function processCompressionWithOpenAI(
  insight: string,
  originalQuestion: string,
  compressionSettings?: CompressionSettings
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
    
    return parseCompressionResponse(rawResponse, insight, originalQuestion, compressionSettings);
    
  } catch (error) {
    console.error('Enhanced compression generation request failed:', error);
    return generateFallbackFormats(insight, originalQuestion, compressionSettings);
  }
}

function parseCompressionResponse(
  rawResponse: string,
  insight: string,
  originalQuestion: string,
  compressionSettings?: CompressionSettings
): CompressionFormats {
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
}

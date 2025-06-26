
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
import { getCompressionInstructions } from './styleInstructions.ts';
import { generateFallbackCompression } from './fallbackGenerator.ts';

export async function processCompressionWithOpenAI(
  insight: string,
  originalQuestion: string,
  compressionSettings?: any,
  outputType?: string
) {
  try {
    if (!openAIApiKey) {
      console.log('No OpenAI key available, using fallback compression');
      return generateFallbackCompression(insight, originalQuestion, compressionSettings, outputType);
    }

    const style = compressionSettings?.style || 'insight-summary';
    const instructions = getCompressionInstructions(style, outputType);
    
    console.log('Processing compression with OpenAI:', { style, outputType });
    
    // Generate all three compression formats
    const compressionPromises = [
      generateCompression(insight, 'ultra-concise', outputType, instructions),
      generateCompression(insight, 'medium', outputType, instructions),  
      generateCompression(insight, 'comprehensive', outputType, instructions)
    ];
    
    const [ultraConcise, medium, comprehensive] = await Promise.all(compressionPromises);
    
    return {
      ultraConcise: ultraConcise || insight.substring(0, 100) + '...',
      medium: medium || insight.substring(0, 300) + '...',
      comprehensive: comprehensive || insight
    };
    
  } catch (error) {
    console.error('Compression processing failed:', error);
    return generateFallbackCompression(insight, originalQuestion, compressionSettings, outputType);
  }
}

async function generateCompression(
  insight: string,
  format: string,
  outputType?: string,
  instructions?: string
) {
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
          {
            role: 'system',
            content: `You are a master of insight compression. Transform insights while preserving their essential breakthrough nature. ${instructions || ''}`
          },
          {
            role: 'user',
            content: `Transform this insight for ${format} format${outputType ? ` with ${outputType} output type` : ''}:\n\n${insight}`
          }
        ],
        max_tokens: format === 'ultra-concise' ? 50 : format === 'medium' ? 200 : 400,
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
    
  } catch (error) {
    console.error(`Failed to generate ${format} compression:`, error);
    return null;
  }
}

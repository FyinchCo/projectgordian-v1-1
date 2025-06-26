
import { CompressionFormats, CompressionSettings } from './compression/types.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export async function generateCompressionFormats(
  insight: string,
  results: any,
  question: string,
  compressionSettings?: CompressionSettings,
  outputType?: string
): Promise<CompressionFormats> {
  
  if (!openAIApiKey) {
    console.warn('OpenAI API key not available for compression generation');
    return generateFallbackCompressions(insight, outputType, question);
  }

  try {
    const style = outputType || compressionSettings?.style || 'practical';
    const customInstructions = compressionSettings?.customInstructions || '';
    
    const compressionPrompt = buildDirectAnswerCompressionPrompt(
      insight, 
      question, 
      style, 
      customInstructions,
      results
    );

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
            content: 'You are a compression specialist who creates direct, actionable answers in different formats. Focus on answering the question, not describing the process.'
          },
          {
            role: 'user',
            content: compressionPrompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      console.error('Compression API error:', response.status, response.statusText);
      return generateFallbackCompressions(insight, outputType, question);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      return generateFallbackCompressions(insight, outputType, question);
    }

    return parseCompressionResponse(content, insight, outputType, question);
    
  } catch (error) {
    console.error('Error generating compression formats:', error);
    return generateFallbackCompressions(insight, outputType, question);
  }
}

function buildDirectAnswerCompressionPrompt(
  insight: string, 
  question: string, 
  style: string, 
  customInstructions: string,
  results: any
): string {
  return `Transform this analysis into direct answers to the user's question in 3 formats:

USER'S QUESTION: "${question}"
ANALYSIS INSIGHT: "${insight}"
ANSWER STYLE: ${style}
CUSTOM INSTRUCTIONS: ${customInstructions}

Create 3 direct answer formats that respond to the user's question:

ULTRA-CONCISE (15-25 words): The most essential answer distilled to its core
MEDIUM (40-80 words): A balanced answer with key reasoning  
COMPREHENSIVE (100-150 words): A complete answer with context and implications

Each format should:
- Directly answer the user's question
- NOT describe the analysis process
- Focus on the insight itself, not how it was generated
- Be useful and actionable for the user

Respond in JSON format:
{
  "ultraConcise": "direct answer here",
  "medium": "balanced answer with reasoning here", 
  "comprehensive": "complete answer with full context here"
}`;
}

function parseCompressionResponse(content: string, insight: string, outputType?: string, question?: string): CompressionFormats {
  try {
    const parsed = JSON.parse(content);
    return {
      ultraConcise: parsed.ultraConcise || insight.substring(0, 100),
      medium: parsed.medium || insight.substring(0, 300),
      comprehensive: parsed.comprehensive || insight
    };
  } catch (error) {
    console.warn('Failed to parse compression JSON, using fallback');
    return generateFallbackCompressions(insight, outputType, question);
  }
}

function generateFallbackCompressions(insight: string, outputType?: string, question?: string): CompressionFormats {
  const sentences = insight.split(/[.!?]+/).filter(s => s.trim());
  
  return {
    ultraConcise: sentences[0]?.substring(0, 100) || insight.substring(0, 100),
    medium: sentences.slice(0, 2).join('. ') || insight.substring(0, 300),
    comprehensive: insight
  };
}

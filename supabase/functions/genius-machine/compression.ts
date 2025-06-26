
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
    return generateFallbackCompressions(insight, outputType);
  }

  try {
    const style = outputType || compressionSettings?.style || 'practical';
    const customInstructions = compressionSettings?.customInstructions || '';
    
    const compressionPrompt = buildCompressionPrompt(
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
            content: 'You are a compression specialist who creates focused, actionable summaries in different formats.'
          },
          {
            role: 'user',
            content: compressionPrompt
          }
        ],
        max_tokens: 800,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      console.error('Compression API error:', response.status, response.statusText);
      return generateFallbackCompressions(insight, outputType);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      return generateFallbackCompressions(insight, outputType);
    }

    return parseCompressionResponse(content, insight, outputType);
    
  } catch (error) {
    console.error('Error generating compression formats:', error);
    return generateFallbackCompressions(insight, outputType);
  }
}

function buildCompressionPrompt(
  insight: string, 
  question: string, 
  style: string, 
  customInstructions: string,
  results: any
): string {
  return `Transform this insight into 5 different compression formats:

ORIGINAL INSIGHT: "${insight}"
QUESTION: "${question}"
STYLE FOCUS: ${style}
CUSTOM INSTRUCTIONS: ${customInstructions}

Create exactly these 5 formats:

PRACTICAL: Action-oriented bullet points and next steps
TECHNICAL: Structured analysis with key components  
CREATIVE: Engaging narrative that captures the essence
EXECUTIVE: High-level strategic summary for decision makers
ACADEMIC: Rigorous analytical framework with supporting logic

Each format should be 2-4 sentences maximum and capture the core insight while serving its specific audience.`;
}

function parseCompressionResponse(content: string, insight: string, outputType?: string): CompressionFormats {
  const sections = content.split(/PRACTICAL:|TECHNICAL:|CREATIVE:|EXECUTIVE:|ACADEMIC:/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  const fallback = generateFallbackCompressions(insight, outputType);
  
  return {
    practical: sections[0] || fallback.practical,
    technical: sections[1] || fallback.technical,
    creative: sections[2] || fallback.creative,
    executive: sections[3] || fallback.executive,
    academic: sections[4] || fallback.academic,
  };
}

function generateFallbackCompressions(insight: string, outputType?: string): CompressionFormats {
  const core = insight.substring(0, 200);
  
  return {
    practical: `• Key insight: ${core}...\n• Next steps: Apply this understanding to current challenges\n• Action items: Review implications and adjust approach accordingly`,
    
    technical: `Core Analysis: ${core}...\nStructural Elements: Multi-layered reasoning process\nImplementation: Systematic application of derived insights`,
    
    creative: `This exploration reveals ${core}... Like layers of an onion, each level of analysis unveils deeper truths about the nature of our inquiry.`,
    
    executive: `Strategic Insight: ${core}...\nBusiness Impact: Enhanced decision-making framework\nRecommendation: Integrate findings into strategic planning`,
    
    academic: `Analytical Framework: ${core}...\nMethodological Approach: Systematic multi-perspective analysis\nConclusion: Findings support comprehensive understanding of complex systems`
  };
}

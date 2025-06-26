
import { CompressionSettings } from './types.ts';
import { getEnhancedStyleInstructions } from './styleInstructions.ts';

export function buildEnhancedSystemPrompt(compressionSettings?: CompressionSettings): string {
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

export function buildEnhancedCompressionPrompt(insight: string, originalQuestion: string, compressionSettings?: CompressionSettings): string {
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

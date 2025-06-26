
import { CompressionSettings } from './types.ts';
import { getOutputTypeCompressionInstructions, getPostCompressionReflectionPrompt } from './styleInstructions.ts';

export function buildEnhancedSystemPrompt(compressionSettings?: CompressionSettings, outputType?: string): string {
  const basePrompt = 'You are an expert compression specialist. Your task is to distill insights into their most essential form while preserving their conceptual power. Always include an insight strength rating. Return only valid JSON without any markdown formatting.';
  
  let customization = '';
  
  // Use output type for compression instructions
  if (outputType) {
    const outputInstructions = getOutputTypeCompressionInstructions(outputType);
    if (outputInstructions) {
      customization += ` ${outputInstructions}.`;
    }
  }
  
  return basePrompt + customization;
}

export function buildEnhancedCompressionPrompt(insight: string, originalQuestion: string, compressionSettings?: CompressionSettings, outputType?: string): string {
  let basePrompt = `Transform this insight using enhanced compression techniques:

ORIGINAL INSIGHT: ${insight}

ORIGINAL QUESTION: ${originalQuestion}`;

  // Apply custom instructions if provided
  if (compressionSettings?.customInstructions?.trim()) {
    basePrompt += `\n\nCUSTOM INSTRUCTIONS: ${compressionSettings.customInstructions}`;
  }

  // Apply output type instructions
  const outputInstructions = getOutputTypeCompressionInstructions(outputType);
  if (outputInstructions) {
    basePrompt += `\n\nOUTPUT TYPE FOCUS: ${outputInstructions}`;
  }

  // Apply length preferences with enhanced targeting
  const lengthMap = {
    'short': { ultra: 15, medium: 40, comprehensive: 80 },
    'medium': { ultra: 20, medium: 60, comprehensive: 120 },
    'long': { ultra: 25, medium: 80, comprehensive: 150 }
  };
  
  const lengths = lengthMap[compressionSettings?.length || 'medium'];

  basePrompt += `\n\nGenerate three formats following these enhanced guidelines:

**ULTRA-CONCISE (${lengths.ultra} words max):**
Compress into a single, high-impact statement. Prioritize clarity and emotional weight. Don't summarize—distill. Cut all fluff.

**MEDIUM (${lengths.medium} words max):**
Compress into a single paragraph. Prioritize clarity, emotional resonance, and emergent conceptual novelty. Reveal the deepest underlying pattern as if it were always there. Deliver insight that feels etched in stone.

**COMPREHENSIVE (${lengths.comprehensive} words max):**
Expand with context and implications while maintaining the distilled essence. Focus on actionable understanding and deeper patterns.`;

  // Add post-compression reflection prompt
  basePrompt += getPostCompressionReflectionPrompt();

  basePrompt += `

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

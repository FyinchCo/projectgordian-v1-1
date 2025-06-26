
import { CompressionFormats, CompressionSettings } from './types.ts';
import { getStyleModifier } from './styleInstructions.ts';

export function generateFallbackFormats(insight: string, question: string, compressionSettings?: CompressionSettings): CompressionFormats {
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

function extractKeyPhrase(text: string): string {
  // Extract the most impactful phrase from the insight
  const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 5);
  const firstSentence = sentences[0]?.trim() || text;
  
  // Look for key patterns or just take first meaningful chunk
  const keyWords = firstSentence.split(' ').slice(0, 10).join(' ');
  return keyWords.length < firstSentence.length ? keyWords + '...' : keyWords;
}

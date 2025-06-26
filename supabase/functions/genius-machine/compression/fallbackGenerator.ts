
import { getStyleModifier } from './styleInstructions.ts';

export const generateFallbackCompression = (
  insight: string,
  originalQuestion: string,
  compressionSettings?: any,
  outputType?: string
) => {
  const style = compressionSettings?.style || 'insight-summary';
  const length = compressionSettings?.length || 'medium';
  
  // Generate different compression levels based on the insight
  const compressions = {
    ultraConcise: generateUltraConcise(insight, style, outputType),
    medium: generateMediumCompression(insight, style, outputType),
    comprehensive: generateComprehensive(insight, style, outputType)
  };
  
  return compressions;
};

const generateUltraConcise = (insight: string, style: string, outputType?: string) => {
  // Extract the core essence of the insight
  const coreMessage = insight.substring(0, 200).split('.')[0];
  const styleModifier = getStyleModifier('ultra-concise', outputType);
  
  return `${coreMessage}.`;
};

const generateMediumCompression = (insight: string, style: string, outputType?: string) => {
  // Provide a balanced compression
  const sentences = insight.split('.').filter(s => s.trim().length > 0);
  const key_sentences = sentences.slice(0, 3);
  
  return key_sentences.join('. ') + '.';
};

const generateComprehensive = (insight: string, style: string, outputType?: string) => {
  // Return the full insight with potential enhancements
  return insight;
};

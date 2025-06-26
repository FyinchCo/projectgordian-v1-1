
export function getOutputTypeCompressionInstructions(outputType?: string): string | null {
  const instructionMap = {
    'practical': 'Focus on actionable insights and concrete next steps. Distill to what someone can actually do or implement. Use numbered steps or bullets if appropriate. Cut theory—deliver tactics. Prioritize immediate implementation over abstract understanding.',
    'theoretical': 'Structure insights into clear frameworks, models, and systematic understanding. Focus on how things work, underlying patterns, and organized knowledge. Build conceptual scaffolding that can be applied across situations. Emphasize logical structure and coherent systems.',
    'philosophical': 'Challenge fundamental assumptions and provoke deep worldview shifts. Question what seems obviously true. Focus on paradoxes, contradictions, and the hidden structures of belief. Prioritize depth over comfort. Aim to shift perspective rather than confirm existing views.',
    'abstract': 'Reveal unexpected connections and cross-domain patterns. Draw from fields like nature, physics, language, culture, or mythology to illuminate surprising analogies. Focus on emergent insights that wouldn\'t be obvious. Seek patterns that transcend their original contexts.'
  };
  
  return instructionMap[outputType || 'theoretical'] || null;
}

export function getOutputTypeModifier(outputType?: string): string {
  const modifiers = {
    'practical': 'The actionable insight: ',
    'theoretical': 'The systematic understanding: ',
    'philosophical': 'The challenging truth: ',
    'abstract': 'The hidden pattern: '
  };
  
  return modifiers[outputType || 'theoretical'] || 'The core insight: ';
}

export function getPostCompressionReflectionPrompt(): string {
  return `

INSIGHT STRENGTH EVALUATION:
Rate this insight on a 1–6 scale for strength and briefly justify the score:
1 = Weak | 2 = Basic | 3 = Competent | 4 = Insightful | 5 = Sharp | 6 = Profound

Include this evaluation in your response as part of the insightRating object.`;
}

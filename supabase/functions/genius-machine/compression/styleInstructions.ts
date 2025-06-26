
export const getStyleModifier = (style: string, outputType?: string) => {
  const baseModifiers = {
    'ultra-concise': 'Compress to absolute essence. Maximum 2 sentences.',
    'insight-summary': 'Provide clear, actionable insight in 3-4 sentences.',
    'comprehensive': 'Detailed analysis with supporting reasoning and implications.',
    'poetic': 'Express with metaphorical, evocative language.',
    'technical': 'Use precise, systematic language with clear structure.',
    'actionable': 'Focus on practical steps and concrete recommendations.'
  };

  const outputModifiers = {
    'practical': 'Focus on real-world application and concrete utility.',
    'theoretical': 'Emphasize conceptual frameworks and abstract principles.',
    'abstract': 'Explore deeper philosophical and conceptual dimensions.',
    'provocative': 'Challenge assumptions and present contrarian perspectives.'
  };

  let modifier = baseModifiers[style as keyof typeof baseModifiers] || baseModifiers['insight-summary'];
  
  if (outputType && outputModifiers[outputType as keyof typeof outputModifiers]) {
    modifier += ` ${outputModifiers[outputType as keyof typeof outputModifiers]}`;
  }
  
  return modifier;
};

export const getCompressionInstructions = (style: string, outputType?: string) => {
  const styleModifier = getStyleModifier(style, outputType);
  
  return `
Transform the insight using these guidelines:
- ${styleModifier}
- Maintain the core breakthrough while adapting the presentation
- Ensure the compressed version is self-contained and impactful
${outputType ? `- Align with ${outputType} output type requirements` : ''}
`;
};


export function getEnhancedStyleInstructions(style?: string): string | null {
  const styleMap = {
    'aphorism': 'Craft a compact, punchy statement that could live on the margin of a philosopher\'s notebook. It should be clever, memorable, and layered enough to reward re-reading. Avoid platitudes or abstract generalizations. Instead, say something sharp, strange, or slightly dangerous.',
    'philosophical-phrase': 'Condense the core insight into a single, evocative sentence. Prioritize conceptual gravity, paradox, and metaphorical depth. The sentence should feel like something worth pondering for hours. Avoid clichés or over-explaining. Think less like a summary, more like a koan or distilled axiom.',
    'narrative-form': 'Retell the insight as a short, allegorical story or micro-fable. Use metaphor and character to embody the core concept without directly naming it. The goal is not entertainment—it\'s emotional truth. Keep it under 100 words, but let it breathe. It should leave the reader feeling like they just lived the idea rather than read about it.',
    'insight-summary': 'Compress the insight into a single, high-impact paragraph. Prioritize clarity, emotional resonance, and emergent conceptual novelty. Don\'t summarize—distill. Reveal the deepest underlying pattern as if it were always there, waiting to be seen. Cut fluff. Cut recaps. Deliver an insight that feels etched in stone.'
  };
  
  return styleMap[style || 'insight-summary'] || null;
}

export function getStyleModifier(style?: string): string {
  const modifiers = {
    'aphorism': 'Truth carved in stone: ',
    'philosophical-phrase': 'Consider the paradox: ',
    'narrative-form': 'Imagine a seeker who discovers that ',
    'insight-summary': 'The core insight emerges: '
  };
  
  return modifiers[style || 'insight-summary'] || '';
}


import { Archetype } from '../types.ts';
import { defaultArchetypes, buildSystemPromptFromPersonality } from '../archetypes.ts';

export function buildArchetypes(customArchetypes?: any[]): Archetype[] {
  if (customArchetypes && Array.isArray(customArchetypes) && customArchetypes.length > 0) {
    console.log('Using custom archetypes');
    return customArchetypes.map(arch => ({
      name: arch.name || 'Custom Archetype',
      description: arch.description || 'A custom archetype',
      languageStyle: arch.languageStyle || 'logical',
      imagination: typeof arch.imagination === 'number' ? arch.imagination : 5,
      skepticism: typeof arch.skepticism === 'number' ? arch.skepticism : 5,
      aggression: typeof arch.aggression === 'number' ? arch.aggression : 5,
      emotionality: typeof arch.emotionality === 'number' ? arch.emotionality : 5,
      constraint: arch.constraint || '',
      systemPrompt: buildSystemPromptFromPersonality(
        arch.name || 'Custom Archetype',
        arch.description || 'A custom archetype',
        arch.languageStyle || 'logical',
        typeof arch.imagination === 'number' ? arch.imagination : 5,
        typeof arch.skepticism === 'number' ? arch.skepticism : 5,
        typeof arch.aggression === 'number' ? arch.aggression : 5,
        typeof arch.emotionality === 'number' ? arch.emotionality : 5,
        arch.constraint
      )
    }));
  } else {
    console.log('Using default archetypes');
    return defaultArchetypes;
  }
}

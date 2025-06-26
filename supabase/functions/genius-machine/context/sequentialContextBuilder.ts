
import { ArchetypeResponse } from '../types.ts';

export function buildSequentialTensionContext(responses: ArchetypeResponse[], layerNumber: number): string {
  if (responses.length === 0) return '';
  
  const recentResponses = responses.slice(-2); // Only show last 2 for focus
  return `\n\nARCHETYPE RESPONSES IN LAYER ${layerNumber} (CHALLENGE THESE PERSPECTIVES):\n${recentResponses.map(r => 
    `${r.archetype}: ${r.response.substring(0, 200)}...`
  ).join('\n\n')}\n\nCRITICAL: You MUST disagree with or challenge aspects of the above perspectives. Create intellectual tension.\n`;
}


import { Archetype, ArchetypeResponse } from '../types.ts';

export function createEnhancedFallbackResponse(
  archetype: Archetype,
  layerNumber: number,
  question: string,
  existingResponses: ArchetypeResponse[]
): ArchetypeResponse {
  
  const fallbackInsights = [
    `${archetype.name} analysis reveals that this question exposes fundamental tensions between knowledge and wisdom. The inquiry demands we examine not just what we think we know, but why we think we need to know it.`,
    
    `From ${archetype.name}'s perspective, this question creates a paradox where the very act of questioning transforms both the questioner and the questioned. This recursive relationship suggests deeper layers of understanding await.`,
    
    `${archetype.name} observes that this inquiry challenges the boundaries between subject and object, revealing that some questions are not meant to be answered but experienced as transformative encounters with mystery.`,
    
    `The ${archetype.name} viewpoint suggests this question operates as a catalyst, not seeking information but provoking a fundamental shift in how we relate to uncertainty and the unknown.`,
    
    `${archetype.name}'s analysis indicates this question reveals the limitations of conventional frameworks, pointing toward the necessity of new modes of understanding that transcend traditional categories.`
  ];
  
  let baseResponse = fallbackInsights[layerNumber % fallbackInsights.length];
  
  // Add tension if other responses exist
  if (existingResponses.length > 0) {
    const tensionAddition = ` However, I fundamentally disagree with the previous perspectives that suggest simple answers exist. This question demands we embrace the productive discomfort of not-knowing.`;
    baseResponse += tensionAddition;
  }
  
  // Add personality flavor
  baseResponse += getPersonalityFlavor(archetype);
  
  return {
    archetype: archetype.name,
    response: baseResponse,
    processingTime: 0,
    timestamp: Date.now()
  };
}

function getPersonalityFlavor(archetype: Archetype): string {
  switch (archetype.name) {
    case 'The Visionary':
      return ' I envision this as opening doorways to revolutionary understanding.';
    case 'The Skeptic':
      return ' We must rigorously question every assumption underlying this inquiry.';
    case 'The Mystic':
      return ' This touches the ineffable mystery that rational analysis cannot penetrate.';
    case 'The Contrarian':
      return ' Perhaps we\'re asking entirely the wrong question and need to reverse our assumptions.';
    case 'The Realist':
      return ' Practically speaking, we must ground this inquiry in observable phenomena.';
    default:
      return ' This requires deep contemplation beyond surface-level analysis.';
  }
}

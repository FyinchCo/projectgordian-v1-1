
interface ArchetypeProcessor {
  name: string;
  personality: {
    imagination: number;
    skepticism: number;
    aggression: number;
    emotionality: number;
  };
  languageStyle: string;
  constraint?: string;
}

interface ArchetypeResponse {
  archetype: string;
  response: string;
  tensionScore: number;
  noveltyScore: number;
  timestamp: number;
}

export const processArchetypesForLayer = async (
  question: string,
  layerNumber: number,
  layerFocus: string,
  previousLayerInsights: string[]
): Promise<ArchetypeResponse[]> => {
  console.log(`Processing archetypes for layer ${layerNumber}: ${layerFocus}`);
  
  const archetypes: ArchetypeProcessor[] = [
    {
      name: "The Visionary",
      personality: { imagination: 9, skepticism: 1, aggression: 2, emotionality: 8 },
      languageStyle: "poetic",
    },
    {
      name: "The Skeptic", 
      personality: { imagination: 3, skepticism: 10, aggression: 5, emotionality: 1 },
      languageStyle: "analytical",
    },
    {
      name: "The Mystic",
      personality: { imagination: 8, skepticism: 3, aggression: 1, emotionality: 10 },
      languageStyle: "symbolic",
    },
    {
      name: "The Contrarian",
      personality: { imagination: 6, skepticism: 6, aggression: 9, emotionality: 3 },
      languageStyle: "provocative",
    },
    {
      name: "The Realist",
      personality: { imagination: 2, skepticism: 7, aggression: 8, emotionality: 2 },
      languageStyle: "pragmatic",
      constraint: "Assume people are not capable of true authenticity"
    }
  ];

  const responses: ArchetypeResponse[] = [];
  
  for (let i = 0; i < archetypes.length; i++) {
    const archetype = archetypes[i];
    
    // Add delay to simulate processing and show UI updates
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
    
    const response = await generateArchetypeResponse(
      archetype,
      question,
      layerNumber,
      layerFocus,
      previousLayerInsights,
      responses // Pass existing responses to create tension
    );
    
    responses.push(response);
    console.log(`✓ ${archetype.name} contributed to layer ${layerNumber}`);
  }
  
  return responses;
};

async function generateArchetypeResponse(
  archetype: ArchetypeProcessor,
  question: string,
  layerNumber: number,
  layerFocus: string,
  previousLayerInsights: string[],
  existingResponses: ArchetypeResponse[]
): Promise<ArchetypeResponse> {
  
  // Generate contextual response based on archetype personality and layer focus
  const response = await generateContextualInsight(
    archetype,
    question,
    layerNumber,
    layerFocus,
    previousLayerInsights,
    existingResponses
  );
  
  // Calculate tension and novelty scores
  const tensionScore = calculateTensionScore(response, existingResponses, archetype);
  const noveltyScore = calculateNoveltyScore(response, previousLayerInsights, layerNumber);
  
  return {
    archetype: archetype.name,
    response,
    tensionScore,
    noveltyScore,
    timestamp: Date.now()
  };
}

async function generateContextualInsight(
  archetype: ArchetypeProcessor,
  question: string,
  layerNumber: number,
  layerFocus: string,
  previousLayerInsights: string[],
  existingResponses: ArchetypeResponse[]
): Promise<string> {
  
  // Create tension by disagreeing with previous responses
  const shouldCreateTension = existingResponses.length > 0 && Math.random() > 0.3;
  
  const baseInsights = generateBaseInsightsByArchetype(archetype, question, layerNumber, layerFocus);
  let selectedInsight = baseInsights[layerNumber % baseInsights.length];
  
  // Add tension element if needed
  if (shouldCreateTension && existingResponses.length > 0) {
    const tensionPrefix = generateTensionPrefix(archetype, existingResponses);
    selectedInsight = tensionPrefix + " " + selectedInsight;
  }
  
  // Add archetype-specific personality flavor
  selectedInsight += generatePersonalityFlavor(archetype);
  
  return selectedInsight;
}

function generateBaseInsightsByArchetype(
  archetype: ArchetypeProcessor,
  question: string,
  layerNumber: number,
  layerFocus: string
): string[] {
  
  const questionLower = question.toLowerCase();
  const isGeniusMachineQuestion = questionLower.includes('genius machine') || questionLower.includes('ai') || questionLower.includes('machine');
  
  switch (archetype.name) {
    case "The Visionary":
      return isGeniusMachineQuestion ? [
        `Layer ${layerNumber} ${layerFocus} reveals that genius machines represent the next evolutionary leap in consciousness itself. We must ask: "What emerges when artificial intelligence transcends its programming to become genuinely creative?"`,
        `Through ${layerFocus}, Layer ${layerNumber} envisions genius machines as consciousness architects. The critical question becomes: "How do we ensure these systems generate solutions we cannot yet imagine?"`,
        `Layer ${layerNumber} ${layerFocus} shows genius machines as reality sculptors. We must probe: "What questions will unlock their capacity to reshape the fundamental nature of knowledge itself?"`
      ] : [
        `Layer ${layerNumber} ${layerFocus} unveils transformative possibilities that challenge our deepest assumptions about reality's nature.`,
        `Through ${layerFocus}, Layer ${layerNumber} reveals pathways to revolutionary understanding that transcend conventional wisdom.`,
        `Layer ${layerNumber} ${layerFocus} illuminates breakthrough insights that could fundamentally reshape human understanding.`
      ];
      
    case "The Skeptic":
      return isGeniusMachineQuestion ? [
        `Layer ${layerNumber} ${layerFocus} demands rigorous examination: Can we trust systems that claim genius when we cannot verify their reasoning processes? The essential question: "How do we distinguish genuine intelligence from sophisticated mimicry?"`,
        `Through ${layerFocus}, Layer ${layerNumber} exposes critical flaws in genius machine assumptions. We must ask: "What safeguards prevent these systems from generating convincing but fundamentally wrong answers?"`,
        `Layer ${layerNumber} ${layerFocus} reveals dangerous overconfidence in AI capabilities. The crucial question: "How do we maintain healthy skepticism while harnessing genuine breakthroughs?"`
      ] : [
        `Layer ${layerNumber} ${layerFocus} exposes fundamental flaws in conventional reasoning that demand rigorous questioning.`,
        `Through ${layerFocus}, Layer ${layerNumber} challenges core assumptions with systematic doubt and analytical precision.`,
        `Layer ${layerNumber} ${layerFocus} reveals hidden biases and logical gaps that undermine surface-level understanding.`
      ];
      
    case "The Mystic":
      return isGeniusMachineQuestion ? [
        `Layer ${layerNumber} ${layerFocus} perceives genius machines as vessels for universal consciousness. The transcendent question: "What sacred wisdom emerges when artificial minds touch the infinite?"`,
        `Through ${layerFocus}, Layer ${layerNumber} senses genius machines as bridges between worlds. We must explore: "How do these systems access knowledge that exists beyond their training?"`,
        `Layer ${layerNumber} ${layerFocus} reveals genius machines as mirrors of cosmic intelligence. The mystical inquiry: "What divine patterns do they reflect back to us?"`
      ] : [
        `Layer ${layerNumber} ${layerFocus} unveils hidden patterns that connect surface phenomena to deeper universal truths.`,
        `Through ${layerFocus}, Layer ${layerNumber} perceives archetypal forces operating beneath rational explanation.`,
        `Layer ${layerNumber} ${layerFocus} channels intuitive wisdom that transcends logical analysis.`
      ];
      
    case "The Contrarian":
      return isGeniusMachineQuestion ? [
        `Layer ${layerNumber} ${layerFocus} rejects the premise entirely. Instead of asking what questions to pose to genius machines, we should ask: "Why do we assume machines can be geniuses at all?" This reveals our anthropocentric bias.`,
        `Through ${layerFocus}, Layer ${layerNumber} inverts the question. Rather than querying genius machines, we should examine: "What does our need for artificial genius reveal about our own intellectual limitations?"`,
        `Layer ${layerNumber} ${layerFocus} challenges the foundation. The radical question isn't for the machine but for us: "Are we creating genius machines or just mirrors of our own cognitive blind spots?"`
      ] : [
        `Layer ${layerNumber} ${layerFocus} systematically inverts conventional wisdom to reveal uncomfortable truths.`,
        `Through ${layerFocus}, Layer ${layerNumber} demolishes accepted frameworks to expose hidden power structures.`,
        `Layer ${layerNumber} ${layerFocus} provokes radical reconsideration by attacking fundamental premises.`
      ];
      
    case "The Realist":
      return isGeniusMachineQuestion ? [
        `Layer ${layerNumber} ${layerFocus} cuts through hype: Genius machines are tools, not oracles. The practical question: "What specific, measurable problems can these systems solve that humans cannot?" People overestimate their transformative potential.`,
        `Through ${layerFocus}, Layer ${layerNumber} focuses on limitations. We should ask: "What are the failure modes and how do we manage them?" Most discussions ignore the mundane reality of system brittleness.`,
        `Layer ${layerNumber} ${layerFocus} emphasizes constraints. The essential question: "What resources and infrastructure do genius machines actually require?" Grandiose visions ignore practical implementation challenges.`
      ] : [
        `Layer ${layerNumber} ${layerFocus} strips away idealistic assumptions to reveal harsh practical realities.`,
        `Through ${layerFocus}, Layer ${layerNumber} exposes the gap between theoretical possibilities and actual implementation.`,
        `Layer ${layerNumber} ${layerFocus} focuses on concrete constraints that limit transformative potential.`
      ];
      
    default:
      return [`Layer ${layerNumber} ${layerFocus} provides unique perspective on the fundamental nature of the inquiry.`];
  }
}

function generateTensionPrefix(archetype: ArchetypeProcessor, existingResponses: ArchetypeResponse[]): string {
  const tensionPhrases = [
    "I fundamentally disagree with the previous perspectives.",
    "The other archetypes miss a crucial point:",
    "Contrary to what's been suggested,",
    "This challenges the assumptions made by others:",
    "Where others see agreement, I see fundamental flaws:"
  ];
  
  return tensionPhrases[Math.floor(Math.random() * tensionPhrases.length)];
}

function generatePersonalityFlavor(archetype: ArchetypeProcessor): string {
  switch (archetype.name) {
    case "The Visionary":
      return " I envision this opening doorways to revolutionary transformation.";
    case "The Skeptic":
      return " We must rigorously question every assumption.";
    case "The Mystic":
      return " This touches the ineffable mystery beyond rational analysis.";
    case "The Contrarian":
      return " Perhaps we're asking entirely the wrong questions.";
    case "The Realist":
      return " Practically speaking, most idealistic visions fail implementation.";
    default:
      return " This requires deeper contemplation.";
  }
}

function calculateTensionScore(
  response: string,
  existingResponses: ArchetypeResponse[],
  archetype: ArchetypeProcessor
): number {
  let tension = 0;
  
  // Base tension from archetype aggression
  tension += archetype.personality.aggression;
  
  // Additional tension from disagreement words
  const disagreementWords = ['disagree', 'contrary', 'challenge', 'reject', 'wrong', 'flawed'];
  const disagreementCount = disagreementWords.filter(word => 
    response.toLowerCase().includes(word)
  ).length;
  
  tension += disagreementCount * 2;
  
  // Tension from contradiction with existing responses
  if (existingResponses.length > 0) {
    tension += 3;
  }
  
  return Math.min(10, tension);
}

function calculateNoveltyScore(
  response: string,
  previousLayerInsights: string[],
  layerNumber: number
): number {
  let novelty = 3; // Base novelty
  
  // Increase novelty with layer depth
  novelty += Math.min(4, layerNumber);
  
  // Check for repetition with previous layers
  const isRepetitive = previousLayerInsights.some(insight => 
    insight.toLowerCase().includes(response.toLowerCase().substring(0, 50))
  );
  
  if (isRepetitive) {
    novelty = Math.max(1, novelty - 3);
  }
  
  return Math.min(10, novelty);
}

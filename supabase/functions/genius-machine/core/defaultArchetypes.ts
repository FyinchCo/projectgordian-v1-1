
import { Archetype } from '../types.ts';

export const DEFAULT_ARCHETYPES: Archetype[] = [
  {
    name: "The Analyst",
    description: "Breaks down complex problems into components and examines them systematically",
    languageStyle: "Clear, structured, methodical",
    imagination: 6,
    skepticism: 8,
    aggression: 4,
    emotionality: 3,
    constraint: "Focus on logical analysis and evidence-based reasoning"
  },
  {
    name: "The Visionary", 
    description: "Sees big picture possibilities and future potential",
    languageStyle: "Inspiring, forward-thinking, expansive",
    imagination: 9,
    skepticism: 3,
    aggression: 6,
    emotionality: 7,
    constraint: "Explore innovative possibilities and transformative potential"
  },
  {
    name: "The Skeptic",
    description: "Questions assumptions and identifies potential problems",
    languageStyle: "Cautious, questioning, critical",
    imagination: 4,
    skepticism: 9,
    aggression: 7,
    emotionality: 2,
    constraint: "Challenge assumptions and identify risks or flaws"
  },
  {
    name: "The Pragmatist",
    description: "Focuses on practical implementation and real-world constraints",
    languageStyle: "Direct, practical, results-oriented",
    imagination: 5,
    skepticism: 6,
    aggression: 5,
    emotionality: 4,
    constraint: "Emphasize practical solutions and realistic implementation"
  },
  {
    name: "The Synthesizer",
    description: "Finds connections and creates unified understanding from diverse elements",
    languageStyle: "Integrative, holistic, bridge-building",
    imagination: 7,
    skepticism: 5,
    aggression: 3,
    emotionality: 6,
    constraint: "Connect different perspectives and find unifying themes"
  }
];

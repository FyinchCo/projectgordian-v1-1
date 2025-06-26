
import { Brain, Lightbulb, Search, Zap, Hammer, Eye, Cpu } from "lucide-react";

export const getArchetypeIcon = (archetype: string) => {
  switch (archetype) {
    case "The Visionary": return Lightbulb;
    case "The Skeptic": return Search;
    case "The Mystic": return Zap;
    case "The Contrarian": return Zap;
    case "The Craftsman": 
    case "The Realist": return Hammer;
    case "Synthesis Agent": return Cpu;
    default: return Brain;
  }
};

export const getArchetypeColor = (archetype: string) => {
  switch (archetype) {
    case "The Visionary": return "bg-purple-100 border-purple-200 text-purple-800";
    case "The Skeptic": return "bg-yellow-100 border-yellow-200 text-yellow-800";
    case "The Mystic": return "bg-blue-100 border-blue-200 text-blue-800";
    case "The Contrarian": return "bg-red-100 border-red-200 text-red-800";
    case "The Craftsman":
    case "The Realist": return "bg-green-100 border-green-200 text-green-800";
    case "Synthesis Agent": return "bg-indigo-100 border-indigo-200 text-indigo-800";
    default: return "bg-gray-100 border-gray-200 text-gray-800";
  }
};

export const getThinkingStages = (archetype: string) => {
  switch (archetype) {
    case "The Visionary": return [
      "Scanning possibility space...",
      "Identifying breakthrough patterns...",
      "Envisioning transformative scenarios...",
      "Connecting future potentials...",
      "Crystallizing visionary insights..."
    ];
    case "The Skeptic": return [
      "Examining core assumptions...",
      "Stress-testing logical foundations...",
      "Identifying critical vulnerabilities...",
      "Probing for hidden flaws...",
      "Formulating penetrating questions..."
    ];
    case "The Mystic": return [
      "Sensing archetypal currents...",
      "Exploring symbolic dimensions...",
      "Connecting to universal patterns...",
      "Intuiting deeper meanings...",
      "Channeling transcendent wisdom..."
    ];
    case "The Contrarian": return [
      "Challenging orthodox thinking...",
      "Seeking radical alternatives...",
      "Identifying contradictions...",
      "Proposing disruptive perspectives...",
      "Revolutionizing conventional wisdom..."
    ];
    case "The Craftsman":
    case "The Realist": return [
      "Assessing practical constraints...",
      "Evaluating implementation paths...",
      "Testing real-world viability...",
      "Optimizing feasibility...",
      "Crafting actionable solutions..."
    ];
    case "Synthesis Agent": return [
      "Gathering all perspectives...",
      "Identifying convergent themes...",
      "Resolving cognitive tensions...",
      "Weaving unified understanding...",
      "Generating breakthrough synthesis..."
    ];
    default: return ["Processing cognitive insights..."];
  }
};

export const getCompletionInsights = (archetype: string) => {
  switch (archetype) {
    case "The Visionary": return "Contributed innovative pathways and future-oriented perspectives";
    case "The Skeptic": return "Identified critical assumptions and strengthened logical foundations";
    case "The Mystic": return "Revealed deeper patterns and archetypal wisdom";
    case "The Contrarian": return "Challenged orthodoxy and provided alternative viewpoints";
    case "The Realist": return "Grounded insights in practical reality and feasibility";
    case "Synthesis Agent": return "Integrated all perspectives into unified breakthrough";
    default: return "Contributed unique analytical perspective";
  }
};

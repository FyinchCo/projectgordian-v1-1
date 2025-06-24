
export const getProcessingInsights = (currentArchetype: string) => {
  switch (currentArchetype) {
    case "The Visionary": return {
      focus: "Future Possibilities & Innovation",
      contribution: "Exploring unconventional pathways and breakthrough potential"
    };
    case "The Skeptic": return {
      focus: "Critical Analysis & Validation",
      contribution: "Testing assumptions and identifying logical vulnerabilities"
    };
    case "The Mystic": return {
      focus: "Intuitive Patterns & Deep Wisdom",
      contribution: "Sensing hidden connections and archetypal meanings"
    };
    case "The Contrarian": return {
      focus: "Alternative Perspectives",
      contribution: "Challenging consensus and proposing radical alternatives"
    };
    case "The Realist": return {
      focus: "Practical Implementation",
      contribution: "Grounding insights in real-world constraints and feasibility"
    };
    case "Compression Agent": return {
      focus: "Synthesis & Integration",
      contribution: "Weaving all perspectives into unified breakthrough insight"
    };
    default: return {
      focus: "Cognitive Processing",
      contribution: "Analyzing question from unique perspective"
    };
  }
};

export const getCircuitIcon = (circuitType: string) => {
  const { Layers, GitBranch, RotateCcw, Zap } = require("lucide-react");
  
  switch (circuitType) {
    case 'parallel': return GitBranch;
    case 'recursive': return RotateCcw;
    case 'hybrid': return Zap;
    default: return Layers;
  }
};

import { useState, useEffect } from "react";
import { Brain, Eye, Target, Zap, Puzzle } from "lucide-react";

interface InsightStreamProps {
  currentArchetype: string;
  currentLayer: number;
  isActive: boolean;
}

interface InsightTile {
  id: string;
  text: string;
  archetype: string;
  icon: React.ReactNode;
  timestamp: number;
}

export const InsightStream = ({ currentArchetype, currentLayer, isActive }: InsightStreamProps) => {
  const [insights, setInsights] = useState<InsightTile[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  // Archetype configurations with icons and insight templates
  const archetypeConfig = {
    "The Visionary": {
      icon: <Eye className="w-3 h-3" />,
      templates: [
        "seeing beyond conventional boundaries...",
        "envisioning radical possibilities in layer {layer}",
        "questioning fundamental assumptions about reality",
        "what if the entire premise needs rethinking?",
        "glimpsing patterns that transcend current logic",
        "proposing transformative shifts in perspective"
      ]
    },
    "The Mystic": {
      icon: <Brain className="w-3 h-3" />,
      templates: [
        "sensing deeper interconnections emerging...",
        "intuiting hidden relationships in layer {layer}",
        "feeling the pulse of collective consciousness",
        "ancient wisdom whispers through modern inquiry",
        "the paradox reveals its deeper truth",
        "unity emerges from apparent contradiction"
      ]
    },
    "The Skeptic": {
      icon: <Target className="w-3 h-3" />,
      templates: [
        "demanding rigorous evidence for claims...",
        "challenging assumptions in layer {layer}",
        "where is the empirical foundation?",
        "correlation does not imply causation here",
        "this requires more substantial proof",
        "separating speculation from verified truth"
      ]
    },
    "The Realist": {
      icon: <Puzzle className="w-3 h-3" />,
      templates: [
        "grounding insights in practical reality...",
        "applying real-world constraints to layer {layer}",
        "how does this manifest in actual experience?",
        "focusing on implementable solutions",
        "balancing idealism with pragmatic limits",
        "what are the concrete implications?"
      ]
    },
    "The Contrarian": {
      icon: <Zap className="w-3 h-3" />,
      templates: [
        "disrupting comfortable assumptions...",
        "challenging consensus in layer {layer}",
        "what if everyone else is wrong?",
        "flipping the script on conventional wisdom",
        "tension spike detected: opposing forces clash",
        "rejecting the obvious to find the hidden"
      ]
    }
  };

  // Generate a new insight based on current processing state
  const generateInsight = (): InsightTile => {
    const archetype = currentArchetype || "The Visionary";
    const config = archetypeConfig[archetype] || archetypeConfig["The Visionary"];
    const template = config.templates[Math.floor(Math.random() * config.templates.length)];
    const text = template.replace("{layer}", currentLayer.toString());

    return {
      id: `insight-${Date.now()}-${Math.random()}`,
      text: text,
      archetype: archetype.replace("The ", ""),
      icon: config.icon,
      timestamp: Date.now()
    };
  };

  // Add insights periodically while processing
  useEffect(() => {
    if (!isActive || isPaused) return;

    const interval = setInterval(() => {
      const newInsight = generateInsight();
      setInsights(prev => {
        const updated = [...prev, newInsight];
        // Keep only the last 10 insights to prevent memory issues
        return updated.slice(-10);
      });
    }, 3500 + Math.random() * 2000); // 3.5-5.5 second intervals

    return () => clearInterval(interval);
  }, [currentArchetype, currentLayer, isActive, isPaused]);

  // Clear insights when processing stops
  useEffect(() => {
    if (!isActive) {
      setInsights([]);
    }
  }, [isActive]);

  if (!isActive || insights.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <div className="text-center mb-4">
        <div className="text-xs text-gray-500 uppercase tracking-wider font-mono">
          Cognitive Stream
        </div>
      </div>
      
      <div 
        className="relative bg-gray-50 border border-gray-200 rounded-lg p-4 h-24 overflow-hidden cursor-pointer"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        title="Hover to pause the insight stream"
      >
        <div className={`flex space-x-6 ${isPaused ? '' : 'animate-scroll'}`}>
          {insights.map((insight) => (
            <div 
              key={insight.id}
              className="flex-shrink-0 flex items-center space-x-3 min-w-max"
            >
              <div className="flex items-center space-x-2 text-gray-400">
                {insight.icon}
                <span className="text-xs font-mono">{insight.archetype}</span>
              </div>
              <div className="font-cormorant text-sm text-gray-700 italic max-w-xs">
                {insight.text}
              </div>
            </div>
          ))}
        </div>
        
        {/* Fade overlay on the right */}
        <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
      </div>
      
      {isPaused && (
        <div className="text-center mt-2">
          <div className="text-xs text-gray-400 font-inter">Stream paused • Move cursor away to resume</div>
        </div>
      )}
    </div>
  );
};

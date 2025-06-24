
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Lightbulb, Search, Zap, Hammer, Eye, Cpu } from "lucide-react";
import { useState, useEffect } from "react";

interface ArchetypeThoughtBubbleProps {
  archetype: string;
  isActive: boolean;
  isCompleted: boolean;
  thoughtProcess?: string;
  processingStage?: string;
}

const getArchetypeIcon = (archetype: string) => {
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

const getArchetypeColor = (archetype: string) => {
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

const getThinkingStages = (archetype: string) => {
  switch (archetype) {
    case "The Visionary": return [
      "Scanning for possibilities...",
      "Identifying patterns and trends...",
      "Envisioning future scenarios...",
      "Connecting disparate concepts...",
      "Crystallizing the vision..."
    ];
    case "The Skeptic": return [
      "Examining assumptions...",
      "Identifying potential flaws...",
      "Testing logical consistency...",
      "Probing for weaknesses...",
      "Formulating critical questions..."
    ];
    case "The Mystic": return [
      "Sensing deeper currents...",
      "Exploring symbolic meanings...",
      "Connecting to universal patterns...",
      "Intuiting hidden relationships...",
      "Channeling wisdom insights..."
    ];
    case "The Contrarian": return [
      "Challenging conventional wisdom...",
      "Seeking alternative viewpoints...",
      "Identifying contradictions...",
      "Proposing radical alternatives...",
      "Disrupting established thought..."
    ];
    case "The Craftsman":
    case "The Realist": return [
      "Assessing practical implications...",
      "Evaluating implementation challenges...",
      "Grounding in real-world constraints...",
      "Testing feasibility...",
      "Crafting actionable insights..."
    ];
    case "Synthesis Agent": return [
      "Collecting all perspectives...",
      "Identifying common threads...",
      "Resolving contradictions...",
      "Weaving unified understanding...",
      "Generating breakthrough insight..."
    ];
    default: return ["Processing insights..."];
  }
};

export const ArchetypeThoughtBubble = ({ 
  archetype, 
  isActive, 
  isCompleted, 
  thoughtProcess,
  processingStage 
}: ArchetypeThoughtBubbleProps) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const Icon = getArchetypeIcon(archetype);
  const colorClass = getArchetypeColor(archetype);
  const thinkingStages = getThinkingStages(archetype);

  // Animate through thinking stages when active
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => (prev + 1) % thinkingStages.length);
    }, 2000); // Change stage every 2 seconds

    return () => clearInterval(interval);
  }, [isActive, thinkingStages.length]);

  // Typewriter effect for current stage
  useEffect(() => {
    if (!isActive) {
      setDisplayText("");
      return;
    }

    const currentStage = thinkingStages[currentStageIndex];
    setDisplayText("");
    
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index < currentStage.length) {
        setDisplayText(currentStage.substring(0, index + 1));
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, 50); // Type each character every 50ms

    return () => clearInterval(typeInterval);
  }, [currentStageIndex, isActive, thinkingStages]);

  return (
    <Card className={`p-4 transition-all duration-500 ${
      isActive ? `${colorClass} scale-105 shadow-lg ring-2 ring-opacity-50` : 
      isCompleted ? "bg-green-50 border-green-200 shadow-md" : 
      "bg-gray-50 border-gray-200 opacity-60"
    }`}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className={`w-5 h-5 ${isActive ? "animate-pulse" : ""}`} />
            <h3 className="font-semibold text-sm">
              {archetype.replace("The ", "")}
            </h3>
          </div>
          {isCompleted && (
            <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
              ✓ Complete
            </Badge>
          )}
          {isActive && (
            <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-300 animate-pulse">
              <Eye className="w-3 h-3 mr-1" />
              Thinking...
            </Badge>
          )}
        </div>

        {/* Thought Process */}
        <div className="min-h-[80px]">
          {isActive && (
            <div className="space-y-3">
              <div className="bg-white bg-opacity-50 rounded-lg p-3 border border-current border-opacity-20">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Current Focus:
                </p>
                <p className="text-sm italic text-gray-800 min-h-[20px]">
                  {displayText}
                  <span className="animate-pulse">|</span>
                </p>
              </div>
              
              {/* Stage Progress Dots */}
              <div className="flex justify-center space-x-1">
                {thinkingStages.map((_, index) => (
                  <div 
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentStageIndex ? 'bg-current scale-125' : 
                      index < currentStageIndex ? 'bg-current opacity-60' : 'bg-current opacity-20'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
          
          {isCompleted && (
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm font-medium text-green-800">
                  Analysis Complete
                </p>
              </div>
              <p className="text-sm text-green-700">
                Perspective captured and integrated into the synthesis
              </p>
            </div>
          )}
          
          {!isActive && !isCompleted && (
            <div className="bg-gray-100 rounded-lg p-3 border border-gray-200">
              <p className="text-sm text-gray-500 flex items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                Awaiting activation...
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

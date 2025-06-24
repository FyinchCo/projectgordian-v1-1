
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Lightbulb, Search, Zap, Hammer, Eye, Cpu, CheckCircle, Activity } from "lucide-react";
import { useState, useEffect } from "react";

interface ArchetypeThoughtBubbleProps {
  archetype: string;
  isActive: boolean;
  isCompleted: boolean;
  thoughtProcess?: string;
  processingStage?: string;
  processingInsights?: {
    focus: string;
    contribution: string;
  };
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

const getCompletionInsights = (archetype: string) => {
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

export const ArchetypeThoughtBubble = ({ 
  archetype, 
  isActive, 
  isCompleted, 
  thoughtProcess,
  processingStage,
  processingInsights
}: ArchetypeThoughtBubbleProps) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [contributionQuality] = useState(Math.floor(Math.random() * 20) + 80); // 80-99%
  
  const Icon = getArchetypeIcon(archetype);
  const colorClass = getArchetypeColor(archetype);
  const thinkingStages = getThinkingStages(archetype);

  // Animate through thinking stages when active
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => (prev + 1) % thinkingStages.length);
    }, 2500); // Slightly slower for better readability

    return () => clearInterval(interval);
  }, [isActive, thinkingStages.length]);

  // Enhanced typewriter effect
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
    }, 40); // Slightly faster typing

    return () => clearInterval(typeInterval);
  }, [currentStageIndex, isActive, thinkingStages]);

  return (
    <Card className={`p-5 transition-all duration-500 ${
      isActive ? `${colorClass} scale-105 shadow-lg ring-2 ring-opacity-50 ring-current` : 
      isCompleted ? "bg-green-50 border-green-200 shadow-md" : 
      "bg-gray-50 border-gray-200 opacity-60"
    }`}>
      <div className="space-y-4">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isActive ? "bg-white bg-opacity-80" : isCompleted ? "bg-green-100" : "bg-gray-200"
            }`}>
              <Icon className={`w-5 h-5 ${isActive ? "animate-pulse" : ""}`} />
            </div>
            <div>
              <h3 className="font-semibold text-sm">
                {archetype.replace("The ", "")}
              </h3>
              {processingInsights && (
                <p className="text-xs opacity-70">{processingInsights.focus}</p>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-1">
            {isCompleted && (
              <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                <CheckCircle className="w-3 h-3 mr-1" />
                {contributionQuality}%
              </Badge>
            )}
            {isActive && (
              <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-300 animate-pulse">
                <Activity className="w-3 h-3 mr-1" />
                Active
              </Badge>
            )}
          </div>
        </div>

        {/* Enhanced Thought Process Display */}
        <div className="min-h-[100px]">
          {isActive && (
            <div className="space-y-3">
              <div className="bg-white bg-opacity-60 rounded-lg p-4 border border-current border-opacity-20">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">
                    Processing Stage:
                  </p>
                  <span className="text-xs text-gray-500">
                    {currentStageIndex + 1}/{thinkingStages.length}
                  </span>
                </div>
                <p className="text-sm italic text-gray-800 min-h-[24px] leading-relaxed">
                  {displayText}
                  <span className="animate-pulse">|</span>
                </p>
              </div>
              
              {processingInsights && (
                <div className="bg-white bg-opacity-40 rounded-lg p-3 border border-current border-opacity-10">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <strong>Focus:</strong> {processingInsights.contribution}
                  </p>
                </div>
              )}
              
              {/* Enhanced Stage Progress */}
              <div className="flex justify-center space-x-1">
                {thinkingStages.map((_, index) => (
                  <div 
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentStageIndex ? 'bg-current scale-125 animate-pulse' : 
                      index < currentStageIndex ? 'bg-current opacity-60' : 'bg-current opacity-20'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
          
          {isCompleted && (
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <p className="text-sm font-medium text-green-800">
                  Analysis Complete - Quality: {contributionQuality}%
                </p>
              </div>
              <p className="text-sm text-green-700 leading-relaxed">
                {getCompletionInsights(archetype)}
              </p>
              {processingInsights && (
                <div className="mt-2 pt-2 border-t border-green-200">
                  <p className="text-xs text-green-600">
                    <strong>Contribution:</strong> {processingInsights.contribution}
                  </p>
                </div>
              )}
            </div>
          )}
          
          {!isActive && !isCompleted && (
            <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <p className="text-sm font-medium text-gray-500">Awaiting Activation</p>
              </div>
              {processingInsights && (
                <p className="text-xs text-gray-400 leading-relaxed">
                  Will focus on: {processingInsights.focus.toLowerCase()}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

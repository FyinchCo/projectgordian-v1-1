
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { ArchetypeHeader } from "./ArchetypeHeader";
import { ThoughtProcessDisplay } from "./ThoughtProcessDisplay";
import { getThinkingStages } from "./archetypeConfig";

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
  const [contributionQuality] = useState(Math.floor(Math.random() * 20) + 80);
  
  const thinkingStages = getThinkingStages(archetype);

  // Animate through thinking stages when active
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => (prev + 1) % thinkingStages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isActive, thinkingStages.length]);

  // Elegant typewriter effect
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
    }, 50);

    return () => clearInterval(typeInterval);
  }, [currentStageIndex, isActive, thinkingStages]);

  if (!isActive) return null;

  return (
    <Card className="p-8 border border-gray-300 bg-white shadow-zen">
      <div className="space-y-6">
        {/* Elegant Header */}
        <div className="text-center border-b border-gray-200 pb-4">
          <h3 className="font-cormorant text-2xl font-normal text-black">
            {archetype}
          </h3>
          <div className="text-sm text-gray-500 uppercase tracking-wider font-mono mt-1">
            Active Cognitive Process
          </div>
        </div>

        {/* Thought Process Display */}
        <div className="min-h-[120px] flex items-center justify-center">
          <div className="text-center space-y-4 max-w-2xl">
            <div className="text-lg font-inter text-gray-800 leading-relaxed italic">
              "{displayText}"
              <span className="animate-pulse ml-1 not-italic">|</span>
            </div>
            
            {/* Stage Progress */}
            <div className="flex justify-center space-x-2">
              {thinkingStages.map((_, index) => (
                <div 
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentStageIndex ? 'bg-black scale-125' : 
                    index < currentStageIndex ? 'bg-gray-400' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            
            <div className="text-xs font-mono text-gray-500 uppercase tracking-wider">
              Stage {currentStageIndex + 1} of {thinkingStages.length}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

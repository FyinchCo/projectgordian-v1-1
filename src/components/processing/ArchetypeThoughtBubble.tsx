
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { ArchetypeHeader } from "./ArchetypeHeader";
import { ThoughtProcessDisplay } from "./ThoughtProcessDisplay";
import { getArchetypeColor, getThinkingStages } from "./archetypeConfig";

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
  const [contributionQuality] = useState(Math.floor(Math.random() * 20) + 80); // 80-99%
  
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
        <ArchetypeHeader 
          archetype={archetype}
          isActive={isActive}
          isCompleted={isCompleted}
          contributionQuality={contributionQuality}
          processingInsights={processingInsights}
        />

        <div className="min-h-[100px]">
          <ThoughtProcessDisplay 
            archetype={archetype}
            isActive={isActive}
            isCompleted={isCompleted}
            displayText={displayText}
            currentStageIndex={currentStageIndex}
            contributionQuality={contributionQuality}
            processingInsights={processingInsights}
          />
        </div>
      </div>
    </Card>
  );
};

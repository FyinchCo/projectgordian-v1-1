
import { ArchetypeThoughtBubble } from "./ArchetypeThoughtBubble";
import { ProcessingHeader } from "./ProcessingHeader";
import { CurrentFocusCards } from "./CurrentFocusCards";
import { getProcessingInsights } from "./processingInsights";
import { useState, useEffect } from "react";

interface ProcessingVisualizationProps {
  currentArchetype: string;
  currentLayer: number;
  totalLayers: number;
  circuitType: string;
  chunkProgress?: { current: number; total: number };
}

const archetypes = ["The Visionary", "The Skeptic", "The Mystic", "The Contrarian", "The Realist"];

export const ProcessingVisualization = ({
  currentArchetype,
  currentLayer,
  totalLayers,
  circuitType,
  chunkProgress
}: ProcessingVisualizationProps) => {
  const [processingTime, setProcessingTime] = useState(0);
  const [currentPhase, setCurrentPhase] = useState("Initializing cognitive architecture...");
  const [efficiencyScore, setEfficiencyScore] = useState(85);
  
  const insights = getProcessingInsights(currentArchetype);
  
  // Enhanced timer and metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setProcessingTime(prev => prev + 1);
      // Simulate efficiency fluctuation
      setEfficiencyScore(prev => Math.max(75, Math.min(95, prev + (Math.random() - 0.5) * 5)));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Enhanced phase tracking
  useEffect(() => {
    if (currentArchetype === "Compression Agent") {
      setCurrentPhase("Synthesizing multi-perspective breakthrough...");
    } else if (currentArchetype) {
      const insight = getProcessingInsights(currentArchetype);
      setCurrentPhase(`${insight.focus} - ${insight.contribution}`);
    } else {
      setCurrentPhase("Preparing cognitive architecture...");
    }
  }, [currentArchetype]);
  
  // Calculate enhanced progress
  const overallProgress = Math.min(((currentLayer - 1) / totalLayers) * 100 + 
    (currentArchetype !== "Compression Agent" ? 
      (archetypes.indexOf(currentArchetype) + 1) / (archetypes.length + 1) * (100 / totalLayers) : 
      100 / totalLayers), 100);

  const getCurrentArchetypeIndex = () => {
    if (currentArchetype === "Compression Agent") return archetypes.length;
    return archetypes.indexOf(currentArchetype);
  };

  const currentIndex = getCurrentArchetypeIndex();

  return (
    <div className="space-y-6">
      {/* Enhanced Progress Header with Real-time Metrics */}
      <ProcessingHeader
        currentLayer={currentLayer}
        totalLayers={totalLayers}
        circuitType={circuitType}
        overallProgress={overallProgress}
        currentPhase={currentPhase}
        processingTime={processingTime}
        efficiencyScore={efficiencyScore}
        chunkProgress={chunkProgress}
      />

      {/* Enhanced Archetype Grid with Contribution Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {archetypes.map((archetype, index) => (
          <ArchetypeThoughtBubble
            key={archetype}
            archetype={archetype}
            isActive={currentArchetype === archetype}
            isCompleted={currentLayer > 1 || currentIndex > index}
            processingInsights={getProcessingInsights(archetype)}
          />
        ))}
        
        {/* Enhanced Synthesis Agent */}
        <ArchetypeThoughtBubble
          archetype="Synthesis Agent"
          isActive={currentArchetype === "Compression Agent"}
          isCompleted={false}
          processingInsights={getProcessingInsights("Compression Agent")}
        />
      </div>

      {/* Current Focus Cards */}
      <CurrentFocusCards 
        currentArchetype={currentArchetype}
        insights={insights}
      />
    </div>
  );
};


import { DescentVisualization } from "./DescentVisualization";
import { EnhancedArchetypeGrid } from "./EnhancedArchetypeGrid";
import { getProcessingInsights } from "./processingInsights";
import { PixelRobot } from "../PixelRobot";
import { useState, useEffect } from "react";

interface ProcessingVisualizationProps {
  currentArchetype: string;
  currentLayer: number;
  totalLayers: number;
  circuitType: string;
  chunkProgress?: { current: number; total: number };
}

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

  // Enhanced phase tracking with archetypal language
  useEffect(() => {
    if (currentArchetype === "Compression Agent") {
      setCurrentPhase("Neural synthesis active - breakthrough imminent");
    } else if (currentArchetype) {
      const archetypePhases = {
        "The Visionary": "Scanning possibility horizons...",
        "The Skeptic": "Stress-testing foundations...", 
        "The Mystic": "Sensing deeper currents...",
        "The Contrarian": "Challenging orthodox thinking...",
        "The Realist": "Grounding in practical reality..."
      };
      setCurrentPhase(archetypePhases[currentArchetype] || "Cognitive processing active...");
    } else {
      setCurrentPhase("Awakening archetypal consciousness...");
    }
  }, [currentArchetype]);
  
  // Calculate enhanced progress
  const overallProgress = Math.min(((currentLayer - 1) / totalLayers) * 100 + 
    (currentArchetype !== "Compression Agent" ? 15 : 20), 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <div className="space-y-8 max-w-7xl mx-auto p-8">
        {/* Main Descent Interface */}
        <DescentVisualization
          currentLayer={currentLayer}
          totalLayers={totalLayers}
          overallProgress={overallProgress}
          processingTime={processingTime}
          efficiencyScore={efficiencyScore}
          currentPhase={currentPhase}
          chunkProgress={chunkProgress}
        />

        {/* Enhanced Archetype Grid */}
        <EnhancedArchetypeGrid 
          currentArchetype={currentArchetype}
          currentLayer={currentLayer}
        />

        {/* Atmospheric Bottom Section */}
        <div className="text-center space-y-4 py-8">
          <div className="flex justify-center items-center space-x-4 mb-6">
            <PixelRobot size={48} mood="working" animate={true} />
            <div className="text-center">
              <p className="text-gray-400 text-lg">
                {currentArchetype === "Compression Agent" 
                  ? "All perspectives converging into unified insight..."
                  : "Archetypal minds engaged in deep cognitive work..."
                }
              </p>
            </div>
            <PixelRobot size={48} mood="thinking" animate={true} />
          </div>
          
          {/* Dynamic Activity Indicators */}
          <div className="flex justify-center space-x-2">
            {[...Array(7)].map((_, i) => (
              <div 
                key={i}
                className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

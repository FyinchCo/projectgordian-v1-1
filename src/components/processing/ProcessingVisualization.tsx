
import { EnhancedArchetypeGrid } from "./EnhancedArchetypeGrid";
import { getProcessingInsights } from "./processingInsights";
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
  
  const insights = getProcessingInsights(currentArchetype);
  
  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setProcessingTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8">
      {/* Elegant Archetype Row */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="font-cormorant text-3xl font-normal text-black mb-2">
            Thinkers at Work
          </h2>
          <div className="text-sm text-gray-500 uppercase tracking-wider font-mono">
            Processing Time: {formatTime(processingTime)}
          </div>
        </div>

        <EnhancedArchetypeGrid 
          currentArchetype={currentArchetype}
          currentLayer={currentLayer}
        />
      </div>
    </div>
  );
};

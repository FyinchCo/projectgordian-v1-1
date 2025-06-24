
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArchetypeThoughtBubble } from "./ArchetypeThoughtBubble";
import { Layers, Zap, GitBranch, RotateCcw, Activity, Timer } from "lucide-react";
import { useState, useEffect } from "react";

interface ProcessingVisualizationProps {
  currentArchetype: string;
  currentLayer: number;
  totalLayers: number;
  circuitType: string;
  chunkProgress?: { current: number; total: number };
}

const archetypes = ["The Visionary", "The Skeptic", "The Mystic", "The Contrarian", "The Realist"];

const getCircuitIcon = (circuitType: string) => {
  switch (circuitType) {
    case 'parallel': return GitBranch;
    case 'recursive': return RotateCcw;
    case 'hybrid': return Zap;
    default: return Layers;
  }
};

export const ProcessingVisualization = ({
  currentArchetype,
  currentLayer,
  totalLayers,
  circuitType,
  chunkProgress
}: ProcessingVisualizationProps) => {
  const [processingTime, setProcessingTime] = useState(0);
  const [currentPhase, setCurrentPhase] = useState("Initializing...");
  
  const CircuitIcon = getCircuitIcon(circuitType);
  
  // Timer for processing duration
  useEffect(() => {
    const interval = setInterval(() => {
      setProcessingTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Phase tracking
  useEffect(() => {
    if (currentArchetype === "Compression Agent") {
      setCurrentPhase("Synthesizing insights...");
    } else if (currentArchetype) {
      setCurrentPhase(`${currentArchetype} analyzing...`);
    } else {
      setCurrentPhase("Preparing processing...");
    }
  }, [currentArchetype]);
  
  // Calculate progress
  const overallProgress = Math.min(((currentLayer - 1) / totalLayers) * 100 + 
    (currentArchetype !== "Compression Agent" ? 
      (archetypes.indexOf(currentArchetype) + 1) / (archetypes.length + 1) * (100 / totalLayers) : 
      100 / totalLayers), 100);

  const getCurrentArchetypeIndex = () => {
    if (currentArchetype === "Compression Agent") return archetypes.length;
    return archetypes.indexOf(currentArchetype);
  };

  const currentIndex = getCurrentArchetypeIndex();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Progress Header */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CircuitIcon className="w-6 h-6 text-blue-600" />
              <div>
                <div className="font-bold text-lg text-blue-800">
                  Layer {currentLayer} of {totalLayers}
                </div>
                <div className="text-sm text-blue-600 capitalize flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>{circuitType} Circuit Processing</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Timer className="w-4 h-4" />
              <span>{formatTime(processingTime)}</span>
            </div>
          </div>
          
          {chunkProgress && chunkProgress.total > 1 && (
            <div className="text-right">
              <div className="text-sm font-medium text-blue-700">
                Chunk {chunkProgress.current}/{chunkProgress.total}
              </div>
              <div className="text-xs text-blue-500">
                Deep Processing Mode
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">{currentPhase}</span>
            <span className="font-medium text-blue-700">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-3 bg-blue-100" />
          
          {/* Phase indicator */}
          <div className="flex justify-between text-xs text-gray-500">
            <span>Analysis Phase</span>
            <span>Synthesis Phase</span>
          </div>
        </div>
      </Card>

      {/* Enhanced Archetype Thinking Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {archetypes.map((archetype, index) => (
          <ArchetypeThoughtBubble
            key={archetype}
            archetype={archetype}
            isActive={currentArchetype === archetype}
            isCompleted={currentLayer > 1 || currentIndex > index}
          />
        ))}
        
        {/* Enhanced Synthesis Step */}
        <ArchetypeThoughtBubble
          archetype="Synthesis Agent"
          isActive={currentArchetype === "Compression Agent"}
          isCompleted={false}
        />
      </div>

      {/* Enhanced Current Focus Cards */}
      {currentArchetype && currentArchetype !== "Compression Agent" && (
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <h3 className="text-xl font-bold text-purple-800">
                {currentArchetype} Active
              </h3>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-purple-600 max-w-2xl mx-auto">
              Deep archetypal analysis in progress. Each perspective brings unique insights that contribute to a richer understanding of your question.
            </p>
            <div className="flex justify-center space-x-1 mt-4">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }} 
                />
              ))}
            </div>
          </div>
        </Card>
      )}

      {currentArchetype === "Compression Agent" && (
        <Card className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <Zap className="w-6 h-6 text-emerald-600 animate-pulse" />
              <h3 className="text-xl font-bold text-emerald-800">
                Synthesis in Progress
              </h3>
              <Zap className="w-6 h-6 text-emerald-600 animate-pulse" />
            </div>
            <p className="text-emerald-600 max-w-2xl mx-auto">
              Weaving together all archetypal perspectives into a unified breakthrough insight. This is where the magic happens.
            </p>
            <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto mt-4">
              {archetypes.map((_, i) => (
                <div 
                  key={i}
                  className="w-8 h-1 bg-emerald-400 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }} 
                />
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

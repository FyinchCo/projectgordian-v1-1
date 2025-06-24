
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArchetypeThoughtBubble } from "./ArchetypeThoughtBubble";
import { Layers, Zap, GitBranch, RotateCcw } from "lucide-react";

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
  const CircuitIcon = getCircuitIcon(circuitType);
  
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

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <CircuitIcon className="w-5 h-5" />
            <div>
              <div className="font-semibold">
                Layer {currentLayer} of {totalLayers}
              </div>
              <div className="text-sm text-gray-500 capitalize">
                {circuitType} Circuit Processing
              </div>
            </div>
          </div>
          
          {chunkProgress && chunkProgress.total > 1 && (
            <div className="text-sm text-blue-600">
              Chunk {chunkProgress.current}/{chunkProgress.total}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>
      </Card>

      {/* Archetype Thinking Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {archetypes.map((archetype, index) => (
          <ArchetypeThoughtBubble
            key={archetype}
            archetype={archetype}
            isActive={currentArchetype === archetype}
            isCompleted={currentLayer > 1 || currentIndex > index}
          />
        ))}
        
        {/* Synthesis Step */}
        <ArchetypeThoughtBubble
          archetype="Synthesis Agent"
          isActive={currentArchetype === "Compression Agent"}
          isCompleted={false}
        />
      </div>

      {/* Current Focus */}
      {currentArchetype && currentArchetype !== "Compression Agent" && (
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-blue-800">
              🧠 {currentArchetype} is Thinking
            </h3>
            <p className="text-blue-600">
              Analyzing the question from a unique archetypal perspective...
            </p>
          </div>
        </Card>
      )}

      {currentArchetype === "Compression Agent" && (
        <Card className="p-6 bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-green-800">
              ⚡ Synthesis in Progress
            </h3>
            <p className="text-green-600">
              Weaving together all archetypal insights into a unified understanding...
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

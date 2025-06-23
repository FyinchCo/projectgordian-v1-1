
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, Layers, Zap, GitBranch, RotateCcw } from "lucide-react";

interface ProcessingDisplayProps {
  currentArchetype: string;
  question: string;
  currentLayer?: number;
  totalLayers?: number;
  circuitType?: string;
  chunkProgress?: { current: number; total: number };
}

const getCircuitIcon = (circuitType: string) => {
  switch (circuitType) {
    case 'parallel': return GitBranch;
    case 'recursive': return RotateCcw;
    case 'hybrid': return Zap;
    default: return Layers;
  }
};

export const ProcessingDisplay = ({ 
  currentArchetype, 
  question,
  currentLayer = 1,
  totalLayers = 1,
  circuitType = 'sequential',
  chunkProgress
}: ProcessingDisplayProps) => {
  const CircuitIcon = getCircuitIcon(circuitType);
  
  // Calculate overall progress
  const archetypes = ["The Visionary", "The Skeptic", "The Mystic", "The Contrarian", "The Craftsman"];
  const stepsPerLayer = archetypes.length + 1; // agents + synthesis
  const totalSteps = totalLayers * stepsPerLayer;
  const completedLayers = currentLayer - 1;
  const currentLayerProgress = currentArchetype === "Compression Agent" ? archetypes.length + 1 : 
    archetypes.indexOf(currentArchetype) + 1;
  const currentStep = completedLayers * stepsPerLayer + currentLayerProgress;
  const progressPercent = Math.min((currentStep / totalSteps) * 100, 100);

  return (
    <div className="space-y-8">
      {/* Question Context */}
      <Card className="p-6 bg-gray-50">
        <h3 className="font-bold text-sm uppercase tracking-wide text-gray-500 mb-2">PROCESSING QUESTION</h3>
        <p className="text-lg">{question}</p>
      </Card>

      {/* Chunk Progress (if chunked processing) */}
      {chunkProgress && chunkProgress.total > 1 && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-blue-800">
              Chunk {chunkProgress.current} of {chunkProgress.total}
            </div>
            <div className="text-sm text-blue-600">
              High-depth processing in progress...
            </div>
          </div>
        </Card>
      )}

      {/* Processing Status */}
      <Card className="p-8 border-2">
        <div className="space-y-6">
          {/* Layer and Circuit Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Layers className="w-6 h-6" />
              <div>
                <div className="font-bold text-lg">
                  Layer {currentLayer} of {totalLayers}
                </div>
                <div className="text-sm text-gray-500">Multi-layer analysis</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CircuitIcon className="w-4 h-4" />
              <span className="capitalize">{circuitType} Circuit</span>
            </div>
          </div>

          {/* Current Agent */}
          <div className="text-center space-y-4">
            <Brain className="w-12 h-12 mx-auto animate-pulse" />
            <div>
              <h3 className="text-2xl font-bold">{currentArchetype}</h3>
              <p className="text-gray-600">
                {currentArchetype === "Compression Agent" 
                  ? "Synthesizing insights from archetypal perspectives..."
                  : "Analyzing question from archetypal perspective..."
                }
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          {/* Processing Steps */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            {archetypes.map((archetype, index) => {
              const isCompleted = currentLayer > 1 || archetypes.indexOf(currentArchetype) > index;
              const isCurrent = currentArchetype === archetype && currentLayer;
              
              return (
                <div 
                  key={archetype}
                  className={`p-2 rounded text-center transition-colors ${
                    isCompleted ? 'bg-green-100 text-green-700' :
                    isCurrent ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-500'
                  }`}
                >
                  {archetype.replace('The ', '')}
                </div>
              );
            })}
            <div 
              className={`p-2 rounded text-center transition-colors ${
                currentArchetype === "Compression Agent" ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-500'
              }`}
            >
              Synthesis
            </div>
          </div>
        </div>
      </Card>

      {/* Processing Animation */}
      <div className="text-center">
        <div className="inline-flex space-x-2">
          <div className="w-3 h-3 bg-black rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">Processing deep insights...</p>
      </div>
    </div>
  );
};

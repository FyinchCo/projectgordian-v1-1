
import { Card } from "@/components/ui/card";
import { ProcessingVisualization } from "./processing/ProcessingVisualization";
import { MessageSquare, Eye, Circle } from "lucide-react";

interface ProcessingDisplayProps {
  currentArchetype: string;
  question: string;
  currentLayer?: number;
  totalLayers?: number;
  circuitType?: string;
  chunkProgress?: { current: number; total: number };
}

export const ProcessingDisplay = ({ 
  currentArchetype, 
  question,
  currentLayer = 1,
  totalLayers = 1,
  circuitType = 'sequential',
  chunkProgress
}: ProcessingDisplayProps) => {
  return (
    <div className="min-h-screen bg-white">
      <div className="space-y-12 max-w-6xl mx-auto p-12">
        {/* Cognitive Descent Header */}
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="font-cormorant text-5xl font-normal text-black tracking-tight">
              Cognitive Descent
            </h1>
            <div className="text-xl text-gray-600 font-inter font-light">
              Layer {currentLayer} of {totalLayers}
            </div>
            <div className="text-sm text-gray-500 uppercase tracking-wider font-mono">
              {circuitType} Processing with Archetypal Reasoning
            </div>
          </div>

          {/* Vertical Progress Ladder */}
          <div className="flex justify-center">
            <div className="flex flex-col space-y-3">
              {Array.from({ length: totalLayers }, (_, index) => {
                const layer = index + 1;
                const isCompleted = layer < currentLayer;
                const isActive = layer === currentLayer;
                const isPending = layer > currentLayer;
                
                return (
                  <div key={layer} className="flex items-center space-x-3">
                    <div className="w-4 text-right text-xs font-mono text-gray-400">
                      {layer}
                    </div>
                    <div className={`w-3 h-3 rounded-full border transition-all duration-500 ${
                      isCompleted ? 'bg-black border-black' :
                      isActive ? 'border-black border-2 animate-pulse' :
                      'border-gray-300'
                    }`}>
                      {isActive && (
                        <div className="w-1 h-1 bg-black rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                    <div className="w-20 text-left text-xs font-mono text-gray-400">
                      {isCompleted ? 'Complete' : isActive ? 'Active' : 'Pending'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Question Analysis Box */}
        <Card className="p-8 bg-white border border-black shadow-zen-lg">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Eye className="w-5 h-5 text-black" />
              <span className="text-sm uppercase tracking-wider font-mono text-gray-600">
                Initializing Dialectical Processing
              </span>
            </div>
            
            <blockquote className="font-cormorant text-2xl italic text-black leading-relaxed max-w-3xl mx-auto">
              "{question}"
            </blockquote>
            
            {/* Metrics Dashboard */}
            <div className="pt-6 border-t border-gray-200">
              <div className="grid grid-cols-4 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-lg font-mono font-bold text-black">
                    Layer {currentLayer}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">
                    Cognitive Layer: Active
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-mono font-bold text-black">
                    {currentArchetype.replace("The ", "")}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">
                    Archetype: Processing
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-mono font-bold text-black">
                    78%
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">
                    Computational Efficiency
                  </div>
                </div>
                
                {chunkProgress && chunkProgress.total > 1 && (
                  <div className="text-center">
                    <div className="text-lg font-mono font-bold text-black">
                      {chunkProgress.current}/{chunkProgress.total}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">
                      Recursive Segment
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Enhanced Processing Visualization */}
        <ProcessingVisualization 
          currentArchetype={currentArchetype}
          currentLayer={currentLayer}
          totalLayers={totalLayers}
          circuitType={circuitType}
          chunkProgress={chunkProgress}
        />
      </div>
    </div>
  );
};

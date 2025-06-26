
import { Brain, Activity, TrendingUp, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MetricsCardsProps {
  currentLayer: number;
  totalLayers: number;
  currentArchetype: string;
  efficiency: number;
  chunkProgress?: { current: number; total: number };
  processingPhase?: string;
}

export const MetricsCards = ({ 
  currentLayer, 
  totalLayers, 
  currentArchetype, 
  efficiency,
  chunkProgress,
  processingPhase
}: MetricsCardsProps) => {
  // Calculate confidence based on progress
  const confidence = Math.round(((currentLayer - 1) / totalLayers) * 100);
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Active Layer Card */}
      <Card className="p-4 bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-black font-mono">
              {currentLayer}
              <span className="text-sm text-gray-500 font-normal">/{totalLayers}</span>
            </div>
            <div className="text-xs text-gray-600 uppercase tracking-wider">
              Active Layer
            </div>
          </div>
          <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      </Card>

      {/* Current Archetype Card */}
      <Card className="p-4 bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="text-lg font-semibold text-black truncate">
              {currentArchetype.replace("The ", "")}
            </div>
            <div className="text-xs text-gray-600 uppercase tracking-wider">
              Active Thinker
            </div>
          </div>
          <Brain className="w-5 h-5 text-gray-400" />
        </div>
      </Card>

      {/* Confidence Card */}
      <Card className="p-4 bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-black font-mono">
              {confidence}%
            </div>
            <div className="text-xs text-gray-600 uppercase tracking-wider">
              Progress
            </div>
          </div>
          <TrendingUp className="w-5 h-5 text-gray-400" />
        </div>
      </Card>

      {/* Efficiency Card */}
      <Card className="p-4 bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-black font-mono">
              {efficiency}%
            </div>
            <div className="text-xs text-gray-600 uppercase tracking-wider">
              Efficiency
            </div>
            {chunkProgress && chunkProgress.total > 1 && (
              <div className="text-xs text-gray-500">
                Chunk {chunkProgress.current}/{chunkProgress.total}
              </div>
            )}
          </div>
          <Zap className="w-5 h-5 text-gray-400" />
        </div>
      </Card>
    </div>
  );
};

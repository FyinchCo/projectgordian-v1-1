
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity, Brain, Zap } from "lucide-react";
import { ProcessingMetrics } from "./ProcessingMetrics";
import { getCircuitIcon } from "./processingInsights";

interface ProcessingHeaderProps {
  currentLayer: number;
  totalLayers: number;
  circuitType: string;
  overallProgress: number;
  currentPhase: string;
  processingTime: number;
  efficiencyScore: number;
  chunkProgress?: { current: number; total: number };
}

export const ProcessingHeader = ({
  currentLayer,
  totalLayers,
  circuitType,
  overallProgress,
  currentPhase,
  processingTime,
  efficiencyScore,
  chunkProgress
}: ProcessingHeaderProps) => {
  const CircuitIcon = getCircuitIcon(circuitType);
  
  // Calculate real progress based on engine layers
  const engineProgress = Math.min(95, (currentLayer / totalLayers) * 100);
  const estimatedMinutes = Math.ceil((totalLayers * 35) / 60);

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 shadow-lg">
      <div className="space-y-4">
        {/* Main Progress Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <CircuitIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="font-bold text-2xl text-blue-800">
                  Engine Layer {currentLayer} of {totalLayers}
                </div>
                <div className="text-sm text-blue-600 capitalize flex items-center space-x-2">
                  <Zap className="w-4 h-4 animate-pulse" />
                  <span>Genius Engine Processing • ~{estimatedMinutes}min total</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Real-time Metrics */}
          <ProcessingMetrics 
            processingTime={processingTime}
            efficiencyScore={Math.round(engineProgress)}
            chunkProgress={chunkProgress}
          />
        </div>
        
        {/* Engine Progress Bar */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Real Engine Progress
              </span>
            </div>
            <span className="font-bold text-blue-700 text-lg">{Math.round(engineProgress)}%</span>
          </div>
          <Progress value={engineProgress} className="h-4 bg-blue-100" />
          <div className="text-xs text-gray-500 text-center">
            Genuine {totalLayers}-layer analysis in progress
          </div>
        </div>
      </div>
    </Card>
  );
};

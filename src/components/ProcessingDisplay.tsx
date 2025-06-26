
import { Card } from "@/components/ui/card";
import { LayerGridMap } from "./processing/LayerGridMap";
import { MetricsCards } from "./processing/MetricsCards";
import { ArchetypeContributionBars } from "./processing/ArchetypeContributionBars";
import { InsightStream } from "./processing/InsightStream";
import { ProcessingClock } from "./processing/ProcessingClock";
import { Eye } from "lucide-react";

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
  totalLayers = 20,
  circuitType = 'sequential',
  chunkProgress
}: ProcessingDisplayProps) => {
  // Determine connection status based on progress
  const getConnectionStatus = () => {
    if (chunkProgress && chunkProgress.current === 0) {
      return 'connecting';
    }
    if (chunkProgress && chunkProgress.current > 0 && chunkProgress.current < chunkProgress.total) {
      return 'processing';
    }
    if (chunkProgress && chunkProgress.current === chunkProgress.total) {
      return 'completed';
    }
    return 'connecting';
  };

  const connectionStatus = getConnectionStatus();

  return (
    <div className="min-h-screen bg-white">
      <div className="space-y-8 max-w-6xl mx-auto p-8">
        {/* Header with Processing Clock */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="font-cormorant text-4xl font-normal text-black tracking-tight">
              Cognitive Descent
            </h1>
            <div className="text-sm text-gray-500 uppercase tracking-wider font-mono">
              {circuitType} Processing • {connectionStatus === 'connecting' ? 'Establishing Connection' : 'Archetypal Reasoning'}
            </div>
          </div>
          
          {/* Processing Clock with Connection Status */}
          <div className="flex justify-center pt-2">
            <ProcessingClock 
              isActive={true}
              currentLayer={currentLayer}
              totalLayers={totalLayers}
              connectionStatus={connectionStatus}
            />
          </div>
        </div>

        {/* Connection Status Message */}
        {connectionStatus === 'connecting' && (
          <Card className="p-6 bg-blue-50 border border-blue-200">
            <div className="text-center">
              <div className="text-blue-700 font-medium">
                Establishing connection to AI processing services...
              </div>
              <div className="text-blue-600 text-sm mt-2">
                This may take up to 60 seconds depending on system load
              </div>
            </div>
          </Card>
        )}

        {/* Only show processing details when actually processing */}
        {connectionStatus !== 'connecting' && (
          <>
            {/* Row 1: Layer Progress Grid */}
            <div className="flex justify-center">
              <LayerGridMap 
                currentLayer={currentLayer}
                totalLayers={totalLayers}
              />
            </div>

            {/* Row 2: Question Analysis */}
            <Card className="p-8 bg-gray-50 border border-gray-200">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Eye className="w-5 h-5 text-black" />
                  <span className="text-sm uppercase tracking-wider font-mono text-gray-600">
                    Analyzing Question
                  </span>
                </div>
                
                <blockquote className="font-cormorant text-xl italic text-black leading-relaxed max-w-4xl mx-auto">
                  "{question}"
                </blockquote>
              </div>
            </Card>

            {/* Row 2.5: Progressive Insight Stream */}
            <InsightStream 
              currentArchetype={currentArchetype}
              currentLayer={currentLayer}
              isActive={connectionStatus === 'processing'}
            />

            {/* Row 3: Metrics Cards */}
            <MetricsCards 
              currentLayer={currentLayer}
              totalLayers={totalLayers}
              currentArchetype={currentArchetype}
              efficiency={connectionStatus === 'processing' ? 85 : 0}
              chunkProgress={chunkProgress}
            />

            {/* Row 4: Archetype Contribution Bars */}
            <ArchetypeContributionBars 
              currentArchetype={currentArchetype}
              currentLayer={currentLayer}
            />
          </>
        )}
      </div>
    </div>
  );
};

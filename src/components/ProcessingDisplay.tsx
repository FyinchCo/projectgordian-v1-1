
import { Card } from "@/components/ui/card";
import { LayerGridMap } from "./processing/LayerGridMap";
import { MetricsCards } from "./processing/MetricsCards";
import { ArchetypeContributionBars } from "./processing/ArchetypeContributionBars";
import { InsightStream } from "./processing/InsightStream";
import { ProcessingClock } from "./processing/ProcessingClock";
import { Eye, Zap, Brain } from "lucide-react";

interface ProcessingDisplayProps {
  currentArchetype: string;
  question: string;
  currentLayer?: number;
  totalLayers?: number;
  circuitType?: string;
  chunkProgress?: { current: number; total: number };
  processingPhase?: string;
}

export const ProcessingDisplay = ({ 
  currentArchetype, 
  question,
  currentLayer = 1,
  totalLayers = 20,
  circuitType = 'sequential',
  chunkProgress,
  processingPhase = "Processing..."
}: ProcessingDisplayProps) => {
  // Determine connection status based on progress and phase
  const getConnectionStatus = () => {
    if (processingPhase?.includes('Initializing')) {
      return 'connecting';
    }
    if (processingPhase?.includes('complete') || processingPhase?.includes('Complete')) {
      return 'completed';
    }
    if (chunkProgress && chunkProgress.current > 0) {
      return 'processing';
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
              Enhanced Cognitive Descent
            </h1>
            <div className="text-sm text-gray-500 uppercase tracking-wider font-mono">
              {circuitType} Processing • Real-Time Analysis
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

        {/* Enhanced Phase Status Display */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              {connectionStatus === 'connecting' && <Brain className="w-6 h-6 text-blue-600 animate-pulse" />}
              {connectionStatus === 'processing' && <Zap className="w-6 h-6 text-green-600 animate-pulse" />}
              {connectionStatus === 'completed' && <Eye className="w-6 h-6 text-purple-600" />}
              <div className="text-lg font-medium text-gray-800">
                {processingPhase}
              </div>
            </div>
            
            {currentArchetype && connectionStatus === 'processing' && (
              <div className="text-sm text-gray-600">
                Current Archetype: <span className="font-medium text-blue-700">{currentArchetype}</span>
              </div>
            )}
            
            {chunkProgress && chunkProgress.total > 0 && (
              <div className="text-sm text-gray-500">
                Layer {chunkProgress.current} of {chunkProgress.total} • 
                {Math.round((chunkProgress.current / chunkProgress.total) * 100)}% Complete
              </div>
            )}
          </div>
        </Card>

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

            {/* Row 3: Enhanced Metrics Cards */}
            <MetricsCards 
              currentLayer={currentLayer}
              totalLayers={totalLayers}
              currentArchetype={currentArchetype}
              efficiency={connectionStatus === 'processing' ? 90 : connectionStatus === 'completed' ? 95 : 0}
              chunkProgress={chunkProgress}
              processingPhase={processingPhase}
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

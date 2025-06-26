
import { Card } from "@/components/ui/card";
import { LayerGridMap } from "./processing/LayerGridMap";
import { MetricsCards } from "./processing/MetricsCards";
import { ArchetypeContributionBars } from "./processing/ArchetypeContributionBars";
import { InsightStream } from "./processing/InsightStream";
import { ProcessingClock } from "./processing/ProcessingClock";
import { Eye, Zap, Brain, AlertTriangle } from "lucide-react";

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
  // Improved connection status based on actual engine progress
  const getConnectionStatus = () => {
    if (processingPhase?.includes('Initializing') || processingPhase?.includes('genius-level')) {
      return 'connecting';
    }
    if (processingPhase?.includes('complete') || processingPhase?.includes('Complete')) {
      return 'completed';
    }
    if (currentArchetype && currentArchetype.length > 0) {
      return 'processing';
    }
    if (chunkProgress && chunkProgress.current > 0) {
      return 'processing';
    }
    return 'connecting';
  };

  const connectionStatus = getConnectionStatus();
  
  // Calculate estimated time more accurately
  const estimatedMinutes = Math.ceil((totalLayers * 35) / 60);

  return (
    <div className="min-h-screen bg-white">
      <div className="space-y-8 max-w-6xl mx-auto p-8">
        {/* Header with Processing Clock */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="font-cormorant text-4xl font-normal text-black tracking-tight">
              Genius Engine Processing
            </h1>
            <div className="text-sm text-gray-500 uppercase tracking-wider font-mono">
              {circuitType} Analysis • {totalLayers} Layers • ~{estimatedMinutes} Minutes
            </div>
          </div>
          
          {/* Processing Clock with Real Engine Status */}
          <div className="flex justify-center pt-2">
            <ProcessingClock 
              isActive={true}
              currentLayer={currentLayer}
              totalLayers={totalLayers}
              connectionStatus={connectionStatus}
            />
          </div>
        </div>

        {/* Engine Status Display */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              {connectionStatus === 'connecting' && <Brain className="w-6 h-6 text-blue-600 animate-pulse" />}
              {connectionStatus === 'processing' && <Zap className="w-6 h-6 text-green-600 animate-pulse" />}
              {connectionStatus === 'completed' && <Eye className="w-6 h-6 text-purple-600" />}
              <div className="text-lg font-medium text-gray-800">
                {connectionStatus === 'connecting' && 'Engine initializing... Please wait'}
                {connectionStatus === 'processing' && `Processing Layer ${currentLayer} of ${totalLayers}`}
                {connectionStatus === 'completed' && 'Engine analysis complete'}
              </div>
            </div>
            
            {currentArchetype && connectionStatus === 'processing' && (
              <div className="text-sm text-gray-600">
                Current Perspective: <span className="font-medium text-blue-700">{currentArchetype}</span>
              </div>
            )}
            
            {connectionStatus === 'connecting' && totalLayers > 5 && (
              <div className="flex items-center justify-center space-x-2 text-sm text-amber-600">
                <AlertTriangle className="w-4 h-4" />
                <span>Deep analysis requested - This will take approximately {estimatedMinutes} minutes</span>
              </div>
            )}
          </div>
        </Card>

        {/* Only show detailed processing visuals when actually processing */}
        {connectionStatus === 'processing' && (
          <>
            {/* Layer Progress Grid */}
            <div className="flex justify-center">
              <LayerGridMap 
                currentLayer={currentLayer}
                totalLayers={totalLayers}
              />
            </div>

            {/* Question Analysis */}
            <Card className="p-8 bg-gray-50 border border-gray-200">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Eye className="w-5 h-5 text-black" />
                  <span className="text-sm uppercase tracking-wider font-mono text-gray-600">
                    Engine Analyzing Question
                  </span>
                </div>
                
                <blockquote className="font-cormorant text-xl italic text-black leading-relaxed max-w-4xl mx-auto">
                  "{question}"
                </blockquote>
              </div>
            </Card>

            {/* Real-time Insight Stream */}
            <InsightStream 
              currentArchetype={currentArchetype}
              currentLayer={currentLayer}
              isActive={true}
            />

            {/* Simplified Metrics */}
            <MetricsCards 
              currentLayer={currentLayer}
              totalLayers={totalLayers}
              currentArchetype={currentArchetype}
              efficiency={Math.min(95, (currentLayer / totalLayers) * 100)}
              chunkProgress={chunkProgress}
              processingPhase={`Engine processing layer ${currentLayer}`}
            />

            {/* Archetype Contribution */}
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

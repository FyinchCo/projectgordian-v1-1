
import { Card } from "@/components/ui/card";
import { Brain, Zap, Eye, Timer, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

interface DescentVisualizationProps {
  currentLayer: number;
  totalLayers: number;
  overallProgress: number;
  processingTime: number;
  efficiencyScore: number;
  currentPhase: string;
  chunkProgress?: { current: number; total: number };
}

export const DescentVisualization = ({
  currentLayer,
  totalLayers,
  overallProgress,
  processingTime,
  efficiencyScore,
  currentPhase,
  chunkProgress
}: DescentVisualizationProps) => {
  const [cognitiveState, setCognitiveState] = useState("Initiating descent...");

  // Generate dynamic cognitive states
  useEffect(() => {
    const states = [
      "Piercing surface assumptions...",
      "Contradictions detected. Pursuing...",
      "Archetypal resonance building...",
      "Paradox encountered. Synthesizing...",
      "Depth achieved. Emergence imminent...",
      "Cognitive tension escalating...",
      "Pattern recognition active..."
    ];
    
    const interval = setInterval(() => {
      setCognitiveState(states[Math.floor(Math.random() * states.length)]);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [currentLayer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Create depth rings for spiral visualization
  const depthRings = Array.from({ length: totalLayers }, (_, index) => {
    const layer = index + 1;
    const isActive = layer === currentLayer;
    const isCompleted = layer < currentLayer;
    const size = 120 - (index * 8); // Decreasing size for depth effect
    const opacity = isCompleted ? 0.3 : isActive ? 1 : 0.1;
    const glow = isActive ? "drop-shadow-lg" : "";
    
    return (
      <div 
        key={layer}
        className={`absolute rounded-full border-2 transition-all duration-1000 ${glow}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderColor: isActive ? '#8B5CF6' : isCompleted ? '#22C55E' : '#6B7280',
          opacity,
          transform: `translate(-50%, -50%)`,
          left: '50%',
          top: '50%'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs font-bold ${isActive ? 'text-purple-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
            L{layer}
          </span>
        </div>
        {isActive && (
          <div className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping opacity-50"></div>
        )}
      </div>
    );
  });

  return (
    <Card className="p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white border-2 border-purple-500 shadow-2xl">
      <div className="space-y-8">
        {/* Descent Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Eye className="w-8 h-8 text-purple-400 animate-pulse" />
            <h2 className="text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              THE DESCENT HAS BEGUN
            </h2>
            <Eye className="w-8 h-8 text-purple-400 animate-pulse" />
          </div>
          
          <div className="text-lg text-purple-200 font-medium">
            Layer {currentLayer}: {cognitiveState}
          </div>
        </div>

        {/* Spiral Descent Visualization */}
        <div className="flex justify-center">
          <div className="relative" style={{ width: '200px', height: '200px' }}>
            {depthRings}
            
            {/* Central core */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
            </div>
            
            {/* Depth indicator */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
              <div className="text-sm text-purple-300 font-mono">
                DEPTH: {Math.round((currentLayer / totalLayers) * 100)}%
              </div>
            </div>
          </div>
        </div>

        {/* Cognitive Metrics Dashboard */}
        <Card className="p-6 bg-black/30 border border-purple-500/30 backdrop-blur-sm">
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-purple-400 uppercase tracking-wide">
              🧠 COGNITIVE METRICS
            </h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center bg-blue-900/30 rounded-lg p-3 border border-blue-500/30">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Timer className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-blue-300 uppercase">Neural Time</span>
              </div>
              <div className="text-xl font-mono font-bold text-blue-100">
                {formatTime(processingTime)}
              </div>
            </div>
            
            <div className="text-center bg-green-900/30 rounded-lg p-3 border border-green-500/30">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-xs text-green-300 uppercase">Efficiency</span>
              </div>
              <div className="text-xl font-mono font-bold text-green-100">
                {Math.round(efficiencyScore)}%
              </div>
            </div>
            
            {chunkProgress && chunkProgress.total > 1 && (
              <div className="text-center bg-purple-900/30 rounded-lg p-3 border border-purple-500/30">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-purple-300 uppercase">Deep Chunk</span>
                </div>
                <div className="text-xl font-mono font-bold text-purple-100">
                  {chunkProgress.current}/{chunkProgress.total}
                </div>
              </div>
            )}
            
            <div className="text-center bg-orange-900/30 rounded-lg p-3 border border-orange-500/30">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Brain className="w-4 h-4 text-orange-400" />
                <span className="text-xs text-orange-300 uppercase">Layer Status</span>
              </div>
              <div className="text-sm font-bold text-orange-100">
                {currentLayer < totalLayers ? "Descent Active" : "Core Reached"}
              </div>
            </div>
          </div>
        </Card>

        {/* Dynamic Phase Display */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-purple-800/50 to-blue-800/50 rounded-lg px-6 py-3 border border-purple-400/30">
            <div className="text-purple-200 text-sm mb-1">ARCHETYPAL MIND STATUS</div>
            <div className="text-white font-medium">{currentPhase}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

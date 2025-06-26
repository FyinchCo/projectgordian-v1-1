import { Card } from "@/components/ui/card";
import { Lightbulb, Brain, Zap, TrendingUp, Target } from "lucide-react";

interface MainInsightDisplayProps {
  insight: string;
  confidence: number;
  tensionPoints: number;
  noveltyScore?: number;
  emergenceDetected?: boolean;
  enhancedMode?: boolean;
  circuitType?: string;
  processingDepth?: number;
  logicTrailLength?: number;
  compressionFormats?: {
    ultraConcise: string;
    medium: string;
    comprehensive: string;
  };
}

export const MainInsightDisplay = ({
  insight,
  confidence,
  tensionPoints,
  noveltyScore = 5,
  emergenceDetected = false,
  enhancedMode = false,
  circuitType = 'sequential',
  processingDepth = 1,
  logicTrailLength = 0,
  compressionFormats
}: MainInsightDisplayProps) => {
  // Calculate actual processing depth from the insight content
  const actualDepth = processingDepth || 1;
  
  return (
    <div className="space-y-8">
      {/* Primary Insight Card */}
      <Card className="p-12 bg-white border-2 border-black shadow-zen-lg">
        <div className="text-center space-y-8">
          {/* Breakthrough Icon & Status */}
          <div className="space-y-4">
            {emergenceDetected ? (
              <div className="flex items-center justify-center space-x-3">
                <Zap className="w-8 h-8 text-purple-600 animate-pulse" />
                <div className="text-sm uppercase tracking-wider font-mono text-purple-600 font-bold">
                  Breakthrough Synthesis Achieved
                </div>
                <Zap className="w-8 h-8 text-purple-600 animate-pulse" />
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-3">
                <Brain className="w-8 h-8 text-black" />
                <div className="text-sm uppercase tracking-wider font-mono text-gray-600">
                  Deep Analysis Complete
                </div>
              </div>
            )}
          </div>

          {/* Main Insight */}
          <div className="space-y-6">
            <blockquote className="font-cormorant text-3xl italic text-black leading-relaxed max-w-5xl mx-auto">
              "{insight}"
            </blockquote>
          </div>

          {/* Metrics Dashboard */}
          <div className="pt-8 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-mono font-bold text-black">
                  {Math.round(confidence * 100)}%
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                  Synthesis Confidence
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-mono font-bold text-black">
                  {tensionPoints}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                  Cognitive Tension
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-mono font-bold text-black">
                  {actualDepth}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                  Actual Layers
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-mono font-bold text-black">
                  {noveltyScore}/10
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                  Novelty Index
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-mono font-bold text-black">
                  {logicTrailLength}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                  Archetype Views
                </div>
              </div>
            </div>
          </div>

          {/* Processing Method */}
          <div className="pt-6">
            <div className="inline-block bg-gray-50 rounded-lg px-6 py-3 border border-gray-200">
              <div className="text-sm text-gray-600 font-inter">
                Processed via <span className="font-mono font-semibold text-black">{circuitType}</span> circuit
                {enhancedMode && <span className="text-purple-600 ml-2">• Enhanced Mode</span>}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Insight Compression Formats */}
      {compressionFormats && (
        <Card className="p-8 bg-gray-50 border border-gray-300">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="font-cormorant text-2xl font-normal text-black">
                Compressed Insights
              </h3>
              <div className="text-sm text-gray-600 font-inter mt-1">
                Multiple levels of synthesis for different contexts
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Ultra Concise */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-black" />
                  <h4 className="font-cormorant text-lg font-normal text-black">Ultra Concise</h4>
                </div>
                <div className="text-sm text-gray-800 font-inter leading-relaxed p-4 bg-white rounded border border-gray-200">
                  {compressionFormats.ultraConcise}
                </div>
              </div>

              {/* Medium */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-black" />
                  <h4 className="font-cormorant text-lg font-normal text-black">Balanced</h4>
                </div>
                <div className="text-sm text-gray-800 font-inter leading-relaxed p-4 bg-white rounded border border-gray-200">
                  {compressionFormats.medium}
                </div>
              </div>

              {/* Comprehensive */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Brain className="w-4 h-4 text-black" />
                  <h4 className="font-cormorant text-lg font-normal text-black">Comprehensive</h4>
                </div>
                <div className="text-sm text-gray-800 font-inter leading-relaxed p-4 bg-white rounded border border-gray-200">
                  {compressionFormats.comprehensive}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

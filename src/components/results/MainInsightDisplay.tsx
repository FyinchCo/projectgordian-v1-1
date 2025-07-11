
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Brain, Zap, TrendingUp, Target, Star } from "lucide-react";
import { InsightFormatToggle, InsightFormat } from "./InsightFormatToggle";

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
    insightRating?: {
      score: number;
      category: string;
      justification: string;
    };
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
  const [currentFormat, setCurrentFormat] = useState<InsightFormat>('medium');
  
  // Calculate actual processing depth from the insight content
  const actualDepth = processingDepth || 1;

  // Get the current format text - prioritize compression formats if available
  const getCurrentFormatText = () => {
    if (!compressionFormats) return insight;
    
    switch (currentFormat) {
      case 'ultra':
        return compressionFormats.ultraConcise || insight.substring(0, 100);
      case 'medium':
        return compressionFormats.medium || insight.substring(0, 300);
      case 'comprehensive':
        return compressionFormats.comprehensive || insight;
      default:
        return compressionFormats.medium || insight;
    }
  };

  // Get the current format label
  const getCurrentFormatLabel = () => {
    switch (currentFormat) {
      case 'ultra':
        return 'Ultra Concise Answer';
      case 'medium':
        return 'Balanced Answer';
      case 'comprehensive':
        return 'Complete Answer';
      default:
        return 'Balanced Answer';
    }
  };

  // Get insight rating details
  const getInsightRating = () => {
    return compressionFormats?.insightRating || null;
  };

  const getRatingColor = (score: number) => {
    if (score >= 5) return 'text-purple-600';
    if (score >= 4) return 'text-blue-600';
    if (score >= 3) return 'text-green-600';
    return 'text-yellow-600';
  };
  
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
                  Breakthrough Answer Generated
                </div>
                <Zap className="w-8 h-8 text-purple-600 animate-pulse" />
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-3">
                <Brain className="w-8 h-8 text-black" />
                <div className="text-sm uppercase tracking-wider font-mono text-gray-600">
                  Enhanced Answer Complete
                </div>
              </div>
            )}
          </div>

          {/* Format Toggle - show if compression formats are available */}
          {compressionFormats && (
            <>
              <InsightFormatToggle 
                currentFormat={currentFormat}
                onFormatChange={setCurrentFormat}
              />
              
              {/* Format Label */}
              <div className="text-sm text-gray-500 font-inter">
                {getCurrentFormatLabel()}
              </div>
            </>
          )}

          {/* Main Answer */}
          <div className="space-y-6">
            <blockquote className="font-cormorant text-3xl italic text-black leading-relaxed max-w-5xl mx-auto">
              "{getCurrentFormatText()}"
            </blockquote>
          </div>

          {/* Insight Strength Rating */}
          {getInsightRating() && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-4 bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm font-mono text-gray-600">ANSWER QUALITY:</span>
                </div>
                <Badge 
                  variant="secondary" 
                  className={`text-lg font-bold ${getRatingColor(getInsightRating()!.score)}`}
                >
                  {getInsightRating()!.score}/6 - {getInsightRating()!.category}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-2 italic">
                {getInsightRating()!.justification}
              </p>
            </div>
          )}

          {/* Metrics Dashboard */}
          <div className="pt-8 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-mono font-bold text-black">
                  {Math.round(confidence * 100)}%
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                  Answer Confidence
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
                  Analysis Depth
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
                  Perspectives
                </div>
              </div>
            </div>
          </div>

          {/* Processing Method */}
          <div className="pt-6">
            <div className="inline-block bg-gray-50 rounded-lg px-6 py-3 border border-gray-200">
              <div className="text-sm text-gray-600 font-inter">
                Processed via <span className="font-mono font-semibold text-black">{circuitType}</span> circuit
                {enhancedMode && <span className="text-purple-600 ml-2">• Enhanced Answer Generation</span>}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

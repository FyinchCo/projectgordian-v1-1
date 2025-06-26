
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Lightbulb, Brain, Sparkles } from "lucide-react";
import { InsightFormatToggle, InsightFormat } from "./InsightFormatToggle";
import { PixelRobot } from "../PixelRobot";

interface MainInsightDisplayProps {
  insight: string;
  confidence: number;
  tensionPoints: number;
  noveltyScore?: number;
  emergenceDetected?: boolean;
  enhancedMode?: boolean;
  circuitType?: string;
  processingDepth?: number;
  logicTrailLength: number;
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
  noveltyScore,
  emergenceDetected,
  enhancedMode,
  circuitType,
  processingDepth,
  logicTrailLength,
  compressionFormats,
}: MainInsightDisplayProps) => {
  const [currentFormat, setCurrentFormat] = useState<InsightFormat>('medium');

  const getNoveltyColor = (score: number) => {
    if (score >= 8) return "bg-red-500";
    if (score >= 6) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getNoveltyLabel = (score: number) => {
    if (score >= 8) return "Paradigm Shift";
    if (score >= 6) return "Challenging";
    return "Conventional";
  };

  // Clean the insight text - remove any JSON artifacts
  const cleanInsight = (text: string): string => {
    // Remove any JSON prefixes or suffixes
    let cleaned = text.replace(/^(json\s*|```json\s*)/i, '');
    cleaned = cleaned.replace(/```\s*$/, '');
    
    // If it starts with a JSON object, extract just the insight value
    if (cleaned.startsWith('{')) {
      try {
        const parsed = JSON.parse(cleaned);
        return parsed.insight || text;
      } catch {
        // If parsing fails, try to extract insight from malformed JSON
        const insightMatch = cleaned.match(/"insight":\s*"([^"]+)"/);
        if (insightMatch) {
          return insightMatch[1];
        }
      }
    }
    
    return cleaned;
  };

  const getCurrentInsight = () => {
    if (!compressionFormats) {
      return cleanInsight(insight);
    }

    let selectedInsight = '';
    switch (currentFormat) {
      case 'ultra':
        selectedInsight = compressionFormats.ultraConcise || '';
        break;
      case 'medium':
        selectedInsight = compressionFormats.medium || '';
        break;
      case 'comprehensive':
        selectedInsight = compressionFormats.comprehensive || '';
        break;
      default:
        selectedInsight = '';
    }

    // Fallback to main insight if selected format is empty
    if (!selectedInsight || selectedInsight.trim() === '') {
      return cleanInsight(insight);
    }

    return selectedInsight;
  };

  const getInsightStyle = () => {
    switch (currentFormat) {
      case 'ultra':
        return "text-4xl font-black tracking-tight text-center";
      case 'medium':
        return "text-2xl font-bold leading-tight";
      case 'comprehensive':
        return "text-xl font-semibold leading-relaxed";
      default:
        return "text-2xl font-bold leading-tight";
    }
  };

  const displayInsight = getCurrentInsight();

  return (
    <Card className="p-8 border-3 border-gray-300 bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 shadow-2xl">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center space-x-4 mb-6">
          <PixelRobot size={64} mood="celebrating" animate={true} />
          <div className="flex flex-col items-center">
            <Lightbulb className="w-16 h-16 text-yellow-500 mb-2" />
            {emergenceDetected && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-2 border-purple-300 font-bold">
                <Brain className="w-4 h-4 mr-1" />
                🎉 BREAKTHROUGH DETECTED!
              </Badge>
            )}
          </div>
          <PixelRobot size={64} mood="excited" animate={true} />
        </div>
        
        <div>
          <h2 className="text-lg font-bold uppercase tracking-wide text-gray-600 mb-4">
            🌟 Your Breakthrough Insight 🌟
            {enhancedMode && (
              <Badge variant="outline" className="ml-2 border-2 border-purple-300 text-purple-700">
                <Sparkles className="w-3 h-3 mr-1" />
                Enhanced Mode
              </Badge>
            )}
          </h2>

          {/* Format Toggle - Only show if compression formats are available */}
          {compressionFormats && (
            <InsightFormatToggle
              currentFormat={currentFormat}
              onFormatChange={setCurrentFormat}
            />
          )}

          <div className={`transition-all duration-300 ${currentFormat === 'ultra' ? 'py-8' : 'py-4'}`}>
            <p className={getInsightStyle()}>
              {currentFormat === 'ultra' ? displayInsight : `"${displayInsight}"`}
            </p>
          </div>
        </div>

        {/* Enhanced Metrics with Pixel Robot Charm */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t-2 border-gray-200">
          <div className="text-center bg-white rounded-lg p-3 border-2 border-green-200">
            <div className="text-2xl font-bold text-green-600">{Math.round(confidence * 100)}%</div>
            <div className="text-xs text-gray-500 uppercase font-medium">Confidence</div>
          </div>
          <div className="text-center bg-white rounded-lg p-3 border-2 border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{tensionPoints}</div>
            <div className="text-xs text-gray-500 uppercase font-medium">Tensions</div>
          </div>
          {noveltyScore !== undefined && (
            <div className="text-center bg-white rounded-lg p-3 border-2 border-purple-200">
              <div className="flex items-center justify-center space-x-2">
                <div className="text-2xl font-bold text-purple-600">{noveltyScore}/10</div>
                <div className={`w-3 h-3 rounded-full ${getNoveltyColor(noveltyScore)}`}></div>
              </div>
              <div className="text-xs text-gray-500 uppercase font-medium">{getNoveltyLabel(noveltyScore)}</div>
            </div>
          )}
          <div className="text-center bg-white rounded-lg p-3 border-2 border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">{logicTrailLength}</div>
            <div className="text-xs text-gray-500 uppercase font-medium">AI Friends</div>
          </div>
        </div>

        {circuitType && (
          <div className="text-center pt-4">
            <div className="bg-gray-100 rounded-lg p-3 inline-block">
              <span className="text-sm text-gray-600 font-medium">
                Processed with {circuitType} teamwork
                {processingDepth && ` across ${processingDepth} thinking layers`} 🤝
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

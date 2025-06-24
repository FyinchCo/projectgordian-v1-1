
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Lightbulb, Brain } from "lucide-react";
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

    switch (currentFormat) {
      case 'ultra':
        return compressionFormats.ultraConcise;
      case 'medium':
        return compressionFormats.medium;
      case 'comprehensive':
        return compressionFormats.comprehensive;
      default:
        return cleanInsight(insight);
    }
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
    <Card className="p-8 border-2 border-black">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center space-x-2">
          <Lightbulb className="w-12 h-12 text-black" />
          {emergenceDetected && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              <Brain className="w-3 h-3 mr-1" />
              EMERGENCE DETECTED
            </Badge>
          )}
        </div>
        
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-2">
            BREAKTHROUGH INSIGHT
            {enhancedMode && (
              <Badge variant="outline" className="ml-2">Enhanced Mode</Badge>
            )}
          </h2>

          {/* Format Toggle */}
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

        {/* Enhanced Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold">{Math.round(confidence * 100)}%</div>
            <div className="text-xs text-gray-500 uppercase">Confidence</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{tensionPoints}</div>
            <div className="text-xs text-gray-500 uppercase">Tension Points</div>
          </div>
          {noveltyScore !== undefined && (
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="text-2xl font-bold">{noveltyScore}/10</div>
                <div className={`w-3 h-3 rounded-full ${getNoveltyColor(noveltyScore)}`}></div>
              </div>
              <div className="text-xs text-gray-500 uppercase">{getNoveltyLabel(noveltyScore)}</div>
            </div>
          )}
          <div className="text-center">
            <div className="text-2xl font-bold">{logicTrailLength}</div>
            <div className="text-xs text-gray-500 uppercase">Perspectives</div>
          </div>
        </div>

        {circuitType && (
          <div className="text-center pt-2">
            <span className="text-sm text-gray-500 uppercase tracking-wide">
              Processed via {circuitType} circuit
              {processingDepth && ` • ${processingDepth} layers`}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

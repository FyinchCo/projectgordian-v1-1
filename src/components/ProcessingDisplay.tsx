
import { Card } from "@/components/ui/card";
import { LayerGridMap } from "./processing/LayerGridMap";
import { MetricsCards } from "./processing/MetricsCards";
import { ArchetypeContributionBars } from "./processing/ArchetypeContributionBars";
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
  // Calculate efficiency (simulated)
  const efficiency = Math.round(75 + Math.random() * 10);

  return (
    <div className="min-h-screen bg-white">
      <div className="space-y-8 max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="font-cormorant text-4xl font-normal text-black tracking-tight">
              Cognitive Descent
            </h1>
            <div className="text-sm text-gray-500 uppercase tracking-wider font-mono">
              {circuitType} Processing • Archetypal Reasoning
            </div>
          </div>
        </div>

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

        {/* Row 3: Metrics Cards */}
        <MetricsCards 
          currentLayer={currentLayer}
          totalLayers={totalLayers}
          currentArchetype={currentArchetype}
          efficiency={efficiency}
          chunkProgress={chunkProgress}
        />

        {/* Row 4: Archetype Contribution Bars */}
        <ArchetypeContributionBars 
          currentArchetype={currentArchetype}
          currentLayer={currentLayer}
        />
      </div>
    </div>
  );
};

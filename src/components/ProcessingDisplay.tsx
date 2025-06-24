
import { Card } from "@/components/ui/card";
import { ProcessingVisualization } from "./processing/ProcessingVisualization";

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
  totalLayers = 1,
  circuitType = 'sequential',
  chunkProgress
}: ProcessingDisplayProps) => {
  return (
    <div className="space-y-8">
      {/* Question Context */}
      <Card className="p-6 bg-gray-50">
        <h3 className="font-bold text-sm uppercase tracking-wide text-gray-500 mb-2">
          PROCESSING QUESTION
        </h3>
        <p className="text-lg">{question}</p>
      </Card>

      {/* Enhanced Processing Visualization */}
      <ProcessingVisualization 
        currentArchetype={currentArchetype}
        currentLayer={currentLayer}
        totalLayers={totalLayers}
        circuitType={circuitType}
        chunkProgress={chunkProgress}
      />

      {/* Processing Status */}
      <div className="text-center">
        <div className="inline-flex space-x-2">
          <div className="w-3 h-3 bg-black rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">Processing deep insights...</p>
      </div>
    </div>
  );
};

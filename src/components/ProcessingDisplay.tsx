
import { Card } from "@/components/ui/card";
import { ProcessingVisualization } from "./processing/ProcessingVisualization";
import { MessageSquare, Sparkles } from "lucide-react";

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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Enhanced Question Context */}
      <Card className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
        <div className="flex items-start space-x-3">
          <MessageSquare className="w-6 h-6 text-gray-600 mt-1 flex-shrink-0" />
          <div className="space-y-2">
            <h3 className="font-bold text-sm uppercase tracking-wide text-gray-600 flex items-center space-x-2">
              <span>PROCESSING QUESTION</span>
              <Sparkles className="w-4 h-4" />
            </h3>
            <p className="text-lg text-gray-800 leading-relaxed">{question}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-3">
              <span>Deep Analysis Mode</span>
              <span>•</span>
              <span>{totalLayers} Layer{totalLayers > 1 ? 's' : ''} Planned</span>
              <span>•</span>
              <span className="capitalize">{circuitType} Processing</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Enhanced Processing Visualization */}
      <ProcessingVisualization 
        currentArchetype={currentArchetype}
        currentLayer={currentLayer}
        totalLayers={totalLayers}
        circuitType={circuitType}
        chunkProgress={chunkProgress}
      />

      {/* Enhanced Processing Status */}
      <Card className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <div className="text-center space-y-3">
          <div className="flex justify-center items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-indigo-700">Processing Deep Insights</p>
            <p className="text-xs text-indigo-600">Each archetype contributes unique wisdom to your question</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

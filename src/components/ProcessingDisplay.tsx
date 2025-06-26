
import { Card } from "@/components/ui/card";
import { ProcessingVisualization } from "./processing/ProcessingVisualization";
import { MessageSquare, Sparkles, Eye } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <div className="space-y-8 max-w-7xl mx-auto p-8">
        {/* Question Context with Dark Theme */}
        <Card className="p-8 bg-gray-900/80 border-2 border-purple-500/50 shadow-2xl backdrop-blur-sm">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-900/50 rounded-xl flex items-center justify-center border border-purple-400/30">
                <MessageSquare className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div className="space-y-4 flex-1">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-xl uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 flex items-center space-x-2">
                  <span>QUESTION SUBMITTED FOR DEEP ANALYSIS</span>
                  <Sparkles className="w-5 h-5 animate-pulse text-purple-400" />
                </h2>
                <div className="flex items-center space-x-2 text-sm text-purple-300 bg-purple-900/30 px-3 py-1 rounded-full border border-purple-400/30">
                  <Eye className="w-4 h-4" />
                  <span>Descent Active</span>
                </div>
              </div>
              
              <blockquote className="text-xl font-medium text-gray-200 leading-relaxed border-l-4 border-purple-400 pl-4 italic bg-black/20 p-4 rounded-r-lg">
                "{question}"
              </blockquote>
            </div>
          </div>
        </Card>

        {/* Main Processing Visualization */}
        <ProcessingVisualization 
          currentArchetype={currentArchetype}
          currentLayer={currentLayer}
          totalLayers={totalLayers}
          circuitType={circuitType}
          chunkProgress={chunkProgress}
        />
      </div>
    </div>
  );
};

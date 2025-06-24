
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProcessingVisualization } from "./processing/ProcessingVisualization";
import { MessageSquare, Sparkles, Clock, Zap } from "lucide-react";

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
  const overallProgress = Math.min(((currentLayer - 1) / totalLayers) * 100 + 
    (currentArchetype !== "Compression Agent" ? 15 : 20), 100);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Enhanced Question Context with Better Visual Hierarchy */}
      <Card className="p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-200 shadow-lg">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg uppercase tracking-wide text-indigo-800 flex items-center space-x-2">
                <span>DEEP ANALYSIS IN PROGRESS</span>
                <Sparkles className="w-5 h-5 animate-pulse" />
              </h2>
              <div className="flex items-center space-x-2 text-sm text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4" />
                <span>Live Processing</span>
              </div>
            </div>
            
            <blockquote className="text-xl font-medium text-gray-800 leading-relaxed border-l-4 border-indigo-300 pl-4 italic">
              "{question}"
            </blockquote>
            
            {/* Enhanced Overall Progress */}
            <div className="bg-white bg-opacity-60 rounded-lg p-4 border border-indigo-200">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-indigo-700">Overall Progress</span>
                <span className="text-lg font-bold text-indigo-800">{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-3 bg-indigo-100" />
              <div className="flex justify-between text-xs text-indigo-600 mt-2">
                <span>Layer {currentLayer} of {totalLayers}</span>
                <span className="capitalize">{circuitType} Processing</span>
              </div>
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

      {/* Enhanced Real-time Status with Dynamic Activity */}
      <Card className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 shadow-lg">
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center space-x-3">
            <Zap className="w-6 h-6 text-emerald-600 animate-pulse" />
            <h3 className="text-xl font-bold text-emerald-800">
              {currentArchetype === "Compression Agent" ? "Synthesizing Breakthrough" : "Cognitive Processing Active"}
            </h3>
            <Zap className="w-6 h-6 text-emerald-600 animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <p className="text-lg font-medium text-emerald-700">
              {currentArchetype === "Compression Agent" 
                ? "Weaving all perspectives into unified insight"
                : `${currentArchetype || "System"} contributing unique analytical perspective`
              }
            </p>
            <p className="text-sm text-emerald-600 max-w-2xl mx-auto">
              Each archetype brings specialized cognitive patterns to ensure comprehensive analysis
            </p>
          </div>
          
          {/* Dynamic Activity Indicators */}
          <div className="flex justify-center space-x-2 mt-4">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }} 
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};


import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Settings, RefreshCw } from "lucide-react";

interface AnalysisType {
  type: string;
  description: string;
}

interface AnalysisConfigurationProps {
  question: string;
  setQuestion: (question: string) => void;
  totalLayers: number;
  setTotalLayers: (layers: number) => void;
  loading: boolean;
  onSubmitJob: () => void;
  jobResults: any;
  onClearResults: () => void;
}

export const AnalysisConfiguration = ({
  question,
  setQuestion,
  totalLayers,
  setTotalLayers,
  loading,
  onSubmitJob,
  jobResults,
  onClearResults
}: AnalysisConfigurationProps) => {
  const getEstimatedTime = (layers: number) => {
    const estimatedSeconds = layers * 25;
    return Math.ceil(estimatedSeconds / 60);
  };

  const getAnalysisType = (layers: number): AnalysisType => {
    if (layers <= 3) return { type: "Quick Insight", description: "Rapid analysis" };
    if (layers <= 5) return { type: "Standard Analysis", description: "Balanced depth" };
    if (layers <= 10) return { type: "Deep Exploration", description: "Comprehensive understanding" };
    if (layers <= 20) return { type: "Genius-Level Analysis", description: "Breakthrough potential" };
    return { type: "Transcendent Analysis", description: "Ultimate understanding" };
  };

  const analysisType = getAnalysisType(totalLayers);

  // Results Display
  if (jobResults) {
    return (
      <Card className="p-8 bg-white shadow-lg">
        <div className="space-y-6">
          <div className="text-center border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800">Analysis Results</h2>
            <p className="text-gray-600">Your completed genius analysis</p>
          </div>
          
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-4">Synthesis</h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 leading-relaxed">
                {jobResults.synthesis || "Analysis completed successfully. Full results processing..."}
              </p>
            </div>
          </div>

          <div className="flex justify-center space-x-4 pt-6">
            <Button onClick={onClearResults} variant="outline" className="px-6">
              <RefreshCw className="w-4 h-4 mr-2" />
              Start New Analysis
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Configuration Interface
  return (
    <Card className="p-8 bg-white shadow-lg">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">What would you like to explore?</h2>
          <p className="text-gray-600">Enter a question for unlimited-depth genius analysis</p>
        </div>
        
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What is the nature of creativity? How do we navigate moral complexity? What makes a life meaningful?"
          className="min-h-32 text-lg resize-none border-2 focus:border-blue-500"
        />
        
        {/* Enhanced Configuration Bar */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">Depth:</span>
              <select 
                value={totalLayers} 
                onChange={(e) => setTotalLayers(Number(e.target.value))}
                className="text-sm border rounded px-2 py-1"
              >
                <option value={3}>3 Layers (Quick)</option>
                <option value={5}>5 Layers (Standard)</option>
                <option value={10}>10 Layers (Deep)</option>
                <option value={15}>15 Layers (Profound)</option>
                <option value={20}>20 Layers (Genius)</option>
                <option value={30}>30 Layers (Transcendent)</option>
              </select>
            </div>
            
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              ~{getEstimatedTime(totalLayers)} min
            </Badge>
          </div>
          
          <Badge 
            variant="secondary" 
            className={`text-xs ${totalLayers >= 20 ? 'bg-purple-100 text-purple-800' : totalLayers >= 10 ? 'bg-blue-100 text-blue-800' : ''}`}
          >
            {analysisType.type}
          </Badge>
        </div>

        {/* Analysis Type Description */}
        <div className="text-center text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <strong>{analysisType.type}:</strong> {analysisType.description}
          {totalLayers >= 20 && (
            <div className="mt-1 text-purple-600 font-medium">
              🚀 Breakthrough potential: High probability of transcendent insights
            </div>
          )}
        </div>

        <Button 
          onClick={onSubmitJob}
          disabled={!question.trim() || loading}
          className={`w-full h-12 text-lg font-semibold ${
            totalLayers >= 20 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <Play className="w-5 h-5 mr-2" />
          {loading ? 'Starting Analysis...' : `Begin ${analysisType.type}`}
        </Button>
        
        <div className="text-center text-sm text-gray-500">
          <p>✨ Chunked processing ensures reliability even for deepest analyses!</p>
          <p className="mt-1">🧠 Analysis continues in background - safe to close page</p>
        </div>
      </div>
    </Card>
  );
};

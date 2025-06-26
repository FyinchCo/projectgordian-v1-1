
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Zap, 
  Play, 
  Eye, 
  Clock, 
  Settings,
  Pause,
  RefreshCw
} from "lucide-react";
import { ProcessingLogic } from "@/components/ProcessingLogic";
import { useToast } from "@/hooks/use-toast";

const Engine = () => {
  const [question, setQuestion] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentLayer, setCurrentLayer] = useState(1);
  const [totalLayers, setTotalLayers] = useState(5);
  const [currentArchetype, setCurrentArchetype] = useState("");
  const [chunkProgress, setChunkProgress] = useState({ current: 0, total: 0 });
  const [processingPhase, setProcessingPhase] = useState("");
  const [results, setResults] = useState(null);
  const [processingTime, setProcessingTime] = useState(0);
  
  const { toast } = useToast();

  // Timer for processing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isProcessing) {
      interval = setInterval(() => {
        setProcessingTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isProcessing]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEstimatedTime = (layers: number) => {
    const estimatedSeconds = layers * 35; // 35 seconds per layer
    return Math.ceil(estimatedSeconds / 60);
  };

  const handleProcessingStart = () => {
    setIsProcessing(true);
    setResults(null);
    setProcessingTime(0);
    setCurrentLayer(1);
  };

  const handleProcessingComplete = (data: any) => {
    setIsProcessing(false);
    setResults(data);
    setCurrentArchetype("");
    setProcessingPhase("Analysis complete");
  };

  const handleProcessingError = () => {
    setIsProcessing(false);
    setCurrentArchetype("");
    setProcessingPhase("Processing stopped");
  };

  const handleReset = () => {
    setResults(null);
    setQuestion("");
    setProcessingTime(0);
    setCurrentLayer(1);
    setCurrentArchetype("");
    setProcessingPhase("");
    setChunkProgress({ current: 0, total: 0 });
  };

  const archetypes = [
    { name: "The Visionary", color: "purple", description: "Sees possibilities beyond the obvious" },
    { name: "The Skeptic", color: "red", description: "Questions assumptions relentlessly" },
    { name: "The Mystic", color: "blue", description: "Explores deeper spiritual dimensions" },
    { name: "The Realist", color: "green", description: "Grounds ideas in practical truth" },
    { name: "The Contrarian", color: "orange", description: "Challenges conventional wisdom" }
  ];

  const getArchetypeCard = (archetype: any, isActive: boolean, isCompleted: boolean) => {
    const progress = isCompleted ? 100 : isActive ? 75 : 0;
    
    return (
      <Card 
        key={archetype.name}
        className={`p-4 transition-all duration-500 ${
          isActive ? 'border-2 border-black shadow-lg scale-105' : 
          isCompleted ? 'border-green-500 bg-green-50' : 
          'border-gray-200 opacity-60'
        }`}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">{archetype.name}</h4>
            {isActive && <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />}
            {isCompleted && <Eye className="w-4 h-4 text-green-600" />}
          </div>
          
          <p className="text-xs text-gray-600">{archetype.description}</p>
          
          <div className="space-y-1">
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-gray-500">
              {isActive ? "Thinking..." : isCompleted ? "Complete" : "Waiting"}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Brain className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Genius Engine</h1>
            <Brain className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Deep cognitive analysis through multi-archetype processing. Ask complex questions and receive genuinely thoughtful insights.
          </p>
        </div>

        {!isProcessing && !results && (
          <>
            {/* Question Portal */}
            <Card className="p-8 bg-white shadow-lg">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">What would you like to explore?</h2>
                  <p className="text-gray-600">Enter a question that deserves deep thought</p>
                </div>
                
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What is the nature of creativity? How do we navigate moral complexity? What makes a life meaningful?"
                  className="min-h-32 text-lg resize-none border-2 focus:border-blue-500"
                />
                
                {/* Configuration Bar */}
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
                        <option value={20}>20 Layers (Profound)</option>
                      </select>
                    </div>
                    
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      ~{getEstimatedTime(totalLayers)} min
                    </Badge>
                  </div>
                  
                  <Badge variant="secondary" className="text-xs">
                    Sequential Analysis
                  </Badge>
                </div>

                <ProcessingLogic
                  question={question}
                  processingDepth={[totalLayers]}
                  circuitType="sequential"
                  enhancedMode={true}
                  customArchetypes={null}
                  currentAssessment={null}
                  onProcessingStart={handleProcessingStart}
                  onProcessingComplete={handleProcessingComplete}
                  onProcessingError={handleProcessingError}
                  onCurrentArchetypeChange={setCurrentArchetype}
                  onCurrentLayerChange={setCurrentLayer}
                  onChunkProgressChange={setChunkProgress}
                  onProcessingPhaseChange={setProcessingPhase}
                />
              </div>
            </Card>
          </>
        )}

        {/* Processing Display */}
        {isProcessing && (
          <div className="space-y-8">
            {/* Status Header */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <Brain className="w-6 h-6 text-blue-600 animate-pulse" />
                  <h2 className="text-2xl font-bold text-gray-800">Engine Processing</h2>
                  <div className="font-mono text-lg font-bold text-blue-700">
                    {formatTime(processingTime)}
                  </div>
                </div>
                
                <div className="flex items-center justify-center space-x-6">
                  <Badge className="text-sm">
                    Layer {currentLayer} of {totalLayers}
                  </Badge>
                  <div className="text-sm text-gray-600">
                    {processingPhase || "Processing..."}
                  </div>
                </div>

                <Progress 
                  value={Math.min(95, (currentLayer / totalLayers) * 100)} 
                  className="h-3 max-w-md mx-auto" 
                />
              </div>
            </Card>

            {/* Question Being Analyzed */}
            <Card className="p-6 bg-white">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Analyzing Question</h3>
                <blockquote className="text-xl italic text-gray-700 max-w-4xl mx-auto">
                  "{question}"
                </blockquote>
              </div>
            </Card>

            {/* Archetype Cards */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-center text-gray-800">Cognitive Perspectives</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {archetypes.map((archetype) => {
                  const isActive = currentArchetype === archetype.name;
                  const isCompleted = currentLayer > archetypes.findIndex(a => a.name === archetype.name) + 1;
                  return getArchetypeCard(archetype, isActive, isCompleted);
                })}
              </div>
            </div>

            {/* Current Thinking Display */}
            {currentArchetype && (
              <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center space-x-2">
                    <Zap className="w-5 h-5 text-purple-600 animate-pulse" />
                    <h3 className="text-xl font-bold text-purple-800">
                      {currentArchetype} is thinking...
                    </h3>
                  </div>
                  <p className="text-purple-600">
                    Deep cognitive processing in progress
                  </p>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Results Display */}
        {results && !isProcessing && (
          <div className="space-y-8">
            <Card className="p-8 bg-white shadow-lg">
              <div className="space-y-6">
                <div className="text-center border-b pb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Analysis Complete</h2>
                  <p className="text-gray-600">Processed in {formatTime(processingTime)}</p>
                </div>
                
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold mb-4">Synthesis</h3>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">
                      {results.synthesis || "Analysis completed successfully. Full results processing..."}
                    </p>
                  </div>
                </div>

                <div className="flex justify-center space-x-4 pt-6">
                  <Button onClick={handleReset} variant="outline" className="px-6">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Ask Another Question
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Engine;

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArchetypeThoughtBubble } from "./ArchetypeThoughtBubble";
import { Layers, Zap, GitBranch, RotateCcw, Activity, Timer, TrendingUp, Brain } from "lucide-react";
import { useState, useEffect } from "react";

interface ProcessingVisualizationProps {
  currentArchetype: string;
  currentLayer: number;
  totalLayers: number;
  circuitType: string;
  chunkProgress?: { current: number; total: number };
}

const archetypes = ["The Visionary", "The Skeptic", "The Mystic", "The Contrarian", "The Realist"];

const getCircuitIcon = (circuitType: string) => {
  switch (circuitType) {
    case 'parallel': return GitBranch;
    case 'recursive': return RotateCcw;
    case 'hybrid': return Zap;
    default: return Layers;
  }
};

const getProcessingInsights = (currentArchetype: string) => {
  switch (currentArchetype) {
    case "The Visionary": return {
      focus: "Future Possibilities & Innovation",
      contribution: "Exploring unconventional pathways and breakthrough potential"
    };
    case "The Skeptic": return {
      focus: "Critical Analysis & Validation",
      contribution: "Testing assumptions and identifying logical vulnerabilities"
    };
    case "The Mystic": return {
      focus: "Intuitive Patterns & Deep Wisdom",
      contribution: "Sensing hidden connections and archetypal meanings"
    };
    case "The Contrarian": return {
      focus: "Alternative Perspectives",
      contribution: "Challenging consensus and proposing radical alternatives"
    };
    case "The Realist": return {
      focus: "Practical Implementation",
      contribution: "Grounding insights in real-world constraints and feasibility"
    };
    case "Compression Agent": return {
      focus: "Synthesis & Integration",
      contribution: "Weaving all perspectives into unified breakthrough insight"
    };
    default: return {
      focus: "Cognitive Processing",
      contribution: "Analyzing question from unique perspective"
    };
  }
};

export const ProcessingVisualization = ({
  currentArchetype,
  currentLayer,
  totalLayers,
  circuitType,
  chunkProgress
}: ProcessingVisualizationProps) => {
  const [processingTime, setProcessingTime] = useState(0);
  const [currentPhase, setCurrentPhase] = useState("Initializing cognitive architecture...");
  const [efficiencyScore, setEfficiencyScore] = useState(85);
  
  const CircuitIcon = getCircuitIcon(circuitType);
  const insights = getProcessingInsights(currentArchetype);
  
  // Enhanced timer and metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setProcessingTime(prev => prev + 1);
      // Simulate efficiency fluctuation
      setEfficiencyScore(prev => Math.max(75, Math.min(95, prev + (Math.random() - 0.5) * 5)));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Enhanced phase tracking
  useEffect(() => {
    if (currentArchetype === "Compression Agent") {
      setCurrentPhase("Synthesizing multi-perspective breakthrough...");
    } else if (currentArchetype) {
      const insight = getProcessingInsights(currentArchetype);
      setCurrentPhase(`${insight.focus} - ${insight.contribution}`);
    } else {
      setCurrentPhase("Preparing cognitive architecture...");
    }
  }, [currentArchetype]);
  
  // Calculate enhanced progress
  const overallProgress = Math.min(((currentLayer - 1) / totalLayers) * 100 + 
    (currentArchetype !== "Compression Agent" ? 
      (archetypes.indexOf(currentArchetype) + 1) / (archetypes.length + 1) * (100 / totalLayers) : 
      100 / totalLayers), 100);

  const getCurrentArchetypeIndex = () => {
    if (currentArchetype === "Compression Agent") return archetypes.length;
    return archetypes.indexOf(currentArchetype);
  };

  const currentIndex = getCurrentArchetypeIndex();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Progress Header with Real-time Metrics */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 shadow-lg">
        <div className="space-y-4">
          {/* Main Progress Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <CircuitIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-bold text-2xl text-blue-800">
                    Layer {currentLayer} of {totalLayers}
                  </div>
                  <div className="text-sm text-blue-600 capitalize flex items-center space-x-2">
                    <Activity className="w-4 h-4 animate-pulse" />
                    <span>{circuitType} Circuit Processing</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Real-time Metrics */}
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Timer className="w-4 h-4" />
                  <span className="font-mono text-lg font-bold">{formatTime(processingTime)}</span>
                </div>
                <div className="text-xs text-gray-500">Processing Time</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center space-x-2 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-mono text-lg font-bold">{Math.round(efficiencyScore)}%</span>
                </div>
                <div className="text-xs text-gray-500">Efficiency</div>
              </div>
              
              {chunkProgress && chunkProgress.total > 1 && (
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-700">
                    {chunkProgress.current}/{chunkProgress.total}
                  </div>
                  <div className="text-xs text-purple-500">Deep Chunks</div>
                </div>
              )}
            </div>
          </div>
          
          {/* Enhanced Progress Bar with Phase Information */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700 max-w-md truncate">
                  {currentPhase}
                </span>
              </div>
              <span className="font-bold text-blue-700 text-lg">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-4 bg-blue-100" />
            
            {/* Phase Timeline */}
            <div className="flex justify-between text-xs text-gray-500">
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Analysis Phase</span>
              </span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Integration Phase</span>
              </span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Synthesis Phase</span>
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Enhanced Archetype Grid with Contribution Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {archetypes.map((archetype, index) => (
          <ArchetypeThoughtBubble
            key={archetype}
            archetype={archetype}
            isActive={currentArchetype === archetype}
            isCompleted={currentLayer > 1 || currentIndex > index}
          />
        ))}
        
        {/* Enhanced Synthesis Agent */}
        <ArchetypeThoughtBubble
          archetype="Synthesis Agent"
          isActive={currentArchetype === "Compression Agent"}
          isCompleted={false}
        />
      </div>

      {/* Enhanced Current Focus Cards */}
      {currentArchetype && currentArchetype !== "Compression Agent" && (
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <h3 className="text-xl font-bold text-purple-800">
                {currentArchetype} Active
              </h3>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-purple-600 max-w-2xl mx-auto">
              {insights.contribution}
            </p>
            <div className="flex justify-center space-x-1 mt-4">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }} 
                />
              ))}
            </div>
          </div>
        </Card>
      )}

      {currentArchetype === "Compression Agent" && (
        <Card className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <Zap className="w-6 h-6 text-emerald-600 animate-pulse" />
              <h3 className="text-xl font-bold text-emerald-800">
                Synthesis in Progress
              </h3>
              <Zap className="w-6 h-6 text-emerald-600 animate-pulse" />
            </div>
            <p className="text-emerald-600 max-w-2xl mx-auto">
              {insights.contribution}
            </p>
            <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto mt-4">
              {archetypes.map((_, i) => (
                <div 
                  key={i}
                  className="w-8 h-1 bg-emerald-400 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }} 
                />
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

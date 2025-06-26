
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Lightbulb, Search, Zap, Hammer, Eye, Cpu, CheckCircle, Activity, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface EnhancedArchetypeGridProps {
  currentArchetype: string;
  currentLayer: number;
}

const getArchetypeIcon = (archetype: string) => {
  switch (archetype) {
    case "The Visionary": return Lightbulb;
    case "The Skeptic": return Search;
    case "The Mystic": return Zap;
    case "The Contrarian": return Zap;
    case "The Craftsman": 
    case "The Realist": return Hammer;
    case "Synthesis Agent": return Cpu;
    default: return Brain;
  }
};

const getArchetypeQuote = (archetype: string) => {
  switch (archetype) {
    case "The Visionary": return "I see patterns others miss...";
    case "The Skeptic": return "But what if we're wrong?";
    case "The Mystic": return "There's something deeper here...";
    case "The Contrarian": return "Let me challenge that assumption...";
    case "The Realist": return "How does this work in practice?";
    case "Synthesis Agent": return "Weaving all perspectives together...";
    default: return "Processing...";
  }
};

const getArchetypeColor = (archetype: string) => {
  switch (archetype) {
    case "The Visionary": return { bg: "bg-purple-900/40", border: "border-purple-400", text: "text-purple-200", accent: "purple" };
    case "The Skeptic": return { bg: "bg-yellow-900/40", border: "border-yellow-400", text: "text-yellow-200", accent: "yellow" };
    case "The Mystic": return { bg: "bg-blue-900/40", border: "border-blue-400", text: "text-blue-200", accent: "blue" };
    case "The Contrarian": return { bg: "bg-red-900/40", border: "border-red-400", text: "text-red-200", accent: "red" };
    case "The Realist": return { bg: "bg-green-900/40", border: "border-green-400", text: "text-green-200", accent: "green" };
    case "Synthesis Agent": return { bg: "bg-indigo-900/40", border: "border-indigo-400", text: "text-indigo-200", accent: "indigo" };
    default: return { bg: "bg-gray-900/40", border: "border-gray-400", text: "text-gray-200", accent: "gray" };
  }
};

export const EnhancedArchetypeGrid = ({ currentArchetype, currentLayer }: EnhancedArchetypeGridProps) => {
  const [hoveredArchetype, setHoveredArchetype] = useState<string | null>(null);
  const archetypes = ["The Visionary", "The Skeptic", "The Mystic", "The Contrarian", "The Realist"];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
          ARCHETYPAL COUNCIL
        </h3>
        <p className="text-gray-300">Each perspective contributes to the synthesis</p>
      </div>

      {/* Archetype Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {archetypes.map((archetype, index) => {
          const Icon = getArchetypeIcon(archetype);
          const colors = getArchetypeColor(archetype);
          const isActive = currentArchetype === archetype;
          const isCompleted = currentLayer > 1 || (currentArchetype !== archetype && currentArchetype !== "");
          const quote = getArchetypeQuote(archetype);
          
          return (
            <Card
              key={archetype}
              className={`p-6 transition-all duration-500 cursor-pointer transform hover:scale-105 ${
                isActive 
                  ? `${colors.bg} ${colors.border} border-2 shadow-2xl shadow-${colors.accent}-500/50` 
                  : isCompleted 
                    ? "bg-green-900/20 border-green-400/30 border" 
                    : "bg-gray-900/20 border-gray-600/30 border hover:border-gray-400/50"
              }`}
              onMouseEnter={() => setHoveredArchetype(archetype)}
              onMouseLeave={() => setHoveredArchetype(null)}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isActive ? "bg-white/20" : isCompleted ? "bg-green-100/20" : "bg-gray-100/10"
                    }`}>
                      <Icon className={`w-6 h-6 ${isActive ? "animate-pulse text-white" : isCompleted ? "text-green-400" : "text-gray-400"}`} />
                    </div>
                    <div>
                      <h4 className={`font-bold text-lg ${isActive ? colors.text : isCompleted ? "text-green-200" : "text-gray-300"}`}>
                        {archetype.replace("The ", "")}
                      </h4>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  {isActive && (
                    <Badge className={`bg-${colors.accent}-500/20 text-${colors.accent}-200 border-${colors.accent}-400/50 animate-pulse`}>
                      <Activity className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  )}
                  {isCompleted && !isActive && (
                    <Badge className="bg-green-500/20 text-green-200 border-green-400/50">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Complete
                    </Badge>
                  )}
                </div>

                {/* Quote/Status */}
                <div className="min-h-[60px] flex items-center">
                  {isActive && (
                    <div className={`${colors.bg} rounded-lg p-4 border ${colors.border}/30`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <MessageCircle className={`w-4 h-4 text-${colors.accent}-400`} />
                        <span className="text-xs text-gray-300 uppercase tracking-wide">Current Thought</span>
                      </div>
                      <p className="text-white italic font-medium leading-relaxed">
                        "{quote}"
                      </p>
                      <div className="flex justify-center space-x-1 mt-3">
                        {[...Array(3)].map((_, i) => (
                          <div 
                            key={i}
                            className={`w-2 h-2 bg-${colors.accent}-400 rounded-full animate-bounce`}
                            style={{ animationDelay: `${i * 0.15}s` }} 
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {isCompleted && !isActive && (
                    <div className="bg-green-900/20 rounded-lg p-4 border border-green-400/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-xs text-green-300 uppercase tracking-wide">Contribution Complete</span>
                      </div>
                      <p className="text-green-200 text-sm">
                        Perspective integrated into synthesis
                      </p>
                    </div>
                  )}
                  
                  {!isActive && !isCompleted && (
                    <div className="bg-gray-900/20 rounded-lg p-4 border border-gray-600/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <Brain className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-400 uppercase tracking-wide">Awaiting Activation</span>
                      </div>
                      {hoveredArchetype === archetype && (
                        <p className="text-gray-300 text-sm italic transition-opacity duration-300">
                          "{quote}"
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
        
        {/* Synthesis Agent */}
        <Card className={`p-6 transition-all duration-500 ${
          currentArchetype === "Compression Agent" 
            ? "bg-indigo-900/40 border-indigo-400 border-2 shadow-2xl shadow-indigo-500/50" 
            : "bg-gray-900/20 border-gray-600/30 border"
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  currentArchetype === "Compression Agent" ? "bg-white/20" : "bg-gray-100/10"
                }`}>
                  <Cpu className={`w-6 h-6 ${currentArchetype === "Compression Agent" ? "animate-pulse text-white" : "text-gray-400"}`} />
                </div>
                <div>
                  <h4 className={`font-bold text-lg ${currentArchetype === "Compression Agent" ? "text-indigo-200" : "text-gray-300"}`}>
                    Synthesis
                  </h4>
                </div>
              </div>
              
              {currentArchetype === "Compression Agent" && (
                <Badge className="bg-indigo-500/20 text-indigo-200 border-indigo-400/50 animate-pulse">
                  <Zap className="w-3 h-3 mr-1" />
                  Synthesizing
                </Badge>
              )}
            </div>

            <div className="min-h-[60px] flex items-center">
              {currentArchetype === "Compression Agent" && (
                <div className="bg-indigo-900/40 rounded-lg p-4 border border-indigo-400/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs text-gray-300 uppercase tracking-wide">Neural Synthesis</span>
                  </div>
                  <p className="text-white italic font-medium leading-relaxed">
                    "Weaving all perspectives into breakthrough..."
                  </p>
                  <div className="grid grid-cols-5 gap-1 max-w-xs mx-auto mt-3">
                    {archetypes.map((_, i) => (
                      <div 
                        key={i}
                        className="w-full h-1 bg-indigo-400 rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }} 
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

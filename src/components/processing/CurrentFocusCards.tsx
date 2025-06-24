
import { Card } from "@/components/ui/card";
import { Zap } from "lucide-react";

interface CurrentFocusCardsProps {
  currentArchetype: string;
  insights: {
    focus: string;
    contribution: string;
  };
}

export const CurrentFocusCards = ({ currentArchetype, insights }: CurrentFocusCardsProps) => {
  const archetypes = ["The Visionary", "The Skeptic", "The Mystic", "The Contrarian", "The Realist"];

  if (currentArchetype && currentArchetype !== "Compression Agent") {
    return (
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
    );
  }

  if (currentArchetype === "Compression Agent") {
    return (
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
    );
  }

  return null;
};

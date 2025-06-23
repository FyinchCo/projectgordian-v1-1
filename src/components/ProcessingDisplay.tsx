
import { Card } from "@/components/ui/card";
import { Brain, Zap, Eye, Shield, Sparkles, Hammer, Compress } from "lucide-react";

interface ProcessingDisplayProps {
  currentArchetype: string;
  question: string;
}

const archetypeIcons = {
  "The Visionary": Eye,
  "The Skeptic": Shield,
  "The Mystic": Sparkles,
  "The Contrarian": Zap,
  "The Craftsman": Hammer,
  "Compression Agent": Compress
};

export const ProcessingDisplay = ({ currentArchetype, question }: ProcessingDisplayProps) => {
  const Icon = archetypeIcons[currentArchetype as keyof typeof archetypeIcons] || Brain;

  return (
    <div className="space-y-8">
      {/* Question Display */}
      <Card className="p-6 bg-gray-50">
        <h3 className="font-bold text-sm uppercase tracking-wide text-gray-500 mb-2">PROCESSING QUESTION</h3>
        <p className="text-lg">{question}</p>
      </Card>

      {/* Current Archetype */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-black rounded-full animate-pulse">
          <Icon className="w-12 h-12 text-white" />
        </div>
        
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            {currentArchetype}
          </h2>
          <p className="text-gray-600">
            {currentArchetype === "Compression Agent" 
              ? "Synthesizing insights and detecting breakthrough patterns..."
              : "Analyzing from archetypal perspective..."
            }
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center space-x-2">
          {["The Visionary", "The Skeptic", "The Mystic", "The Contrarian", "The Craftsman", "Compression Agent"].map((archetype, index) => (
            <div
              key={archetype}
              className={`w-3 h-3 rounded-full ${
                archetype === currentArchetype
                  ? "bg-black animate-pulse"
                  : index < ["The Visionary", "The Skeptic", "The Mystic", "The Contrarian", "The Craftsman", "Compression Agent"].indexOf(currentArchetype)
                  ? "bg-gray-400"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Status */}
      <Card className="p-4 text-center">
        <p className="text-sm text-gray-600">
          Multi-agent analysis in progress. Each archetype contributes unique cognitive patterns.
        </p>
      </Card>
    </div>
  );
};

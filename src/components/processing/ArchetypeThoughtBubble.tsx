
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Lightbulb, Search, Zap, Hammer } from "lucide-react";

interface ArchetypeThoughtBubbleProps {
  archetype: string;
  isActive: boolean;
  isCompleted: boolean;
  thoughtProcess?: string;
}

const getArchetypeIcon = (archetype: string) => {
  switch (archetype) {
    case "The Visionary": return Lightbulb;
    case "The Skeptic": return Search;
    case "The Mystic": return Zap;
    case "The Contrarian": return Zap;
    case "The Craftsman": 
    case "The Realist": return Hammer;
    default: return Brain;
  }
};

const getArchetypeColor = (archetype: string) => {
  switch (archetype) {
    case "The Visionary": return "bg-purple-100 border-purple-200 text-purple-800";
    case "The Skeptic": return "bg-yellow-100 border-yellow-200 text-yellow-800";
    case "The Mystic": return "bg-blue-100 border-blue-200 text-blue-800";
    case "The Contrarian": return "bg-red-100 border-red-200 text-red-800";
    case "The Craftsman":
    case "The Realist": return "bg-green-100 border-green-200 text-green-800";
    default: return "bg-gray-100 border-gray-200 text-gray-800";
  }
};

const getThoughtPlaceholder = (archetype: string) => {
  switch (archetype) {
    case "The Visionary": return "Envisioning possibilities and potential futures...";
    case "The Skeptic": return "Questioning assumptions and probing for weaknesses...";
    case "The Mystic": return "Exploring deeper patterns and hidden connections...";
    case "The Contrarian": return "Challenging conventional wisdom and proposing alternatives...";
    case "The Craftsman":
    case "The Realist": return "Grounding ideas in practical reality and implementation...";
    default: return "Processing insights...";
  }
};

export const ArchetypeThoughtBubble = ({ 
  archetype, 
  isActive, 
  isCompleted, 
  thoughtProcess 
}: ArchetypeThoughtBubbleProps) => {
  const Icon = getArchetypeIcon(archetype);
  const colorClass = getArchetypeColor(archetype);
  const placeholder = getThoughtPlaceholder(archetype);

  return (
    <Card className={`p-4 transition-all duration-500 ${
      isActive ? `${colorClass} scale-105 shadow-lg` : 
      isCompleted ? "bg-green-50 border-green-200" : 
      "bg-gray-50 border-gray-200 opacity-60"
    }`}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className={`w-5 h-5 ${isActive ? "animate-pulse" : ""}`} />
            <h3 className="font-semibold text-sm">
              {archetype.replace("The ", "")}
            </h3>
          </div>
          {isCompleted && (
            <Badge variant="outline" className="text-xs bg-green-100 text-green-700">
              Complete
            </Badge>
          )}
          {isActive && (
            <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">
              Thinking...
            </Badge>
          )}
        </div>

        {/* Thought Process */}
        <div className="min-h-[60px]">
          {isActive && (
            <div className="space-y-2">
              <p className="text-sm italic text-gray-600">
                {thoughtProcess || placeholder}
              </p>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}
          {isCompleted && (
            <p className="text-sm text-gray-700">
              ✓ Perspective analyzed and insights captured
            </p>
          )}
          {!isActive && !isCompleted && (
            <p className="text-sm text-gray-400">
              Waiting to process...
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

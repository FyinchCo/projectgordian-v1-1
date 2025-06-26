
import { CheckCircle } from "lucide-react";
import { getThinkingStages, getCompletionInsights } from "./archetypeConfig";

interface ThoughtProcessDisplayProps {
  archetype: string;
  isActive: boolean;
  isCompleted: boolean;
  displayText: string;
  currentStageIndex: number;
  contributionQuality: number;
  processingInsights?: {
    focus: string;
    contribution: string;
  };
}

export const ThoughtProcessDisplay = ({
  archetype,
  isActive,
  isCompleted,
  displayText,
  currentStageIndex,
  contributionQuality,
  processingInsights
}: ThoughtProcessDisplayProps) => {
  const thinkingStages = getThinkingStages(archetype);

  if (isActive) {
    return (
      <div className="space-y-3">
        <div className="bg-white bg-opacity-60 rounded-lg p-4 border border-current border-opacity-20">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">
              Processing Stage:
            </p>
            <span className="text-xs text-gray-500">
              {currentStageIndex + 1}/{thinkingStages.length}
            </span>
          </div>
          <p className="text-sm italic text-gray-800 min-h-[24px] leading-relaxed">
            {displayText}
            <span className="animate-pulse">|</span>
          </p>
        </div>
        
        {processingInsights && (
          <div className="bg-white bg-opacity-40 rounded-lg p-3 border border-current border-opacity-10">
            <p className="text-xs text-gray-600 leading-relaxed">
              <strong>Focus:</strong> {processingInsights.contribution}
            </p>
          </div>
        )}
        
        {/* Enhanced Stage Progress */}
        <div className="flex justify-center space-x-1">
          {thinkingStages.map((_, index) => (
            <div 
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentStageIndex ? 'bg-current scale-125 animate-pulse' : 
                index < currentStageIndex ? 'bg-current opacity-60' : 'bg-current opacity-20'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <div className="flex items-center space-x-2 mb-3">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <p className="text-sm font-medium text-green-800">
            Analysis Complete - Quality: {contributionQuality}%
          </p>
        </div>
        <p className="text-sm text-green-700 leading-relaxed">
          {getCompletionInsights(archetype)}
        </p>
        {processingInsights && (
          <div className="mt-2 pt-2 border-t border-green-200">
            <p className="text-xs text-green-600">
              <strong>Contribution:</strong> {processingInsights.contribution}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
      <div className="flex items-center space-x-2 mb-2">
        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        <p className="text-sm font-medium text-gray-500">Awaiting Activation</p>
      </div>
      {processingInsights && (
        <p className="text-xs text-gray-400 leading-relaxed">
          Will focus on: {processingInsights.focus.toLowerCase()}
        </p>
      )}
    </div>
  );
};

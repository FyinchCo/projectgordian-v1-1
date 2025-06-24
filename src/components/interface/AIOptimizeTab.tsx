
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Target } from "lucide-react";

interface AIOptimizeTabProps {
  question: string;
  isAssessing: boolean;
  currentAssessment: any;
  onAIOptimize: () => void;
}

export const AIOptimizeTab = ({
  question,
  isAssessing,
  currentAssessment,
  onAIOptimize
}: AIOptimizeTabProps) => {
  return (
    <div className="text-center space-y-3">
      <p className="text-mono-dark-gray font-inter text-sm">
        Let AI analyze your question and configure optimal processing parameters
      </p>
      
      <Button
        onClick={onAIOptimize}
        disabled={!question.trim() || isAssessing}
        className="bg-mono-pure-black text-mono-pure-white hover:bg-mono-charcoal font-mono uppercase tracking-wide text-sm"
      >
        {isAssessing ? (
          <>
            <Brain className="w-3 h-3 mr-2 animate-pulse" />
            Analyzing...
          </>
        ) : (
          <>
            <Target className="w-3 h-3 mr-2" />
            Optimize Configuration
          </>
        )}
      </Button>

      {currentAssessment && (
        <div className="mt-4 p-4 bg-mono-light-gray border-2 border-mono-pure-black">
          <div className="text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-mono uppercase">Domain:</span>
              <Badge className="text-xs">{currentAssessment.domainType}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono uppercase">Complexity:</span>
              <Badge variant="outline" className="text-xs">{currentAssessment.complexityScore}/10</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono uppercase">Recommended Depth:</span>
              <Badge className="text-xs">{currentAssessment.recommendations.processingDepth} layers</Badge>
            </div>
            <div className="text-xs text-mono-dark-gray mt-2">
              All 5 archetypes active with dynamic emphasis tuning
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

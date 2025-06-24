
import { Badge } from "@/components/ui/badge";
import { Brain } from "lucide-react";

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
        Use the "Optimize All Settings" button above to automatically configure archetype personalities, tension parameters, and compression settings based on your question. Processing depth remains your manual choice.
      </p>

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
            <div className="text-xs text-mono-dark-gray mt-2">
              Archetype personalities, tension parameters, and compression settings optimized. Processing depth kept as your selection.
            </div>
          </div>
        </div>
      )}

      {!currentAssessment && !isAssessing && question.trim() && (
        <div className="flex items-center justify-center space-x-2 text-mono-medium-gray text-sm">
          <Brain className="w-4 h-4" />
          <span>Ready to optimize - click "Optimize All Settings" above</span>
        </div>
      )}
    </div>
  );
};

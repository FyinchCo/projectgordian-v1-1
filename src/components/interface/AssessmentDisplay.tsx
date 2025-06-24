
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AssessmentDisplayProps {
  currentAssessment: any;
  learningInsights: any;
}

export const AssessmentDisplay = ({ currentAssessment, learningInsights }: AssessmentDisplayProps) => {
  if (!currentAssessment) return null;

  return (
    <div className="p-6 bg-zen-whisper border border-zen-light rounded-md">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-zen-mono text-xs uppercase tracking-wide text-zen-charcoal">Domain</span>
          <Badge className="text-xs bg-zen-light text-zen-charcoal border-zen-medium">{currentAssessment.domainType}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-zen-mono text-xs uppercase tracking-wide text-zen-charcoal">Complexity</span>
          <Badge variant="outline" className="text-xs border-zen-medium text-zen-charcoal">{currentAssessment.complexityScore}/10</Badge>
        </div>
        {currentAssessment.recommendations?.metaLearningApplied && (
          <div className="flex justify-between items-center">
            <span className="text-zen-mono text-xs uppercase tracking-wide text-zen-charcoal">Learning Applied</span>
            <Badge className="text-xs bg-purple-100 text-purple-800 border-purple-200">
              {Math.round(currentAssessment.recommendations.learningConfidence * 100)}% Confidence
            </Badge>
          </div>
        )}
        <div className="text-xs text-zen-body text-zen-medium mt-3 leading-relaxed">
          {currentAssessment.recommendations?.metaLearningApplied 
            ? "Configuration enhanced with meta-learning insights. System continuously improves based on results."
            : "Configuration optimized for maximum insight generation. System is learning your preferences."
          }
        </div>
      </div>
    </div>
  );
};

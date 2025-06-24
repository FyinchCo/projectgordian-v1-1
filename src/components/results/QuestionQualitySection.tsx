
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Compass } from "lucide-react";

interface QuestionQualityMetrics {
  geniusYield: number;
  constraintBalance: number;
  metaPotential: number;
  effortVsEmergence: number;
  overallScore: number;
  feedback: string;
  recommendations: string[];
}

interface QuestionQualitySectionProps {
  questionQuality: QuestionQualityMetrics;
}

export const QuestionQualitySection = ({ questionQuality }: QuestionQualitySectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const getScoreColor = (score: number, isConstraint = false) => {
    if (isConstraint) {
      if (score >= 5 && score <= 7) return "text-green-600";
      if (score >= 3 && score <= 8) return "text-yellow-600";
      return "text-red-600";
    }
    
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getConstraintLabel = (score: number) => {
    if (score >= 8) return "Too Vague";
    if (score >= 5) return "Well-Scoped";
    if (score >= 3) return "Focused";
    return "Too Narrow";
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="p-6">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full flex items-center justify-between p-0 h-auto">
            <div className="flex items-center space-x-2">
              <Compass className="w-5 h-5" />
              <h3 className="font-bold text-lg">QUESTION QUALITY EVALUATION</h3>
              <Badge variant="outline" className={`${getScoreColor(questionQuality.overallScore)} border-current`}>
                {questionQuality.overallScore}/10
              </Badge>
            </div>
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-6">
          <div className="space-y-6">
            {/* Final Score Summary */}
            <div className="p-4 bg-gray-50 rounded border-l-4 border-gray-400">
              <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-700 mb-2">
                Question Genius Yield: {questionQuality.overallScore}/10
              </h4>
              <p className="text-gray-700">{questionQuality.feedback}</p>
            </div>

            {/* Scoring Categories */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded">
                <div className={`text-2xl font-bold ${getScoreColor(questionQuality.geniusYield)}`}>
                  {questionQuality.geniusYield}/10
                </div>
                <div className="text-sm text-blue-700 font-semibold">Genius Yield</div>
                <div className="text-xs text-blue-600">Insight value unlocked</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded">
                <div className={`text-2xl font-bold ${getScoreColor(questionQuality.constraintBalance, true)}`}>
                  {questionQuality.constraintBalance}/10
                </div>
                <div className="text-sm text-green-700 font-semibold">Constraint Balance</div>
                <div className="text-xs text-green-600">{getConstraintLabel(questionQuality.constraintBalance)}</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded">
                <div className={`text-2xl font-bold ${getScoreColor(questionQuality.metaPotential)}`}>
                  {questionQuality.metaPotential}/10
                </div>
                <div className="text-sm text-purple-700 font-semibold">Meta-Potential</div>
                <div className="text-xs text-purple-600">Layers & paradoxes</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded">
                <div className={`text-2xl font-bold ${getScoreColor(questionQuality.effortVsEmergence)}`}>
                  {questionQuality.effortVsEmergence}/10
                </div>
                <div className="text-sm text-orange-700 font-semibold">Effort vs Emergence</div>
                <div className="text-xs text-orange-600">How easily genius emerged</div>
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-700 mb-3">
                Recommendations for Better Questions
              </h4>
              <div className="space-y-2">
                {questionQuality.recommendations.map((rec, index) => (
                  <div key={index} className="p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-700">
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

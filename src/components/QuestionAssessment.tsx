
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Brain, Target, Zap, Users, Lightbulb } from "lucide-react";
import { useQuestionAssessment } from "@/hooks/useQuestionAssessment";

interface QuestionAssessmentProps {
  question: string;
  onApplyRecommendations: (recommendations: any) => void;
}

export const QuestionAssessment = ({ question, onApplyRecommendations }: QuestionAssessmentProps) => {
  const { assessQuestion, assessment, isAssessing } = useQuestionAssessment();
  const [showAssessment, setShowAssessment] = useState(false);

  const handleAssess = async () => {
    const result = await assessQuestion(question);
    if (result) {
      setShowAssessment(true);
    }
  };

  const handleApplyRecommendations = () => {
    if (assessment?.recommendations) {
      onApplyRecommendations(assessment.recommendations);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "bg-red-500";
    if (score >= 6) return "bg-yellow-500";
    if (score >= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-purple-800">Question Intelligence</h3>
          </div>
          <Button
            onClick={handleAssess}
            disabled={!question.trim() || isAssessing}
            variant="outline"
            size="sm"
            className="border-purple-200 hover:bg-purple-100"
          >
            {isAssessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Assess & Optimize
              </>
            )}
          </Button>
        </div>

        <p className="text-sm text-purple-700">
          Let AI analyze your question complexity and recommend optimal processing settings
        </p>

        {showAssessment && assessment && (
          <div className="mt-6 space-y-4">
            {/* Assessment Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getScoreColor(assessment.complexityScore)}`}></div>
                <span className="text-sm">Complexity: {assessment.complexityScore}/10</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getScoreColor(assessment.controversyPotential)}`}></div>
                <span className="text-sm">Controversy: {assessment.controversyPotential}/10</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getScoreColor(assessment.noveltyRequirement)}`}></div>
                <span className="text-sm">Novelty Need: {assessment.noveltyRequirement}/10</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{assessment.domainType}</Badge>
              <Badge variant="outline">{assessment.abstractionLevel}</Badge>
            </div>

            {/* Recommendations */}
            <div className="p-4 bg-white rounded-lg border border-purple-200">
              <h4 className="font-semibold text-sm mb-3 flex items-center">
                <Lightbulb className="w-4 h-4 mr-2" />
                AI Recommendations
              </h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Processing Depth:</span>
                  <Badge>{assessment.recommendations.processingDepth} layers</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Circuit Type:</span>
                  <Badge>{assessment.recommendations.circuitType}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Enhanced Mode:</span>
                  <Badge variant={assessment.recommendations.enhancedMode ? "default" : "outline"}>
                    {assessment.recommendations.enhancedMode ? "ON" : "OFF"}
                  </Badge>
                </div>
                
                {assessment.recommendations.archetypeEmphasis.length > 0 && (
                  <div>
                    <span className="text-gray-600">Emphasize:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {assessment.recommendations.archetypeEmphasis.map((archetype, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {archetype}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-3 p-3 bg-gray-50 rounded text-xs text-gray-700">
                <strong>Reasoning:</strong> {assessment.recommendations.reasoning}
              </div>

              <Button
                onClick={handleApplyRecommendations}
                className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
                size="sm"
              >
                <Zap className="w-4 h-4 mr-2" />
                Apply These Settings
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Brain, Target, Zap, Users, Lightbulb, Settings, Layers } from "lucide-react";
import { useQuestionAssessment } from "@/hooks/useQuestionAssessment";

interface QuestionAssessmentProps {
  question: string;
  onApplyRecommendations: (recommendations: any, fullAssessment: any) => void;
}

export const QuestionAssessment = ({ question, onApplyRecommendations }: QuestionAssessmentProps) => {
  const { assessQuestion, assessment, isAssessing } = useQuestionAssessment();
  const [showAssessment, setShowAssessment] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleAssess = async () => {
    const result = await assessQuestion(question);
    if (result) {
      setShowAssessment(true);
    }
  };

  const handleApplyRecommendations = () => {
    if (assessment?.recommendations) {
      console.log('Applying recommendations with full assessment context');
      onApplyRecommendations(assessment.recommendations, assessment);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "bg-red-500";
    if (score >= 6) return "bg-yellow-500";
    if (score >= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const getEmphasisColor = (emphasis: number) => {
    if (emphasis >= 8) return "bg-purple-500";
    if (emphasis >= 6) return "bg-blue-500";
    if (emphasis >= 4) return "bg-green-500";
    return "bg-gray-400";
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-purple-800">Cognitive Architecture Assessment</h3>
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
                Analyze & Configure
              </>
            )}
          </Button>
        </div>

        <p className="text-sm text-purple-700">
          AI-powered cognitive architecture optimization - all archetypes always active with dynamic tuning
        </p>

        {showAssessment && assessment && (
          <div className="mt-6 space-y-4">
            {/* Core Assessment Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getScoreColor(assessment.complexityScore)}`}></div>
                <span className="text-sm">Complexity: {assessment.complexityScore}/10</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getScoreColor(assessment.controversyPotential)}`}></div>
                <span className="text-sm">Controversy: {assessment.controversyPotential}/10</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getScoreColor(assessment.breakthroughPotential || 5)}`}></div>
                <span className="text-sm">Breakthrough: {assessment.breakthroughPotential || 5}/10</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getScoreColor(assessment.cognitiveComplexity || 5)}`}></div>
                <span className="text-sm">Cognitive: {assessment.cognitiveComplexity || 5}/10</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{assessment.domainType}</Badge>
              <Badge variant="outline">{assessment.abstractionLevel}</Badge>
              {assessment.processingConfiguration && (
                <Badge variant="secondary">{assessment.processingConfiguration.outputFormat}</Badge>
              )}
              <Badge className="bg-green-100 text-green-800">All Archetypes Active</Badge>
            </div>

            {/* Core Recommendations */}
            <div className="p-4 bg-white rounded-lg border border-purple-200">
              <h4 className="font-semibold text-sm mb-3 flex items-center">
                <Lightbulb className="w-4 h-4 mr-2" />
                Dynamic Cognitive Configuration
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
              </div>

              {/* Enhanced Archetype Configuration Display */}
              {assessment.archetypeConfigurations && (
                <div className="mt-4 space-y-2">
                  <h5 className="font-semibold text-xs flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    Archetype Emphasis Levels (All Active)
                  </h5>
                  <div className="grid grid-cols-1 gap-2">
                    {assessment.archetypeConfigurations.map((config, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-xs font-medium">{config.name}</span>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getEmphasisColor(config.emphasis)}`}></div>
                          <Badge variant="outline" className="text-xs">
                            {config.emphasis}/10
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Advanced Configuration Toggle */}
              {assessment.archetypeConfigurations && (
                <Button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  variant="ghost"
                  size="sm"
                  className="mt-3 w-full"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {showAdvanced ? "Hide" : "Show"} Parameter Details
                </Button>
              )}

              {/* Advanced Configuration Details */}
              {showAdvanced && assessment.archetypeConfigurations && (
                <div className="mt-4 space-y-3 p-3 bg-gray-50 rounded">
                  <h5 className="font-semibold text-xs flex items-center">
                    <Layers className="w-3 h-3 mr-1" />
                    Detailed Personality Parameters
                  </h5>
                  
                  {assessment.archetypeConfigurations.map((config, index) => (
                    <div key={index} className="text-xs p-2 bg-white rounded border">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{config.name}</span>
                        <Badge className={`text-xs ${getEmphasisColor(config.emphasis)}`}>
                          Emphasis: {config.emphasis}/10
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                        <span>Imagination: {config.personalityAdjustments.imagination}/10</span>
                        <span>Skepticism: {config.personalityAdjustments.skepticism}/10</span>
                        <span>Aggression: {config.personalityAdjustments.aggression}/10</span>
                        <span>Emotionality: {config.personalityAdjustments.emotionality}/10</span>
                      </div>
                    </div>
                  ))}

                  {assessment.tensionParameters && (
                    <div className="text-xs p-2 bg-white rounded border">
                      <h6 className="font-medium mb-1">Tension Parameters</h6>
                      <div className="grid grid-cols-2 gap-1 text-gray-600">
                        <span>Contradiction Threshold: {assessment.tensionParameters.contradictionThreshold}</span>
                        <span>Recursion Depth: {assessment.tensionParameters.recursionDepth}</span>
                        <span>Consensus Risk: {assessment.tensionParameters.consensusRiskTolerance}</span>
                        <span>Dialectical: {assessment.tensionParameters.dialecticalMode ? "ON" : "OFF"}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-3 p-3 bg-gray-50 rounded text-xs text-gray-700">
                <strong>Reasoning:</strong> {assessment.recommendations.reasoning}
              </div>

              <Button
                onClick={handleApplyRecommendations}
                className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
                size="sm"
              >
                <Zap className="w-4 h-4 mr-2" />
                Apply Dynamic Architecture
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};


import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Brain, ChevronDown, ChevronUp } from "lucide-react";
import { LearningDashboard } from "../LearningDashboard";

interface MetaLearningStatusCardProps {
  learningInsights: any;
  optimizationReasoning: any;
  clearOptimizationReasoning: () => void;
}

export const MetaLearningStatusCard = ({
  learningInsights,
  optimizationReasoning,
  clearOptimizationReasoning
}: MetaLearningStatusCardProps) => {
  const [showLearningDashboard, setShowLearningDashboard] = useState(false);

  // Only show if we have actual learning data or optimization reasoning
  const hasLearningData = learningInsights?.totalExperience > 0;
  const hasOptimizationReasoning = !!optimizationReasoning;

  if (!hasLearningData && !hasOptimizationReasoning) {
    return null; // Hide completely when no meaningful data
  }

  return (
    <>
      {/* Meta-Learning Status - Enhanced with collapsible dashboard */}
      {learningInsights?.isSystemLearning && (
        <Collapsible open={showLearningDashboard} onOpenChange={setShowLearningDashboard}>
          <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 mb-6">
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <div className="text-left">
                    <h3 className="text-sm font-semibold text-purple-800">Meta-Learning System Active</h3>
                    <p className="text-xs text-purple-600">
                      System maturity: {Math.round(learningInsights.maturityLevel * 100)}% | 
                      Total experience: {learningInsights.totalExperience} questions | 
                      Quality trend: {learningInsights.qualityTrend}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="border-purple-300 text-purple-700">
                    Learning Enabled
                  </Badge>
                  {showLearningDashboard ? (
                    <ChevronUp className="w-4 h-4 text-purple-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-purple-600" />
                  )}
                </div>
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="pt-4">
              <LearningDashboard />
            </CollapsibleContent>
            
            {!showLearningDashboard && learningInsights.bestPerformingDomains.length > 0 && (
              <div className="mt-3 pt-3 border-t border-purple-200">
                <p className="text-xs text-purple-600">
                  <strong>Best performance:</strong> {learningInsights.bestPerformingDomains.map(d => `${d.domain} (${Math.round(d.averageQuality * 10) / 10}/10)`).join(', ')}
                </p>
              </div>
            )}
          </Card>
        </Collapsible>
      )}

      {/* Optimization Reasoning Display - Enhanced with meta-learning info */}
      {optimizationReasoning && (
        <div className="mb-6">
          <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Brain className="w-5 h-5 text-green-600" />
                <div>
                  <h3 className="text-sm font-semibold text-green-800">Configuration Optimized</h3>
                  <p className="text-xs text-green-600 mt-1">{optimizationReasoning.reasoning}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="border-green-300 text-green-700">
                  {optimizationReasoning.domainType}
                </Badge>
                <button
                  onClick={clearOptimizationReasoning}
                  className="text-xs text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </div>
            </div>
          </Card>
          
          {optimizationReasoning.metaLearningApplied && (
            <Card className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Meta-Learning Enhanced</span>
                <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                  {Math.round((optimizationReasoning.systemConfidence || 0) * 100)}% Confidence
                </Badge>
              </div>
              <p className="text-xs text-green-700 mt-1">
                Configuration optimized using patterns learned from {learningInsights?.totalExperience || 0} previous questions.
              </p>
            </Card>
          )}
        </div>
      )}
    </>
  );
};

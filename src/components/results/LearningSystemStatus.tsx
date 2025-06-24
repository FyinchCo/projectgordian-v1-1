
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp } from "lucide-react";

interface QuestionQualityMetrics {
  geniusYield: number;
  constraintBalance: number;
  metaPotential: number;
  effortVsEmergence: number;
  overallScore: number;
  feedback: string;
  recommendations: string[];
}

interface LearningSystemStatusProps {
  questionQuality?: QuestionQualityMetrics;
}

export const LearningSystemStatus = ({ questionQuality }: LearningSystemStatusProps) => {
  if (!questionQuality) return null;

  return (
    <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="w-5 h-5 text-green-600" />
          <div>
            <h3 className="text-sm font-semibold text-green-800">Learning Cycle Completed</h3>
            <p className="text-xs text-green-600">
              Quality score: {questionQuality.overallScore}/10 | 
              Results recorded for future optimization
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <Badge variant="outline" className="border-green-300 text-green-700">
            System Learning
          </Badge>
        </div>
      </div>
    </Card>
  );
};

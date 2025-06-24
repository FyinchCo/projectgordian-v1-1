
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, TrendingUp, Zap } from "lucide-react";
import { LearningDashboard } from "@/components/LearningDashboard";

interface SystemOverviewTabProps {
  learningDashboard: any;
  rawData: any;
  patterns: any[];
}

export const SystemOverviewTab = ({ 
  learningDashboard, 
  rawData, 
  patterns 
}: SystemOverviewTabProps) => {
  return (
    <div className="space-y-6">
      <LearningDashboard />
      
      {learningDashboard && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <Database className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-semibold">Data Health</h3>
                <p className="text-sm text-gray-600">
                  {rawData?.records?.length || 0} learning records stored
                </p>
                <p className="text-xs text-gray-500">
                  Hook reports: {learningDashboard.learningStats?.totalRecords || 0}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <h3 className="font-semibold">Learning Velocity</h3>
                <p className="text-sm text-gray-600">
                  {Math.round((learningDashboard.systemEvolution?.learningVelocity || 0) * 100)}% improvement rate
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 text-purple-600" />
              <div>
                <h3 className="font-semibold">Pattern Discovery</h3>
                <p className="text-sm text-gray-600">
                  {patterns.length} configuration patterns identified
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

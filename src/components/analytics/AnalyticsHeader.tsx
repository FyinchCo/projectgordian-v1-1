
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";

interface AnalyticsHeaderProps {
  rawData: any;
  learningDashboard: any;
  onForceRefresh: () => void;
  onExportData: () => void;
}

export const AnalyticsHeader = ({ 
  rawData, 
  learningDashboard, 
  onForceRefresh, 
  onExportData 
}: AnalyticsHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-playfair font-bold text-gordian-dark-brown mb-2">
          Learning Analytics Dashboard
        </h1>
        <p className="text-gordian-brown font-inter">
          Developer insights into the meta-learning system's progress and patterns
        </p>
        {/* Debug info */}
        <div className="mt-2 text-xs text-gray-500">
          Records: {rawData?.records?.length || 0} | 
          Last refresh: {new Date().toLocaleTimeString()} |
          Dashboard total: {learningDashboard?.learningStats?.totalRecords || 0}
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Button onClick={onForceRefresh} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Force Refresh
        </Button>
        <Button onClick={onExportData} size="sm" className="bg-gordian-dark-brown hover:bg-gordian-brown">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>
    </div>
  );
};

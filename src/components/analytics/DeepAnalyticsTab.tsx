
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DeepAnalyticsTabProps {
  rawData: any;
  learningDashboard: any;
  onResetSystem: () => void;
}

export const DeepAnalyticsTab = ({ 
  rawData, 
  learningDashboard, 
  onResetSystem 
}: DeepAnalyticsTabProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Configuration Effectiveness</h3>
          {rawData?.records && rawData.records.length > 0 ? (
            <div className="space-y-3">
              {['enhanced', 'basic'].map(mode => {
                const records = rawData.records.filter((r: any) => 
                  r.configuration.enhancedMode === (mode === 'enhanced')
                );
                const avgQuality = records.length > 0 ? 
                  records.reduce((sum: number, r: any) => sum + r.qualityMetrics.overallScore, 0) / records.length : 0;
                
                return (
                  <div key={mode} className="flex justify-between items-center">
                    <span className="capitalize">{mode} Mode</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{Math.round(avgQuality * 10) / 10}/10</span>
                      <span className="text-xs text-gray-500">({records.length} samples)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No data available for analysis.</p>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Domain Performance</h3>
          {learningDashboard?.learningStats?.bestDomains?.length > 0 ? (
            <div className="space-y-3">
              {learningDashboard.learningStats.bestDomains.slice(0, 5).map((domain: any, index: number) => (
                <div key={domain.domain} className="flex justify-between items-center">
                  <span>{domain.domain}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{Math.round(domain.averageQuality * 10) / 10}/10</span>
                    <span className="text-xs text-gray-500">({domain.sampleSize} samples)</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No domain performance data available.</p>
          )}
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">System Management</h3>
          <Button 
            onClick={onResetSystem} 
            variant="destructive" 
            size="sm"
          >
            Reset All Learning Data
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          Use the reset function to clear all learning data and start fresh. This action cannot be undone.
        </p>
      </Card>
    </div>
  );
};

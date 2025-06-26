
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, List } from "lucide-react";
import { JobStatusCard } from "@/components/JobStatusCard";

interface JobMonitorViewProps {
  job: any;
  onBack: () => void;
  onViewHistory: () => void;
  onViewResults: (job: any) => void;
  onRetryJob: (job: any) => void;
}

export const JobMonitorView = ({ 
  job, 
  onBack, 
  onViewHistory, 
  onViewResults, 
  onRetryJob 
}: JobMonitorViewProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analysis Monitor</h1>
              <p className="text-gray-600">Real-time job progress</p>
            </div>
          </div>

          <Button 
            variant="outline"
            onClick={onViewHistory}
            className="flex items-center space-x-2"
          >
            <List className="w-4 h-4" />
            <span>View History</span>
          </Button>
        </div>

        <JobStatusCard
          job={job}
          onViewResults={onViewResults}
          onRetry={onRetryJob}
          className="border-2 border-blue-200"
        />

        {job.status === 'completed' && job.final_results?.[0] && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Analysis Results</h2>
            <div className="prose max-w-none">
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed">
                  {job.final_results[0].synthesis}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

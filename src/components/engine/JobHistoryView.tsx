
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Brain } from "lucide-react";
import { JobStatusCard } from "@/components/JobStatusCard";

interface JobHistoryViewProps {
  jobs: any[];
  onBack: () => void;
  onViewResults: (job: any) => void;
  onRetryJob: (job: any) => void;
}

export const JobHistoryView = ({ 
  jobs, 
  onBack, 
  onViewResults, 
  onRetryJob 
}: JobHistoryViewProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-8 space-y-8">
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
            <h1 className="text-3xl font-bold text-gray-900">Analysis History</h1>
            <p className="text-gray-600">Your recent genius analyses</p>
          </div>
        </div>

        <div className="space-y-4">
          {jobs.length === 0 ? (
            <Card className="p-8 text-center">
              <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No analyses yet</h3>
              <p className="text-gray-600 mb-4">Start your first genius analysis to see it here.</p>
              <Button onClick={onBack}>
                Create Analysis
              </Button>
            </Card>
          ) : (
            jobs.map((jobItem) => (
              <JobStatusCard
                key={jobItem.id}
                job={jobItem}
                onViewResults={onViewResults}
                onRetry={onRetryJob}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

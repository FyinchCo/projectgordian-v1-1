
import { Button } from "@/components/ui/button";
import { Eye, RefreshCw } from "lucide-react";

interface Job {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
}

interface JobActionsProps {
  job: Job;
  onViewResults?: (job: Job) => void;
  onRetry?: (job: Job) => void;
}

export const JobActions = ({ job, onViewResults, onRetry }: JobActionsProps) => {
  return (
    <div className="flex space-x-2 pt-2">
      {job.status === 'completed' && onViewResults && (
        <Button 
          onClick={() => onViewResults(job)}
          size="sm"
          className="flex items-center space-x-2"
        >
          <Eye className="w-4 h-4" />
          <span>View Results</span>
        </Button>
      )}
      
      {job.status === 'failed' && onRetry && (
        <Button 
          onClick={() => onRetry(job)}
          size="sm"
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </Button>
      )}
    </div>
  );
};

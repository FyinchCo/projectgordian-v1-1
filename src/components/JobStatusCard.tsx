
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { getStatusIcon, getStatusColor } from "./job-status/jobStatusUtils";
import { JobProgressDisplay } from "./job-status/JobProgressDisplay";
import { JobResultsPreview } from "./job-status/JobResultsPreview";
import { JobActions } from "./job-status/JobActions";

interface Job {
  id: string;
  question: string;
  processing_depth: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  job_progress?: Array<{
    current_layer: number;
    total_layers: number;
    current_archetype?: string;
    processing_phase?: string;
    updated_at: string;
    chunk_progress?: {
      currentChunk: number;
      totalChunks: number;
      breakthroughPotential: number;
      tensionLevel: number;
      chunkSize?: number;
    };
  }>;
  final_results?: Array<{
    synthesis: string;
    confidence: number;
    full_results: any;
  }>;
}

interface JobStatusCardProps {
  job: Job;
  onViewResults?: (job: Job) => void;
  onRetry?: (job: Job) => void;
  className?: string;
}

export const JobStatusCard = ({ job, onViewResults, onRetry, className }: JobStatusCardProps) => {
  const StatusIcon = getStatusIcon(job.status);
  const statusColor = getStatusColor(job.status);
  
  const getTimeDisplay = () => {
    if (job.completed_at) {
      return `Completed ${formatDistanceToNow(new Date(job.completed_at))} ago`;
    }
    if (job.started_at) {
      return `Started ${formatDistanceToNow(new Date(job.started_at))} ago`;
    }
    return `Created ${formatDistanceToNow(new Date(job.created_at))} ago`;
  };

  const progress = job.job_progress?.[0];
  const isBreakthrough = (progress?.chunk_progress?.breakthroughPotential || 0) >= 70;

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <StatusIcon className={`w-4 h-4 ${job.status === 'processing' ? 'animate-pulse' : ''} ${
              job.status === 'pending' ? 'text-yellow-600' : 
              job.status === 'processing' ? 'text-blue-600' :
              job.status === 'completed' ? 'text-green-600' :
              job.status === 'failed' ? 'text-red-600' : 'text-gray-600'
            }`} />
            <div>
              <Badge className={statusColor}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </Badge>
              <div className="text-sm text-gray-500 mt-1">
                {job.processing_depth} layers • {getTimeDisplay()}
              </div>
            </div>
          </div>
          
          {/* Breakthrough Indicator */}
          {isBreakthrough && (
            <Badge className="bg-purple-100 text-purple-800 border-purple-200">
              🚀 Breakthrough Detected
            </Badge>
          )}
        </div>

        {/* Question */}
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Question</h3>
          <blockquote className="text-sm text-gray-700 italic border-l-4 border-gray-200 pl-4">
            "{job.question}"
          </blockquote>
        </div>

        {/* Progress Display */}
        <JobProgressDisplay job={job} />

        {/* Results Preview */}
        <JobResultsPreview job={job} />

        {/* Actions */}
        <JobActions job={job} onViewResults={onViewResults} onRetry={onRetry} />
      </div>
    </Card>
  );
};

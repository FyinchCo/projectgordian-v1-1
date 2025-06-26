
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Brain,
  Eye,
  RefreshCw
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
  const getStatusIcon = () => {
    switch (job.status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'processing':
        return <Brain className="w-4 h-4 text-blue-600 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (job.status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgress = () => {
    const progress = job.job_progress?.[0];
    if (!progress) return 0;
    return Math.min(95, (progress.current_layer / progress.total_layers) * 100);
  };

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
  const finalResult = job.final_results?.[0];

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <Badge className={getStatusColor()}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </Badge>
              <div className="text-sm text-gray-500 mt-1">
                {job.processing_depth} layers • {getTimeDisplay()}
              </div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Question</h3>
          <blockquote className="text-sm text-gray-700 italic border-l-4 border-gray-200 pl-4">
            "{job.question}"
          </blockquote>
        </div>

        {/* Progress for processing jobs */}
        {job.status === 'processing' && progress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Layer {progress.current_layer} of {progress.total_layers}</span>
              <span>{Math.round(getProgress())}%</span>
            </div>
            <Progress value={getProgress()} className="h-2" />
            {progress.current_archetype && (
              <div className="text-xs text-gray-600">
                Current perspective: {progress.current_archetype}
              </div>
            )}
            {progress.processing_phase && (
              <div className="text-xs text-gray-600">
                {progress.processing_phase}
              </div>
            )}
          </div>
        )}

        {/* Error message */}
        {job.status === 'failed' && job.error_message && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="text-sm text-red-800">
              <strong>Error:</strong> {job.error_message}
            </div>
          </div>
        )}

        {/* Results preview for completed jobs */}
        {job.status === 'completed' && finalResult && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="text-sm text-green-800 mb-2">
              <strong>Analysis Complete</strong>
            </div>
            <div className="text-sm text-gray-700 line-clamp-3">
              {finalResult.synthesis}
            </div>
          </div>
        )}

        {/* Actions */}
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
      </div>
    </Card>
  );
};

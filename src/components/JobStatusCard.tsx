
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

  const getChunkedProgress = () => {
    const progress = job.job_progress?.[0];
    if (!progress?.chunk_progress) return { percent: 0, text: 'Initializing...' };
    
    const { currentChunk, totalChunks, breakthroughPotential, tensionLevel } = progress.chunk_progress;
    
    if (job.status === 'completed') {
      return { 
        percent: 100, 
        text: `Breakthrough: ${breakthroughPotential}%`,
        isBreakthrough: breakthroughPotential >= 70
      };
    }
    
    const chunkPercent = totalChunks > 0 ? (currentChunk / totalChunks) * 100 : 0;
    return { 
      percent: Math.min(chunkPercent, 95), 
      text: `Chunk ${currentChunk}/${totalChunks} • Breakthrough: ${breakthroughPotential}%`,
      tensionLevel,
      breakthroughPotential,
      isBreakthrough: breakthroughPotential >= 70
    };
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
  const chunkedProgress = getChunkedProgress();

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
          
          {/* Breakthrough Indicator */}
          {chunkedProgress.isBreakthrough && (
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

        {/* Chunked Progress for processing jobs */}
        {job.status === 'processing' && progress && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>{chunkedProgress.text}</span>
              <span>{Math.round(chunkedProgress.percent)}%</span>
            </div>
            <div className="relative">
              <Progress 
                value={chunkedProgress.percent} 
                className={`h-3 ${chunkedProgress.isBreakthrough ? 'bg-purple-200' : ''}`} 
              />
              {chunkedProgress.isBreakthrough && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 opacity-30 rounded-full animate-pulse"></div>
              )}
            </div>
            
            {/* Genius Metrics */}
            <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-semibold text-purple-600">
                  {progress.chunk_progress?.breakthroughPotential || 0}%
                </div>
                <div className="text-xs text-gray-600">Breakthrough Potential</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-red-600">
                  {progress.chunk_progress?.tensionLevel || 0}/10
                </div>
                <div className="text-xs text-gray-600">Tension Level</div>
              </div>
            </div>
            
            {progress.processing_phase && (
              <div className="text-xs text-gray-600 italic">
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

        {/* Enhanced results preview for completed jobs */}
        {job.status === 'completed' && finalResult && (
          <div className={`border rounded-lg p-4 ${chunkedProgress.isBreakthrough ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200' : 'bg-green-50 border-green-200'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`text-sm font-semibold ${chunkedProgress.isBreakthrough ? 'text-purple-800' : 'text-green-800'}`}>
                {chunkedProgress.isBreakthrough ? '🚀 Breakthrough Analysis Complete' : '✅ Analysis Complete'}
              </div>
              <Badge variant="outline" className="text-xs">
                Confidence: {Math.round((finalResult.confidence || 0) * 100)}%
              </Badge>
            </div>
            <div className="text-sm text-gray-700 line-clamp-3">
              {finalResult.synthesis}
            </div>
            
            {/* Enhanced metrics display */}
            {finalResult.full_results?.breakthroughPotential && (
              <div className="mt-3 text-xs text-gray-600">
                Final Breakthrough Score: {finalResult.full_results.breakthroughPotential}% • 
                Layers Processed: {finalResult.full_results.processingDepth || job.processing_depth}
              </div>
            )}
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

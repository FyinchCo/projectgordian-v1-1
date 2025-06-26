
import { Badge } from "@/components/ui/badge";

interface Job {
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  error_message?: string;
  final_results?: Array<{
    synthesis: string;
    confidence: number;
    full_results: any;
  }>;
  job_progress?: Array<{
    chunk_progress?: {
      breakthroughPotential: number;
    };
  }>;
  processing_depth: number;
}

interface JobResultsPreviewProps {
  job: Job;
}

export const JobResultsPreview = ({ job }: JobResultsPreviewProps) => {
  const finalResult = job.final_results?.[0];
  const progress = job.job_progress?.[0];
  const isBreakthrough = (progress?.chunk_progress?.breakthroughPotential || 0) >= 70;

  // Error message for failed jobs
  if (job.status === 'failed' && job.error_message) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
        <div className="text-sm text-red-800">
          <strong>Error:</strong> {job.error_message}
        </div>
      </div>
    );
  }

  // Results preview for completed jobs
  if (job.status === 'completed' && finalResult) {
    return (
      <div className={`border rounded-lg p-4 ${isBreakthrough ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200' : 'bg-green-50 border-green-200'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className={`text-sm font-semibold ${isBreakthrough ? 'text-purple-800' : 'text-green-800'}`}>
            {isBreakthrough ? '🚀 Breakthrough Analysis Complete' : '✅ Analysis Complete'}
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
    );
  }

  return null;
};

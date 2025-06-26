
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface Job {
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  processing_depth: number;
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
}

interface JobProgressDisplayProps {
  job: Job;
}

export const JobProgressDisplay = ({ job }: JobProgressDisplayProps) => {
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

  const progress = job.job_progress?.[0];
  const chunkedProgress = getChunkedProgress();

  if (job.status !== 'processing' || !progress) {
    return null;
  }

  return (
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
  );
};


import { Timer, TrendingUp } from "lucide-react";

interface ProcessingMetricsProps {
  processingTime: number;
  efficiencyScore: number;
  chunkProgress?: { current: number; total: number };
}

export const ProcessingMetrics = ({ 
  processingTime, 
  efficiencyScore, 
  chunkProgress 
}: ProcessingMetricsProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center space-x-6">
      <div className="text-center">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Timer className="w-4 h-4" />
          <span className="font-mono text-lg font-bold">{formatTime(processingTime)}</span>
        </div>
        <div className="text-xs text-gray-500">Processing Time</div>
      </div>
      
      <div className="text-center">
        <div className="flex items-center space-x-2 text-sm text-green-600">
          <TrendingUp className="w-4 h-4" />
          <span className="font-mono text-lg font-bold">{Math.round(efficiencyScore)}%</span>
        </div>
        <div className="text-xs text-gray-500">Efficiency</div>
      </div>
      
      {chunkProgress && chunkProgress.total > 1 && (
        <div className="text-center">
          <div className="text-lg font-bold text-purple-700">
            {chunkProgress.current}/{chunkProgress.total}
          </div>
          <div className="text-xs text-purple-500">Deep Chunks</div>
        </div>
      )}
    </div>
  );
};


import { Clock, TrendingUp, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface ProcessingClockProps {
  isActive: boolean;
  currentLayer: number;
  totalLayers: number;
  connectionStatus?: 'connecting' | 'processing' | 'completed' | 'error';
}

export const ProcessingClock = ({ 
  isActive, 
  currentLayer, 
  totalLayers, 
  connectionStatus = 'connecting' 
}: ProcessingClockProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setElapsedTime(0);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusInfo = () => {
    switch (connectionStatus) {
      case 'connecting':
        return { text: 'Connecting...', icon: Clock, color: 'text-blue-600' };
      case 'processing':
        return { text: 'Processing...', icon: TrendingUp, color: 'text-green-600' };
      case 'completed':
        return { text: 'Completed', icon: TrendingUp, color: 'text-green-700' };
      case 'error':
        return { text: 'Error', icon: AlertCircle, color: 'text-red-600' };
      default:
        return { text: 'Connecting...', icon: Clock, color: 'text-blue-600' };
    }
  };

  if (!isActive) return null;

  const status = getStatusInfo();
  const StatusIcon = status.icon;

  return (
    <div className="flex items-center space-x-6 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-200">
      <div className="flex items-center space-x-2">
        <Clock className="w-4 h-4 text-gray-600" />
        <span className="font-mono text-lg font-bold text-gray-800">
          {formatTime(elapsedTime)}
        </span>
        <div className="text-xs text-gray-500">Processing Time</div>
      </div>
      
      <div className="flex items-center space-x-2">
        <StatusIcon className={`w-4 h-4 ${status.color}`} />
        <span className={`font-mono text-sm font-bold ${status.color}`}>
          {status.text}
        </span>
        {connectionStatus === 'processing' && (
          <div className="text-xs text-gray-500">
            Layer {currentLayer}/{totalLayers}
          </div>
        )}
      </div>
    </div>
  );
};


import { Clock, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

interface ProcessingClockProps {
  isActive: boolean;
  currentLayer: number;
  totalLayers: number;
}

export const ProcessingClock = ({ isActive, currentLayer, totalLayers }: ProcessingClockProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [efficiency, setEfficiency] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setElapsedTime(0);
      setEfficiency(0);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(elapsed);
      
      // Calculate efficiency based on progress vs time
      const progress = (currentLayer / totalLayers) * 100;
      const expectedTime = currentLayer * 8; // 8 seconds per layer baseline
      const actualTime = elapsed || 1;
      const calculatedEfficiency = Math.min(100, Math.max(0, (expectedTime / actualTime) * 100));
      setEfficiency(Math.round(calculatedEfficiency));
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, currentLayer, totalLayers]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isActive) return null;

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
        <TrendingUp className="w-4 h-4 text-green-600" />
        <span className="font-mono text-lg font-bold text-green-700">
          {efficiency}%
        </span>
        <div className="text-xs text-gray-500">Efficiency</div>
      </div>
    </div>
  );
};

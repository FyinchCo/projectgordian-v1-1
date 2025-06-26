
import { Badge } from "@/components/ui/badge";
import { Clock, Settings } from "lucide-react";

interface AnalysisType {
  type: string;
  description: string;
}

interface AnalysisTypeSelectorProps {
  totalLayers: number;
  setTotalLayers: (layers: number) => void;
}

export const AnalysisTypeSelector = ({ totalLayers, setTotalLayers }: AnalysisTypeSelectorProps) => {
  const getEstimatedTime = (layers: number) => {
    const estimatedSeconds = layers * 25;
    return Math.ceil(estimatedSeconds / 60);
  };

  const getAnalysisType = (layers: number): AnalysisType => {
    if (layers <= 3) return { type: "Quick Insight", description: "Rapid analysis" };
    if (layers <= 5) return { type: "Standard Analysis", description: "Balanced depth" };
    if (layers <= 10) return { type: "Deep Exploration", description: "Comprehensive understanding" };
    if (layers <= 20) return { type: "Genius-Level Analysis", description: "Breakthrough potential" };
    return { type: "Transcendent Analysis", description: "Ultimate understanding" };
  };

  const analysisType = getAnalysisType(totalLayers);

  return (
    <>
      {/* Enhanced Configuration Bar */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Settings className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">Depth:</span>
            <select 
              value={totalLayers} 
              onChange={(e) => setTotalLayers(Number(e.target.value))}
              className="text-sm border rounded px-2 py-1"
            >
              <option value={3}>3 Layers (Quick)</option>
              <option value={5}>5 Layers (Standard)</option>
              <option value={10}>10 Layers (Deep)</option>
              <option value={15}>15 Layers (Profound)</option>
              <option value={20}>20 Layers (Genius)</option>
              <option value={30}>30 Layers (Transcendent)</option>
            </select>
          </div>
          
          <Badge variant="outline" className="text-xs">
            <Clock className="w-3 h-3 mr-1" />
            ~{getEstimatedTime(totalLayers)} min
          </Badge>
        </div>
        
        <Badge 
          variant="secondary" 
          className={`text-xs ${totalLayers >= 20 ? 'bg-purple-100 text-purple-800' : totalLayers >= 10 ? 'bg-blue-100 text-blue-800' : ''}`}
        >
          {analysisType.type}
        </Badge>
      </div>

      {/* Analysis Type Description */}
      <div className="text-center text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <strong>{analysisType.type}:</strong> {analysisType.description}
        {totalLayers >= 20 && (
          <div className="mt-1 text-purple-600 font-medium">
            🚀 Breakthrough potential: High probability of transcendent insights
          </div>
        )}
      </div>
    </>
  );
};

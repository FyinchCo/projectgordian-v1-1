
interface Metrics {
  confidence: number;
  tensionPoints: number;
  breakthroughPotential: number;
  layersProcessed: number;
}

interface ResultsMetricsProps {
  metrics: Metrics;
}

export const ResultsMetrics = ({ metrics }: ResultsMetricsProps) => {
  return (
    <>
      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-blue-50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{metrics.confidence}%</div>
          <div className="text-xs text-gray-600">Confidence</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{metrics.tensionPoints}</div>
          <div className="text-xs text-gray-600">Tension Points</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{metrics.breakthroughPotential}%</div>
          <div className="text-xs text-gray-600">Breakthrough</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{metrics.layersProcessed}</div>
          <div className="text-xs text-gray-600">Layers</div>
        </div>
      </div>

      {/* Breakthrough indicator */}
      {metrics.breakthroughPotential >= 70 && (
        <div className="text-center p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border-2 border-purple-200">
          <div className="text-lg font-bold text-purple-800 mb-2">
            🚀 Breakthrough Analysis Achieved!
          </div>
          <p className="text-purple-700 text-sm">
            This analysis reached transcendent insights beyond conventional thinking.
          </p>
        </div>
      )}
    </>
  );
};

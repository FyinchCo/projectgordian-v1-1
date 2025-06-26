

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Eye, Download } from "lucide-react";

interface AnalysisResultsDisplayProps {
  jobResults: any;
  onClearResults: () => void;
}

export const AnalysisResultsDisplay = ({ jobResults, onClearResults }: AnalysisResultsDisplayProps) => {
  console.log('Displaying job results:', jobResults);
  console.log('Job results structure:', JSON.stringify(jobResults, null, 2));
  
  // Extract the actual synthesis from the results - prioritize the real analysis content
  const getSynthesis = () => {
    // First priority: Get the actual insight content from final_results
    if (jobResults?.final_results?.[0]?.full_results?.insight) {
      const insight = jobResults.final_results[0].full_results.insight;
      console.log('Found insight in final_results:', insight);
      return insight;
    }
    
    // Second priority: Direct insight from final_results
    if (jobResults?.final_results?.[0]?.synthesis) {
      console.log('Found synthesis in final_results');
      return jobResults.final_results[0].synthesis;
    }
    
    // Third priority: Look for compression formats with actual content
    if (jobResults?.final_results?.[0]?.full_results?.compressionFormats?.comprehensive) {
      const compressed = jobResults.final_results[0].full_results.compressionFormats.comprehensive;
      if (compressed && !compressed.includes('PROGRESSIVE GENIUS SYNTHESIS')) {
        console.log('Found comprehensive compression format');
        return compressed;
      }
    }
    
    // Fourth priority: Extract from layers if available
    if (jobResults?.final_results?.[0]?.full_results?.layers && Array.isArray(jobResults.final_results[0].full_results.layers)) {
      const layers = jobResults.final_results[0].full_results.layers;
      console.log('Extracting from layers:', layers.length);
      
      // Get the final layer's insight (most synthesized)
      const finalLayer = layers[layers.length - 1];
      if (finalLayer?.insight && !finalLayer.insight.includes('PROGRESSIVE GENIUS SYNTHESIS')) {
        return finalLayer.insight;
      }
      
      // Fallback: combine insights from all layers
      const layerInsights = layers
        .filter(layer => layer.insight && !layer.insight.includes('PROGRESSIVE GENIUS SYNTHESIS'))
        .map((layer: any, index: number) => `Layer ${index + 1}: ${layer.insight}`)
        .join('\n\n');
      
      if (layerInsights) {
        return layerInsights;
      }
    }
    
    // Fallback to any available insight that's not meta-commentary
    const fallbackInsight = jobResults?.insight || jobResults?.synthesis || jobResults?.full_results?.insight;
    if (fallbackInsight && !fallbackInsight.includes('PROGRESSIVE GENIUS SYNTHESIS')) {
      return fallbackInsight;
    }
    
    return "Analysis completed but the compressed insights were not properly extracted. The system processed your question but the synthesis extraction needs refinement.";
  };
  
  // Extract metrics
  const getMetrics = () => {
    const base = jobResults?.final_results?.[0] || jobResults?.full_results || jobResults || {};
    return {
      confidence: Math.round((base.confidence || 0.8) * 100),
      tensionPoints: base.tensionPoints || base.tension_points || 0,
      breakthroughPotential: base.breakthroughPotential || base.breakthrough_potential || 0,
      layersProcessed: base.processingDepth || base.layers?.length || 0
    };
  };
  
  const synthesis = getSynthesis();
  const metrics = getMetrics();
  
  return (
    <Card className="p-8 bg-white shadow-lg">
      <div className="space-y-6">
        <div className="text-center border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">Analysis Complete!</h2>
          <p className="text-gray-600">Your genius analysis has finished processing</p>
        </div>
        
        {/* Main Results */}
        <div className="prose max-w-none">
          <h3 className="text-xl font-semibold mb-4">Key Insights from Analysis</h3>
          <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
              {synthesis}
            </p>
          </div>
        </div>

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

        <div className="flex justify-center space-x-4 pt-6">
          <Button onClick={onClearResults} variant="outline" className="px-6">
            <RefreshCw className="w-4 h-4 mr-2" />
            Start New Analysis
          </Button>
        </div>
      </div>
    </Card>
  );
};


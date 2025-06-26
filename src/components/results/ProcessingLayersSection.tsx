
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Layers, TrendingUp, Brain } from "lucide-react";
import { deduplicateLayers } from "../processing/layerNormalizer";

interface ProcessingLayersSectionProps {
  layers?: Array<{
    layerNumber: number;
    circuitType: string;
    insight: string;
    confidence: number;
    tensionPoints: number;
    noveltyScore?: number;
    emergenceDetected?: boolean;
    tensionMetrics?: any;
    archetypeResponses: Array<{
      archetype: string;
      contribution: string;
    }>;
  }>;
}

export const ProcessingLayersSection = ({ layers }: ProcessingLayersSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!layers || layers.length === 0) {
    return null;
  }

  // Deduplicate and organize layers properly
  const cleanLayers = deduplicateLayers(layers);
  
  if (cleanLayers.length === 0) {
    return null;
  }

  // Calculate progression metrics
  const tensionProgression = cleanLayers.map(layer => layer.tensionPoints || 0);
  const confidenceProgression = cleanLayers.map(layer => Math.round((layer.confidence || 0) * 100));
  const avgTensionIncrease = tensionProgression.length > 1 
    ? (tensionProgression[tensionProgression.length - 1] - tensionProgression[0]) / (tensionProgression.length - 1)
    : 0;

  const finalLayer = cleanLayers[cleanLayers.length - 1];
  const hasBreakthrough = cleanLayers.some(layer => layer.emergenceDetected);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="p-8 bg-white border border-gray-300 shadow-zen">
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between text-left">
            <div className="flex items-center space-x-4">
              <Layers className="w-6 h-6 text-black" />
              <div>
                <h3 className="font-cormorant text-2xl font-normal text-black">
                  Cognitive Descent Analysis
                </h3>
                <div className="text-sm text-gray-600 font-inter mt-1">
                  {cleanLayers.length} layers processed • Tension escalation: {avgTensionIncrease > 0 ? '↗' : '→'} {avgTensionIncrease.toFixed(1)} pts/layer
                </div>
              </div>
            </div>
            {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
          </button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-8">
          <div className="space-y-6">
            {/* Processing Overview */}
            <div className="grid grid-cols-3 gap-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-black">{cleanLayers.length}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Actual Layers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-black">
                  {finalLayer?.tensionPoints || 0}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Final Tension</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-black">
                  {Math.round((finalLayer?.confidence || 0) * 100)}%
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Peak Confidence</div>
              </div>
            </div>

            {/* Tension Progression Visualization */}
            <div className="space-y-4">
              <h4 className="font-cormorant text-lg font-normal text-black">Tension Escalation Pattern</h4>
              <div className="flex items-end space-x-2 h-20 bg-gray-50 p-4 rounded-lg">
                {tensionProgression.map((tension, index) => (
                  <div key={index} className="flex flex-col items-center space-y-1 flex-1">
                    <div 
                      className="bg-black rounded-sm transition-all duration-300"
                      style={{ 
                        height: `${Math.max(8, (tension / Math.max(...tensionProgression, 1)) * 48)}px`,
                        width: '12px'
                      }}
                    ></div>
                    <div className="text-xs text-gray-500 font-mono">L{cleanLayers[index]?.layerNumber}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual Layer Analysis */}
            <div className="space-y-4">
              <h4 className="font-cormorant text-lg font-normal text-black">Layer-by-Layer Insights</h4>
              {cleanLayers.map((layer, index) => (
                <Card key={`layer-${layer.layerNumber}-${index}`} className="p-6 bg-white border border-gray-200">
                  <div className="space-y-4">
                    {/* Layer Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {layer.layerNumber}
                        </div>
                        <div>
                          <h5 className="font-cormorant text-lg font-normal text-black">
                            Layer {layer.layerNumber} Analysis
                          </h5>
                          <div className="text-xs text-gray-500 uppercase tracking-wider font-mono">
                            {layer.circuitType} processing
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-4 text-sm">
                        <div className="text-center">
                          <div className="font-mono font-bold text-black">{Math.round(layer.confidence * 100)}%</div>
                          <div className="text-xs text-gray-500">Confidence</div>
                        </div>
                        <div className="text-center">
                          <div className="font-mono font-bold text-black">{layer.tensionPoints}</div>
                          <div className="text-xs text-gray-500">Tension</div>
                        </div>
                        {layer.emergenceDetected && (
                          <div className="text-center">
                            <div className="text-sm text-purple-600">⚡</div>
                            <div className="text-xs text-purple-600">Emergence</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Layer Insight */}
                    <div className="space-y-3">
                      <div className="text-gray-800 font-inter leading-relaxed">
                        {layer.insight}
                      </div>
                      
                      {/* Archetype Contributions */}
                      {layer.archetypeResponses && layer.archetypeResponses.length > 0 && (
                        <details className="group">
                          <summary className="cursor-pointer text-sm text-gray-600 hover:text-black transition-colors">
                            <span className="group-open:hidden">Show archetype contributions ({layer.archetypeResponses.length})</span>
                            <span className="hidden group-open:inline">Hide archetype contributions</span>
                          </summary>
                          <div className="mt-3 space-y-2 pl-4 border-l-2 border-gray-200">
                            {layer.archetypeResponses.map((response, idx) => (
                              <div key={idx} className="text-sm">
                                <div className="font-medium text-gray-700">{response.archetype}:</div>
                                <div className="text-gray-600 mt-1">
                                  {response.contribution.substring(0, 200)}
                                  {response.contribution.length > 200 ? '...' : ''}
                                </div>
                              </div>
                            ))}
                          </div>
                        </details>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Breakthrough Detection */}
            {hasBreakthrough && (
              <Card className="p-6 bg-purple-50 border border-purple-200">
                <div className="flex items-center space-x-3">
                  <Brain className="w-6 h-6 text-purple-600" />
                  <div>
                    <h4 className="font-cormorant text-lg font-normal text-purple-900">
                      Breakthrough Synthesis Detected
                    </h4>
                    <div className="text-sm text-purple-700 font-inter mt-1">
                      Cognitive tension reached critical threshold, triggering emergent insight compression
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Layers } from "lucide-react";

interface Layer {
  layerNumber: number;
  circuitType: string;
  insight: string;
  confidence: number;
  tensionPoints: number;
  noveltyScore?: number;
  emergenceDetected?: boolean;
  archetypeResponses: Array<{
    archetype: string;
    contribution: string;
  }>;
  synthesis?: {
    insight?: string;
    confidence?: number;
    tensionPoints?: number;
    noveltyScore?: number;
    emergenceDetected?: boolean;
  };
}

interface ProcessingLayersSectionProps {
  layers: Layer[];
}

export const ProcessingLayersSection = ({ layers }: ProcessingLayersSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!layers || layers.length <= 1) return null;

  // Helper function to safely extract insight with fallbacks
  const getLayerInsight = (layer: Layer): string => {
    const insight = layer.insight || 
                   layer.synthesis?.insight || 
                   `Layer ${layer.layerNumber} processing completed`;
    
    console.log(`Layer ${layer.layerNumber} insight extraction:`, {
      hasDirectInsight: !!layer.insight,
      hasSynthesisInsight: !!layer.synthesis?.insight,
      finalInsight: insight.substring(0, 50) + '...'
    });
    
    return insight;
  };

  // Helper function to safely extract other properties
  const getLayerProperty = (layer: Layer, property: string, defaultValue: any) => {
    return layer[property] !== undefined ? layer[property] : 
           layer.synthesis?.[property] !== undefined ? layer.synthesis[property] : 
           defaultValue;
  };

  // Validate that layers have unique content
  const layersWithUniqueContent = layers.filter((layer, index) => {
    const insight = getLayerInsight(layer);
    const isUnique = index === 0 || layers.slice(0, index).every(prevLayer => 
      getLayerInsight(prevLayer) !== insight
    );
    
    if (!isUnique) {
      console.warn(`Layer ${layer.layerNumber} has duplicate content - this indicates a processing issue`);
    }
    
    return true; // Show all layers but log duplicates
  });

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="p-6">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full flex items-center justify-between p-0 h-auto">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5" />
              <h3 className="font-bold text-lg">PROCESSING LAYERS</h3>
              <Badge variant="outline" className="text-xs">
                {layersWithUniqueContent.length} layers
              </Badge>
            </div>
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-6">
          <div className="space-y-4">
            {layersWithUniqueContent.map((layer, index) => {
              const insight = getLayerInsight(layer);
              const confidence = getLayerProperty(layer, 'confidence', 0.5);
              const tensionPoints = getLayerProperty(layer, 'tensionPoints', 3);
              const noveltyScore = getLayerProperty(layer, 'noveltyScore', null);
              const emergenceDetected = getLayerProperty(layer, 'emergenceDetected', false);
              
              // Check if this layer has identical metrics to others (indicating a processing issue)
              const hasIdenticalMetrics = index > 0 && layersWithUniqueContent.slice(0, index).some(prevLayer => 
                getLayerProperty(prevLayer, 'confidence', 0.5) === confidence &&
                getLayerProperty(prevLayer, 'tensionPoints', 3) === tensionPoints &&
                getLayerProperty(prevLayer, 'noveltyScore', null) === noveltyScore
              );
              
              return (
                <Card key={index} className={`p-4 ${hasIdenticalMetrics ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50'}`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm uppercase tracking-wide text-gray-700">
                        Layer {layer.layerNumber} - {layer.circuitType || 'sequential'}
                        {hasIdenticalMetrics && (
                          <span className="ml-2 text-xs text-yellow-600 font-normal">⚠️ Duplicate metrics detected</span>
                        )}
                      </h4>
                      <div className="flex space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {Math.round(confidence * 100)}% confidence
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {tensionPoints} tensions
                        </Badge>
                        {noveltyScore !== null && noveltyScore !== undefined && (
                          <Badge variant="outline" className="text-xs">
                            {noveltyScore}/10 novelty
                          </Badge>
                        )}
                        {emergenceDetected && (
                          <Badge className="text-xs bg-purple-100 text-purple-800">
                            Emergence
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-800 leading-relaxed">{insight}</p>
                    
                    {layer.archetypeResponses && layer.archetypeResponses.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-2">Contributing Archetypes:</p>
                        <div className="flex flex-wrap gap-1">
                          {layer.archetypeResponses.map((response, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {response.archetype}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};


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
}

interface ProcessingLayersSectionProps {
  layers: Layer[];
}

export const ProcessingLayersSection = ({ layers }: ProcessingLayersSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!layers || layers.length <= 1) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="p-6">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full flex items-center justify-between p-0 h-auto">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5" />
              <h3 className="font-bold text-lg">PROCESSING LAYERS</h3>
            </div>
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-6">
          <div className="space-y-4">
            {layers.map((layer, index) => (
              <Card key={index} className="p-4 bg-gray-50">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm uppercase tracking-wide text-gray-700">
                      Layer {layer.layerNumber} - {layer.circuitType}
                    </h4>
                    <div className="flex space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {Math.round(layer.confidence * 100)}% confidence
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {layer.tensionPoints} tensions
                      </Badge>
                      {layer.noveltyScore !== undefined && (
                        <Badge variant="outline" className="text-xs">
                          {layer.noveltyScore}/10 novelty
                        </Badge>
                      )}
                      {layer.emergenceDetected && (
                        <Badge className="text-xs bg-purple-100 text-purple-800">
                          Emergence
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-800">{layer.insight}</p>
                </div>
              </Card>
            ))}
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};


import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, Target } from "lucide-react";

interface EnhancedProcessingControlsProps {
  processingDepth: number[];
  onProcessingDepthChange: (value: number[]) => void;
  circuitType: string;
  onCircuitTypeChange: (value: string) => void;
  enhancedMode: boolean;
  onEnhancedModeChange: (value: boolean) => void;
}

export const EnhancedProcessingControls = ({
  processingDepth,
  onProcessingDepthChange,
  circuitType,
  onCircuitTypeChange,
  enhancedMode,
  onEnhancedModeChange
}: EnhancedProcessingControlsProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-bold">PROCESSING CONFIGURATION</h3>
          <p className="text-sm text-gray-600">Configure the cognitive analysis parameters</p>
        </div>

        {/* Enhanced Mode Toggle */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
          <div className="flex items-center space-x-3">
            <Brain className="w-5 h-5 text-purple-600" />
            <div>
              <Label htmlFor="enhanced-mode" className="text-sm font-semibold">
                Enhanced Cognitive Disruption
              </Label>
              <p className="text-xs text-gray-600 mt-1">
                Enables assumption interrogation, dialectical tension, and emergence detection
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="enhanced-mode"
              checked={enhancedMode}
              onCheckedChange={onEnhancedModeChange}
            />
            {enhancedMode && (
              <Badge className="bg-purple-100 text-purple-800">
                <Zap className="w-3 h-3 mr-1" />
                ACTIVE
              </Badge>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Processing Depth */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <Label>Processing Depth</Label>
              <Badge variant="outline">{processingDepth[0]} layer{processingDepth[0] > 1 ? 's' : ''}</Badge>
            </div>
            <Slider
              value={processingDepth}
              onValueChange={onProcessingDepthChange}
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="text-xs text-gray-500">
              Higher depth creates more refined insights through iterative processing
              {enhancedMode && " with enhanced tension detection"}
            </div>
          </div>

          {/* Circuit Type */}
          <div className="space-y-3">
            <Label>Processing Circuit</Label>
            <Select value={circuitType} onValueChange={onCircuitTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sequential">
                  Sequential
                  <span className="text-xs text-gray-500 ml-2">
                    - Ordered processing, builds context
                  </span>
                </SelectItem>
                <SelectItem value="parallel">
                  Parallel
                  <span className="text-xs text-gray-500 ml-2">
                    - Simultaneous analysis, faster results
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="text-xs text-gray-500">
              {circuitType === 'sequential' 
                ? 'Archetypes process sequentially, building on each other\'s insights'
                : 'All archetypes analyze simultaneously for independent perspectives'
              }
              {enhancedMode && circuitType === 'sequential' && (
                <span className="text-purple-600 block mt-1">
                  Enhanced mode adds dialectical injection for increased tension
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Mode Features */}
        {enhancedMode && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <h4 className="font-semibold text-blue-800 mb-2">Enhanced Mode Features Active:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Assumption Interrogation - Challenges hidden premises</li>
              <li>• Dialectical Tension Engine - Forces uncomfortable contradictions</li>
              <li>• Emergence Detection - Identifies genuine breakthrough moments</li>
              <li>• Novelty Scoring - Measures cognitive disruption achieved</li>
              <li>• Consensus Risk Analysis - Prevents groupthink convergence</li>
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};

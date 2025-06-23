
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Layers, Zap, RotateCcw, GitBranch, Brain } from "lucide-react";

interface EnhancedProcessingControlsProps {
  processingDepth: number[];
  onProcessingDepthChange: (value: number[]) => void;
  circuitType: string;
  onCircuitTypeChange: (value: string) => void;
  enhancedMode: boolean;
  onEnhancedModeChange: (value: boolean) => void;
}

const circuitTypes = [
  { value: "sequential", label: "Sequential", icon: Layers, description: "Process agents one after another" },
  { value: "parallel", label: "Parallel", icon: GitBranch, description: "Process all agents simultaneously" },
  { value: "recursive", label: "Recursive", icon: RotateCcw, description: "Agents review and refine iteratively" },
  { value: "hybrid", label: "Hybrid", icon: Zap, description: "Combine sequential and parallel approaches" }
];

export const EnhancedProcessingControls = ({ 
  processingDepth, 
  onProcessingDepthChange, 
  circuitType, 
  onCircuitTypeChange,
  enhancedMode,
  onEnhancedModeChange
}: EnhancedProcessingControlsProps) => {
  const selectedCircuit = circuitTypes.find(ct => ct.value === circuitType);
  const IconComponent = selectedCircuit?.icon || Layers;

  const getDepthDescription = (depth: number) => {
    if (depth <= 2) return "Quick analysis with basic refinement";
    if (depth <= 5) return "Deep analysis with iterative refinement";
    if (depth <= 10) return "Comprehensive multi-layer analysis";
    return "Maximum depth analysis - experimental territory";
  };

  const getDepthWarning = (depth: number) => {
    if (depth >= 10) return "⚠️ High-depth processing may take significantly longer";
    return null;
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-gray-50 to-blue-50">
      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <span>ENHANCED PROCESSING CONFIGURATION</span>
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Processing Depth */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-semibold">Processing Depth</Label>
              <span className="text-sm text-gray-500 font-mono">
                {processingDepth[0]} {processingDepth[0] === 1 ? 'Layer' : 'Layers'}
              </span>
            </div>
            <Slider
              value={processingDepth}
              onValueChange={onProcessingDepthChange}
              max={20}
              min={1}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-gray-600">
              {getDepthDescription(processingDepth[0])}
            </p>
            {getDepthWarning(processingDepth[0]) && (
              <p className="text-xs text-amber-600 font-medium">
                {getDepthWarning(processingDepth[0])}
              </p>
            )}
          </div>

          {/* Circuit Type */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Circuit Type</Label>
            <Select value={circuitType} onValueChange={onCircuitTypeChange}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  <div className="flex items-center space-x-2">
                    <IconComponent className="w-4 h-4" />
                    <span>{selectedCircuit?.label}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {circuitTypes.map((circuit) => {
                  const Icon = circuit.icon;
                  return (
                    <SelectItem key={circuit.value} value={circuit.value}>
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{circuit.label}</div>
                          <div className="text-xs text-gray-500">{circuit.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Enhanced Mode Toggle */}
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
          <div className="space-y-1">
            <Label className="text-sm font-semibold">Enhanced Mode</Label>
            <p className="text-xs text-gray-600">
              Enables assumption challenging, tension analysis, and emergence detection
            </p>
          </div>
          <Switch
            checked={enhancedMode}
            onCheckedChange={onEnhancedModeChange}
          />
        </div>

        {/* Quick Depth Presets */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-gray-600">QUICK PRESETS</Label>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 5, 10, 20].map((depth) => (
              <button
                key={depth}
                onClick={() => onProcessingDepthChange([depth])}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  processingDepth[0] === depth
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {depth} Layer{depth > 1 ? 's' : ''}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

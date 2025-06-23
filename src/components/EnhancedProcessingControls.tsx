
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ProcessingModeSelector } from "@/components/ProcessingModeSelector";
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

// Processing mode mappings
const getProcessingModeFromDepth = (depth: number): string => {
  if (depth <= 8) return "standard";
  if (depth <= 20) return "deep";
  return "experimental";
};

const getRecommendedDepthForMode = (mode: string): number => {
  switch (mode) {
    case "standard": return 5;
    case "deep": return 16;
    case "experimental": return 25;
    default: return 5;
  }
};

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

  const currentMode = getProcessingModeFromDepth(processingDepth[0]);
  const customDepth = processingDepth[0];

  const handleModeChange = (mode: string) => {
    const recommendedDepth = getRecommendedDepthForMode(mode);
    onProcessingDepthChange([recommendedDepth]);
  };

  const handleCustomDepthChange = (depth: number) => {
    onProcessingDepthChange([depth]);
  };

  return (
    <div className="space-y-6">
      {/* Processing Mode Selector */}
      <ProcessingModeSelector
        selectedMode={currentMode}
        onModeChange={handleModeChange}
        customDepth={customDepth}
        onCustomDepthChange={handleCustomDepthChange}
      />

      {/* Circuit Configuration */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <span>CIRCUIT CONFIGURATION</span>
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
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

            {/* Enhanced Mode Toggle */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Enhanced Analysis</Label>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Enhanced Mode</div>
                  <p className="text-xs text-gray-600">
                    Assumption challenging, tension analysis, emergence detection
                  </p>
                </div>
                <Switch
                  checked={enhancedMode}
                  onCheckedChange={onEnhancedModeChange}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

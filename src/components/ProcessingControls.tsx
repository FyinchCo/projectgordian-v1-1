
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layers, Zap, RotateCcw, GitBranch } from "lucide-react";

interface ProcessingControlsProps {
  processingDepth: number[];
  onProcessingDepthChange: (value: number[]) => void;
  circuitType: string;
  onCircuitTypeChange: (value: string) => void;
}

const circuitTypes = [
  { value: "sequential", label: "Sequential", icon: Layers, description: "Process agents one after another" },
  { value: "parallel", label: "Parallel", icon: GitBranch, description: "Process all agents simultaneously" },
  { value: "recursive", label: "Recursive", icon: RotateCcw, description: "Agents review and refine iteratively" },
  { value: "hybrid", label: "Hybrid", icon: Zap, description: "Combine sequential and parallel approaches" }
];

export const ProcessingControls = ({ 
  processingDepth, 
  onProcessingDepthChange, 
  circuitType, 
  onCircuitTypeChange 
}: ProcessingControlsProps) => {
  const selectedCircuit = circuitTypes.find(ct => ct.value === circuitType);
  const IconComponent = selectedCircuit?.icon || Layers;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
            <Layers className="w-5 h-5" />
            <span>PROCESSING CONFIGURATION</span>
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
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Higher depth allows for more iterative refinement and deeper analysis
            </p>
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
      </div>
    </Card>
  );
};

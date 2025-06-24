
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

interface ManualSetupTabProps {
  processingDepth: number[];
  setProcessingDepth: (depth: number[]) => void;
  circuitType: string;
  setCircuitType: (type: string) => void;
  enhancedMode: boolean;
  setEnhancedMode: (enabled: boolean) => void;
  customArchetypes: any;
}

export const ManualSetupTab = ({
  processingDepth,
  setProcessingDepth,
  circuitType,
  setCircuitType,
  enhancedMode,
  setEnhancedMode,
  customArchetypes
}: ManualSetupTabProps) => {
  const getDepthLabel = (depth: number) => {
    if (depth <= 5) return "Quick Analysis";
    if (depth <= 10) return "Deep Analysis";
    return "Ultra-Deep Analysis";
  };

  const getDepthDescription = (depth: number) => {
    if (depth <= 5) return "Fast processing, good for straightforward questions";
    if (depth <= 10) return "Thorough analysis, recommended for complex problems";
    return "Maximum depth, for the most challenging questions";
  };

  return (
    <div className="space-y-4">
      {/* Processing Depth */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="font-mono uppercase tracking-wide text-sm">Processing Depth</Label>
          <Badge variant="outline" className="font-mono text-xs">
            {processingDepth[0]} layers - {getDepthLabel(processingDepth[0])}
          </Badge>
        </div>
        <Slider
          value={processingDepth}
          onValueChange={setProcessingDepth}
          max={20}
          min={1}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-mono-medium-gray font-mono">
          <span>1 (Fast)</span>
          <span>10 (Balanced)</span>
          <span>20 (Maximum)</span>
        </div>
        <p className="text-xs text-mono-dark-gray font-inter">
          {getDepthDescription(processingDepth[0])}
        </p>
      </div>

      {/* Circuit Type */}
      <div className="space-y-2">
        <Label className="font-mono uppercase tracking-wide text-sm">Circuit Type</Label>
        <Select value={circuitType} onValueChange={setCircuitType}>
          <SelectTrigger className="border-2 border-mono-pure-black text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sequential" className="text-sm">Sequential - Archetypes build on each other</SelectItem>
            <SelectItem value="parallel" className="text-sm">Parallel - All archetypes think simultaneously</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Enhanced Mode */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="font-mono uppercase tracking-wide text-sm">Enhanced Mode</Label>
          <p className="text-xs text-mono-dark-gray">Assumption analysis and dialectical tension</p>
        </div>
        <Switch
          checked={enhancedMode}
          onCheckedChange={setEnhancedMode}
        />
      </div>

      {/* Archetype Status */}
      {customArchetypes && (
        <div className="space-y-1">
          <Label className="font-mono uppercase tracking-wide text-sm">Custom Archetypes</Label>
          <div className="flex items-center space-x-2">
            <Users className="w-3 h-3" />
            <span className="text-xs text-mono-dark-gray">
              {customArchetypes.length} custom archetypes loaded
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

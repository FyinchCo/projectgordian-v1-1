
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Brain } from "lucide-react";

interface ProcessingConfigurationSectionProps {
  processingDepth: number[];
  setProcessingDepth: (depth: number[]) => void;
  circuitType: string;
  setCircuitType: (type: string) => void;
  enhancedMode: boolean;
  setEnhancedMode: (enabled: boolean) => void;
  customArchetypes: any;
  learningInsights: any;
}

export const ProcessingConfigurationSection = ({
  processingDepth,
  setProcessingDepth,
  circuitType,
  setCircuitType,
  enhancedMode,
  setEnhancedMode,
  customArchetypes,
  learningInsights
}: ProcessingConfigurationSectionProps) => {
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
    <div className="pt-6 space-zen border-t border-zen-light">
      <h3 className="text-zen-mono text-sm uppercase tracking-wide text-zen-ink mb-6">Processing Configuration</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-zen-mono text-sm uppercase tracking-wide text-zen-charcoal">Processing Depth</Label>
          <Badge variant="outline" className="text-zen-mono text-xs border-zen-medium text-zen-charcoal">
            {processingDepth[0]} layers — {getDepthLabel(processingDepth[0])}
          </Badge>
        </div>
        <Slider value={processingDepth} onValueChange={setProcessingDepth} max={20} min={1} step={1} className="w-full" />
        <div className="flex justify-between text-xs text-zen-mono text-zen-medium">
          <span>1 (Fast)</span>
          <span>10 (Balanced)</span>
          <span>20 (Maximum)</span>
        </div>
        <p className="text-xs text-zen-body text-zen-medium leading-relaxed">
          {getDepthDescription(processingDepth[0])}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-8">
        <div className="md:col-span-3 space-y-3">
          <Label className="text-zen-mono text-sm uppercase tracking-wide text-zen-charcoal">Circuit Type</Label>
          <Select value={circuitType} onValueChange={setCircuitType}>
            <SelectTrigger className="border border-zen-light bg-zen-paper text-sm rounded-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zen-paper border border-zen-light shadow-zen-lg">
              <SelectItem value="sequential" className="text-sm">Sequential — Build on each other</SelectItem>
              <SelectItem value="parallel" className="text-sm">Parallel — Think simultaneously</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-zen-mono text-sm uppercase tracking-wide text-zen-charcoal">Enhanced Mode</Label>
              <p className="text-xs text-zen-body text-zen-medium mt-1">Dialectical tension</p>
            </div>
            <Switch checked={enhancedMode} onCheckedChange={setEnhancedMode} />
          </div>
        </div>
      </div>

      {customArchetypes && (
        <div className="space-y-2 mt-6">
          <Label className="text-zen-mono text-sm uppercase tracking-wide text-zen-charcoal">Custom Archetypes</Label>
          <div className="flex items-center space-x-3">
            <Users className="w-4 h-4 text-zen-medium" />
            <span className="text-xs text-zen-body text-zen-medium">
              {customArchetypes.length} custom archetypes loaded
            </span>
          </div>
        </div>
      )}

      {learningInsights?.isSystemLearning && (
        <div className="space-y-2 mt-6">
          <Label className="text-zen-mono text-sm uppercase tracking-wide text-zen-charcoal">Learning System</Label>
          <div className="flex items-center space-x-3">
            <Brain className="w-4 h-4 text-purple-500" />
            <span className="text-xs text-zen-body text-zen-medium">
              Active - Continuously improving based on results
            </span>
            {learningInsights.isImproving && (
              <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                Improving
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

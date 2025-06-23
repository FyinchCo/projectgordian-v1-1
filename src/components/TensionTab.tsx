
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface TensionSettings {
  contradictionThreshold: number[];
  recursionDepth: number[];
  archetypeOverlap: number[];
}

interface TensionTabProps {
  tensionSettings: TensionSettings;
  onUpdateTensionSettings: (field: string, value: number[]) => void;
}

export const TensionTab = ({ tensionSettings, onUpdateTensionSettings }: TensionTabProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">TENSION DETECTION</h2>
        <p className="text-gray-600">Configure when the system detects breakthrough moments</p>
      </div>

      <Card className="p-8 max-w-2xl mx-auto">
        <div className="space-y-8">
          <div>
            <div className="flex justify-between mb-3">
              <Label className="text-base">Contradiction Frequency</Label>
              <span className="text-sm text-gray-500">{tensionSettings.contradictionThreshold[0]}/10</span>
            </div>
            <Slider
              value={tensionSettings.contradictionThreshold}
              onValueChange={(value) => onUpdateTensionSettings('contradictionThreshold', value)}
              max={10}
              step={1}
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-2">How sensitive the system is to contradictory viewpoints</p>
          </div>

          <div>
            <div className="flex justify-between mb-3">
              <Label className="text-base">Recursion Depth</Label>
              <span className="text-sm text-gray-500">{tensionSettings.recursionDepth[0]} layers</span>
            </div>
            <Slider
              value={tensionSettings.recursionDepth}
              onValueChange={(value) => onUpdateTensionSettings('recursionDepth', value)}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-2">Minimum number of archetype layers before triggering analysis</p>
          </div>

          <div>
            <div className="flex justify-between mb-3">
              <Label className="text-base">Archetype Overlap Required</Label>
              <span className="text-sm text-gray-500">{tensionSettings.archetypeOverlap[0]} agents</span>
            </div>
            <Slider
              value={tensionSettings.archetypeOverlap}
              onValueChange={(value) => onUpdateTensionSettings('archetypeOverlap', value)}
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-2">Number of agents that must agree before signaling tension</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

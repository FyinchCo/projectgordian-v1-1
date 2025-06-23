
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, Rocket, Clock, Target, Sparkles } from "lucide-react";

interface ProcessingMode {
  id: string;
  name: string;
  description: string;
  depthRange: [number, number];
  recommendedDepth: number;
  icon: React.ComponentType<any>;
  color: string;
  expectedOutcome: string;
  cognitiveStage: string;
  estimatedTime: string;
}

const processingModes: ProcessingMode[] = [
  {
    id: "standard",
    name: "Standard Analysis",
    description: "Quick, high-quality insights with dialectical resolution",
    depthRange: [3, 8],
    recommendedDepth: 5,
    icon: Brain,
    color: "bg-blue-50 border-blue-200 text-blue-800",
    expectedOutcome: "Strong Insight",
    cognitiveStage: "Thesis + Antithesis → Resolution",
    estimatedTime: "1-2 minutes"
  },
  {
    id: "deep",
    name: "Deep Synthesis",
    description: "Genius-level attempts for complex philosophical problems",
    depthRange: [12, 20],
    recommendedDepth: 16,
    icon: Zap,
    color: "bg-purple-50 border-purple-200 text-purple-800",
    expectedOutcome: "Profound Breakthrough",
    cognitiveStage: "Recursive Inquiry → Emergent Synthesis",
    estimatedTime: "3-5 minutes"
  },
  {
    id: "experimental",
    name: "Experimental Depth",
    description: "Maximum cognitive processing for ultimate insight refinement",
    depthRange: [20, 30],
    recommendedDepth: 25,
    icon: Rocket,
    color: "bg-amber-50 border-amber-200 text-amber-800",
    expectedOutcome: "Transcendent Insight",
    cognitiveStage: "Recursive Synthesis → Cognitive Alchemy",
    estimatedTime: "5-8 minutes"
  }
];

interface ProcessingModeSelectorProps {
  selectedMode: string;
  onModeChange: (mode: string) => void;
  customDepth?: number;
  onCustomDepthChange?: (depth: number) => void;
}

export const ProcessingModeSelector = ({ 
  selectedMode, 
  onModeChange,
  customDepth,
  onCustomDepthChange
}: ProcessingModeSelectorProps) => {
  const currentMode = processingModes.find(mode => mode.id === selectedMode) || processingModes[0];

  return (
    <Card className="p-6 bg-gradient-to-r from-gray-50 to-blue-50">
      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-lg mb-2 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span>COGNITIVE PROCESSING MODE</span>
          </h3>
          <p className="text-sm text-gray-600">
            Select the depth of cognitive analysis based on your question's complexity
          </p>
        </div>

        {/* Mode Selection */}
        <ToggleGroup 
          type="single" 
          value={selectedMode} 
          onValueChange={onModeChange}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {processingModes.map((mode) => {
            const IconComponent = mode.icon;
            const isSelected = selectedMode === mode.id;
            
            return (
              <ToggleGroupItem 
                key={mode.id} 
                value={mode.id}
                className={`h-auto p-0 data-[state=on]:bg-transparent`}
              >
                <Card className={`p-4 w-full transition-all cursor-pointer hover:shadow-md ${
                  isSelected 
                    ? `${mode.color} border-2 shadow-md` 
                    : 'bg-white border hover:border-gray-300'
                }`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="w-5 h-5" />
                        <span className="font-semibold text-sm">{mode.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {mode.recommendedDepth} layers
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {mode.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-1 text-xs">
                        <Target className="w-3 h-3" />
                        <span className="font-medium">{mode.expectedOutcome}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{mode.estimatedTime}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>

        {/* Selected Mode Details */}
        <Card className={`p-4 ${currentMode.color}`}>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Selected: {currentMode.name}</h4>
              <Badge variant="outline" className="text-xs">
                {currentMode.depthRange[0]}-{currentMode.depthRange[1]} layers
              </Badge>
            </div>
            <div className="text-sm">
              <div className="font-medium">Cognitive Process:</div>
              <div className="text-xs opacity-80">{currentMode.cognitiveStage}</div>
            </div>
            {customDepth && customDepth !== currentMode.recommendedDepth && (
              <div className="text-xs opacity-80">
                Custom depth: {customDepth} layers
              </div>
            )}
          </div>
        </Card>

        {/* Advanced Options */}
        {onCustomDepthChange && (
          <details className="text-sm">
            <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
              Advanced: Custom Depth Override
            </summary>
            <div className="mt-3 p-3 bg-white rounded border">
              <Label className="text-xs">Custom Processing Depth</Label>
              <input
                type="number"
                min={1}
                max={30}
                value={customDepth || currentMode.recommendedDepth}
                onChange={(e) => onCustomDepthChange(parseInt(e.target.value) || currentMode.recommendedDepth)}
                className="w-full mt-1 px-2 py-1 border rounded text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Override the recommended depth for this mode
              </p>
            </div>
          </details>
        )}
      </div>
    </Card>
  );
};


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
    color: "border-mono-pure-black bg-mono-pure-white",
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
    color: "border-mono-pure-black bg-mono-pure-white",
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
    color: "border-mono-pure-black bg-mono-pure-white",
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
    <div className="border-4 border-mono-pure-black bg-mono-pure-white shadow-2xl">
      <div className="p-4 space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-cormorant font-bold tracking-tight text-mono-pure-black uppercase mb-2">
            COGNITIVE PROCESSING MODE
          </h3>
          <p className="text-sm font-inter text-mono-dark-gray leading-relaxed">
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
                className="h-auto p-0 data-[state=on]:bg-transparent"
              >
                <div className={`p-4 w-full transition-all cursor-pointer border-2 ${
                  isSelected 
                    ? 'border-mono-pure-black bg-mono-pure-black text-mono-pure-white shadow-lg' 
                    : 'border-mono-pure-black bg-mono-pure-white text-mono-pure-black hover:bg-mono-light-gray'
                }`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="w-5 h-5" />
                        <span className="font-mono font-bold text-sm uppercase tracking-wide">{mode.name}</span>
                      </div>
                      <div className={`px-2 py-1 text-xs font-mono uppercase border ${
                        isSelected 
                          ? 'border-mono-pure-white text-mono-pure-white' 
                          : 'border-mono-pure-black text-mono-pure-black'
                      }`}>
                        {mode.recommendedDepth} layers
                      </div>
                    </div>
                    
                    <p className="text-xs font-inter leading-relaxed">
                      {mode.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-1 text-xs">
                        <Target className="w-3 h-3" />
                        <span className="font-mono font-medium uppercase">{mode.expectedOutcome}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs">
                        <Clock className="w-3 h-3" />
                        <span className="font-mono">{mode.estimatedTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>

        {/* Selected Mode Details */}
        <div className="border-2 border-mono-pure-black bg-mono-light-gray p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-mono font-bold text-mono-pure-black uppercase tracking-wide">Selected: {currentMode.name}</h4>
              <div className="px-2 py-1 text-xs font-mono uppercase border border-mono-pure-black bg-mono-pure-white text-mono-pure-black">
                {currentMode.depthRange[0]}-{currentMode.depthRange[1]} layers
              </div>
            </div>
            <div className="text-sm">
              <div className="font-mono font-medium text-mono-pure-black uppercase tracking-wide">Cognitive Process:</div>
              <div className="text-xs font-inter text-mono-dark-gray">{currentMode.cognitiveStage}</div>
            </div>
            {customDepth && customDepth !== currentMode.recommendedDepth && (
              <div className="text-xs font-mono text-mono-pure-black bg-mono-pure-white inline-block px-2 py-1 border border-mono-pure-black uppercase tracking-wide">
                Custom depth: {customDepth} layers
              </div>
            )}
          </div>
        </div>

        {/* Advanced Options */}
        {onCustomDepthChange && (
          <details className="text-sm">
            <summary className="cursor-pointer font-mono text-mono-pure-black hover:text-mono-charcoal uppercase tracking-wide">
              Advanced: Custom Depth Override
            </summary>
            <div className="mt-3 p-3 border-2 border-mono-pure-black bg-mono-pure-white">
              <Label className="text-xs font-mono text-mono-pure-black uppercase tracking-wide">Custom Processing Depth</Label>
              <input
                type="number"
                min={1}
                max={30}
                value={customDepth || currentMode.recommendedDepth}
                onChange={(e) => onCustomDepthChange(parseInt(e.target.value) || currentMode.recommendedDepth)}
                className="w-full mt-1 px-2 py-1 border-2 border-mono-pure-black text-sm font-mono bg-mono-pure-white text-mono-pure-black focus:outline-none focus:ring-0"
              />
              <p className="text-xs font-inter text-mono-dark-gray mt-1">
                Override the recommended depth for this mode
              </p>
            </div>
          </details>
        )}
      </div>
    </div>
  );
};

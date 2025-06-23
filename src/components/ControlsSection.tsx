
import { EnhancedProcessingControls } from "@/components/EnhancedProcessingControls";
import { ProcessingDepthWarning } from "@/components/ProcessingDepthWarning";

interface ControlsSectionProps {
  processingDepth: number[];
  onProcessingDepthChange: (value: number[]) => void;
  circuitType: string;
  onCircuitTypeChange: (value: string) => void;
  enhancedMode: boolean;
  onEnhancedModeChange: (value: boolean) => void;
}

export const ControlsSection = ({
  processingDepth,
  onProcessingDepthChange,
  circuitType,
  onCircuitTypeChange,
  enhancedMode,
  onEnhancedModeChange
}: ControlsSectionProps) => {
  return (
    <div className="space-y-8">
      <ProcessingDepthWarning depth={processingDepth[0]} />
      
      <EnhancedProcessingControls
        processingDepth={processingDepth}
        onProcessingDepthChange={onProcessingDepthChange}
        circuitType={circuitType}
        onCircuitTypeChange={onCircuitTypeChange}
        enhancedMode={enhancedMode}
        onEnhancedModeChange={onEnhancedModeChange}
      />
    </div>
  );
};

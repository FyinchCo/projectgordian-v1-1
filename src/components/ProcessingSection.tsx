
import { ProcessingDisplay } from "@/components/ProcessingDisplay";

interface ProcessingSectionProps {
  currentArchetype: string;
  question: string;
  currentLayer: number;
  processingDepth: number[];
  circuitType: string;
  chunkProgress?: { current: number; total: number };
  processingPhase?: string;
}

export const ProcessingSection = ({ 
  currentArchetype, 
  question, 
  currentLayer, 
  processingDepth, 
  circuitType,
  chunkProgress,
  processingPhase
}: ProcessingSectionProps) => {
  return (
    <ProcessingDisplay 
      currentArchetype={currentArchetype}
      question={question}
      currentLayer={currentLayer}
      totalLayers={processingDepth[0]}
      circuitType={circuitType}
      chunkProgress={chunkProgress}
      processingPhase={processingPhase}
    />
  );
};

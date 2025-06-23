
import { ProcessingDisplay } from "@/components/ProcessingDisplay";

interface ProcessingSectionProps {
  currentArchetype: string;
  question: string;
  currentLayer: number;
  processingDepth: number[];
  circuitType: string;
}

export const ProcessingSection = ({ 
  currentArchetype, 
  question, 
  currentLayer, 
  processingDepth, 
  circuitType 
}: ProcessingSectionProps) => {
  return (
    <ProcessingDisplay 
      currentArchetype={currentArchetype}
      question={question}
      currentLayer={currentLayer}
      totalLayers={processingDepth[0]}
      circuitType={circuitType}
    />
  );
};

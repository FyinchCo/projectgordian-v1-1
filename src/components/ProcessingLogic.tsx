
import { useToast } from "@/hooks/use-toast";
import { useProcessingExecutor } from "./processing/processingExecutor";

interface ProcessingLogicProps {
  question: string;
  processingDepth: number[];
  customArchetypes: any;
  onProcessingStart: () => void;
  onProcessingComplete: (results: any) => void;
  onProcessingError: () => void;
  onCurrentArchetypeChange: (archetype: string) => void;
  onCurrentLayerChange: (layer: number) => void;
  onChunkProgressChange: (progress: { current: number; total: number }) => void;
  onProcessingPhaseChange?: (phase: string) => void;
}

export const ProcessingLogic = ({
  question,
  customArchetypes,
  onProcessingStart,
  onProcessingComplete,
  onProcessingError,
  onCurrentArchetypeChange,
  onCurrentLayerChange,
  onChunkProgressChange,
  onProcessingPhaseChange
}: ProcessingLogicProps) => {
  const { toast } = useToast();
  const { executeProcessing } = useProcessingExecutor();

  const handleStartGenius = async () => {
    if (!question.trim()) {
      toast({
        title: "Question Required",
        description: "Please enter a question to analyze.",
        variant: "destructive",
      });
      return;
    }
    
    console.log('=== STARTING REBUILT GENIUS ANALYSIS ===');
    console.log('Question:', question.trim().substring(0, 100) + '...');
    
    toast({
      title: "Starting Genius Analysis",
      description: "Processing your question with multiple AI perspectives...",
      variant: "default",
    });
    
    onProcessingStart();
    onCurrentLayerChange(1);
    onChunkProgressChange({ current: 0, total: 1 });
    
    if (onProcessingPhaseChange) {
      onProcessingPhaseChange('Initializing genius analysis...');
    }
    
    try {
      const finalResults = await executeProcessing({
        question,
        processingDepth: [1], // Simplified to single layer for now
        customArchetypes,
        onProcessingComplete,
        onCurrentLayerChange,
        onChunkProgressChange,
        onCurrentArchetypeChange,
        onProcessingPhaseChange
      });
      
      // Success feedback
      toast({
        title: "Analysis Complete",
        description: "Your genius analysis has finished successfully!",
        variant: "default",
      });
      
    } catch (error: any) {
      console.error('=== GENIUS PROCESSING ERROR ===');
      console.error('Error details:', error);
      
      const errorMessage = error?.message || 'Unknown error';
      
      toast({
        title: "Processing Error",
        description: `Analysis failed: ${errorMessage}`,
        variant: "destructive",
      });
      
      onProcessingError();
    } finally {
      console.log('=== GENIUS PROCESSING CLEANUP ===');
      onCurrentArchetypeChange("");
      onCurrentLayerChange(1);
      onChunkProgressChange({ current: 0, total: 0 });
      if (onProcessingPhaseChange) {
        onProcessingPhaseChange('Ready for next analysis');
      }
    }
  };

  return { handleStartGenius };
};

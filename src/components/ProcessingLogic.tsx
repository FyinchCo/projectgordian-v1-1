
import { useMetaLearning } from "@/hooks/useMetaLearning";
import { useToast } from "@/hooks/use-toast";
import { useProcessingExecutor } from "./processing/processingExecutor";

interface ProcessingLogicProps {
  question: string;
  processingDepth: number[];
  circuitType: string;
  enhancedMode: boolean;
  customArchetypes: any;
  currentAssessment: any;
  onProcessingStart: () => void;
  onProcessingComplete: (results: any) => void;
  onProcessingError: () => void;
  onCurrentArchetypeChange: (archetype: string) => void;
  onCurrentLayerChange: (layer: number) => void;
  onChunkProgressChange: (progress: { current: number; total: number }) => void;
}

export const ProcessingLogic = ({
  question,
  processingDepth,
  circuitType,
  enhancedMode,
  customArchetypes,
  currentAssessment,
  onProcessingStart,
  onProcessingComplete,
  onProcessingError,
  onCurrentArchetypeChange,
  onCurrentLayerChange,
  onChunkProgressChange
}: ProcessingLogicProps) => {
  const { toast } = useToast();
  const { executeProcessing } = useProcessingExecutor();
  const { recordProcessingResults } = useMetaLearning();

  const handleStartGenius = async () => {
    if (!question.trim()) {
      console.error('No question provided');
      return;
    }
    
    console.log('=== PROCESSING START ===');
    console.log('Configuration:', {
      question: question.trim().substring(0, 100) + '...',
      requestedDepth: processingDepth[0],
      circuitType,
      customArchetypes: customArchetypes ? customArchetypes.length : 0,
      enhancedMode
    });
    
    onProcessingStart();
    onCurrentLayerChange(1);
    onChunkProgressChange({ current: 0, total: 0 });
    
    try {
      const finalResults = await executeProcessing({
        question,
        processingDepth,
        circuitType,
        enhancedMode,
        customArchetypes,
        currentAssessment,
        onProcessingComplete,
        onCurrentLayerChange,
        onChunkProgressChange
      });
      
      // Handle meta-learning recording
      if (finalResults.questionQuality) {
        console.log('Recording learning cycle...');
        try {
          const assessment = currentAssessment || {
            complexityScore: processingDepth[0],
            domainType: "General",
            abstractionLevel: "Theoretical",
            controversyPotential: 5,
            noveltyRequirement: 5,
            stakeholderComplexity: 5,
            breakthroughPotential: finalResults.emergenceDetected ? 8 : 5,
            cognitiveComplexity: processingDepth[0]
          };
          
          const configuration = {
            processingDepth: processingDepth[0],
            circuitType,
            enhancedMode,
            archetypeConfigurations: currentAssessment?.archetypeConfigurations || [],
            tensionParameters: currentAssessment?.tensionParameters || {}
          };
          
          recordProcessingResults(
            question,
            assessment,
            configuration,
            finalResults,
            finalResults.questionQuality
          );
        } catch (learningError) {
          console.error('Failed to record learning data:', learningError);
        }
      }
      
    } catch (error: any) {
      console.error('=== PROCESSING ERROR ===');
      console.error('Error details:', error);
      
      let userTitle = "Processing Error";
      let userDescription = "Analysis encountered an issue. Please try again.";
      
      const errorMessage = error?.message || '';
      
      if (errorMessage.includes('timeout')) {
        userTitle = "Processing Timeout";
        userDescription = `Analysis took longer than expected. Try reducing processing depth or try again later.`;
      } else if (errorMessage.includes('error') || errorMessage.includes('failed')) {
        userTitle = "Connection Error";
        userDescription = "Unable to complete processing. Please check your connection and try again.";
      } else if (errorMessage.includes('No data')) {
        userTitle = "Processing Service Error";
        userDescription = "Processing service returned no data. Please try again.";
      }
      
      toast({
        title: userTitle,
        description: userDescription,
        variant: "destructive",
      });
      
      onProcessingError();
    } finally {
      console.log('=== PROCESSING CLEANUP ===');
      onCurrentArchetypeChange("");
      onCurrentLayerChange(1);
      onChunkProgressChange({ current: 0, total: 0 });
    }
  };

  return { handleStartGenius };
};


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
      toast({
        title: "Question Required",
        description: "Please enter a question to analyze.",
        variant: "destructive",
      });
      return;
    }
    
    // Load compression settings from localStorage
    const savedCompression = localStorage.getItem('genius-machine-compression');
    const compressionSettings = savedCompression ? JSON.parse(savedCompression) : {
      style: "insight-summary",
      length: "medium",
      includeTrail: true,
      includeFullTranscript: false,
      customInstructions: ""
    };
    
    console.log('=== RELIABLE PROCESSING START ===');
    console.log('Configuration:', {
      question: question.trim().substring(0, 100) + '...',
      requestedDepth: processingDepth[0],
      circuitType,
      customArchetypes: customArchetypes ? customArchetypes.length : 0,
      enhancedMode,
      compressionSettings
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
        compressionSettings,
        onProcessingComplete,
        onCurrentLayerChange,
        onChunkProgressChange
      });
      
      // Handle meta-learning recording with proper type checking
      if (finalResults && 'questionQuality' in finalResults && finalResults.questionQuality) {
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
      console.error('=== RELIABLE PROCESSING ERROR ===');
      console.error('Error details:', error);
      
      // Enhanced error handling with better user messages
      let userTitle = "Processing Error";
      let userDescription = "Analysis encountered an issue. The system has reliable fallbacks - please try again.";
      let variant: "default" | "destructive" = "destructive";
      
      const errorMessage = error?.message || '';
      
      if (errorMessage.includes('timeout')) {
        userTitle = "Processing Timeout";
        userDescription = "Analysis took longer than expected. Try reducing processing depth or try again - the system will adapt.";
        variant = "default";
      } else if (errorMessage.includes('partial')) {
        userTitle = "Partial Results Available";
        userDescription = "Some processing completed successfully. Results may have reduced quality but are still valuable.";
        variant = "default";
      } else {
        userTitle = "System Temporarily Unavailable";
        userDescription = "The analysis service is currently experiencing issues. Please try again in a moment.";
      }
      
      toast({
        title: userTitle,
        description: userDescription,
        variant: variant,
      });
      
      onProcessingError();
    } finally {
      console.log('=== RELIABLE PROCESSING CLEANUP ===');
      onCurrentArchetypeChange("");
      onCurrentLayerChange(1);
      onChunkProgressChange({ current: 0, total: 0 });
    }
  };

  return { handleStartGenius };
};

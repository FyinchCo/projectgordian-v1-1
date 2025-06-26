
import { useMetaLearning } from "@/hooks/useMetaLearning";
import { useToast } from "@/hooks/use-toast";
import { useProcessingExecutor } from "./processing/processingExecutor";
import { OutputType } from "@/types/outputTypes";

interface ProcessingLogicProps {
  question: string;
  processingDepth: number[];
  circuitType: string;
  enhancedMode: boolean;
  customArchetypes: any;
  currentAssessment: any;
  outputType?: OutputType;
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
  processingDepth,
  circuitType,
  enhancedMode,
  customArchetypes,
  currentAssessment,
  outputType,
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
      length: "medium",
      includeTrail: true,
      includeFullTranscript: false,
      customInstructions: ""
    };
    
    console.log('=== ENHANCED REAL-TIME PROCESSING START ===');
    console.log('Configuration:', {
      question: question.trim().substring(0, 100) + '...',
      requestedDepth: processingDepth[0],
      circuitType,
      customArchetypes: customArchetypes ? customArchetypes.length : 0,
      enhancedMode,
      outputType,
      compressionSettings,
      realTimeProgress: true
    });
    
    onProcessingStart();
    onCurrentLayerChange(1);
    onChunkProgressChange({ current: 0, total: 0 });
    
    // Enhanced progress tracking
    if (onProcessingPhaseChange) {
      onProcessingPhaseChange('Initializing enhanced processing system...');
    }
    
    try {
      const finalResults = await executeProcessing({
        question,
        processingDepth,
        circuitType,
        enhancedMode,
        customArchetypes,
        currentAssessment,
        compressionSettings,
        outputType,
        onProcessingComplete,
        onCurrentLayerChange,
        onChunkProgressChange,
        onCurrentArchetypeChange,
        onProcessingPhaseChange
      });
      
      // Handle meta-learning recording with proper type checking
      if (finalResults && 'questionQuality' in finalResults && finalResults.questionQuality) {
        console.log('Recording enhanced learning cycle...');
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
            tensionParameters: currentAssessment?.tensionParameters || {},
            realTimeProgress: true
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
      console.error('=== ENHANCED PROCESSING ERROR ===');
      console.error('Error details:', error);
      
      // Enhanced error handling with better user messages
      let userTitle = "Processing Error";
      let userDescription = "Analysis encountered an issue. The enhanced system has multiple fallbacks - please try again.";
      let variant: "default" | "destructive" = "destructive";
      
      const errorMessage = error?.message || '';
      
      if (errorMessage.includes('timeout')) {
        userTitle = "Processing Timeout";
        userDescription = "Analysis took longer than expected. The system automatically optimized for reliability - try again for enhanced results.";
        variant = "default";
      } else if (errorMessage.includes('partial')) {
        userTitle = "Partial Results Available";
        userDescription = "Some processing completed successfully. Results may have reduced quality but contain valuable insights.";
        variant = "default";
      } else {
        userTitle = "System Temporarily Unavailable";
        userDescription = "The enhanced analysis service is temporarily unavailable. Please try again in a moment.";
      }
      
      toast({
        title: userTitle,
        description: userDescription,
        variant: variant,
      });
      
      onProcessingError();
    } finally {
      console.log('=== ENHANCED PROCESSING CLEANUP ===');
      onCurrentArchetypeChange("");
      onCurrentLayerChange(1);
      onChunkProgressChange({ current: 0, total: 0 });
      if (onProcessingPhaseChange) {
        onProcessingPhaseChange('Processing complete');
      }
    }
  };

  return { handleStartGenius };
};


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
    
    // Load compression settings
    const savedCompression = localStorage.getItem('genius-machine-compression');
    const compressionSettings = savedCompression ? JSON.parse(savedCompression) : {
      length: "medium",
      includeTrail: true,
      includeFullTranscript: false,
      customInstructions: ""
    };
    
    const requestedDepth = processingDepth[0];
    const estimatedMinutes = Math.ceil((requestedDepth * 4) / 60);
    
    console.log('=== GENIUS ENGINE DIRECT PROCESSING START ===');
    console.log('Configuration:', {
      question: question.trim().substring(0, 100) + '...',
      requestedDepth,
      circuitType,
      customArchetypes: customArchetypes ? customArchetypes.length : 0,
      enhancedMode,
      outputType,
      estimatedTime: `${estimatedMinutes} minutes`
    });
    
    // Show user what they're getting
    toast({
      title: `Processing ${requestedDepth} Layers`,
      description: `Estimated time: ${estimatedMinutes} minutes for full genius analysis. Processing will continue in background.`,
      variant: "default",
    });
    
    onProcessingStart();
    onCurrentLayerChange(1);
    onChunkProgressChange({ current: 0, total: requestedDepth });
    
    if (onProcessingPhaseChange) {
      onProcessingPhaseChange(`Initializing ${requestedDepth}-layer genius analysis...`);
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
      
      // Record learning results
      if (finalResults && 'questionQuality' in finalResults && finalResults.questionQuality) {
        console.log('Recording genius learning cycle...');
        try {
          const assessment = currentAssessment || {
            complexityScore: requestedDepth,
            domainType: "General",
            abstractionLevel: "Theoretical",
            controversyPotential: 5,
            noveltyRequirement: 5,
            stakeholderComplexity: 5,
            breakthroughPotential: finalResults.emergenceDetected ? 9 : 6,
            cognitiveComplexity: requestedDepth
          };
          
          const configuration = {
            processingDepth: requestedDepth,
            circuitType,
            enhancedMode,
            archetypeConfigurations: currentAssessment?.archetypeConfigurations || [],
            tensionParameters: currentAssessment?.tensionParameters || {},
            realTimeProgress: true,
            directEngineCall: true
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
      
      // Success feedback
      toast({
        title: "Genius Analysis Complete",
        description: `Generated ${finalResults.layers?.length || requestedDepth} layers with ${finalResults.emergenceDetected ? 'breakthrough' : 'progressive'} insights.`,
        variant: "default",
      });
      
    } catch (error: any) {
      console.error('=== GENIUS ENGINE PROCESSING ERROR ===');
      console.error('Error details:', error);
      
      const errorMessage = error?.message || 'Unknown error';
      
      let userTitle = "Processing Error";
      let userDescription = "Genius analysis encountered an issue.";
      
      if (errorMessage.includes('timeout')) {
        userTitle = "Processing Time Limit";
        userDescription = `${requestedDepth}-layer analysis requires more time. Consider reducing depth to ${Math.max(2, Math.floor(requestedDepth/2))} layers or allowing more processing time.`;
      } else if (errorMessage.includes('temporarily unavailable')) {
        userTitle = "Engine Temporarily Unavailable";
        userDescription = "The genius engine is temporarily busy. Please try again in a moment.";
      } else {
        userDescription = `Genius analysis failed: ${errorMessage}`;
      }
      
      toast({
        title: userTitle,
        description: userDescription,
        variant: "destructive",
      });
      
      onProcessingError();
    } finally {
      console.log('=== GENIUS ENGINE PROCESSING CLEANUP ===');
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

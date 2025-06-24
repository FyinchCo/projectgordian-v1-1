
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useChunkedProcessor } from "@/components/processing/ChunkedProcessor";
import { useMetaLearning } from "@/hooks/useMetaLearning";

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
  const { processChunkedLayers } = useChunkedProcessor();
  const { recordProcessingResults } = useMetaLearning();

  const handleStartGenius = async () => {
    if (!question.trim()) {
      console.error('No question provided');
      return;
    }
    
    console.log('=== PROCESSING START ===');
    console.log('Timestamp:', new Date().toISOString());
    onProcessingStart();
    onCurrentLayerChange(1);
    onChunkProgressChange({ current: 0, total: 0 });
    
    try {
      console.log('Starting genius processing with configuration:', {
        question: question.trim().substring(0, 100) + '...',
        processingDepth: processingDepth[0],
        circuitType,
        customArchetypes: customArchetypes ? customArchetypes.length : 0,
        enhancedMode,
        hasAssessment: !!currentAssessment
      });
      
      const baseConfig = {
        question,
        circuitType,
        customArchetypes: customArchetypes,
        enhancedMode,
        assessmentConfiguration: currentAssessment ? {
          archetypeConfigurations: currentAssessment.archetypeConfigurations,
          tensionParameters: currentAssessment.tensionParameters,
          processingConfiguration: currentAssessment.processingConfiguration
        } : null
      };
      
      console.log('Base config prepared:', baseConfig);
      
      let finalResults;
      
      // Use chunked processing for depths > 5, simple processing for 1-5
      if (processingDepth[0] > 5) {
        console.log('Using chunked processing for depth > 5:', processingDepth[0]);
        toast({
          title: "Deep Processing Mode",
          description: `Processing ${processingDepth[0]} layers in chunks for optimal performance.`,
          variant: "default",
        });
        
        try {
          finalResults = await processChunkedLayers({
            baseConfig,
            totalDepth: processingDepth[0],
            chunkSize: 2,
            onChunkProgressChange,
            onCurrentLayerChange
          });
        } catch (chunkError: any) {
          // Fallback to simple processing with reduced depth
          console.log('Chunked processing failed, falling back to simple processing with depth 5');
          toast({
            title: "Switching to Simple Processing",
            description: "Deep processing failed, using standard processing instead.",
            variant: "default",
          });
          
          const fallbackConfig = { ...baseConfig, processingDepth: 5 };
          const result = await supabase.functions.invoke('genius-machine', {
            body: fallbackConfig
          });
          
          if (result.error) throw new Error(`FUNCTION_ERROR: ${result.error.message}`);
          if (!result.data) throw new Error('NO_DATA: Empty response from processing service');
          
          finalResults = result.data;
        }
      } else {
        // Simple processing for depth 1-5 with longer timeout
        console.log('Using simple processing for depth <= 5:', processingDepth[0]);
        const config = { ...baseConfig, processingDepth: processingDepth[0] };
        
        console.log('Calling genius-machine function with config:', JSON.stringify(config, null, 2));
        console.log('Function call initiated at:', new Date().toISOString());
        
        // Longer timeout for simple processing - 45 seconds
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            console.log('45 second timeout triggered at:', new Date().toISOString());
            reject(new Error('SIMPLE_TIMEOUT: Function timeout after 45 seconds'));
          }, 45000);
        });
        
        const requestPromise = supabase.functions.invoke('genius-machine', {
          body: config
        });
        
        const result = await Promise.race([requestPromise, timeoutPromise]);
        
        if (result.error) {
          console.error('Supabase function error details:', result.error);
          throw new Error(`FUNCTION_ERROR: ${result.error.message || 'Unknown processing error'}`);
        }
        
        if (!result.data) {
          console.error('No data in response - service may be malfunctioning');
          throw new Error('NO_DATA: Empty response from processing service');
        }
        
        finalResults = result.data;
      }
      
      // Record learning cycle
      if (finalResults.questionQuality) {
        console.log('Recording learning cycle for meta-learning system...');
        
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
        
        try {
          recordProcessingResults(
            question,
            assessment,
            configuration,
            finalResults,
            finalResults.questionQuality
          );
          
          console.log('Learning data recorded successfully');
        } catch (learningError) {
          console.error('Failed to record learning data:', learningError);
        }
      }
      
      console.log('=== PROCESSING COMPLETE ===');
      onProcessingComplete(finalResults);
      
      if (finalResults.partialResults) {
        toast({
          title: "Partial Results Generated",
          description: `Generated insights from ${finalResults.processingDepth} layers.`,
          variant: "default",
        });
      } else if (finalResults.chunkProcessed) {
        toast({
          title: "Deep Processing Complete",
          description: `Successfully processed all ${finalResults.processingDepth} layers.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Processing Complete",
          description: "Analysis complete - insights generated successfully.",
          variant: "default",
        });
      }
      
    } catch (error: any) {
      console.error('=== PROCESSING ERROR ANALYSIS ===');
      console.error('Error timestamp:', new Date().toISOString());
      console.error('Error details:', error);
      
      // Simplified error handling
      let userTitle = "Processing Error";
      let userDescription = "There was an issue with processing. Please try again.";
      
      const errorMessage = error?.message || '';
      
      if (errorMessage.includes('TIMEOUT')) {
        userTitle = "Processing Taking Longer Than Expected";
        userDescription = "The system is under heavy load. Try reducing processing depth or try again later.";
      } else if (errorMessage.includes('FUNCTION_ERROR')) {
        userTitle = "Processing Error";
        userDescription = "There was an error in the processing logic. Please try again.";
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

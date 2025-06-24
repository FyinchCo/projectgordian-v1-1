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
      
      // Force chunked processing for all depths > 2 to improve reliability
      if (processingDepth[0] > 2) {
        console.log('Using chunked processing for depth > 2:', processingDepth[0]);
        toast({
          title: "Smart Processing Mode",
          description: `Using chunked processing for ${processingDepth[0]} layers to ensure reliability.`,
          variant: "default",
        });
        
        finalResults = await processChunkedLayers({
          baseConfig,
          totalDepth: processingDepth[0],
          chunkSize: 2,
          onChunkProgressChange,
          onCurrentLayerChange
        });
      } else {
        // Simple processing for depth 1-2 with aggressive timeout
        console.log('Using simple processing for depth <= 2:', processingDepth[0]);
        const config = { ...baseConfig, processingDepth: processingDepth[0] };
        
        console.log('Calling genius-machine function with config:', JSON.stringify(config, null, 2));
        console.log('Function call initiated at:', new Date().toISOString());
        
        // Very aggressive timeout for simple processing - 8 seconds max
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            console.log('8 second timeout triggered at:', new Date().toISOString());
            reject(new Error('SIMPLE_TIMEOUT: Function timeout after 8 seconds'));
          }, 8000);
        });
        
        console.log('Creating function request promise...');
        const startTime = Date.now();
        
        const requestPromise = supabase.functions.invoke('genius-machine', {
          body: config
        }).then(result => {
          const endTime = Date.now();
          const duration = endTime - startTime;
          console.log(`Function completed in ${duration}ms at:`, new Date().toISOString());
          console.log('Raw result received:', {
            hasData: !!result.data,
            hasError: !!result.error,
            dataKeys: result.data ? Object.keys(result.data) : [],
            errorMessage: result.error?.message
          });
          return result;
        }).catch(invokeError => {
          const endTime = Date.now();
          const duration = endTime - startTime;
          console.error(`Function failed after ${duration}ms:`, {
            errorName: invokeError.name,
            errorMessage: invokeError.message,
            errorType: typeof invokeError,
            timestamp: new Date().toISOString()
          });
          throw new Error(`INVOKE_FAILED: ${invokeError.message}`);
        });
        
        console.log('Racing function call against timeout...');
        
        const result = await Promise.race([requestPromise, timeoutPromise]);
        console.log('Function race completed, processing response...');
        
        if (result.error) {
          console.error('Supabase function error details:', {
            message: result.error.message,
            code: result.error.code,
            details: result.error.details,
            hint: result.error.hint,
            timestamp: new Date().toISOString()
          });
          
          throw new Error(`FUNCTION_ERROR: ${result.error.message || 'Unknown processing error'}`);
        }
        
        if (!result.data) {
          console.error('No data in response - service may be malfunctioning');
          throw new Error('NO_DATA: Empty response from processing service');
        }
        
        console.log('Processing successful, validating response structure:', {
          hasInsight: !!result.data.insight,
          hasLayers: !!result.data.layers,
          layerCount: result.data.layers?.length || 0,
          processingTime: Date.now() - startTime
        });
        
        finalResults = result.data;
      }
      
      console.log('Final results validation:', {
        hasResults: !!finalResults,
        resultKeys: finalResults ? Object.keys(finalResults) : [],
        hasQuestionQuality: !!finalResults?.questionQuality
      });
      
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
          
          toast({
            title: "Learning Cycle Recorded",
            description: "Results added to meta-learning system for future optimization.",
            variant: "default",
          });
        } catch (learningError) {
          console.error('Failed to record learning data:', learningError);
        }
      } else {
        console.log('No question quality metrics found, learning not recorded');
      }
      
      console.log('=== PROCESSING COMPLETE ===');
      onProcessingComplete(finalResults);
      
      if (finalResults.partialResults) {
        toast({
          title: "Partial Results Generated",
          description: `Generated insights from ${finalResults.processingDepth} layers. Consider using 1-2 layers for fastest results.`,
          variant: "default",
        });
      } else if (finalResults.chunkProcessed) {
        toast({
          title: "High-Depth Processing Complete",
          description: `Successfully processed all ${finalResults.processingDepth} layers using chunked processing.`,
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
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 5).join('\n'),
        cause: error.cause
      });
      
      // Enhanced error categorization for user feedback
      let userTitle = "Processing Error";
      let userDescription = "An unexpected error occurred. Please try again.";
      
      const errorMessage = error?.message || '';
      
      if (errorMessage.includes('PROCESSING_TIMEOUT') || errorMessage.includes('SIMPLE_TIMEOUT')) {
        userTitle = "Processing Timeout";
        userDescription = "The genius machine is taking too long to respond. Try using depth 1-2 for fastest results, or wait a moment if the system is under load.";
      } else if (errorMessage.includes('SERVICE_UNAVAILABLE')) {
        userTitle = "Service Temporarily Unavailable";
        userDescription = "The processing service is currently down. Please wait 30 seconds and try again.";
      } else if (errorMessage.includes('PROCESSING_ERROR')) {
        userTitle = "Processing Logic Error";
        userDescription = "There was an error in the processing logic. Try a simpler question or reduce the processing depth to 1-2 layers.";
      } else if (errorMessage.includes('NO_DATA')) {
        userTitle = "Empty Response";
        userDescription = "The service returned an empty response. This may indicate a temporary service issue. Please try again.";
      } else if (errorMessage.includes('FUNCTION_ERROR')) {
        userTitle = "Function Error";
        userDescription = "There was an error in the backend processing. Try reducing complexity or processing depth.";
      } else if (errorMessage.includes('INVOKE_FAILED')) {
        userTitle = "Connection Error";
        userDescription = "Could not connect to the processing service. Check your internet connection and try again.";
      }
      
      toast({
        title: userTitle,
        description: userDescription,
        variant: "destructive",
      });
      
      onProcessingError();
    } finally {
      console.log('=== PROCESSING CLEANUP ===');
      console.log('Cleanup timestamp:', new Date().toISOString());
      onCurrentArchetypeChange("");
      onCurrentLayerChange(1);
      onChunkProgressChange({ current: 0, total: 0 });
    }
  };

  return { handleStartGenius };
};

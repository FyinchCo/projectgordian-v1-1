
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
      
      // Always use lower timeout thresholds and force chunked processing for depths > 3
      if (processingDepth[0] > 3) {
        console.log('Forcing chunked processing for depth > 3:', processingDepth[0]);
        toast({
          title: "Smart Processing Mode",
          description: `Using chunked processing for ${processingDepth[0]} layers to ensure reliability.`,
          variant: "default",
        });
        
        finalResults = await processChunkedLayers({
          baseConfig,
          totalDepth: processingDepth[0],
          chunkSize: 2, // Even smaller chunks
          onChunkProgressChange,
          onCurrentLayerChange
        });
      } else {
        // Very conservative processing for low depths with aggressive timeouts
        console.log('Using conservative processing for depth <= 3:', processingDepth[0]);
        const config = { ...baseConfig, processingDepth: processingDepth[0] };
        
        console.log('Calling genius-machine function with config:', JSON.stringify(config, null, 2));
        console.log('Function call initiated at:', new Date().toISOString());
        
        // Much more aggressive timeout for debugging
        const timeouts = {
          15: new Promise((_, reject) => {
            setTimeout(() => {
              console.log('15 second timeout triggered at:', new Date().toISOString());
              reject(new Error('TIMEOUT_15_SEC: Function cold start timeout'));
            }, 15000);
          }),
          30: new Promise((_, reject) => {
            setTimeout(() => {
              console.log('30 second timeout triggered at:', new Date().toISOString());
              reject(new Error('TIMEOUT_30_SEC: Function execution timeout'));
            }, 30000);
          }),
          45: new Promise((_, reject) => {
            setTimeout(() => {
              console.log('45 second timeout triggered at:', new Date().toISOString());
              reject(new Error('TIMEOUT_45_SEC: Service overload timeout'));
            }, 45000);
          })
        };
        
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
          throw invokeError;
        });
        
        console.log('Racing function call against timeouts...');
        
        // Race with very aggressive timeouts
        const result = await Promise.race([
          requestPromise,
          timeouts[15],
          timeouts[30],
          timeouts[45]
        ]);
        
        console.log('Function race completed, processing response...');
        const { data, error } = result as any;
        
        if (error) {
          console.error('Supabase function error details:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
            timestamp: new Date().toISOString()
          });
          
          // Enhanced error categorization
          const errorMsg = error.message?.toLowerCase() || '';
          
          if (errorMsg.includes('timeout') || errorMsg.includes('TIMEOUT_')) {
            throw new Error('CATEGORIZED_TIMEOUT: Function processing timeout - try depth 1-2 for fastest results');
          } else if (errorMsg.includes('502') || errorMsg.includes('bad gateway')) {
            throw new Error('CATEGORIZED_SERVICE: Service temporarily down - please wait 30 seconds and retry');
          } else if (errorMsg.includes('401') || errorMsg.includes('unauthorized')) {
            throw new Error('CATEGORIZED_AUTH: Authentication expired - refresh page and try again');
          } else if (errorMsg.includes('500') || errorMsg.includes('internal')) {
            throw new Error('CATEGORIZED_INTERNAL: Internal service error - try again in a moment');
          } else {
            throw new Error(`CATEGORIZED_UNKNOWN: ${error.message || 'Unknown processing error'}`);
          }
        }
        
        if (!data) {
          console.error('No data in response - service may be malfunctioning');
          throw new Error('CATEGORIZED_NO_DATA: Empty response from processing service');
        }
        
        console.log('Processing successful, validating response structure:', {
          hasInsight: !!data.insight,
          hasLayers: !!data.layers,
          layerCount: data.layers?.length || 0,
          processingTime: Date.now() - startTime
        });
        
        finalResults = data;
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
          description: `Generated insights from ${finalResults.processingDepth} layers. Consider using 5-7 layers for full reliability.`,
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
      
    } catch (error) {
      console.error('=== PROCESSING ERROR ANALYSIS ===');
      console.error('Error timestamp:', new Date().toISOString());
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 5).join('\n'), // First 5 lines only
        cause: error.cause
      });
      
      // Enhanced error categorization for user feedback
      const errorMessage = error?.message || '';
      let userTitle = "Processing Error";
      let userDescription = "An unexpected error occurred. Please try again.";
      
      if (errorMessage.includes('TIMEOUT_')) {
        userTitle = "Processing Timeout";
        const timeoutType = errorMessage.includes('15_SEC') ? '15 seconds' : 
                           errorMessage.includes('30_SEC') ? '30 seconds' : '45 seconds';
        userDescription = `Processing timed out after ${timeoutType}. Try depth 1-2 for fastest results, or wait a moment if the system is under load.`;
      } else if (errorMessage.includes('CATEGORIZED_SERVICE')) {
        userTitle = "Service Temporarily Down";
        userDescription = "The processing service is temporarily unavailable. Please wait 30 seconds and try again.";
      } else if (errorMessage.includes('CATEGORIZED_AUTH')) {
        userTitle = "Session Expired";
        userDescription = "Your session has expired. Please refresh the page and try again.";
      } else if (errorMessage.includes('CATEGORIZED_')) {
        // Extract the user-friendly message
        const colonIndex = errorMessage.indexOf(':');
        if (colonIndex > -1) {
          userDescription = errorMessage.substring(colonIndex + 1).trim();
        }
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


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
      
      // Use chunked processing for high depths
      if (processingDepth[0] >= 8) {
        console.log('Using chunked processing for depth:', processingDepth[0]);
        toast({
          title: "High-Depth Processing",
          description: `Processing ${processingDepth[0]} layers in chunks to avoid timeouts. This may take a few minutes.`,
          variant: "default",
        });
        
        finalResults = await processChunkedLayers({
          baseConfig,
          totalDepth: processingDepth[0],
          chunkSize: 4,
          onChunkProgressChange,
          onCurrentLayerChange
        });
      } else {
        // Regular processing for lower depths with enhanced timeout and error handling
        console.log('Using regular processing for depth:', processingDepth[0]);
        const config = { ...baseConfig, processingDepth: processingDepth[0] };
        
        console.log('Calling genius-machine function with config:', JSON.stringify(config, null, 2));
        
        // Create multiple timeout promises for better debugging
        const timeouts = {
          30: new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timeout after 30 seconds - function may be cold starting')), 30000);
          }),
          60: new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timeout after 60 seconds - function execution timeout')), 60000);
          }),
          90: new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timeout after 90 seconds - severe processing issue')), 90000);
          })
        };
        
        console.log('Invoking supabase function with enhanced error tracking...');
        console.log('Function endpoint check - attempting to call genius-machine...');
        
        const requestPromise = supabase.functions.invoke('genius-machine', {
          body: config
        }).then(result => {
          console.log('Function invocation completed. Raw result:', result);
          console.log('Result data:', result.data);
          console.log('Result error:', result.error);
          return result;
        }).catch(invokeError => {
          console.error('Function invocation failed with error:', invokeError);
          console.error('Error type:', typeof invokeError);
          console.error('Error message:', invokeError.message);
          console.error('Error stack:', invokeError.stack);
          throw invokeError;
        });
        
        console.log('Waiting for genius-machine response with timeout protection...');
        
        // Race between request and timeouts
        const result = await Promise.race([
          requestPromise,
          timeouts[30],
          timeouts[60],
          timeouts[90]
        ]);
        
        console.log('Received response from function call');
        const { data, error } = result as any;
        
        if (error) {
          console.error('Supabase function returned error:', error);
          console.error('Error details:', JSON.stringify(error, null, 2));
          console.error('Error message:', error.message);
          console.error('Error code:', error.code);
          console.error('Error details object:', error.details);
          
          // More specific error messages
          if (error.message?.includes('timeout')) {
            throw new Error('Function timed out - try reducing processing depth to 2-3 layers');
          } else if (error.message?.includes('502') || error.message?.includes('Bad Gateway')) {
            throw new Error('Service temporarily unavailable - please try again in a moment');
          } else if (error.message?.includes('401') || error.message?.includes('unauthorized')) {
            throw new Error('Authentication error - please refresh the page and try again');
          } else {
            throw new Error(`Processing failed: ${error.message || 'Unknown error'}`);
          }
        }
        
        if (!data) {
          console.error('No data returned from function - this should not happen');
          throw new Error('No data returned from processing function - service may be down');
        }
        
        console.log('Processing completed successfully. Result structure:', {
          hasInsight: !!data.insight,
          hasLayers: !!data.layers,
          layerCount: data.layers?.length || 0,
          hasConfidence: typeof data.confidence === 'number',
          hasTensionPoints: typeof data.tensionPoints === 'number'
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
      console.error('=== PROCESSING ERROR ===');
      console.error('Error processing question:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Error cause:', error.cause);
      
      const isTimeout = error?.message?.includes('timeout') || 
                       error?.message?.includes('Load failed') || 
                       error?.message?.includes('Request timeout') ||
                       error?.message?.includes('cold starting');
      
      const isServiceDown = error?.message?.includes('502') || 
                           error?.message?.includes('Bad Gateway') ||
                           error?.message?.includes('service may be down');
      
      const isAuth = error?.message?.includes('401') || 
                     error?.message?.includes('unauthorized');
      
      let errorTitle = "Processing Error";
      let errorDescription = `Failed to process: ${error.message || 'Unknown error'}. Please try again.`;
      
      if (isTimeout) {
        errorTitle = "Processing Timeout";
        errorDescription = `Processing timed out. Try reducing depth to 2-3 layers, or the system may be experiencing high load. If using depth 5+, wait a moment and try again.`;
      } else if (isServiceDown) {
        errorTitle = "Service Unavailable";
        errorDescription = "Processing service is temporarily unavailable. Please wait a moment and try again.";
      } else if (isAuth) {
        errorTitle = "Authentication Error";
        errorDescription = "Authentication issue detected. Please refresh the page and try again.";
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
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

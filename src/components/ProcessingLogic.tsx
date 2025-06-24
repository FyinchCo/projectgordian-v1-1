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
      
      // Use chunked processing for depths > 3, simple processing for 1-3
      if (processingDepth[0] > 3) {
        console.log('Using chunked processing for depth > 3:', processingDepth[0]);
        toast({
          title: "Deep Processing Mode",
          description: `Processing ${processingDepth[0]} layers in chunks for optimal performance.`,
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
        // Simple processing for depth 1-3 with reasonable timeout
        console.log('Using simple processing for depth <= 3:', processingDepth[0]);
        const config = { ...baseConfig, processingDepth: processingDepth[0] };
        
        console.log('Calling genius-machine function with config:', JSON.stringify(config, null, 2));
        console.log('Function call initiated at:', new Date().toISOString());
        
        // Reasonable timeout for simple processing - 30 seconds
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            console.log('30 second timeout triggered at:', new Date().toISOString());
            reject(new Error('SIMPLE_TIMEOUT: Function timeout after 30 seconds'));
          }, 30000);
        });
        
        console.log('Creating function request promise...');
        const startTime = Date.now();
        
        const requestPromise = supabase.functions.invoke('genius-machine', {
          body: config
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
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 5).join('\n'),
        cause: error.cause
      });
      
      // Simplified error handling
      let userTitle = "Processing Error";
      let userDescription = "There was an issue with processing. Please try again.";
      
      const errorMessage = error?.message || '';
      
      if (errorMessage.includes('TIMEOUT')) {
        userTitle = "Processing Taking Longer Than Expected";
        userDescription = "The system is under heavy load. Try a simpler question or lower processing depth.";
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
      console.log('Cleanup timestamp:', new Date().toISOString());
      onCurrentArchetypeChange("");
      onCurrentLayerChange(1);
      onChunkProgressChange({ current: 0, total: 0 });
    }
  };

  return { handleStartGenius };
};

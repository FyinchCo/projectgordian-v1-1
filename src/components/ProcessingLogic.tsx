
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
        // Regular processing for lower depths
        console.log('Using regular processing for depth:', processingDepth[0]);
        const config = { ...baseConfig, processingDepth: processingDepth[0] };
        
        console.log('Calling genius-machine function with config:', config);
        
        // Add timeout to the request
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout after 60 seconds')), 60000);
        });
        
        const requestPromise = supabase.functions.invoke('genius-machine', {
          body: config
        });
        
        console.log('Waiting for genius-machine response...');
        const result = await Promise.race([requestPromise, timeoutPromise]);
        
        console.log('Raw supabase response:', result);
        
        const { data, error } = result as any;
        
        if (error) {
          console.error('Supabase function error:', error);
          console.error('Error details:', JSON.stringify(error, null, 2));
          throw new Error(`Processing failed: ${error.message || 'Unknown error'}`);
        }
        
        if (!data) {
          console.error('No data returned from function');
          throw new Error('No data returned from processing function');
        }
        
        console.log('Processing completed successfully:', data);
        finalResults = data;
      }
      
      console.log('Final results received:', finalResults);
      console.log('Question quality in results:', finalResults.questionQuality);
      
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
      }
      
    } catch (error) {
      console.error('=== PROCESSING ERROR ===');
      console.error('Error processing question:', error);
      console.error('Error stack:', error.stack);
      
      const isTimeout = error?.message?.includes('timeout') || error?.message?.includes('Load failed') || error?.message?.includes('Request timeout');
      
      toast({
        title: isTimeout ? "Processing Timeout" : "Processing Error",
        description: isTimeout 
          ? `Processing failed due to timeout. Try reducing depth to 3-5 layers, or the system may be experiencing high load.`
          : `Failed to process: ${error.message || 'Unknown error'}. Please try again.`,
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

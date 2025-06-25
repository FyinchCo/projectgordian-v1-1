
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
      
      let finalResults;
      const requestedDepth = processingDepth[0];
      
      console.log(`Requested processing depth: ${requestedDepth}`);
      
      // Use chunked processing for depths > 3, simple processing for 1-3
      if (requestedDepth > 3) {
        console.log(`Using chunked processing for depth ${requestedDepth}`);
        
        toast({
          title: "Deep Processing Mode",
          description: `Processing ${requestedDepth} layers in optimized chunks for best performance.`,
          variant: "default",
        });
        
        try {
          finalResults = await processChunkedLayers({
            baseConfig,
            totalDepth: requestedDepth,
            chunkSize: 3, // Process 3 layers at a time
            onChunkProgressChange,
            onCurrentLayerChange
          });
          
          console.log('Chunked processing completed:', {
            totalLayers: finalResults.layers?.length || 0,
            hasInsight: !!finalResults.insight,
            confidence: finalResults.confidence,
            requestedVsActual: `${requestedDepth} → ${finalResults.layers?.length || 0}`,
            processingSuccess: (finalResults.layers?.length || 0) === requestedDepth
          });
          
          // Validate that we got the expected number of layers
          if (finalResults.layers && finalResults.layers.length !== requestedDepth) {
            console.warn(`LAYER MISMATCH: Requested ${requestedDepth} layers but got ${finalResults.layers.length}`);
            
            if (finalResults.layers.length < requestedDepth) {
              toast({
                title: "Partial Processing Complete",
                description: `Processed ${finalResults.layers.length} of ${requestedDepth} requested layers. Some layers may have encountered processing limits.`,
                variant: "default",
              });
            }
          }
          
        } catch (chunkError: any) {
          console.error('Chunked processing failed:', chunkError);
          
          // If chunked processing fails, try simple processing with reduced depth
          console.log('Falling back to simple processing with depth 3');
          
          toast({
            title: "Switching to Standard Processing",
            description: `Deep processing encountered issues. Using standard processing instead.`,
            variant: "default",
          });
          
          const fallbackConfig = { ...baseConfig, processingDepth: 3 };
          
          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('Processing timeout after 3 minutes')), 180000);
          });
          
          const requestPromise = supabase.functions.invoke('genius-machine', {
            body: fallbackConfig
          });
          
          const result = await Promise.race([requestPromise, timeoutPromise]);
          
          if (result.error) throw new Error(`Processing error: ${result.error.message}`);
          if (!result.data) throw new Error('No data returned from processing');
          
          finalResults = result.data;
        }
      } else {
        // Simple processing for depth 1-3
        console.log(`Using simple processing for depth ${requestedDepth}`);
        const config = { ...baseConfig, processingDepth: requestedDepth };
        
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Processing timeout after 3 minutes')), 180000);
        });
        
        const requestPromise = supabase.functions.invoke('genius-machine', {
          body: config
        });
        
        const result = await Promise.race([requestPromise, timeoutPromise]);
        
        if (result.error) throw new Error(`Processing error: ${result.error.message}`);
        if (!result.data) throw new Error('No data returned from processing');
        
        finalResults = result.data;
        
        // Validate simple processing results too
        if (finalResults.layers && finalResults.layers.length !== requestedDepth) {
          console.warn(`SIMPLE PROCESSING LAYER MISMATCH: Requested ${requestedDepth} layers but got ${finalResults.layers.length}`);
        }
      }
      
      // Ensure we have valid results before completing
      if (!finalResults || !finalResults.insight) {
        throw new Error('Invalid results: No insight generated');
      }
      
      console.log('=== PROCESSING COMPLETE ===');
      console.log('Final results summary:', {
        hasInsight: !!finalResults.insight,
        confidence: finalResults.confidence,
        requestedLayers: requestedDepth,
        actualLayers: finalResults.layers?.length || 0,
        layerProcessingSuccess: (finalResults.layers?.length || 0) === requestedDepth,
        partialResults: finalResults.partialResults || false,
        hasCompressionFormats: !!finalResults.compressionFormats
      });
      
      // Complete processing with results
      onProcessingComplete(finalResults);
      
      // Show completion message with processing validation
      const actualLayers = finalResults.layers?.length || 0;
      if (finalResults.partialResults) {
        toast({
          title: "Partial Results Generated",
          description: `Generated insights from ${actualLayers} layers (${requestedDepth} requested).`,
          variant: "default",
        });
      } else if (actualLayers === requestedDepth) {
        toast({
          title: "Analysis Complete - All Layers Processed",
          description: `Successfully processed all ${actualLayers} layers with ${Math.round((finalResults.confidence || 0) * 100)}% confidence.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Analysis Complete - Layer Processing Issue",
          description: `Processed ${actualLayers} of ${requestedDepth} requested layers. Check logs for details.`,
          variant: "default",
        });
      }
      
      // Record learning data if available
      if (finalResults.questionQuality) {
        console.log('Recording learning cycle...');
        try {
          const assessment = currentAssessment || {
            complexityScore: requestedDepth,
            domainType: "General",
            abstractionLevel: "Theoretical",
            controversyPotential: 5,
            noveltyRequirement: 5,
            stakeholderComplexity: 5,
            breakthroughPotential: finalResults.emergenceDetected ? 8 : 5,
            cognitiveComplexity: requestedDepth
          };
          
          const configuration = {
            processingDepth: requestedDepth,
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
      
      // Enhanced error handling
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

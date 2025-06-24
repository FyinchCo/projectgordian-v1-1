import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useChunkedProcessor } from "@/components/processing/ChunkedProcessor";
import { useEnhancedAIConfigOptimization } from "@/hooks/useEnhancedAIConfigOptimization";

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
  const { recordProcessingResults } = useEnhancedAIConfigOptimization();

  const handleStartGenius = async () => {
    if (!question.trim()) return;
    
    onProcessingStart();
    onCurrentLayerChange(1);
    onChunkProgressChange({ current: 0, total: 0 });
    
    try {
      console.log('Starting genius processing with configuration:', {
        question: question.trim(),
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
      
      let finalResults;
      
      // Use chunked processing for high depths
      if (processingDepth[0] >= 8) {
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
        const config = { ...baseConfig, processingDepth: processingDepth[0] };
        
        const { data, error } = await supabase.functions.invoke('genius-machine', {
          body: config
        });
        
        if (error) {
          console.error('Processing error:', error);
          throw error;
        }
        
        finalResults = data;
      }
      
      console.log('Processing completed:', finalResults);
      
      // Record learning cycle - CRITICAL INTEGRATION POINT
      if (currentAssessment && finalResults.questionQuality) {
        console.log('Recording learning cycle for meta-learning system...');
        
        const configuration = {
          processingDepth: processingDepth[0],
          circuitType,
          enhancedMode,
          archetypeConfigurations: currentAssessment.archetypeConfigurations || [],
          tensionParameters: currentAssessment.tensionParameters || {}
        };
        
        recordProcessingResults(
          question,
          configuration,
          finalResults,
          finalResults.questionQuality
        );
        
        toast({
          title: "Learning Cycle Recorded",
          description: "Results added to meta-learning system for future optimization.",
          variant: "default",
        });
      }
      
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
      console.error('Error processing question:', error);
      
      const isTimeout = error?.message?.includes('timeout') || error?.message?.includes('Load failed');
      
      toast({
        title: isTimeout ? "Processing Timeout" : "Processing Error",
        description: isTimeout 
          ? `Processing failed. Try reducing depth to 5-7 layers, or the system may be experiencing high load.`
          : "Failed to process your question. Please try again.",
        variant: "destructive",
      });
      
      onProcessingError();
    } finally {
      onCurrentArchetypeChange("");
      onCurrentLayerChange(1);
      onChunkProgressChange({ current: 0, total: 0 });
    }
  };

  return { handleStartGenius };
};

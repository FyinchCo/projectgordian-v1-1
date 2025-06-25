
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useChunkedProcessor } from "./ChunkedProcessor";
import { buildProcessingConfig, buildFallbackConfig, buildSimpleConfig } from "./processingConfig";

interface ProcessingExecutorProps {
  question: string;
  processingDepth: number[];
  circuitType: string;
  enhancedMode: boolean;
  customArchetypes: any;
  currentAssessment: any;
  onProcessingComplete: (results: any) => void;
  onCurrentLayerChange: (layer: number) => void;
  onChunkProgressChange: (progress: { current: number; total: number }) => void;
}

export const useProcessingExecutor = () => {
  const { toast } = useToast();
  const { processChunkedLayers } = useChunkedProcessor();

  const executeProcessing = async ({
    question,
    processingDepth,
    circuitType,
    enhancedMode,
    customArchetypes,
    currentAssessment,
    onProcessingComplete,
    onCurrentLayerChange,
    onChunkProgressChange
  }: ProcessingExecutorProps) => {
    const baseConfig = buildProcessingConfig(
      question,
      circuitType,
      enhancedMode,
      customArchetypes,
      currentAssessment
    );
    
    let finalResults;
    const requestedDepth = processingDepth[0];
    console.log(`Requested processing depth: ${requestedDepth}`);
    
    if (requestedDepth > 2) {
      console.log(`Using chunked processing for depth ${requestedDepth}`);
      
      toast({
        title: "Optimized Deep Processing",
        description: `Processing ${requestedDepth} layers with improved chunking (2-layer chunks + context optimization).`,
        variant: "default",
      });
      
      try {
        finalResults = await processChunkedLayers({
          baseConfig,
          totalDepth: requestedDepth,
          chunkSize: 2,
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
        console.log('Falling back to simple processing with depth 2');
        
        toast({
          title: "Switching to Standard Processing",
          description: `Deep processing encountered issues. Using standard processing instead.`,
          variant: "default",
        });
        
        const fallbackConfig = buildFallbackConfig(baseConfig, 2);
        finalResults = await executeSimpleProcessing(fallbackConfig);
      }
    } else {
      console.log(`Using simple processing for depth ${requestedDepth}`);
      const config = buildSimpleConfig(baseConfig, requestedDepth);
      finalResults = await executeSimpleProcessing(config);
      
      if (finalResults.layers && finalResults.layers.length !== requestedDepth) {
        console.warn(`SIMPLE PROCESSING LAYER MISMATCH: Requested ${requestedDepth} layers but got ${finalResults.layers.length}`);
      }
    }
    
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
    
    onProcessingComplete(finalResults);
    
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
    
    return finalResults;
  };

  const executeSimpleProcessing = async (config: any) => {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Processing timeout after 3 minutes')), 180000);
    });
    
    const requestPromise = supabase.functions.invoke('genius-machine', {
      body: config
    });
    
    const result = await Promise.race([requestPromise, timeoutPromise]);
    
    if (result.error) throw new Error(`Processing error: ${result.error.message}`);
    if (!result.data) throw new Error('No data returned from processing');
    
    return result.data;
  };

  return { executeProcessing };
};

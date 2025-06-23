
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

  const processChunkedLayers = async (baseConfig: any, totalDepth: number, chunkSize = 4) => {
    const chunks = Math.ceil(totalDepth / chunkSize);
    let accumulatedLayers: any[] = [];
    
    onChunkProgressChange({ current: 0, total: chunks });
    
    for (let chunkIndex = 0; chunkIndex < chunks; chunkIndex++) {
      const startLayer = chunkIndex * chunkSize + 1;
      const endLayer = Math.min((chunkIndex + 1) * chunkSize, totalDepth);
      const chunkDepth = endLayer - startLayer + 1;
      
      console.log(`Processing chunk ${chunkIndex + 1}/${chunks}: layers ${startLayer}-${endLayer}`);
      onChunkProgressChange({ current: chunkIndex + 1, total: chunks });
      
      // Update visual progress
      for (let layer = startLayer; layer <= endLayer; layer++) {
        onCurrentLayerChange(layer);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      const chunkConfig = {
        ...baseConfig,
        processingDepth: chunkDepth,
        previousLayers: accumulatedLayers,
        startFromLayer: startLayer
      };
      
      try {
        console.log(`Invoking chunk ${chunkIndex + 1} with config:`, chunkConfig);
        
        const { data, error } = await supabase.functions.invoke('genius-machine', {
          body: chunkConfig
        });
        
        if (error) {
          console.error(`Chunk ${chunkIndex + 1} error:`, error);
          throw error;
        }
        
        console.log(`Chunk ${chunkIndex + 1} completed:`, data);
        
        // Accumulate layers
        if (data.layers) {
          accumulatedLayers = [...accumulatedLayers, ...data.layers];
        }
        
        // Update intermediate results
        if (chunkIndex === chunks - 1) {
          // Final chunk - return complete results
          return {
            ...data,
            layers: accumulatedLayers,
            processingDepth: totalDepth,
            chunkProcessed: true
          };
        } else {
          // Intermediate chunk - show progress
          toast({
            title: `Chunk ${chunkIndex + 1}/${chunks} Complete`,
            description: `Processed layers ${startLayer}-${endLayer}. Continuing...`,
            variant: "default",
          });
        }
        
      } catch (chunkError) {
        console.error(`Chunk ${chunkIndex + 1} failed:`, chunkError);
        
        if (accumulatedLayers.length > 0) {
          // Return partial results if we have some progress
          toast({
            title: "Partial Results Available",
            description: `Completed ${accumulatedLayers.length} layers before timeout. Returning available insights.`,
            variant: "default",
          });
          
          const lastLayer = accumulatedLayers[accumulatedLayers.length - 1];
          return {
            insight: lastLayer.insight,
            confidence: lastLayer.confidence,
            tensionPoints: lastLayer.tensionPoints,
            layers: accumulatedLayers,
            processingDepth: accumulatedLayers.length,
            partialResults: true
          };
        } else {
          throw chunkError;
        }
      }
    }
  };

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
        
        finalResults = await processChunkedLayers(baseConfig, processingDepth[0]);
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

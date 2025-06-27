
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SimpleProcessingLogicProps {
  question: string;
  customArchetypes: any;
  processingDepth: number[]; // Now actually used
  circuitType: string; // Now actually used
  enhancedMode: boolean; // Now actually used
  onProcessingStart: () => void;
  onProcessingComplete: (results: any) => void;
  onProcessingError: () => void;
  onCurrentArchetypeChange: (archetype: string) => void;
  onCurrentLayerChange: (layer: number) => void;
  onChunkProgressChange: (progress: { current: number; total: number }) => void;
  onProcessingPhaseChange?: (phase: string) => void;
}

export const SimpleProcessingLogic = ({
  question,
  customArchetypes,
  processingDepth,
  circuitType,
  enhancedMode,
  onProcessingStart,
  onProcessingComplete,
  onProcessingError,
  onCurrentArchetypeChange,
  onCurrentLayerChange,
  onChunkProgressChange,
  onProcessingPhaseChange
}: SimpleProcessingLogicProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartGenius = async () => {
    if (!question.trim()) {
      toast({
        title: "Question Required",
        description: "Please enter a question to analyze.",
        variant: "destructive",
      });
      return;
    }
    
    if (isProcessing) {
      return; // Prevent double-clicks
    }

    console.log('=== STARTING ENHANCED GENIUS ANALYSIS ===');
    console.log('Question:', question.trim().substring(0, 100) + '...');
    console.log('Processing Depth:', processingDepth[0]);
    console.log('Circuit Type:', circuitType);
    console.log('Enhanced Mode:', enhancedMode);
    
    setIsProcessing(true);
    onProcessingStart();
    onCurrentLayerChange(1);
    onChunkProgressChange({ current: 0, total: processingDepth[0] });
    
    if (onProcessingPhaseChange) {
      onProcessingPhaseChange('Connecting to enhanced genius machine...');
    }
    
    onCurrentArchetypeChange('Initializing enhanced archetype processing...');
    
    toast({
      title: "Starting Enhanced Analysis",
      description: `Processing with ${processingDepth[0]} layers using ${circuitType} circuit...`,
      variant: "default",
    });
    
    try {
      // Enhanced call to genius machine with all configuration
      const { data, error } = await supabase.functions.invoke('genius-machine', {
        body: {
          question: question.trim(),
          customArchetypes: customArchetypes || [],
          processingDepth: processingDepth[0],
          circuitType: circuitType,
          enhancedMode: enhancedMode,
          tensionDetection: true // Enable tension detection
        }
      });

      if (error) {
        console.error('Enhanced genius machine error:', error);
        throw new Error(`Processing failed: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned from enhanced genius machine');
      }

      console.log('✓ Enhanced genius processing completed successfully');
      console.log('Response structure:', Object.keys(data));
      
      // Update final progress
      onCurrentArchetypeChange('Enhanced analysis complete');
      onChunkProgressChange({ current: processingDepth[0], total: processingDepth[0] });
      if (onProcessingPhaseChange) {
        onProcessingPhaseChange('Enhanced analysis complete - displaying results');
      }
      
      // Success feedback
      toast({
        title: "Enhanced Analysis Complete",
        description: `Your ${processingDepth[0]}-layer genius analysis has finished successfully!`,
        variant: "default",
      });
      
      // Pass the enhanced results
      onProcessingComplete(data);
      
    } catch (error: any) {
      console.error('=== ENHANCED GENIUS PROCESSING ERROR ===');
      console.error('Error details:', error);
      
      const errorMessage = error?.message || 'Unknown error occurred';
      
      toast({
        title: "Enhanced Processing Error",
        description: `Analysis failed: ${errorMessage}`,
        variant: "destructive",
      });
      
      onProcessingError();
    } finally {
      console.log('=== ENHANCED GENIUS PROCESSING CLEANUP ===');
      setIsProcessing(false);
      onCurrentArchetypeChange("");
      onCurrentLayerChange(1);
      onChunkProgressChange({ current: 0, total: 0 });
      if (onProcessingPhaseChange) {
        onProcessingPhaseChange('Ready for next enhanced analysis');
      }
    }
  };

  return { handleStartGenius };
};


import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SimpleProcessingLogicProps {
  question: string;
  customArchetypes: any;
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

    console.log('=== STARTING CLEAN GENIUS ANALYSIS ===');
    console.log('Question:', question.trim().substring(0, 100) + '...');
    
    setIsProcessing(true);
    onProcessingStart();
    onCurrentLayerChange(1);
    onChunkProgressChange({ current: 0, total: 1 });
    
    if (onProcessingPhaseChange) {
      onProcessingPhaseChange('Connecting to genius machine...');
    }
    
    onCurrentArchetypeChange('Initializing archetype processing...');
    
    toast({
      title: "Starting Analysis",
      description: "Processing your question through multiple AI perspectives...",
      variant: "default",
    });
    
    try {
      // Direct call to our rebuilt genius machine
      const { data, error } = await supabase.functions.invoke('genius-machine', {
        body: {
          question: question.trim(),
          customArchetypes: customArchetypes || []
        }
      });

      if (error) {
        console.error('Genius machine error:', error);
        throw new Error(`Processing failed: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned from genius machine');
      }

      console.log('✓ Clean genius processing completed successfully');
      console.log('Response structure:', Object.keys(data));
      
      // Update final progress
      onCurrentArchetypeChange('Analysis complete');
      onChunkProgressChange({ current: 1, total: 1 });
      if (onProcessingPhaseChange) {
        onProcessingPhaseChange('Analysis complete - displaying results');
      }
      
      // Success feedback
      toast({
        title: "Analysis Complete",
        description: "Your genius analysis has finished successfully!",
        variant: "default",
      });
      
      // Pass the raw results directly - no complex extraction
      onProcessingComplete(data);
      
    } catch (error: any) {
      console.error('=== CLEAN GENIUS PROCESSING ERROR ===');
      console.error('Error details:', error);
      
      const errorMessage = error?.message || 'Unknown error occurred';
      
      toast({
        title: "Processing Error",
        description: `Analysis failed: ${errorMessage}`,
        variant: "destructive",
      });
      
      onProcessingError();
    } finally {
      console.log('=== GENIUS PROCESSING CLEANUP ===');
      setIsProcessing(false);
      onCurrentArchetypeChange("");
      onCurrentLayerChange(1);
      onChunkProgressChange({ current: 0, total: 0 });
      if (onProcessingPhaseChange) {
        onProcessingPhaseChange('Ready for next analysis');
      }
    }
  };

  return { handleStartGenius };
};

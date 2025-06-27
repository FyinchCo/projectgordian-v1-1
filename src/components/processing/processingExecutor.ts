
import { supabase } from "@/integrations/supabase/client";

interface ProcessingRequest {
  question: string;
  processingDepth: number[];
  customArchetypes: any;
  onProcessingComplete: (results: any) => void;
  onCurrentLayerChange: (layer: number) => void;
  onChunkProgressChange: (progress: { current: number; total: number }) => void;
  onCurrentArchetypeChange: (archetype: string) => void;
  onProcessingPhaseChange?: (phase: string) => void;
}

export const useProcessingExecutor = () => {
  const executeProcessing = async (request: ProcessingRequest): Promise<any> => {
    const {
      question,
      customArchetypes,
      onProcessingComplete,
      onCurrentLayerChange,
      onChunkProgressChange,
      onCurrentArchetypeChange,
      onProcessingPhaseChange
    } = request;
    
    console.log('=== EXECUTING REBUILT GENIUS PROCESSING ===');
    console.log('Question:', question.substring(0, 100) + '...');
    
    try {
      // Update progress
      onCurrentLayerChange(1);
      onChunkProgressChange({ current: 0, total: 1 });
      if (onProcessingPhaseChange) {
        onProcessingPhaseChange('Initializing genius analysis...');
      }
      
      onCurrentArchetypeChange('Starting archetype processing...');
      
      // Call the rebuilt genius machine
      const { data, error } = await supabase.functions.invoke('genius-machine', {
        body: {
          question: question.trim(),
          customArchetypes: customArchetypes || []
        }
      });

      if (error) {
        console.error('Genius machine call failed:', error);
        throw new Error(`Processing failed: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned from genius machine');
      }

      console.log('✓ Genius processing completed successfully');
      
      // Update final progress
      onCurrentArchetypeChange('');
      onChunkProgressChange({ current: 1, total: 1 });
      if (onProcessingPhaseChange) {
        onProcessingPhaseChange('Analysis complete');
      }
      
      // Call completion callback
      onProcessingComplete(data);
      
      return data;
      
    } catch (error: any) {
      console.error('Processing execution failed:', error);
      throw error;
    }
  };

  return { executeProcessing };
};

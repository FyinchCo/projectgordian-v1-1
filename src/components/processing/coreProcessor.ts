
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCoreProcessor = () => {
  const processChunkedLayers = async ({
    question,
    processingDepth,
    circuitType,
    enhancedMode,
    customArchetypes,
    compressionSettings,
    outputType,
    onCurrentLayerChange,
    onChunkProgressChange
  }: {
    question: string;
    processingDepth: number;
    circuitType: string;
    enhancedMode: boolean;
    customArchetypes?: any;
    compressionSettings?: any;
    outputType?: string;
    onCurrentLayerChange: (layer: number) => void;
    onChunkProgressChange: (progress: { current: number; total: number }) => void;
  }) => {
    console.log('=== CALLING REAL GENIUS MACHINE ===');
    console.log('Question:', question);
    console.log('Processing depth:', processingDepth);
    
    try {
      // Call the actual Supabase genius-machine function
      const { data, error } = await supabase.functions.invoke('genius-machine', {
        body: {
          question,
          processingDepth,
          circuitType,
          customArchetypes,
          enhancedMode,
          compressionSettings,
          outputType
        }
      });

      if (error) {
        console.error('Genius machine function error:', error);
        throw new Error(`Function call failed: ${error.message}`);
      }

      if (!data) {
        console.error('No data returned from genius machine');
        throw new Error('No data returned from processing function');
      }

      console.log('✓ Real genius machine response received:', data);

      // Update progress tracking
      for (let i = 1; i <= processingDepth; i++) {
        onCurrentLayerChange(i);
        onChunkProgressChange({ current: i, total: processingDepth });
      }

      return {
        layers: data.layers || [],
        insight: data.insight || 'Processing completed',
        confidence: data.confidence || 0.8,
        tensionPoints: data.tensionPoints || 5,
        noveltyScore: data.noveltyScore || 7,
        emergenceDetected: data.emergenceDetected || false,
        circuitType: data.circuitType || circuitType,
        processingDepth: data.processingDepth || processingDepth,
        outputType: data.outputType || outputType,
        logicTrail: data.logicTrail || [],
        questionQuality: data.questionQuality,
        compressionFormats: data.compressionFormats
      };

    } catch (error) {
      console.error('Processing failed:', error);
      throw error;
    }
  };

  return { processChunkedLayers };
};

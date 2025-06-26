
import { supabase } from "@/integrations/supabase/client";

export const useProcessingExecutor = () => {
  const executeProcessing = async (params: {
    question: string;
    processingDepth: number[];
    circuitType: string;
    enhancedMode: boolean;
    customArchetypes?: any;
    currentAssessment?: any;
    compressionSettings?: any;
    outputType?: string;
    onProcessingComplete: (results: any) => void;
    onCurrentLayerChange: (layer: number) => void;
    onChunkProgressChange: (progress: { current: number; total: number }) => void;
  }) => {
    console.log('=== RESTORED GENIUS PROCESSING EXECUTOR START ===');
    console.log('Calling REAL Supabase edge function for genius processing...');
    
    try {
      // Call the REAL Supabase edge function instead of local processing
      const { data, error } = await supabase.functions.invoke('genius-machine', {
        body: {
          question: params.question,
          processingDepth: params.processingDepth[0],
          circuitType: params.circuitType,
          enhancedMode: params.enhancedMode,
          customArchetypes: params.customArchetypes,
          compressionSettings: params.compressionSettings,
          outputType: params.outputType
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Edge function failed: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned from genius machine function');
      }

      console.log('✓ REAL AI processing completed successfully');
      console.log('Result confidence:', Math.round((data.confidence || 0) * 100) + '%');
      console.log('Layers generated:', data.layers?.length || 0);
      console.log('Logic trail entries:', data.logicTrail?.length || 0);
      
      // Update progress throughout processing
      if (data.layers) {
        data.layers.forEach((layer: any, index: number) => {
          setTimeout(() => {
            params.onCurrentLayerChange(index + 1);
            params.onChunkProgressChange({ current: index + 1, total: data.layers.length });
          }, index * 100);
        });
      }
      
      // Call completion handler with real results
      params.onProcessingComplete(data);
      
      return data;

    } catch (error) {
      console.error('REAL processing failed, attempting recovery:', error);
      
      // Only fall back if edge function is completely unavailable
      if (error.message.includes('Failed to fetch') || error.message.includes('network')) {
        console.log('Network issue detected, using emergency local processing...');
        
        // Minimal emergency fallback
        const emergencyResult = {
          layers: Array.from({ length: Math.min(params.processingDepth[0], 3) }, (_, i) => ({
            layerNumber: i + 1,
            insight: `Emergency processing layer ${i + 1}: Limited analysis due to system connectivity issues. Real genius processing temporarily unavailable.`,
            confidence: 0.3,
            tensionPoints: 1,
            noveltyScore: 2,
            emergenceDetected: false,
            methodology: 'Emergency fallback processing'
          })),
          insight: 'System temporarily operating in emergency mode. Full genius capabilities will be restored when connection is reestablished.',
          confidence: 0.3,
          tensionPoints: 1,
          noveltyScore: 2,
          emergenceDetected: false,
          logicTrail: [],
          questionQuality: {
            overallScore: 3.0,
            feedback: 'Emergency processing mode - limited analysis capabilities'
          }
        };
        
        params.onProcessingComplete(emergencyResult);
        return emergencyResult;
      }
      
      throw error;
    }
  };

  return { executeProcessing };
};

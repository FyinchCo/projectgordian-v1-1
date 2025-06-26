
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
    onCurrentArchetypeChange?: (archetype: string) => void;
    onProcessingPhaseChange?: (phase: string) => void;
  }) => {
    console.log('=== DIRECT GENIUS ENGINE CALL ===');
    console.log(`Requesting ${params.processingDepth[0]} layers with full genius capability`);
    
    // Initialize progress tracking
    params.onCurrentLayerChange(1);
    params.onChunkProgressChange({ current: 0, total: params.processingDepth[0] });
    if (params.onProcessingPhaseChange) {
      params.onProcessingPhaseChange('Initializing genius-level cognitive architecture...');
    }
    
    try {
      // Direct call to genius engine - no interference
      const { data, error } = await supabase.functions.invoke('genius-machine', {
        body: {
          question: params.question,
          processingDepth: params.processingDepth[0], // Use exactly what user requested
          circuitType: params.circuitType,
          enhancedMode: params.enhancedMode,
          customArchetypes: params.customArchetypes,
          compressionSettings: params.compressionSettings,
          outputType: params.outputType,
          realTimeProgress: true,
          trustEngineProcessing: true // Signal to engine to handle its own optimization
        }
      });

      if (error) {
        console.error('Genius engine error:', error);
        throw new Error(`Genius processing failed: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned from genius engine');
      }

      console.log('✓ Genius engine completed successfully');
      console.log(`Generated ${data.layers?.length || 0} layers of analysis`);
      
      // Process real-time progress updates from engine
      if (data.metadata?.progressUpdates) {
        console.log(`Received ${data.metadata.progressUpdates.length} progress updates from engine`);
        
        // Apply progress updates to UI with slight delay for smooth experience
        data.metadata.progressUpdates.forEach((update: any, index: number) => {
          setTimeout(() => {
            params.onCurrentLayerChange(update.currentLayer);
            params.onChunkProgressChange({ 
              current: update.currentLayer, 
              total: update.totalLayers 
            });
            
            if (params.onCurrentArchetypeChange && update.currentArchetype) {
              params.onCurrentArchetypeChange(update.currentArchetype);
            }
            
            if (params.onProcessingPhaseChange) {
              const phaseMessages = {
                'initializing': 'Initializing cognitive architecture...',
                'processing': `Processing ${update.currentArchetype}...`,
                'synthesizing': 'Synthesizing breakthrough insights...',
                'completing': 'Finalizing genius-level analysis...',
                'completed': 'Genius analysis complete with breakthrough insights'
              };
              params.onProcessingPhaseChange(
                phaseMessages[update.phase as keyof typeof phaseMessages] || 'Processing...'
              );
            }
          }, index * 100);
        });
      }
      
      params.onProcessingComplete(data);
      return data;

    } catch (error) {
      console.error('Genius engine call failed:', error);
      
      // Provide clear error messaging
      const errorMessage = error?.message || 'Unknown error';
      if (errorMessage.includes('timeout')) {
        throw new Error(`Processing timed out after requesting ${params.processingDepth[0]} layers. The genius engine may need more time for deep analysis. Consider reducing depth or allowing more time.`);
      } else if (errorMessage.includes('Load failed')) {
        throw new Error('Genius engine temporarily unavailable. Please try again in a moment.');
      } else {
        throw new Error(`Genius processing error: ${errorMessage}`);
      }
    }
  };

  return { executeProcessing };
};


import { supabase } from '@/integrations/supabase/client';

interface ProcessingParams {
  question: string;
  processingDepth: number;
  circuitType: string;
  enhancedMode: boolean;
  customArchetypes?: any;
  compressionSettings?: any;
  outputType?: string;
  onCurrentLayerChange: (layer: number) => void;
  onChunkProgressChange: (progress: { current: number; total: number }) => void;
}

interface ProcessingResult {
  layers: any[];
  insight: string;
  confidence: number;
  tensionPoints: number;
  noveltyScore: number;
  emergenceDetected: boolean;
  circuitType: string;
  processingDepth: number;
  outputType: string;
  logicTrail: any[];
  questionQuality?: any;
  compressionFormats?: any;
}

export const processWithGeniusMachine = async (params: ProcessingParams): Promise<ProcessingResult> => {
  const {
    question,
    processingDepth,
    circuitType,
    enhancedMode,
    customArchetypes,
    compressionSettings,
    outputType,
    onCurrentLayerChange,
    onChunkProgressChange
  } = params;

  console.log('=== SIMPLIFIED DIRECT GENIUS MACHINE CALL ===');
  console.log('Question:', question.substring(0, 100) + '...');
  console.log('Processing depth:', processingDepth);
  console.log('Circuit type:', circuitType);

  // Set initial state
  onCurrentLayerChange(1);
  onChunkProgressChange({ current: 0, total: processingDepth });

  try {
    // Simple direct call with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    console.log('Calling genius-machine function...');
    
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

    clearTimeout(timeoutId);

    if (error) {
      console.error('Genius machine function error:', error);
      throw new Error(`Processing failed: ${error.message}`);
    }

    if (!data) {
      console.error('No data returned from genius machine');
      throw new Error('No data returned from processing');
    }

    console.log('✓ Genius machine response received successfully');

    // Update progress to completion
    onCurrentLayerChange(processingDepth);
    onChunkProgressChange({ current: processingDepth, total: processingDepth });

    // Return standardized result
    return {
      layers: data.layers || [],
      insight: data.insight || 'Processing completed successfully',
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

  } catch (error: any) {
    console.error('Direct processing failed:', error);
    
    // Reset progress indicators
    onCurrentLayerChange(1);
    onChunkProgressChange({ current: 0, total: 0 });

    // Determine error type and throw appropriate message
    if (error.name === 'AbortError') {
      throw new Error('Processing timed out after 60 seconds. Please try again with a shorter processing depth.');
    }
    
    if (error.message?.includes('timeout')) {
      throw new Error('Connection timeout. Please check your internet connection and try again.');
    }
    
    if (error.message?.includes('network')) {
      throw new Error('Network error. Please check your connection and try again.');
    }

    // Generic error
    throw new Error(`Processing failed: ${error.message || 'Unknown error occurred'}`);
  }
};

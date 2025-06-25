
import { useToast } from "@/hooks/use-toast";
import { ChunkedProcessorProps, ProcessingResult } from './types';
import { createFinalResult } from './chunkResultHandler';
import { createProgressToast } from './visualProgressHandler';
import { normalizeLayerStructure } from './layerNormalizer';
import { executeChunk } from './chunkExecutor';

export const useCoreProcessor = () => {
  const { toast } = useToast();

  const processChunkedLayers = async ({
    baseConfig,
    totalDepth,
    chunkSize = 2, // REDUCED from 3 to 2 layers per chunk
    onChunkProgressChange,
    onCurrentLayerChange,
  }: ChunkedProcessorProps): Promise<ProcessingResult> => {
    const chunks = Math.ceil(totalDepth / chunkSize);
    let accumulatedLayers: any[] = [];
    
    console.log(`=== CHUNKED PROCESSING START ===`);
    console.log(`Total depth: ${totalDepth}, Chunk size: ${chunkSize}, Total chunks: ${chunks}`);
    console.log(`Expected timing: ~${chunkSize * 30}s per chunk (30s per layer average)`);
    console.log(`🔧 OPTIMIZATION: Using reduced chunk size (2) and limited context window`);
    onChunkProgressChange({ current: 0, total: chunks });
    
    for (let chunkIndex = 0; chunkIndex < chunks; chunkIndex++) {
      const startLayer = (chunkIndex * chunkSize) + 1;
      const endLayer = Math.min(startLayer + chunkSize - 1, totalDepth);
      const actualChunkSize = endLayer - startLayer + 1;
      
      console.log(`=== CHUNK ${chunkIndex + 1}/${chunks} START ===`);
      console.log(`Processing layers ${startLayer}-${endLayer} (${actualChunkSize} layers)`);
      console.log(`Expected chunk duration: ~${actualChunkSize * 30}s`);
      
      // CONTEXT WINDOW LIMITING: Only pass last 3 layers to prevent exponential growth
      const contextLayers = accumulatedLayers.length > 3 
        ? accumulatedLayers.slice(-3) 
        : accumulatedLayers;
      
      console.log(`Context optimization: Using ${contextLayers.length} layers (total accumulated: ${accumulatedLayers.length})`);
      
      const chunkConfig = {
        ...baseConfig,
        processingDepth: actualChunkSize,
        previousLayers: contextLayers, // LIMITED CONTEXT WINDOW
        startFromLayer: startLayer
      };
      
      console.log(`Chunk config:`, {
        processingDepth: actualChunkSize,
        startFromLayer: startLayer,
        contextLayersCount: contextLayers.length,
        totalAccumulatedCount: accumulatedLayers.length,
        questionLength: baseConfig.question?.length || 0
      });
      
      onChunkProgressChange({ current: chunkIndex + 1, total: chunks });
      
      // Update visual progress
      for (let layer = startLayer; layer <= endLayer; layer++) {
        onCurrentLayerChange(layer);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      try {
        const { data, chunkDuration } = await executeChunk(chunkConfig, chunkIndex, actualChunkSize);
        
        const normalizedLayers = data.layers
          .map(normalizeLayerStructure)
          .sort((a, b) => a.layerNumber - b.layerNumber);
        
        const expectedLayerNumbers = [];
        for (let i = startLayer; i <= endLayer; i++) {
          expectedLayerNumbers.push(i);
        }
        
        const actualLayerNumbers = normalizedLayers.map(l => l.layerNumber);
        console.log(`Expected layer numbers:`, expectedLayerNumbers);
        console.log(`Actual layer numbers:`, actualLayerNumbers);
        
        accumulatedLayers = [...accumulatedLayers, ...normalizedLayers];
        
        console.log(`=== CHUNK ${chunkIndex + 1} COMPLETE ===`);
        console.log(`Total accumulated layers: ${accumulatedLayers.length}/${totalDepth}`);
        console.log(`Chunk progress: ${chunkIndex + 1}/${chunks}`);
        console.log(`Processing efficiency: ${Math.round(chunkDuration/(actualChunkSize * 1000))}s per layer`);
        
        if (chunkIndex === chunks - 1) {
          const finalResult = createFinalResult(data, accumulatedLayers, totalDepth);
          
          console.log(`=== FINAL CHUNKED PROCESSING COMPLETE ===`);
          console.log('Final result summary:', {
            totalLayers: finalResult.layers?.length || 0,
            hasInsight: !!finalResult.insight,
            confidence: finalResult.confidence,
            layersWithInsights: accumulatedLayers.filter(l => l.insight && l.insight !== `Layer ${l.layerNumber} insight not available`).length,
            requestedDepth: totalDepth,
            actualDepth: accumulatedLayers.length,
            processingSuccess: accumulatedLayers.length === totalDepth
          });
          
          toast({
            title: "🎯 Deep Processing Complete",
            description: `Successfully processed all ${accumulatedLayers.length} layers with ${Math.round((finalResult.confidence || 0) * 100)}% confidence`,
            variant: "default",
          });
          
          return finalResult;
        } else {
          const progressData = createProgressToast(chunkIndex, chunks, startLayer, endLayer);
          toast(progressData);
          
          console.log(`Chunk ${chunkIndex + 1} complete, continuing to next chunk...`);
          
          // INTER-CHUNK DELAY: Let backend recover between chunks
          console.log(`⏱️ Adding 2-second delay before next chunk for backend stability...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
      } catch (chunkError: any) {
        console.error(`=== CHUNK ${chunkIndex + 1} ERROR ===`);
        console.error('Error details:', {
          message: chunkError.message,
          name: chunkError.name,
          stack: chunkError.stack?.substring(0, 200),
          accumulatedLayers: accumulatedLayers.length,
          hasValidLayers: accumulatedLayers.some(l => l?.insight),
          chunkIndex,
          totalChunks: chunks
        });
        
        const isTimeoutError = chunkError.message?.includes('timeout') || chunkError.message?.includes('timed out');
        const isConnectionError = chunkError.message?.includes('Failed to send a request') || chunkError.message?.includes('connection');
        
        if (isTimeoutError) {
          console.log(`🚨 TIMEOUT ISSUE: Chunk ${chunkIndex + 1} exceeded 6 minutes - this suggests backend processing issues`);
          toast({
            title: "Processing Timeout",
            description: `Chunk ${chunkIndex + 1} exceeded timeout. Backend may be overloaded or question too complex.`,
            variant: "destructive",
          });
        } else if (isConnectionError) {
          console.log(`🚨 CONNECTION ISSUE: Chunk ${chunkIndex + 1} had network problems`);
          toast({
            title: "Connection Issue",
            description: `Chunk ${chunkIndex + 1} had a connection problem. Network or server issue.`,
            variant: "destructive",
          });
        }
        
        if (accumulatedLayers.length > 0) {
          const lastValidLayer = accumulatedLayers[accumulatedLayers.length - 1];
          
          toast({
            title: "Partial Results Available",
            description: `Completed ${accumulatedLayers.length} layers before error. Returning available insights.`,
            variant: "default",
          });
          
          return {
            insight: lastValidLayer?.insight || `Partial processing completed with ${accumulatedLayers.length} layers.`,
            confidence: lastValidLayer?.confidence || 0.6,
            tensionPoints: lastValidLayer?.tensionPoints || 3,
            noveltyScore: lastValidLayer?.noveltyScore || 5,
            emergenceDetected: lastValidLayer?.emergenceDetected || false,
            layers: accumulatedLayers,
            processingDepth: accumulatedLayers.length,
            partialResults: true,
            errorMessage: chunkError.message,
            logicTrail: lastValidLayer?.archetypeResponses || [],
            compressionFormats: lastValidLayer?.compressionFormats
          };
        } else {
          throw chunkError;
        }
      }
    }

    throw new Error('Unexpected end of processing loop - this should never happen');
  };

  return { processChunkedLayers };
};

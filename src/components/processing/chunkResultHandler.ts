
import { useToast } from "@/hooks/use-toast";

export const createProcessingTimeout = (chunkIndex: number) => {
  return new Promise<never>((_, reject) => {
    setTimeout(() => {
      console.log(`Chunk ${chunkIndex + 1} timeout triggered at:`, new Date().toISOString());
      reject(new Error(`CHUNK_TIMEOUT: Chunk ${chunkIndex + 1} timeout after 60 seconds`));
    }, 60000);
  });
};

export const validateChunkResult = (result: any, chunkIndex: number) => {
  if (result.error) {
    console.error(`Chunk ${chunkIndex + 1} function error:`, result.error);
    throw new Error(`FUNCTION_ERROR: ${result.error.message || 'Edge Function returned a non-2xx status code'}`);
  }

  if (!result.data) {
    console.error(`Chunk ${chunkIndex + 1} - No data in response`);
    throw new Error(`NO_DATA: Empty response from chunk ${chunkIndex + 1}`);
  }

  return result;
};

export const createFinalResult = (data: any, accumulatedLayers: any[], totalDepth: number) => {
  console.log('Creating final result with:', {
    hasData: !!data,
    accumulatedLayers: accumulatedLayers.length,
    totalDepth,
    hasCompressionFormats: !!data.compressionFormats
  });

  return {
    ...data,
    layers: accumulatedLayers,
    processingDepth: accumulatedLayers.length,
    chunkProcessed: true,
    compressionFormats: data.compressionFormats || (accumulatedLayers.length > 0 ? accumulatedLayers[accumulatedLayers.length - 1].synthesis?.compressionFormats : undefined)
  };
};

export const handleChunkError = (chunkError: any, accumulatedLayers: any[], chunkIndex: number) => {
  console.error(`Chunk ${chunkIndex + 1} failed:`, {
    error: chunkError.message,
    errorType: chunkError.constructor.name,
    accumulatedLayers: accumulatedLayers.length,
    timestamp: new Date().toISOString()
  });

  const hasPartialResults = accumulatedLayers.length > 0;
  
  if (hasPartialResults) {
    console.log(`Returning partial results: ${accumulatedLayers.length} layers processed`);
    
    const lastLayer = accumulatedLayers[accumulatedLayers.length - 1];
    
    return {
      insight: lastLayer.synthesis?.insight || `Partial processing completed with ${accumulatedLayers.length} layers processed.`,
      confidence: lastLayer.synthesis?.confidence || 0.5,
      tensionPoints: lastLayer.synthesis?.tensionPoints || 3,
      noveltyScore: lastLayer.synthesis?.noveltyScore || 5,
      emergenceDetected: lastLayer.synthesis?.emergenceDetected || false,
      layers: accumulatedLayers,
      processingDepth: accumulatedLayers.length,
      partialResults: true,
      errorMessage: chunkError.message,
      compressionFormats: lastLayer.synthesis?.compressionFormats
    };
  }

  throw chunkError;
};

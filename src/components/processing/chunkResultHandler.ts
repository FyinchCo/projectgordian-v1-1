
export const createProcessingTimeout = (chunkIndex: number, timeoutMs: number = 90000) => {
  return new Promise<never>((_, reject) => {
    setTimeout(() => {
      console.log(`Chunk ${chunkIndex + 1} timeout triggered after ${timeoutMs}ms at:`, new Date().toISOString());
      reject(new Error(`CHUNK_TIMEOUT: Chunk ${chunkIndex + 1} timed out after ${timeoutMs / 1000} seconds`));
    }, timeoutMs);
  });
};

export const validateChunkResult = (result: any, chunkIndex: number) => {
  if (!result) {
    throw new Error(`CHUNK_RESULT_MISSING: Chunk ${chunkIndex + 1} returned no result`);
  }
  
  if (result.error) {
    console.error(`Chunk ${chunkIndex + 1} Supabase error:`, result.error);
    throw new Error(`SUPABASE_ERROR: ${result.error.message || 'Unknown Supabase error'}`);
  }
  
  if (!result.data) {
    console.error(`Chunk ${chunkIndex + 1} no data in response:`, result);
    throw new Error(`NO_DATA: Chunk ${chunkIndex + 1} response contains no data`);
  }
  
  return result;
};

export const createFinalResult = (data: any, accumulatedLayers: any[], totalDepth: number) => {
  console.log('Creating final result with:', {
    hasData: !!data,
    accumulatedLayersCount: accumulatedLayers.length,
    totalDepth,
    dataKeys: data ? Object.keys(data) : []
  });
  
  return {
    ...data,
    layers: accumulatedLayers,
    processingDepth: accumulatedLayers.length,
    chunkProcessed: true,
    partialResults: accumulatedLayers.length < totalDepth
  };
};

export const handleChunkError = (chunkError: any, accumulatedLayers: any[], chunkIndex: number) => {
  console.error(`Chunk ${chunkIndex + 1} error details:`, {
    error: chunkError.message,
    errorType: chunkError.constructor.name,
    accumulatedLayers: accumulatedLayers.length,
    timestamp: new Date().toISOString()
  });
  
  // If we have some layers, return partial results
  if (accumulatedLayers.length > 0) {
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
      logicTrail: lastLayer.archetypeResponses || []
    };
  }
  
  // No partial results available
  throw chunkError;
};

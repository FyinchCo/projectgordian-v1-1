
import { ChunkResult, ProcessingResult } from './types';

export const createProcessingTimeout = (chunkIndex: number, timeoutMs: number = 45000): Promise<never> => {
  return new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`CHUNK_TIMEOUT: Chunk ${chunkIndex + 1} timed out after ${timeoutMs / 1000} seconds`));
    }, timeoutMs);
  });
};

export const validateChunkResult = (result: any, chunkIndex: number): { data?: any; error?: any } => {
  if (!result || typeof result !== 'object') {
    throw new Error(`INVALID_RESPONSE: Chunk ${chunkIndex + 1} returned invalid response`);
  }

  const { data, error } = result as { data?: any; error?: any };

  if (error) {
    console.error(`Chunk ${chunkIndex + 1} function error:`, error);
    throw new Error(`FUNCTION_ERROR: ${error.message || 'Unknown function error'}`);
  }

  if (!data) {
    console.error(`Chunk ${chunkIndex + 1} returned no data`);
    throw new Error(`NO_DATA: Chunk ${chunkIndex + 1} returned empty response`);
  }

  return { data, error };
};

export const createPartialResult = (
  accumulatedLayers: any[],
  chunkError: any
): ProcessingResult => {
  const lastLayer = accumulatedLayers[accumulatedLayers.length - 1];
  return {
    insight: lastLayer.insight || "Partial processing completed",
    confidence: lastLayer.confidence || 6,
    tensionPoints: lastLayer.tensionPoints || 5,
    layers: accumulatedLayers,
    processingDepth: accumulatedLayers.length,
    partialResults: true,
    errorMessage: `Processing stopped at layer ${accumulatedLayers.length}: ${chunkError.message}`
  };
};

export const createFinalResult = (
  data: any,
  accumulatedLayers: any[],
  totalDepth: number
): ProcessingResult => {
  const finalResults = {
    ...data,
    layers: accumulatedLayers,
    processingDepth: totalDepth,
    chunkProcessed: true
  };

  console.log('Final chunk processed, returning complete results:', {
    totalLayers: accumulatedLayers.length,
    hasInsight: !!finalResults.insight,
    confidence: finalResults.confidence
  });

  return finalResults;
};

export const handleChunkError = (
  chunkError: any,
  accumulatedLayers: any[],
  chunkIndex: number
): ProcessingResult => {
  console.error(`Chunk ${chunkIndex + 1} failed:`, {
    error: chunkError.message,
    errorType: chunkError.name,
    accumulatedLayers: accumulatedLayers.length,
    timestamp: new Date().toISOString()
  });

  // Return partial results if we have some progress
  if (accumulatedLayers.length > 0) {
    console.log(`Returning partial results: ${accumulatedLayers.length} layers processed`);
    return createPartialResult(accumulatedLayers, chunkError);
  } else {
    const errorMessage = chunkError.message || 'Unknown error';
    if (errorMessage.includes('CHUNK_TIMEOUT')) {
      throw new Error('PROCESSING_TIMEOUT: The genius machine is taking longer than expected. This may be due to system load.');
    } else {
      throw new Error(`PROCESSING_ERROR: ${errorMessage}`);
    }
  }
};

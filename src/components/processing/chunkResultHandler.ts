
import { ProcessingResult } from './types';

export const createProcessingTimeout = (chunkIndex: number, timeoutMs: number = 120000) => {
  return new Promise((_, reject) => 
    setTimeout(() => reject(new Error(`Chunk ${chunkIndex + 1} timed out after ${timeoutMs}ms`)), timeoutMs)
  );
};

export const validateChunkResult = (result: any, chunkIndex: number) => {
  if (!result) {
    throw new Error(`Chunk ${chunkIndex + 1} returned null result`);
  }
  
  if (result.error) {
    throw new Error(`Chunk ${chunkIndex + 1} error: ${result.error.message || 'Unknown error'}`);
  }
  
  const { data } = result;
  if (!data) {
    throw new Error(`Chunk ${chunkIndex + 1} returned no data`);
  }
  
  return { data };
};

export const createFinalResult = (data: any, accumulatedLayers: any[], totalDepth: number): ProcessingResult => {
  // Use the final layer's synthesis as the main result
  const finalLayer = accumulatedLayers[accumulatedLayers.length - 1];
  
  return {
    insight: finalLayer?.synthesis?.insight || data.insight,
    confidence: finalLayer?.synthesis?.confidence || data.confidence,
    tensionPoints: finalLayer?.synthesis?.tensionPoints || data.tensionPoints,
    noveltyScore: finalLayer?.synthesis?.noveltyScore || data.noveltyScore,
    emergenceDetected: finalLayer?.synthesis?.emergenceDetected || data.emergenceDetected,
    layers: accumulatedLayers,
    processingDepth: accumulatedLayers.length,
    logicTrail: finalLayer?.archetypeResponses || data.logicTrail || [],
    circuitType: data.circuitType,
    enhancedMode: data.enhancedMode,
    assumptionAnalysis: data.assumptionAnalysis,
    assumptionChallenge: data.assumptionChallenge,
    finalTensionMetrics: finalLayer?.tensionMetrics || data.finalTensionMetrics,
    compressionFormats: finalLayer?.synthesis?.compressionFormats || data.compressionFormats
  };
};

export const handleChunkError = (chunkError: any, accumulatedLayers: any[], chunkIndex: number) => {
  console.error(`Chunk ${chunkIndex + 1} error details:`, {
    message: chunkError.message,
    accumulatedLayers: accumulatedLayers.length,
    hasValidLayers: accumulatedLayers.some(l => l?.synthesis?.insight)
  });

  // If we have accumulated layers with valid insights, use the last one
  if (accumulatedLayers.length > 0) {
    const lastValidLayer = accumulatedLayers
      .slice()
      .reverse()
      .find(layer => layer?.synthesis?.insight);
    
    if (lastValidLayer) {
      return {
        insight: lastValidLayer.synthesis.insight,
        confidence: lastValidLayer.synthesis.confidence || 0.5,
        tensionPoints: lastValidLayer.synthesis.tensionPoints || 3,
        noveltyScore: lastValidLayer.synthesis.noveltyScore || 5,
        emergenceDetected: lastValidLayer.synthesis.emergenceDetected || false,
        layers: accumulatedLayers,
        processingDepth: accumulatedLayers.length,
        partialResults: true,
        errorMessage: chunkError.message,
        logicTrail: lastValidLayer.archetypeResponses || [],
        compressionFormats: lastValidLayer.synthesis.compressionFormats
      };
    }
  }

  // Only return generic fallback if no valid layers exist
  return {
    partialResults: false,
    errorMessage: chunkError.message
  };
};

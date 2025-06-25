import { ProcessingResult } from './types';

export const createProcessingTimeout = (chunkIndex: number, timeoutMs: number = 480000) => {
  return new Promise((_, reject) => 
    setTimeout(() => reject(new Error(`Chunk ${chunkIndex + 1} timed out after ${Math.round(timeoutMs/60000)} minutes`)), timeoutMs)
  );
};

export const validateChunkResult = (result: any, chunkIndex: number) => {
  console.log(`Validating chunk ${chunkIndex + 1} result:`, {
    hasResult: !!result,
    hasError: !!result?.error,
    hasData: !!result?.data,
    status: result?.status,
    statusText: result?.statusText
  });

  if (!result) {
    throw new Error(`Chunk ${chunkIndex + 1} returned null result`);
  }
  
  // Handle Supabase function invoke errors
  if (result.error) {
    console.error(`Chunk ${chunkIndex + 1} supabase error:`, result.error);
    throw new Error(`Chunk ${chunkIndex + 1} error: ${result.error.message || 'Unknown supabase error'}`);
  }
  
  const { data } = result;
  if (!data) {
    throw new Error(`Chunk ${chunkIndex + 1} returned no data`);
  }
  
  return { data };
};

export const createFinalResult = (data: any, accumulatedLayers: any[], totalDepth: number): ProcessingResult => {
  const finalLayer = accumulatedLayers[accumulatedLayers.length - 1];
  
  console.log('Creating final result with layers:', {
    totalLayers: accumulatedLayers.length,
    finalLayerHasInsight: !!finalLayer?.insight,
    sampleLayerInsights: accumulatedLayers.slice(0, 3).map(l => ({
      layer: l.layerNumber,
      hasInsight: !!l.insight,
      insightLength: l.insight?.length || 0
    }))
  });
  
  return {
    insight: finalLayer?.insight || data.insight || 'Processing completed successfully',
    confidence: finalLayer?.confidence || data.confidence || 0.7,
    tensionPoints: finalLayer?.tensionPoints || data.tensionPoints || 3,
    noveltyScore: finalLayer?.noveltyScore || data.noveltyScore || 5,
    emergenceDetected: finalLayer?.emergenceDetected || data.emergenceDetected || false,
    layers: accumulatedLayers,
    processingDepth: accumulatedLayers.length,
    logicTrail: finalLayer?.archetypeResponses || data.logicTrail || [],
    circuitType: data.circuitType,
    enhancedMode: data.enhancedMode,
    assumptionAnalysis: data.assumptionAnalysis,
    assumptionChallenge: data.assumptionChallenge,
    finalTensionMetrics: finalLayer?.tensionMetrics || data.finalTensionMetrics,
    compressionFormats: finalLayer?.compressionFormats || data.compressionFormats
  };
};

export const handleChunkError = (chunkError: any, accumulatedLayers: any[], chunkIndex: number) => {
  console.error(`Chunk ${chunkIndex + 1} error details:`, {
    message: chunkError.message,
    accumulatedLayers: accumulatedLayers.length,
    hasValidLayers: accumulatedLayers.some(l => l?.insight)
  });

  if (accumulatedLayers.length > 0) {
    const lastValidLayer = accumulatedLayers
      .slice()
      .reverse()
      .find(layer => layer?.insight);
    
    if (lastValidLayer) {
      return {
        insight: lastValidLayer.insight,
        confidence: lastValidLayer.confidence || 0.5,
        tensionPoints: lastValidLayer.tensionPoints || 3,
        noveltyScore: lastValidLayer.noveltyScore || 5,
        emergenceDetected: lastValidLayer.emergenceDetected || false,
        layers: accumulatedLayers,
        processingDepth: accumulatedLayers.length,
        partialResults: true,
        errorMessage: chunkError.message,
        logicTrail: lastValidLayer.archetypeResponses || [],
        compressionFormats: lastValidLayer.compressionFormats
      };
    }
  }

  return {
    partialResults: false,
    errorMessage: chunkError.message
  };
};

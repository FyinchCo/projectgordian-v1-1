
export const normalizeLayerStructure = (layer: any) => {
  // Ensure consistent layer structure with insights in the expected location
  if (!layer) return layer;
  
  const normalizedLayer = {
    ...layer,
    // Ensure insight is available at the expected location
    insight: layer.insight || layer.synthesis?.insight || `Layer ${layer.layerNumber || 'unknown'} insight not available`,
    confidence: layer.confidence || layer.synthesis?.confidence || 0.5,
    tensionPoints: layer.tensionPoints || layer.synthesis?.tensionPoints || 3,
    noveltyScore: layer.noveltyScore || layer.synthesis?.noveltyScore || 5,
    emergenceDetected: layer.emergenceDetected || layer.synthesis?.emergenceDetected || false,
    archetypeResponses: layer.archetypeResponses || [],
    // Preserve synthesis object for compatibility
    synthesis: layer.synthesis || {
      insight: layer.insight,
      confidence: layer.confidence || 0.5,
      tensionPoints: layer.tensionPoints || 3,
      noveltyScore: layer.noveltyScore || 5,
      emergenceDetected: layer.emergenceDetected || false
    }
  };

  console.log(`Normalized layer ${normalizedLayer.layerNumber}:`, {
    hasInsight: !!normalizedLayer.insight,
    insightLength: normalizedLayer.insight?.length || 0,
    hasSynthesis: !!normalizedLayer.synthesis,
    confidence: normalizedLayer.confidence
  });

  return normalizedLayer;
};

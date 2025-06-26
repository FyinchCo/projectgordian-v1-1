export const normalizeLayerStructure = (layer: any, index?: number) => {
  // Handle malformed or duplicate layers
  if (!layer) {
    return null;
  }

  // Extract layer number from various possible formats
  let layerNumber = layer.layerNumber || layer.layer || (index !== undefined ? index + 1 : 1);
  
  // Ensure layer number is a valid integer
  if (typeof layerNumber !== 'number' || layerNumber < 1) {
    layerNumber = (index !== undefined ? index + 1 : 1);
  }

  // Handle different insight formats
  let insight = layer.insight || layer.synthesis?.insight || layer.content || '';
  
  // Clean up insight text - remove layer escalation artifacts
  if (typeof insight === 'string') {
    insight = insight
      .replace(/^Layer \d+ tension escalation: /, '')
      .replace(/^Layer \d+ synthesis: /, '')
      .trim();
  }

  // Extract confidence (convert percentage strings to decimals)
  let confidence = layer.confidence || layer.synthesis?.confidence || 0.5;
  if (typeof confidence === 'string' && confidence.includes('%')) {
    confidence = parseFloat(confidence.replace('%', '')) / 100;
  }
  if (confidence > 1) {
    confidence = confidence / 100;
  }

  // Extract tension points
  let tensionPoints = layer.tensionPoints || layer.synthesis?.tensionPoints || 0;
  if (typeof tensionPoints === 'string') {
    tensionPoints = parseInt(tensionPoints) || 0;
  }

  // Extract novelty score
  let noveltyScore = layer.noveltyScore || layer.synthesis?.noveltyScore || 5;
  if (typeof noveltyScore === 'string') {
    noveltyScore = parseInt(noveltyScore) || 5;
  }

  // Extract circuit type
  const circuitType = layer.circuitType || layer.synthesis?.circuitType || 'sequential';

  // Extract emergence detection
  const emergenceDetected = layer.emergenceDetected || layer.synthesis?.emergenceDetected || false;

  // Extract archetype responses
  const archetypeResponses = layer.archetypeResponses || layer.responses || [];

  return {
    layerNumber,
    insight,
    confidence: Math.max(0.1, Math.min(1.0, confidence)),
    tensionPoints: Math.max(0, Math.min(10, tensionPoints)),
    noveltyScore: Math.max(1, Math.min(10, noveltyScore)),
    circuitType,
    emergenceDetected,
    archetypeResponses,
    timestamp: layer.timestamp || Date.now()
  };
};

export const deduplicateLayers = (layers: any[]) => {
  if (!Array.isArray(layers)) {
    return [];
  }

  // Normalize all layers first
  const normalizedLayers = layers
    .map((layer, index) => normalizeLayerStructure(layer, index))
    .filter(layer => layer !== null);

  // Group by layer number and keep the best version of each
  const layerGroups: Record<number, any[]> = {};
  
  normalizedLayers.forEach(layer => {
    const layerNum = layer.layerNumber;
    if (!layerGroups[layerNum]) {
      layerGroups[layerNum] = [];
    }
    layerGroups[layerNum].push(layer);
  });

  // For each layer number, pick the best version (highest confidence, longest insight)
  const finalLayers: any[] = [];
  
  Object.keys(layerGroups)
    .map(Number)
    .sort((a, b) => a - b)
    .forEach(layerNum => {
      const candidates = layerGroups[layerNum];
      
      // Pick the best candidate based on confidence and insight quality
      const bestCandidate = candidates.reduce((best, current) => {
        const bestScore = (best.confidence * 0.7) + (best.insight.length * 0.3);
        const currentScore = (current.confidence * 0.7) + (current.insight.length * 0.3);
        return currentScore > bestScore ? current : best;
      });
      
      finalLayers.push(bestCandidate);
    });

  return finalLayers;
};

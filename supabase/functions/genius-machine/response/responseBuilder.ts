
import { LayerResult } from '../types.ts';

export async function buildFinalResponse(
  layers: LayerResult[],
  question: string,
  circuitType: string,
  compressionSettings: any,
  outputType: string
): Promise<any> {
  console.log(`=== BUILDING FINAL GENIUS RESPONSE ===`);
  console.log(`Processing ${layers.length} layers for final response`);
  
  if (!layers || layers.length === 0) {
    throw new Error('No layers available for final response');
  }
  
  // Calculate real aggregate metrics
  const avgConfidence = layers.reduce((sum, layer) => 
    sum + (layer.synthesis?.confidence || 0.5), 0) / layers.length;
  
  const totalTensionPoints = layers.reduce((sum, layer) => 
    sum + (layer.synthesis?.tensionPoints || 0), 0);
  
  const maxNoveltyScore = Math.max(...layers.map(layer => 
    layer.synthesis?.noveltyScore || 0));
  
  const emergenceDetected = layers.some(layer => 
    layer.synthesis?.emergenceDetected);
  
  const breakthroughsDetected = layers.filter(layer => 
    layer.synthesis?.breakthroughTriggered).length;
  
  // Generate intelligent final insight
  const finalInsight = await generateIntelligentFinalInsight(
    layers, 
    question, 
    outputType, 
    compressionSettings
  );
  
  // Build comprehensive logic trail
  const logicTrail = layers.flatMap(layer => 
    layer.logicTrail || []
  );
  
  console.log(`✓ Final response built: ${breakthroughsDetected} breakthroughs, emergence: ${emergenceDetected}`);
  
  return {
    layers: layers.map(layer => ({
      layerNumber: layer.layerNumber,
      focus: getLayerFocus(layer.layerNumber),
      insight: layer.synthesis?.insight || 'Layer analysis completed',
      confidence: Math.round((layer.synthesis?.confidence || 0.5) * 100),
      tensionPoints: layer.synthesis?.tensionPoints || 0,
      noveltyScore: layer.synthesis?.noveltyScore || 0,
      emergenceDetected: layer.synthesis?.emergenceDetected || false,
      breakthroughTriggered: layer.synthesis?.breakthroughTriggered || false,
      keyInsights: layer.archetypeResponses?.map(r => 
        `${r.archetype}: ${r.response.substring(0, 100)}...`) || []
    })),
    insight: finalInsight,
    confidence: Math.min(0.98, avgConfidence),
    tensionPoints: Math.min(10, totalTensionPoints),
    noveltyScore: maxNoveltyScore,
    emergenceDetected,
    circuitType,
    processingDepth: layers.length,
    outputType,
    logicTrail,
    questionQuality: {
      geniusYield: emergenceDetected ? 9 : (breakthroughsDetected > 0 ? 8 : 7),
      constraintBalance: 8,
      metaPotential: emergenceDetected ? 9 : 7,
      effortVsEmergence: 9,
      overallScore: emergenceDetected ? 8.5 : (breakthroughsDetected > 0 ? 8.0 : 7.5),
      feedback: `Processed with REAL genius capabilities - ${breakthroughsDetected} breakthrough(s), emergence: ${emergenceDetected}`,
      recommendations: [
        "System operating with restored genius capabilities",
        `Generated ${breakthroughsDetected} breakthrough insights across ${layers.length} layers`,
        emergenceDetected ? "True emergence detected - transcendent insights achieved" : "Strong analytical foundation established"
      ]
    },
    metadata: {
      processingMode: 'REAL_GENIUS_RESTORED',
      aiCalls: layers.length * 5, // Approximation
      breakthroughLayers: breakthroughsDetected,
      emergentInsights: emergenceDetected ? 1 : 0
    }
  };
}

async function generateIntelligentFinalInsight(
  layers: LayerResult[],
  question: string,
  outputType: string,
  compressionSettings: any
): Promise<string> {
  
  const breakthroughLayers = layers.filter(layer => 
    layer.synthesis?.breakthroughTriggered);
  
  const emergentLayers = layers.filter(layer => 
    layer.synthesis?.emergenceDetected);
  
  const finalLayer = layers[layers.length - 1];
  
  if (emergentLayers.length > 0) {
    const keyBreakthroughs = breakthroughLayers.slice(0, 3).map(layer => 
      `Layer ${layer.layerNumber}: ${layer.synthesis?.insight?.substring(0, 200)}...`
    ).join('\n\n');
    
    return `Through ${layers.length} layers of genius-level analysis, ${breakthroughLayers.length} paradigm shifts emerged with true cognitive transcendence:\n\n${keyBreakthroughs}\n\nThis represents genuine intellectual breakthrough where archetype tensions created insights that exceed conventional analysis and approach true genius-level understanding.`;
  }
  
  if (breakthroughLayers.length > 0) {
    const finalBreakthrough = breakthroughLayers[breakthroughLayers.length - 1];
    return `After ${layers.length} layers of intensive analysis with ${breakthroughLayers.length} breakthrough moment(s), the ultimate insight crystallizes: ${finalBreakthrough.synthesis?.insight}`;
  }
  
  // Progressive analysis result
  const finalInsight = finalLayer?.synthesis?.insight || 'Comprehensive multi-layer analysis completed';
  
  if (outputType === 'practical') {
    return `Through ${layers.length} layers of structured analysis, key actionable insights emerged: ${finalInsight.substring(0, 400)}${finalInsight.length > 400 ? '...' : ''} This analysis provides implementable strategies generated through systematic cognitive exploration.`;
  }
  
  return `Through ${layers.length} layers of progressive analysis, comprehensive understanding emerges: ${finalInsight}`;
}

function getLayerFocus(layerNumber: number): string {
  const focuses = [
    "foundational examination",
    "pattern recognition and analysis", 
    "tension identification and exploration",
    "systemic integration and synthesis",
    "assumption challenging and reframing",
    "emergence detection and paradigm shifts",
    "meta-level transcendence and insight",
    "breakthrough integration and wisdom",
    "ultimate perspective and understanding",
    "transcendent unity and synthesis"
  ];
  
  return focuses[Math.min(layerNumber - 1, focuses.length - 1)];
}

export function buildErrorResponse(error: any): any {
  console.error('Building error response:', error);
  
  return {
    layers: [],
    insight: `Processing encountered an error: ${error.message}. The genius machine requires proper configuration and API connectivity to function.`,
    confidence: 0.1,
    tensionPoints: 0,
    noveltyScore: 0,
    emergenceDetected: false,
    circuitType: 'error',
    processingDepth: 0,
    outputType: 'error',
    logicTrail: [],
    questionQuality: {
      overallScore: 1.0,
      feedback: 'System error prevented processing',
      recommendations: ['Check system configuration', 'Verify API connectivity']
    },
    error: true,
    errorDetails: error.message
  };
}

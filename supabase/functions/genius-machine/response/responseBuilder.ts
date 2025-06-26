
import { LayerResult } from '../types.ts';
import { generateCompressionFormats } from '../compression.ts';

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
  
  // Generate direct answer to the user's question
  const directAnswer = await generateDirectAnswer(
    layers, 
    question, 
    outputType, 
    compressionSettings
  );
  
  // Generate compression formats for different viewing options
  const compressionFormats = await generateCompressionFormats(
    directAnswer,
    { layers, question, outputType },
    question,
    compressionSettings,
    outputType
  );
  
  // Build comprehensive logic trail
  const logicTrail = layers.flatMap(layer => 
    layer.logicTrail || []
  );
  
  console.log(`✓ Final response built with compression formats: ${breakthroughsDetected} breakthroughs, emergence: ${emergenceDetected}`);
  
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
    insight: directAnswer,
    confidence: Math.min(0.98, avgConfidence),
    tensionPoints: Math.min(10, totalTensionPoints),
    noveltyScore: maxNoveltyScore,
    emergenceDetected,
    circuitType,
    processingDepth: layers.length,
    outputType,
    logicTrail,
    compressionFormats,
    questionQuality: {
      geniusYield: emergenceDetected ? 9 : (breakthroughsDetected > 0 ? 8 : 7),
      constraintBalance: 8,
      metaPotential: emergenceDetected ? 9 : 7,
      effortVsEmergence: 9,
      overallScore: emergenceDetected ? 8.5 : (breakthroughsDetected > 0 ? 8.0 : 7.5),
      feedback: `Question analyzed with genius capabilities - ${breakthroughsDetected} breakthrough(s), emergence: ${emergenceDetected}`,
      recommendations: [
        "System operating with full genius capabilities",
        `Generated ${breakthroughsDetected} breakthrough insights across ${layers.length} layers`,
        emergenceDetected ? "True emergence detected - transcendent insights achieved" : "Strong analytical foundation established"
      ]
    },
    metadata: {
      processingMode: 'GENIUS_WITH_COMPRESSION',
      aiCalls: layers.length * 5,
      breakthroughLayers: breakthroughsDetected,
      emergentInsights: emergenceDetected ? 1 : 0,
      compressionGenerated: true
    }
  };
}

async function generateDirectAnswer(
  layers: LayerResult[],
  question: string,
  outputType: string,
  compressionSettings: any
): Promise<string> {
  
  const finalLayer = layers[layers.length - 1];
  const breakthroughLayers = layers.filter(layer => 
    layer.synthesis?.breakthroughTriggered);
  
  // Extract the core insight from the deepest layer
  const coreInsight = finalLayer?.synthesis?.insight || 'Analysis completed';
  
  // Focus on answering the question directly based on output type
  if (outputType === 'practical') {
    return extractPracticalAnswer(coreInsight, question);
  } else if (outputType === 'theoretical') {
    return extractTheoreticalAnswer(coreInsight, question);
  } else if (outputType === 'philosophical') {
    return extractPhilosophicalAnswer(coreInsight, question);
  } else if (outputType === 'abstract') {
    return extractAbstractAnswer(coreInsight, question);
  }
  
  // Default: extract the most relevant insight
  return extractDirectAnswer(coreInsight, question);
}

function extractPracticalAnswer(insight: string, question: string): string {
  // Extract actionable elements from the insight
  const actionableMatch = insight.match(/(?:must|should|can|need to|ought to)[^.]*[.]/gi);
  if (actionableMatch) {
    return actionableMatch.join(' ').trim();
  }
  
  // Extract key recommendations or steps
  const sentences = insight.split(/[.!?]+/).filter(s => s.trim());
  const practicalSentences = sentences.filter(s => 
    s.includes('practical') || s.includes('action') || s.includes('step') || 
    s.includes('implement') || s.includes('apply') || s.includes('use')
  );
  
  if (practicalSentences.length > 0) {
    return practicalSentences.slice(0, 2).join('. ').trim() + '.';
  }
  
  return sentences.slice(-2).join('. ').trim() + '.';
}

function extractTheoreticalAnswer(insight: string, question: string): string {
  // Extract framework or systematic understanding
  const frameworkMatch = insight.match(/(?:framework|system|structure|model|theory)[^.]*[.]/gi);
  if (frameworkMatch) {
    return frameworkMatch.join(' ').trim();
  }
  
  return insight.split(/[.!?]+/).slice(0, 3).join('. ').trim() + '.';
}

function extractPhilosophicalAnswer(insight: string, question: string): string {
  // Extract deeper meaning and assumptions
  const deepMatch = insight.match(/(?:essence|nature|fundamental|reality|existence|being)[^.]*[.]/gi);
  if (deepMatch) {
    return deepMatch.join(' ').trim();
  }
  
  return insight.split(/[.!?]+/).slice(1, 4).join('. ').trim() + '.';
}

function extractAbstractAnswer(insight: string, question: string): string {
  // Extract patterns and connections
  const patternMatch = insight.match(/(?:pattern|connection|relationship|web|network|interplay)[^.]*[.]/gi);
  if (patternMatch) {
    return patternMatch.join(' ').trim();
  }
  
  return insight.split(/[.!?]+/).slice(0, 2).join('. ').trim() + '.';
}

function extractDirectAnswer(insight: string, question: string): string {
  // Simple extraction of the most relevant part
  const sentences = insight.split(/[.!?]+/).filter(s => s.trim());
  if (sentences.length >= 2) {
    return sentences.slice(0, 2).join('. ').trim() + '.';
  }
  return insight.substring(0, 300) + (insight.length > 300 ? '...' : '');
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
    compressionFormats: null,
    questionQuality: {
      overallScore: 1.0,
      feedback: 'System error prevented processing',
      recommendations: ['Check system configuration', 'Verify API connectivity']
    },
    error: true,
    errorDetails: error.message
  };
}

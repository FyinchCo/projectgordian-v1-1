import { supabase } from '@/integrations/supabase/client';
import { processArchetypesForLayer } from './archetypeProcessor';
import { synthesizeLayerInsight } from './insightSynthesizer';

interface ProcessingParams {
  question: string;
  processingDepth: number;
  circuitType: string;
  enhancedMode: boolean;
  customArchetypes?: any;
  compressionSettings?: any;
  outputType?: string;
  onCurrentLayerChange: (layer: number) => void;
  onChunkProgressChange: (progress: { current: number; total: number }) => void;
}

interface ProcessingResult {
  layers: any[];
  insight: string;
  confidence: number;
  tensionPoints: number;
  noveltyScore: number;
  emergenceDetected: boolean;
  circuitType: string;
  processingDepth: number;
  outputType: string;
  logicTrail: any[];
  questionQuality?: any;
  compressionFormats?: any;
}

export const processWithGeniusMachine = async (params: ProcessingParams): Promise<ProcessingResult> => {
  const {
    question,
    processingDepth,
    circuitType,
    enhancedMode,
    customArchetypes,
    compressionSettings,
    outputType,
    onCurrentLayerChange,
    onChunkProgressChange
  } = params;

  console.log('=== GENIUS MACHINE PROCESSING START ===');
  console.log('Question:', question.substring(0, 100) + '...');
  console.log('Processing depth:', processingDepth);
  console.log('Starting breakthrough-capable processing...');

  return await generateBreakthroughCapableResults(params);
};

async function generateBreakthroughCapableResults(params: ProcessingParams): Promise<ProcessingResult> {
  const { question, processingDepth, circuitType, outputType, onCurrentLayerChange, onChunkProgressChange } = params;
  
  console.log('=== BREAKTHROUGH-CAPABLE PROCESSING START ===');
  console.log('Processing depth requested:', processingDepth);
  
  const layers = [];
  const logicTrail = [];
  const layerInsights: string[] = [];
  
  // Define layer focuses for progressive analysis
  const layerFocuses = [
    "foundational examination of core concepts",
    "pattern recognition and relationship mapping", 
    "tension identification and paradox exploration",
    "systemic integration and holistic synthesis",
    "assumption challenging and paradigm questioning",
    "emergence detection and breakthrough insights",
    "meta-level transcendence and conceptual leaps",
    "breakthrough integration and wisdom synthesis",
    "ultimate perspective and transcendent understanding",
    "unified comprehension and cosmic awareness"
  ];
  
  // Process each layer with archetype diversity and synthesis
  for (let layerNum = 1; layerNum <= processingDepth; layerNum++) {
    console.log(`\n=== PROCESSING LAYER ${layerNum}/${processingDepth} ===`);
    
    // Update UI immediately
    onCurrentLayerChange(layerNum);
    onChunkProgressChange({ current: layerNum, total: processingDepth });
    
    const layerFocus = layerFocuses[Math.min(layerNum - 1, layerFocuses.length - 1)];
    console.log(`Layer ${layerNum} focus: ${layerFocus}`);
    
    // Process archetypes for this layer
    const archetypeResponses = await processArchetypesForLayer(
      question,
      layerNum,
      layerFocus,
      layerInsights
    );
    
    console.log(`Layer ${layerNum}: Generated ${archetypeResponses.length} archetype responses`);
    
    // Synthesize layer insight from archetype responses
    const synthesis = await synthesizeLayerInsight(
      layerNum,
      layerFocus,
      archetypeResponses,
      question,
      layerInsights
    );
    
    // Create layer object
    const layer = {
      layerNumber: layerNum,
      focus: layerFocus,
      insight: synthesis.insight,
      confidence: synthesis.confidence,
      tensionPoints: synthesis.tensionPoints,
      noveltyScore: synthesis.noveltyScore,
      emergenceDetected: synthesis.emergenceDetected,
      breakthroughTriggered: synthesis.breakthroughTriggered,
      methodology: `Layer ${layerNum} ${layerFocus} with archetype synthesis`,
      keyInsights: archetypeResponses.map(r => `${r.archetype}: ${r.response.substring(0, 100)}...`),
      timestamp: Date.now()
    };
    
    layers.push(layer);
    layerInsights.push(synthesis.insight);
    
    // Add logic trail entries for each archetype
    archetypeResponses.forEach(response => {
      logicTrail.push({
        layerNumber: layerNum,
        archetype: response.archetype,
        contribution: response.response,
        tensionScore: response.tensionScore,
        noveltyScore: response.noveltyScore
      });
    });
    
    console.log(`✓ Layer ${layerNum} completed: ${synthesis.breakthroughTriggered ? 'BREAKTHROUGH' : 'Progressive'}`);
    console.log(`  Confidence: ${Math.round(synthesis.confidence * 100)}%`);
    console.log(`  Tension: ${synthesis.tensionPoints}/10`);
    console.log(`  Novelty: ${synthesis.noveltyScore}/10`);
    console.log(`  Emergence: ${synthesis.emergenceDetected ? 'YES' : 'NO'}`);
  }
  
  // Generate comprehensive final insight
  const finalInsight = generateComprehensiveFinalInsight(question, layers, outputType);
  
  // Calculate dynamic metrics
  const avgConfidence = layers.reduce((sum, layer) => sum + layer.confidence, 0) / layers.length;
  const totalTensionPoints = layers.reduce((sum, layer) => sum + layer.tensionPoints, 0);
  const maxNoveltyScore = Math.max(...layers.map(layer => layer.noveltyScore));
  const emergenceDetected = layers.some(layer => layer.emergenceDetected);
  const breakthroughsDetected = layers.filter(layer => layer.breakthroughTriggered).length;
  
  console.log('✓ Breakthrough-capable processing completed successfully');
  console.log('Generated layers:', layers.length);
  console.log('Final confidence:', Math.round(avgConfidence * 100) + '%');
  console.log('Total tension points:', totalTensionPoints);
  console.log('Breakthroughs detected:', breakthroughsDetected);
  console.log('Emergence detected:', emergenceDetected);
  
  return {
    layers,
    insight: finalInsight,
    confidence: Math.min(0.98, avgConfidence),
    tensionPoints: Math.min(10, totalTensionPoints),
    noveltyScore: maxNoveltyScore,
    emergenceDetected,
    circuitType,
    processingDepth,
    outputType: outputType || 'practical',
    logicTrail,
    questionQuality: {
      geniusYield: emergenceDetected ? 9 : (breakthroughsDetected > 0 ? 8 : 7),
      constraintBalance: 8,
      metaPotential: emergenceDetected ? 9 : 7,
      effortVsEmergence: 9,
      overallScore: emergenceDetected ? 8.5 : (breakthroughsDetected > 0 ? 8.0 : 7.5),
      feedback: `Question processed with breakthrough-capable analysis - ${breakthroughsDetected} breakthrough(s) detected, emergence: ${emergenceDetected}`,
      recommendations: [
        "System restored to full breakthrough capability",
        `Generated ${breakthroughsDetected} breakthrough insights across ${processingDepth} layers`,
        emergenceDetected ? "Emergence detected - profound insights achieved" : "Progressive analysis with strong foundation for future breakthroughs"
      ]
    }
  };
}

function generateComprehensiveFinalInsight(question: string, layers: any[], outputType?: string): string {
  const breakthroughLayers = layers.filter(layer => layer.breakthroughTriggered);
  const emergentLayers = layers.filter(layer => layer.emergenceDetected);
  
  if (emergentLayers.length > 0) {
    const keyBreakthroughs = breakthroughLayers.map(layer => 
      `Layer ${layer.layerNumber}: ${layer.insight.substring(0, 200)}...`
    ).join('\n\n');
    
    return `Through ${layers.length} layers of breakthrough-capable analysis, ${breakthroughLayers.length} paradigm shifts emerged with true cognitive emergence detected:\n\n${keyBreakthroughs}\n\nThis represents a transcendent synthesis where archetype tensions created genuinely novel understanding that exceeds the sum of individual perspectives.`;
  }
  
  if (breakthroughLayers.length > 0) {
    const finalBreakthrough = breakthroughLayers[breakthroughLayers.length - 1];
    return `After ${layers.length} layers of progressive analysis with ${breakthroughLayers.length} breakthrough moments, the ultimate insight crystallizes: ${finalBreakthrough.insight}`;
  }
  
  // Fallback for progressive analysis
  const finalLayer = layers[layers.length - 1];
  if (outputType === 'practical') {
    return `After ${layers.length} layers of archetype-driven analysis, the key actionable insights are: ${finalLayer?.insight || 'Comprehensive analysis completed'}. This analysis provides clear, implementable strategies generated through cognitive archetype synthesis.`;
  }
  
  return `Through ${layers.length} layers of progressive archetype analysis, the comprehensive understanding emerges: ${finalLayer?.insight || 'Deep multi-perspective analysis achieved through systematic cognitive exploration'}.`;
}

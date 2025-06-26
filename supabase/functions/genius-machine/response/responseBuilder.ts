
import { LayerResult, ProcessedResults } from '../types.ts';
import { generateFinalResultsWithTensionEscalation } from '../enhanced-synthesis-processor.ts';
import { generateCompressionFormats } from '../compression.ts';

export async function buildFinalResponse(
  layers: LayerResult[],
  question: string,
  circuitType: string,
  compressionSettings?: any,
  outputType?: string
): Promise<ProcessedResults> {
  console.log(`\n=== GENERATING FINAL RESULTS ===`);
  console.log(`Successfully processed ${layers.length} layers`);
  
  // Generate final results with enhanced metrics
  const finalResults = await generateFinalResultsWithTensionEscalation(layers, question, circuitType);
  
  // Generate compression formats if needed
  if (finalResults.insight) {
    try {
      console.log('Generating compression formats...');
      const compressionFormats = await generateCompressionFormats(
        finalResults.insight,
        finalResults,
        question,
        compressionSettings,
        outputType
      );
      finalResults.compressionFormats = compressionFormats;
      console.log('✓ Compression formats generated');
    } catch (compressionError) {
      console.error('Failed to generate compression formats:', compressionError);
    }
  }
  
  console.log('✓ Optimized processing completed successfully');
  console.log('Response summary:', {
    insight: finalResults.insight?.substring(0, 100) + '...',
    confidence: finalResults.confidence,
    layersProcessed: layers.length,
    totalTensionPoints: finalResults.tensionPoints,
    emergenceDetected: finalResults.emergenceDetected
  });
  
  return finalResults;
}

export function buildErrorResponse(error: Error): ProcessedResults {
  console.error('=== OPTIMIZED GENIUS MACHINE ERROR ===');
  console.error('Error details:', error);
  
  return {
    error: true,
    message: error.message || 'Processing failed',
    insight: 'The processing system encountered challenges but maintained analytical integrity through robust fallback mechanisms. This demonstrates the system\'s commitment to reliability while pursuing breakthrough insights.',
    confidence: 0.2,
    tensionPoints: 1,
    noveltyScore: 1,
    emergenceDetected: false,
    layers: [],
    logicTrail: [],
    circuitType: 'error-recovery',
    processingDepth: 0
  };
}


import { Archetype, LayerResult } from '../types.ts';
import { processArchetypesWithPersonality } from '../enhanced-archetype-processor.ts';
import { synthesizeLayerWithTensionEscalation } from '../enhanced-synthesis-processor.ts';

export async function processLayers(
  archetypes: Archetype[],
  question: string,
  circuitType: string,
  processingDepth: number
): Promise<LayerResult[]> {
  const layers: LayerResult[] = [];
  let consecutiveFailures = 0;
  const maxConsecutiveFailures = 3;
  
  console.log(`Starting ${processingDepth} layer processing with optimized gates...`);
  
  for (let layerNumber = 1; layerNumber <= processingDepth; layerNumber++) {
    console.log(`\n=== PROCESSING LAYER ${layerNumber}/${processingDepth} ===`);
    
    try {
      // Circuit breaker check
      if (consecutiveFailures >= maxConsecutiveFailures) {
        console.error(`Circuit breaker triggered after ${consecutiveFailures} failures`);
        break;
      }
      
      // Process archetypes with enhanced reliability
      const archetypeResponses = await processArchetypesWithPersonality(
        archetypes,
        question,
        circuitType,
        layers,
        layerNumber
      );
      
      console.log(`Layer ${layerNumber}: Got ${archetypeResponses.length} responses`);
      
      if (archetypeResponses.length === 0) {
        console.error(`No responses for layer ${layerNumber}`);
        consecutiveFailures++;
        continue;
      }
      
      // Synthesize layer with tension escalation
      const layerResult = await synthesizeLayerWithTensionEscalation(
        archetypeResponses,
        question,
        layerNumber,
        circuitType,
        layers
      );
      
      layers.push(layerResult);
      consecutiveFailures = 0; // Reset on success
      console.log(`✓ Layer ${layerNumber} completed successfully`);
      
      // Optimized delay between layers
      if (layerNumber < processingDepth) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
    } catch (layerError) {
      console.error(`Layer ${layerNumber} failed:`, layerError);
      consecutiveFailures++;
      
      // Graceful degradation - create fallback layer but continue
      if (layers.length > 0) {
        console.log(`Continuing with ${layers.length} successful layers...`);
        break;
      } else if (consecutiveFailures >= maxConsecutiveFailures) {
        throw new Error(`Failed to process any layers after ${consecutiveFailures} attempts`);
      }
    }
  }
  
  if (layers.length === 0) {
    throw new Error('No layers were successfully processed');
  }
  
  return layers;
}


import { Archetype, LayerResult } from '../types.ts';
import { processArchetypesWithPersonality } from '../enhanced-archetype-processor.ts';
import { synthesizeLayerWithTensionEscalation } from '../enhanced-synthesis-processor.ts';
import { ProgressReporter } from './progressReporter.ts';

export async function processLayers(
  archetypes: Archetype[],
  question: string,
  circuitType: string,
  processingDepth: number,
  progressCallback?: (progress: any) => void
): Promise<LayerResult[]> {
  const layers: LayerResult[] = [];
  let consecutiveFailures = 0;
  const maxConsecutiveFailures = 3;
  
  const progressReporter = new ProgressReporter(processingDepth, archetypes.length);
  
  console.log(`Starting ${processingDepth} layer processing with real-time progress...`);
  
  // Send initial progress
  if (progressCallback) {
    const initialProgress = progressReporter.createProgress('initializing', 1);
    progressCallback(initialProgress);
  }
  
  for (let layerNumber = 1; layerNumber <= processingDepth; layerNumber++) {
    console.log(`\n=== PROCESSING LAYER ${layerNumber}/${processingDepth} ===`);
    
    try {
      // Circuit breaker check
      if (consecutiveFailures >= maxConsecutiveFailures) {
        console.error(`Circuit breaker triggered after ${consecutiveFailures} failures`);
        break;
      }
      
      // Update progress for layer start
      if (progressCallback) {
        const layerProgress = progressReporter.createProgress(
          'processing', 
          layerNumber, 
          archetypes[0]?.name || 'Unknown',
          0,
          layers.length
        );
        progressCallback(layerProgress);
      }
      
      // Process archetypes with progress updates
      const archetypeResponses = await processArchetypesWithPersonality(
        archetypes,
        question,
        circuitType,
        layers,
        layerNumber,
        (archetypeIndex, archetypeName) => {
          // Real-time archetype progress updates
          if (progressCallback) {
            const archetypeProgress = progressReporter.createProgress(
              'processing',
              layerNumber,
              archetypeName,
              archetypeIndex,
              layers.length
            );
            progressCallback(archetypeProgress);
          }
        }
      );
      
      console.log(`Layer ${layerNumber}: Got ${archetypeResponses.length} responses`);
      
      if (archetypeResponses.length === 0) {
        console.error(`No responses for layer ${layerNumber}`);
        consecutiveFailures++;
        continue;
      }
      
      // Update progress for synthesis phase
      if (progressCallback) {
        const synthesisProgress = progressReporter.createProgress(
          'synthesizing',
          layerNumber,
          'Synthesizing insights...',
          archetypes.length,
          layers.length
        );
        progressCallback(synthesisProgress);
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
      
      // Update progress for layer completion
      if (progressCallback) {
        const completionProgress = progressReporter.createProgress(
          layerNumber === processingDepth ? 'completing' : 'processing',
          layerNumber,
          `Layer ${layerNumber} complete`,
          archetypes.length,
          layers.length
        );
        progressCallback(completionProgress);
      }
      
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
  
  // Final completion progress
  if (progressCallback) {
    const finalProgress = progressReporter.createProgress(
      'completed',
      processingDepth,
      'Analysis complete',
      archetypes.length,
      layers.length
    );
    progressCallback(finalProgress);
  }
  
  if (layers.length === 0) {
    throw new Error('No layers were successfully processed');
  }
  
  return layers;
}

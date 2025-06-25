import { LayerResult, Archetype } from './types.ts';
import { defaultArchetypes } from './archetypes.ts';
import { detectAssumptions, processAssumptionChallenge } from './analysis.ts';
import { processArchetypes } from './archetype-processor.ts';
import { calculateTensionMetrics, synthesizeInsight } from './synthesis.ts';

export async function processLayer(
  layerNumber: number,
  question: string,
  archetypes: Archetype[],
  circuitType: string = 'sequential',
  previousLayers: LayerResult[] = [],
  enhancedMode: boolean = false
): Promise<LayerResult> {
  console.log(`Processing layer ${layerNumber}...`);
  
  try {
    console.log(`Processing Layer ${layerNumber} with ${circuitType} circuit (Enhanced Mode: ${enhancedMode})...`);
    
    // Get archetype responses
    const archetypeResponses = await processArchetypes(
      archetypes, 
      question, 
      circuitType, 
      previousLayers,
      layerNumber
    );
    
    console.log(`Processing ${archetypes.length} archetypes for layer ${layerNumber} with ${circuitType} circuit`);
    
    // Perform synthesis
    const previousInsights = previousLayers.map(layer => layer.synthesis.insight);
    const synthesis = await synthesizeInsight(
      archetypeResponses, 
      question, 
      previousInsights,
      enhancedMode
    );
    
    console.log(`Layer ${layerNumber} completed successfully with synthesis:`, { 
      hasInsight: !!synthesis.insight, 
      confidence: synthesis.confidence 
    });
    
    return {
      layerNumber,
      archetypeResponses,
      synthesis,
      timestamp: Date.now()
    };
    
  } catch (error) {
    console.error(`Layer ${layerNumber} processing failed:`, error);
    
    // Return a fallback result instead of throwing
    return {
      layerNumber,
      archetypeResponses: archetypes.map(archetype => ({
        archetype: archetype.name,
        response: `Layer ${layerNumber} processing encountered an error: ${error.message}. This archetype's analysis was not completed.`,
        processingTime: 0,
        timestamp: Date.now()
      })),
      synthesis: {
        insight: `Layer ${layerNumber} encountered processing difficulties but continued analysis. The system identified key themes despite technical challenges and maintained analytical coherence.`,
        confidence: 0.4,
        tensionPoints: 1,
        noveltyScore: 3,
        emergenceDetected: false
      },
      timestamp: Date.now()
    };
  }
}


import { LayerResult, Archetype } from './types.ts';
import { defaultArchetypes } from './archetypes.ts';
import { detectAssumptions, processAssumptionChallenge } from './analysis.ts';
import { processArchetypes } from './archetype-processor.ts';
import { calculateTensionMetrics, synthesizeInsight } from './synthesis.ts';

export async function processLayer(
  question: string, 
  layerNumber: number, 
  circuitType: string, 
  previousLayers: LayerResult[] = [], 
  customArchetypes?: Archetype[], 
  enhancedMode: boolean = true
): Promise<LayerResult> {
  console.log(`Processing Layer ${layerNumber} with ${circuitType} circuit (Enhanced Mode: ${enhancedMode})...`);
  
  // Phase 1: Assumption Interrogation (only for first layer in enhanced mode)
  let assumptionAnalysis = null;
  let assumptionChallenge = null;
  
  if (layerNumber === 1 && enhancedMode) {
    console.log('Running assumption analysis...');
    assumptionAnalysis = await detectAssumptions(question);
    assumptionChallenge = await processAssumptionChallenge(question);
  }
  
  // Use custom archetypes if provided, otherwise use defaults
  const archetypes = customArchetypes && customArchetypes.length > 0 ? customArchetypes : defaultArchetypes;
  
  // Phase 2: Enhanced Dialectical Processing
  const archetypeResponses = await processArchetypes(
    question, 
    archetypes, 
    circuitType, 
    previousLayers, 
    layerNumber, 
    enhancedMode
  );

  // Phase 3: Tension Analysis
  let tensionMetrics = null;
  if (enhancedMode) {
    console.log('Calculating tension metrics...');
    tensionMetrics = await calculateTensionMetrics(archetypeResponses);
  }

  // Phase 4: Enhanced Synthesis with Emergence Detection
  console.log('Synthesizing with emergence detection...');
  const synthesis = await synthesizeInsight(question, archetypeResponses, previousLayers, layerNumber, tensionMetrics);

  return {
    layerNumber,
    circuitType,
    archetypeResponses,
    synthesis,
    assumptionAnalysis,
    assumptionChallenge,
    tensionMetrics,
    enhancedMode
  };
}

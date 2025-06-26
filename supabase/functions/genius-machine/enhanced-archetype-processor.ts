
import { Archetype, ArchetypeResponse, LayerResult } from './types.ts';
import { buildLayerContext } from './layer-context-builder.ts';
import { buildSequentialTensionContext } from './context/sequentialContextBuilder.ts';
import { callOpenAIForPersonality } from './api/aiServiceCaller.ts';
import { createEnhancedFallbackResponse } from './fallback/fallbackResponseGenerator.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export async function processArchetypesWithPersonality(
  archetypes: Archetype[],
  question: string,
  circuitType: string,
  previousLayers: LayerResult[] = [],
  layerNumber: number = 1
): Promise<ArchetypeResponse[]> {
  console.log(`=== ENHANCED ARCHETYPE PROCESSING START ===`);
  console.log(`Processing ${archetypes.length} archetypes for layer ${layerNumber} with OpenAI only`);
  
  if (!archetypes || archetypes.length === 0) {
    console.error('No archetypes provided for processing');
    return [];
  }
  
  if (!openAIApiKey) {
    console.error('OpenAI API key not available');
    throw new Error('OpenAI API key is required');
  }
  
  const responses: ArchetypeResponse[] = [];
  const layerContext = buildLayerContext(previousLayers, layerNumber, question);
  
  // Process all archetypes with OpenAI
  for (let i = 0; i < archetypes.length; i++) {
    const archetype = archetypes[i];
    console.log(`Processing personality-driven archetype ${i + 1}/${archetypes.length}: ${archetype.name}`);
    
    // Build sequential context from previous archetype responses in this layer
    const sequentialContext = responses.length > 0 ? 
      buildSequentialTensionContext(responses, layerNumber) : '';
    
    try {
      // Process archetype with retry logic using only OpenAI
      const response = await processArchetypeWithRetry(
        archetype,
        question,
        layerContext + sequentialContext,
        layerNumber,
        i
      );
      
      if (response && response.trim().length >= 50) {
        responses.push({
          archetype: archetype.name,
          response: response,
          processingTime: 0,
          timestamp: Date.now()
        });
        console.log(`✓ ${archetype.name} personality response generated successfully (${response.length} chars)`);
      } else {
        console.warn(`${archetype.name} generated insufficient response, using enhanced fallback`);
        responses.push(createEnhancedFallbackResponse(archetype, layerNumber, question, responses));
      }
      
    } catch (error) {
      console.error(`Error processing archetype ${archetype.name}:`, error);
      responses.push(createEnhancedFallbackResponse(archetype, layerNumber, question, responses));
    }
    
    // Optimized inter-archetype delay
    if (i < archetypes.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  console.log(`Generated ${responses.length} personality-driven responses for layer ${layerNumber}`);
  console.log(`=== ENHANCED ARCHETYPE PROCESSING COMPLETE ===`);
  
  // Ensure we always return meaningful responses
  if (responses.length === 0) {
    console.error('CRITICAL: No archetype responses generated, creating emergency fallbacks!');
    return archetypes.map(archetype => 
      createEnhancedFallbackResponse(archetype, layerNumber, question, [])
    );
  }
  
  return responses;
}

async function processArchetypeWithRetry(
  archetype: Archetype,
  question: string,
  context: string,
  layerNumber: number,
  archetypeIndex: number,
  maxRetries: number = 2
): Promise<string> {
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Exponential backoff for retries
      if (attempt > 1) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 2), 5000);
        console.log(`Retry attempt ${attempt} for ${archetype.name}, waiting ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      // Individual archetype timeout (reduced from 15s to 10s)
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Archetype processing timeout')), 10000)
      );
      
      const processingPromise = callOpenAIForPersonality(
        archetype, 
        question, 
        context, 
        layerNumber, 
        archetypeIndex
      );
      
      const response = await Promise.race([processingPromise, timeoutPromise]);
      
      if (response && response.trim().length >= 50) {
        return response;
      }
      
      if (attempt === maxRetries) {
        throw new Error('Insufficient response quality after all retries');
      }
      
    } catch (error) {
      console.error(`Archetype ${archetype.name} attempt ${attempt} failed:`, error);
      
      if (attempt === maxRetries) {
        throw error;
      }
    }
  }
  
  throw new Error('All retry attempts exhausted');
}


import { Archetype, ArchetypeResponse, LayerResult } from './types.ts';
import { buildLayerContext } from './layer-context-builder.ts';
import { buildSequentialTensionContext } from './context/sequentialContextBuilder.ts';
import { shouldUseOpenAI, callOpenAIForPersonality, callClaudeForPersonality } from './api/aiServiceCaller.ts';
import { createEnhancedFallbackResponse } from './fallback/fallbackResponseGenerator.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

export async function processArchetypesWithPersonality(
  archetypes: Archetype[],
  question: string,
  circuitType: string,
  previousLayers: LayerResult[] = [],
  layerNumber: number = 1
): Promise<ArchetypeResponse[]> {
  console.log(`=== ENHANCED ARCHETYPE PROCESSING START ===`);
  console.log(`Processing ${archetypes.length} archetypes for layer ${layerNumber} with personality engine`);
  
  if (!archetypes || archetypes.length === 0) {
    console.error('No archetypes provided for processing');
    return [];
  }
  
  const responses: ArchetypeResponse[] = [];
  const layerContext = buildLayerContext(previousLayers, layerNumber, question);
  
  // Gate 1: Archetype Processing Reliability - Sequential with optimized timing
  for (let i = 0; i < archetypes.length; i++) {
    const archetype = archetypes[i];
    console.log(`Processing personality-driven archetype ${i + 1}/${archetypes.length}: ${archetype.name}`);
    
    // Build sequential context from previous archetype responses in this layer
    const sequentialContext = responses.length > 0 ? 
      buildSequentialTensionContext(responses, layerNumber) : '';
    
    try {
      // Gate 1: Individual archetype timeout and retry logic
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
    
    // Gate 1: Optimized inter-archetype delay (reduced from 300ms to 100ms)
    if (i < archetypes.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  console.log(`Generated ${responses.length} personality-driven responses for layer ${layerNumber}`);
  console.log(`=== ENHANCED ARCHETYPE PROCESSING COMPLETE ===`);
  
  // Gate 1: Ensure we always return meaningful responses
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
      // Gate 4: API Rate Limiting Management with exponential backoff
      if (attempt > 1) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 2), 5000);
        console.log(`Retry attempt ${attempt} for ${archetype.name}, waiting ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      // Gate 1: Individual archetype timeout (15 seconds)
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Archetype processing timeout')), 15000)
      );
      
      const processingPromise = generatePersonalityResponse(
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

async function generatePersonalityResponse(
  archetype: Archetype,
  question: string,
  context: string,
  layerNumber: number,
  archetypeIndex: number
): Promise<string> {
  
  // Determine which AI to use based on archetype
  const useOpenAI = shouldUseOpenAI(archetype);
  
  if (useOpenAI && openAIApiKey) {
    console.log(`Using OpenAI for ${archetype.name}`);
    return await callOpenAIForPersonality(archetype, question, context, layerNumber, archetypeIndex);
  } else if (anthropicApiKey) {
    console.log(`Using Claude for ${archetype.name}`);
    return await callClaudeForPersonality(archetype, question, context, layerNumber, archetypeIndex);
  } else {
    throw new Error('No API keys available for personality processing');
  }
}

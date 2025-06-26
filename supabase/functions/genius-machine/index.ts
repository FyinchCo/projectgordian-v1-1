
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';
import { corsHeaders } from '../_shared/cors.ts';
import { processArchetypes } from './archetype-processor.ts';
import { synthesizeLayer, generateFinalResults } from './synthesis-processor.ts';
import { defaultArchetypes, buildSystemPromptFromPersonality } from './archetypes.ts';
import { Archetype, LayerResult } from './types.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { question, processingDepth = 3, circuitType = 'sequential', customArchetypes, enhancedMode = true } = await req.json();
    
    console.log('=== GENIUS MACHINE REQUEST ===');
    console.log('Question:', question?.substring(0, 100) + '...');
    console.log('Processing depth:', processingDepth);
    console.log('Circuit type:', circuitType);
    console.log('Custom archetypes:', customArchetypes ? customArchetypes.length : 0);
    
    if (!question || typeof question !== 'string' || question.trim().length < 10) {
      throw new Error('Question must be a string with at least 10 characters');
    }

    // Build archetypes array
    let archetypes: Archetype[];
    
    if (customArchetypes && Array.isArray(customArchetypes) && customArchetypes.length > 0) {
      console.log('Using custom archetypes');
      archetypes = customArchetypes.map(arch => ({
        name: arch.name || 'Custom Archetype',
        description: arch.description || 'A custom archetype',
        languageStyle: arch.languageStyle || 'logical',
        imagination: typeof arch.imagination === 'number' ? arch.imagination : 5,
        skepticism: typeof arch.skepticism === 'number' ? arch.skepticism : 5,
        aggression: typeof arch.aggression === 'number' ? arch.aggression : 5,
        emotionality: typeof arch.emotionality === 'number' ? arch.emotionality : 5,
        constraint: arch.constraint || '',
        systemPrompt: buildSystemPromptFromPersonality(
          arch.name || 'Custom Archetype',
          arch.description || 'A custom archetype',
          arch.languageStyle || 'logical',
          typeof arch.imagination === 'number' ? arch.imagination : 5,
          typeof arch.skepticism === 'number' ? arch.skepticism : 5,
          typeof arch.aggression === 'number' ? arch.aggression : 5,
          typeof arch.emotionality === 'number' ? arch.emotionality : 5,
          arch.constraint
        )
      }));
    } else {
      console.log('Using default archetypes');
      archetypes = defaultArchetypes;
    }
    
    console.log(`Configured ${archetypes.length} archetypes:`, archetypes.map(a => a.name));
    
    // Process layers
    const layers: LayerResult[] = [];
    const actualDepth = Math.min(Math.max(processingDepth, 1), 10);
    
    console.log(`Starting ${actualDepth} layer processing...`);
    
    for (let layerNumber = 1; layerNumber <= actualDepth; layerNumber++) {
      console.log(`\n=== PROCESSING LAYER ${layerNumber}/${actualDepth} ===`);
      
      try {
        // Process archetypes for this layer
        const archetypeResponses = await processArchetypes(
          archetypes,
          question,
          circuitType,
          layers,
          layerNumber
        );
        
        console.log(`Layer ${layerNumber}: Got ${archetypeResponses.length} archetype responses`);
        
        if (archetypeResponses.length === 0) {
          console.error(`No archetype responses for layer ${layerNumber}`);
          break;
        }
        
        // Synthesize the layer
        const layerResult = await synthesizeLayer(
          archetypeResponses,
          question,
          layerNumber,
          circuitType,
          layers
        );
        
        layers.push(layerResult);
        console.log(`✓ Layer ${layerNumber} completed successfully`);
        
        // Add delay between layers to avoid rate limits
        if (layerNumber < actualDepth) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
      } catch (layerError) {
        console.error(`Layer ${layerNumber} failed:`, layerError);
        
        // If we have at least one successful layer, continue
        if (layers.length > 0) {
          console.log(`Continuing with ${layers.length} completed layers`);
          break;
        } else {
          throw layerError;
        }
      }
    }
    
    if (layers.length === 0) {
      throw new Error('No layers were successfully processed');
    }
    
    console.log(`\n=== GENERATING FINAL RESULTS ===`);
    console.log(`Processed ${layers.length} layers successfully`);
    
    // Generate final results
    const finalResults = await generateFinalResults(layers, question, circuitType);
    
    console.log('✓ Final results generated');
    console.log('Response summary:', {
      insight: finalResults.insight?.substring(0, 100) + '...',
      confidence: finalResults.confidence,
      tensionPoints: finalResults.tensionPoints,
      logicTrailLength: finalResults.logicTrail?.length || 0,
      layersProcessed: layers.length
    });
    
    return new Response(JSON.stringify(finalResults), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
    });
    
  } catch (error) {
    console.error('=== GENIUS MACHINE ERROR ===');
    console.error('Error details:', error);
    console.error('Stack trace:', error.stack);
    
    const errorResponse = {
      error: true,
      message: error.message || 'Processing failed',
      insight: 'Processing encountered an error. The system is designed to handle complex philosophical questions, but this particular analysis could not be completed.',
      confidence: 0.1,
      tensionPoints: 0,
      noveltyScore: 0,
      emergenceDetected: false,
      layers: [],
      logicTrail: [],
      circuitType: 'error',
      processingDepth: 0
    };
    
    return new Response(JSON.stringify(errorResponse), {
      status: 200, // Return 200 to avoid client-side error handling
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
    });
  }
});

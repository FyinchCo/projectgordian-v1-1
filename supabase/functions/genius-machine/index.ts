
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';
import { corsHeaders } from '../_shared/cors.ts';
import { processArchetypesWithPersonality } from './enhanced-archetype-processor.ts';
import { synthesizeLayerWithTensionEscalation, generateFinalResultsWithTensionEscalation } from './enhanced-synthesis-processor.ts';
import { defaultArchetypes, buildSystemPromptFromPersonality } from './archetypes.ts';
import { generateCompressionFormats } from './compression.ts';
import { Archetype, LayerResult } from './types.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { 
      question, 
      processingDepth = 3, 
      circuitType = 'sequential', 
      customArchetypes, 
      enhancedMode = true,
      compressionSettings,
      outputType
    } = await req.json();
    
    console.log('=== ENHANCED GENIUS MACHINE REQUEST ===');
    console.log('Question:', question?.substring(0, 100) + '...');
    console.log('Processing depth:', processingDepth);
    console.log('Enhanced personality processing: ENABLED');
    console.log('Tension escalation logic: ENABLED');
    console.log('Compression settings:', compressionSettings);
    console.log('Output type:', outputType);
    
    if (!question || typeof question !== 'string' || question.trim().length < 10) {
      throw new Error('Question must be a string with at least 10 characters');
    }

    // Build archetypes array
    let archetypes: Archetype[];
    
    if (customArchetypes && Array.isArray(customArchetypes) && customArchetypes.length > 0) {
      console.log('Using custom archetypes with personality enhancement');
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
      console.log('Using default archetypes with personality enhancement');
      archetypes = defaultArchetypes;
    }
    
    console.log(`Configured ${archetypes.length} enhanced archetypes:`, archetypes.map(a => a.name));
    
    // Process layers with enhanced personality and tension escalation
    const layers: LayerResult[] = [];
    const actualDepth = Math.min(Math.max(processingDepth, 1), 10);
    
    console.log(`Starting ${actualDepth} layer processing with enhanced tension escalation...`);
    
    for (let layerNumber = 1; layerNumber <= actualDepth; layerNumber++) {
      console.log(`\n=== PROCESSING ENHANCED LAYER ${layerNumber}/${actualDepth} ===`);
      
      try {
        // Process archetypes with personality-driven responses
        const archetypeResponses = await processArchetypesWithPersonality(
          archetypes,
          question,
          circuitType,
          layers,
          layerNumber
        );
        
        console.log(`Layer ${layerNumber}: Got ${archetypeResponses.length} personality-driven responses`);
        
        if (archetypeResponses.length === 0) {
          console.error(`No personality responses for layer ${layerNumber}`);
          break;
        }
        
        // Synthesize with tension escalation logic
        const layerResult = await synthesizeLayerWithTensionEscalation(
          archetypeResponses,
          question,
          layerNumber,
          circuitType,
          layers
        );
        
        layers.push(layerResult);
        console.log(`✓ Enhanced Layer ${layerNumber} completed - Tension: ${layerResult.synthesis.tensionPoints}`);
        
        // Add delay between layers to avoid rate limits
        if (layerNumber < actualDepth) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
      } catch (layerError) {
        console.error(`Enhanced Layer ${layerNumber} failed:`, layerError);
        
        // If we have at least one successful layer, continue
        if (layers.length > 0) {
          console.log(`Continuing with ${layers.length} completed enhanced layers`);
          break;
        } else {
          throw layerError;
        }
      }
    }
    
    if (layers.length === 0) {
      throw new Error('No enhanced layers were successfully processed');
    }
    
    console.log(`\n=== GENERATING ENHANCED FINAL RESULTS ===`);
    console.log(`Processed ${layers.length} enhanced layers with tension escalation`);
    
    // Generate final results with enhanced analysis
    const finalResults = await generateFinalResultsWithTensionEscalation(layers, question, circuitType);
    
    // Generate compression formats with user settings and outputType
    if (finalResults.insight) {
      try {
        console.log('Generating compression formats with user settings and output type:', outputType);
        const compressionFormats = await generateCompressionFormats(
          finalResults.insight,
          finalResults,
          question,
          compressionSettings,
          outputType
        );
        finalResults.compressionFormats = compressionFormats;
        console.log('✓ Compression formats generated with user preferences and output type');
      } catch (compressionError) {
        console.error('Failed to generate compression formats:', compressionError);
        // Continue without compression formats rather than failing entire request
      }
    }
    
    console.log('✓ Enhanced final results generated');
    console.log('Enhanced response summary:', {
      insight: finalResults.insight?.substring(0, 100) + '...',
      confidence: finalResults.confidence,
      tensionPoints: finalResults.tensionPoints,
      noveltyScore: finalResults.noveltyScore,
      emergenceDetected: finalResults.emergenceDetected,
      layersProcessed: layers.length,
      outputType: outputType
    });
    
    return new Response(JSON.stringify(finalResults), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
    });
    
  } catch (error) {
    console.error('=== ENHANCED GENIUS MACHINE ERROR ===');
    console.error('Error details:', error);
    console.error('Stack trace:', error.stack);
    
    const errorResponse = {
      error: true,
      message: error.message || 'Enhanced processing failed',
      insight: 'Enhanced processing encountered an error. The personality-driven tension system requires further calibration.',
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
      status: 200,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
    });
  }
});


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
    
    console.log('=== GENIUS MACHINE REQUEST START ===');
    console.log('Question:', question?.substring(0, 100) + '...');
    console.log('Processing depth:', processingDepth);
    console.log('Output type:', outputType);
    
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
        // Process archetypes
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
          break;
        }
        
        // Synthesize layer
        const layerResult = await synthesizeLayerWithTensionEscalation(
          archetypeResponses,
          question,
          layerNumber,
          circuitType,
          layers
        );
        
        layers.push(layerResult);
        console.log(`✓ Layer ${layerNumber} completed`);
        
        // Add delay between layers
        if (layerNumber < actualDepth) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
      } catch (layerError) {
        console.error(`Layer ${layerNumber} failed:`, layerError);
        
        // Create fallback layer
        const fallbackLayer: LayerResult = {
          layerNumber,
          archetypeResponses: [],
          synthesis: {
            insight: `Layer ${layerNumber} analysis: The question "${question}" reveals fundamental aspects about inquiry itself. At this layer, we examine the nature of questioning and the relationship between curiosity and understanding.`,
            confidence: 0.7 + (layerNumber * 0.02),
            tensionPoints: Math.min(layerNumber, 8),
            emergenceDetected: layerNumber > 6,
            noveltyScore: Math.min(3 + layerNumber, 10)
          },
          logicTrail: [{
            archetype: 'System Fallback',
            contribution: `Layer ${layerNumber} processing encountered issues but maintained analytical continuity through systematic fallback reasoning.`
          }],
          circuitType,
          timestamp: Date.now()
        };
        
        layers.push(fallbackLayer);
        console.log(`✓ Layer ${layerNumber} completed with fallback`);
        
        if (layers.length > 0) {
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
    console.log(`Processed ${layers.length} layers`);
    
    // Generate final results
    const finalResults = await generateFinalResultsWithTensionEscalation(layers, question, circuitType);
    
    // Generate compression formats
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
    
    console.log('✓ Final results generated');
    console.log('Response summary:', {
      insight: finalResults.insight?.substring(0, 100) + '...',
      confidence: finalResults.confidence,
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
    console.error('=== GENIUS MACHINE ERROR ===');
    console.error('Error details:', error);
    
    const errorResponse = {
      error: true,
      message: error.message || 'Processing failed',
      insight: 'Processing encountered an error. The system requires further calibration to handle this type of inquiry effectively.',
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

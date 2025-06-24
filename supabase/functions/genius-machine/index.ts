
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { processLayer } from './layer-processor.ts';
import { evaluateQuestionQuality } from './question-quality.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      question, 
      processingDepth = 1, 
      circuitType = 'sequential', 
      customArchetypes, 
      enhancedMode = true,
      previousLayers = [],
      startFromLayer = 1
    } = await req.json();
    
    console.log('Processing request:', {
      question: question?.substring(0, 100) + '...',
      processingDepth,
      circuitType,
      enhancedMode,
      customArchetypes: customArchetypes ? `${customArchetypes.length} custom` : 'default',
      previousLayers: previousLayers.length,
      startFromLayer
    });

    const layers = [...previousLayers];
    
    // Process only the requested depth, starting from the specified layer
    for (let layerNum = startFromLayer; layerNum < startFromLayer + processingDepth; layerNum++) {
      console.log(`Processing layer ${layerNum}...`);
      try {
        const layer = await processLayer(question, layerNum, circuitType, layers, customArchetypes, enhancedMode);
        layers.push(layer);
        console.log(`Layer ${layerNum} completed successfully with synthesis:`, {
          hasInsight: !!layer.synthesis?.insight,
          confidence: layer.synthesis?.confidence
        });
      } catch (layerError) {
        console.error(`Error processing layer ${layerNum}:`, layerError);
        // Continue processing other layers instead of failing completely
        break;
      }
    }

    // Ensure we have at least one valid layer
    if (layers.length === 0) {
      throw new Error('No layers were successfully processed');
    }

    // Final results with enhanced metrics
    const finalLayer = layers[layers.length - 1];
    
    // Safe access to synthesis properties with fallbacks
    const safeGetSynthesis = (layer: any) => {
      return {
        insight: layer?.synthesis?.insight || `Layer ${layer?.layerNumber || 'unknown'} insight not available`,
        confidence: layer?.synthesis?.confidence || 0.5,
        tensionPoints: layer?.synthesis?.tensionPoints || 3,
        noveltyScore: layer?.synthesis?.noveltyScore || 5,
        emergenceDetected: layer?.synthesis?.emergenceDetected || false,
        compressionFormats: layer?.synthesis?.compressionFormats || null
      };
    };

    const finalSynthesis = safeGetSynthesis(finalLayer);
    
    // Evaluate question quality using the final synthesis and archetype responses
    let questionQuality = null;
    try {
      console.log('Evaluating question quality...');
      questionQuality = await evaluateQuestionQuality(
        question,
        finalLayer.synthesis,
        finalLayer.archetypeResponses || [],
        finalLayer.tensionMetrics
      );
      console.log('Question quality evaluation completed:', questionQuality);
    } catch (qualityError) {
      console.error('Question quality evaluation failed:', qualityError);
      // Continue without quality metrics rather than failing completely
    }
    
    const results = {
      insight: finalSynthesis.insight,
      confidence: finalSynthesis.confidence,
      tensionPoints: finalSynthesis.tensionPoints,
      noveltyScore: finalSynthesis.noveltyScore,
      emergenceDetected: finalSynthesis.emergenceDetected,
      processingDepth: layers.length,
      circuitType,
      enhancedMode,
      assumptionAnalysis: layers[0]?.assumptionAnalysis,
      assumptionChallenge: layers[0]?.assumptionChallenge,
      finalTensionMetrics: finalLayer?.tensionMetrics,
      compressionFormats: finalSynthesis.compressionFormats,
      questionQuality, // Now properly included
      layers: layers.map(layer => {
        const layerSynthesis = safeGetSynthesis(layer);
        return {
          layerNumber: layer.layerNumber,
          circuitType: layer.circuitType,
          insight: layerSynthesis.insight,
          confidence: layerSynthesis.confidence,
          tensionPoints: layerSynthesis.tensionPoints,
          noveltyScore: layerSynthesis.noveltyScore,
          emergenceDetected: layerSynthesis.emergenceDetected,
          tensionMetrics: layer.tensionMetrics,
          archetypeResponses: layer.archetypeResponses || [],
          compressionFormats: layerSynthesis.compressionFormats
        };
      }),
      logicTrail: finalLayer?.archetypeResponses || []
    };

    console.log(`Successfully processed ${layers.length} layers with question quality assessment`);

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in genius-machine function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

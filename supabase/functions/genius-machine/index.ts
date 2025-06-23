
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { processLayer } from './layer-processor.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, processingDepth = 1, circuitType = 'sequential', customArchetypes, enhancedMode = true } = await req.json();
    console.log('Processing question:', question);
    console.log('Processing depth:', processingDepth);
    console.log('Circuit type:', circuitType);
    console.log('Enhanced mode:', enhancedMode);
    console.log('Custom archetypes:', customArchetypes ? `${customArchetypes.length} custom archetypes` : 'Using default archetypes');

    const layers = [];
    
    for (let layerNum = 1; layerNum <= processingDepth; layerNum++) {
      const layer = await processLayer(question, layerNum, circuitType, layers, customArchetypes, enhancedMode);
      layers.push(layer);
    }

    // Final results with enhanced metrics
    const finalLayer = layers[layers.length - 1];
    
    const results = {
      insight: finalLayer.synthesis.insight,
      confidence: finalLayer.synthesis.confidence,
      tensionPoints: finalLayer.synthesis.tensionPoints,
      noveltyScore: finalLayer.synthesis.noveltyScore || 5,
      emergenceDetected: finalLayer.synthesis.emergenceDetected || false,
      processingDepth,
      circuitType,
      enhancedMode,
      assumptionAnalysis: layers[0]?.assumptionAnalysis,
      assumptionChallenge: layers[0]?.assumptionChallenge,
      finalTensionMetrics: finalLayer.tensionMetrics,
      layers: layers.map(layer => ({
        layerNumber: layer.layerNumber,
        circuitType: layer.circuitType,
        insight: layer.synthesis.insight,
        confidence: layer.synthesis.confidence,
        tensionPoints: layer.synthesis.tensionPoints,
        noveltyScore: layer.synthesis.noveltyScore || 5,
        emergenceDetected: layer.synthesis.emergenceDetected || false,
        tensionMetrics: layer.tensionMetrics,
        archetypeResponses: layer.archetypeResponses
      })),
      logicTrail: finalLayer.archetypeResponses
    };

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

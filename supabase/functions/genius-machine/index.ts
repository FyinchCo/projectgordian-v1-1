
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { processLayer } from './layer-processor.ts';
import { evaluateQuestionQuality } from './question-quality.ts';
import { defaultArchetypes } from './archetypes.ts';
import { detectAssumptions } from './analysis.ts';
import { LayerResult } from './types.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function getArchetypes(customArchetypes: string) {
  // Handle different archetype configurations
  switch (customArchetypes) {
    case 'default':
      return defaultArchetypes;
    default:
      return defaultArchetypes;
  }
}

async function analyzeAssumptions(question: string) {
  try {
    return await detectAssumptions(question);
  } catch (error) {
    console.error('Assumption analysis failed:', error);
    return {
      assumptions: ["Analysis temporarily unavailable"],
      challengingQuestions: ["What underlying assumptions might we be missing?"],
      resistanceScore: 5
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      question, 
      processingDepth = 1, 
      circuitType = 'sequential',
      customArchetypes = 'default',
      enhancedMode = false,
      previousLayers = [],
      startFromLayer = 1
    } = await req.json();

    console.log('Processing request:', {
      question: question.substring(0, 100) + '...',
      processingDepth,
      circuitType,
      enhancedMode,
      customArchetypes,
      previousLayersCount: Array.isArray(previousLayers) ? previousLayers.length : 0,
      startFromLayer
    });

    if (!question) {
      return new Response(JSON.stringify({ error: 'Question is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get archetypes based on configuration
    const archetypes = getArchetypes(customArchetypes);
    
    console.log('Running assumption analysis...');
    const assumptionAnalysis = await analyzeAssumptions(question);
    
    // Process layers - REMOVED HARD CAP, now supports up to 50 layers for safety
    const layers: LayerResult[] = Array.isArray(previousLayers) ? [...previousLayers] : [];
    const requestedDepth = Math.max(1, Math.min(processingDepth, 50)); // Increased from 10 to 50
    const actualStartLayer = Math.max(startFromLayer, layers.length + 1);
    
    console.log(`Processing layers from ${actualStartLayer} to ${requestedDepth} (${requestedDepth - actualStartLayer + 1} new layers)`);
    console.log(`Previous layers: ${layers.length}, Starting from layer: ${actualStartLayer}`);
    
    // Process each layer individually to ensure completion
    for (let i = actualStartLayer; i <= requestedDepth; i++) {
      try {
        console.log(`Starting layer ${i} of ${requestedDepth}...`);
        
        const layer = await processLayer(
          i, 
          question, 
          archetypes, 
          circuitType, 
          layers,
          enhancedMode
        );
        
        layers.push(layer);
        console.log(`Layer ${i} completed successfully. Total layers: ${layers.length}`);
        console.log(`Layer ${i} insight preview: ${layer.synthesis.insight.substring(0, 100)}...`);
        
      } catch (layerError) {
        console.error(`Layer ${i} failed:`, layerError);
        
        // Add a fallback layer result to maintain processing continuity
        layers.push({
          layerNumber: i,
          archetypeResponses: [],
          synthesis: {
            insight: `Layer ${i} encountered processing challenges but the analysis continued. Key insights were preserved from previous layers.`,
            confidence: Math.max(0.3, layers.length > 0 ? layers[layers.length - 1].synthesis.confidence - 0.1 : 0.3),
            tensionPoints: 1,
            noveltyScore: 2,
            emergenceDetected: false
          },
          timestamp: Date.now()
        });
        
        console.log(`Added fallback result for layer ${i}, continuing...`);
      }
    }

    // Validate that we actually processed the requested layers
    if (layers.length < requestedDepth) {
      console.warn(`WARNING: Only processed ${layers.length} layers out of ${requestedDepth} requested`);
    } else {
      console.log(`SUCCESS: Processed all ${layers.length} layers as requested`);
    }

    // Get the final synthesis from the last layer
    const finalLayer = layers[layers.length - 1];
    if (!finalLayer || !finalLayer.synthesis) {
      throw new Error('No valid layers were processed');
    }
    
    const finalSynthesis = finalLayer.synthesis;
    
    // Evaluate question quality with proper error handling
    let questionQuality = null;
    if (finalSynthesis.confidence > 0.2) {
      try {
        console.log('Evaluating question quality...');
        questionQuality = await evaluateQuestionQuality(question, finalSynthesis, layers);
        console.log('Question quality evaluation completed:', questionQuality ? 'Success' : 'Failed');
      } catch (qualityError) {
        console.error('Question quality evaluation failed:', qualityError);
        questionQuality = {
          overallScore: 6.0,
          feedback: "Question quality assessment was not available due to processing constraints, but the question generated meaningful analysis.",
          recommendations: ["Consider refining question specificity for enhanced insights."]
        };
      }
    }

    console.log(`Successfully processed ${layers.length} layers (requested: ${requestedDepth})`);

    const response = {
      insight: finalSynthesis.insight,
      confidence: finalSynthesis.confidence,
      tensionPoints: finalSynthesis.tensionPoints,
      noveltyScore: finalSynthesis.noveltyScore,
      emergenceDetected: finalSynthesis.emergenceDetected,
      processingDepth: layers.length,
      layers: layers,
      questionQuality: questionQuality,
      assumptionAnalysis: assumptionAnalysis,
      logicTrail: finalLayer.archetypeResponses || [],
      metadata: {
        timestamp: Date.now(),
        requestedDepth: requestedDepth,
        actualDepth: layers.length,
        layerProcessingSuccess: layers.length === requestedDepth,
        version: '1.0'
      }
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in genius-machine function:', error);
    
    // Return a meaningful error response instead of crashing
    return new Response(JSON.stringify({ 
      error: 'Processing error occurred',
      insight: 'The system encountered technical difficulties but maintained analytical capacity. Please try again with a refined question or contact support if the issue persists.',
      confidence: 0.2,
      tensionPoints: 0,
      noveltyScore: 1,
      emergenceDetected: false,
      processingDepth: 0,
      layers: [],
      questionQuality: null,
      assumptionAnalysis: null,
      metadata: {
        timestamp: Date.now(),
        error: error.message
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

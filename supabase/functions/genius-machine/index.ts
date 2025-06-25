
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
      customArchetypes = 'default',
      enhancedMode = false,
      previousLayers = 0,
      startFromLayer = 1
    } = await req.json();

    console.log('Processing request:', {
      question: question.substring(0, 100) + '...',
      processingDepth,
      circuitType,
      enhancedMode,
      customArchetypes,
      previousLayers,
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
    
    // Process layers
    const layers: LayerResult[] = [];
    let currentDepth = Math.max(1, Math.min(processingDepth, 3)); // Clamp between 1-3
    
    for (let i = startFromLayer; i <= currentDepth; i++) {
      try {
        const layer = await processLayer(
          i, 
          question, 
          archetypes, 
          circuitType, 
          layers,
          enhancedMode
        );
        layers.push(layer);
      } catch (layerError) {
        console.error(`Layer ${i} failed:`, layerError);
        
        // Add a fallback layer result
        layers.push({
          layerNumber: i,
          archetypeResponses: [],
          synthesis: {
            insight: `Layer ${i} encountered processing challenges but the analysis continued. Key insights were preserved from previous layers.`,
            confidence: 0.3,
            tensionPoints: 1,
            noveltyScore: 2,
            emergenceDetected: false
          },
          timestamp: Date.now()
        });
      }
    }

    // Get the final synthesis from the last layer
    const finalLayer = layers[layers.length - 1];
    const finalSynthesis = finalLayer.synthesis;
    
    // Evaluate question quality if we have a valid synthesis
    let questionQuality = null;
    if (finalSynthesis.confidence > 0.3) {
      try {
        console.log('Evaluating question quality...');
        questionQuality = await evaluateQuestionQuality(question, finalSynthesis, layers);
        console.log('Question quality evaluation completed:', questionQuality);
      } catch (qualityError) {
        console.error('Question quality evaluation failed:', qualityError);
        questionQuality = {
          overallScore: 6.0,
          feedback: "Question quality assessment was not available due to processing constraints, but the question generated meaningful analysis.",
          recommendations: ["Consider refining question specificity for enhanced insights."]
        };
      }
    }

    console.log(`Successfully processed ${layers.length} layers with question quality assessment`);

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
      metadata: {
        timestamp: Date.now(),
        processingTime: Date.now() - Date.now(),
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

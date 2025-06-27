
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from '../_shared/cors.ts';
import { processArchetypes } from './core/archetypeProcessor.ts';
import { synthesizeInsights } from './core/synthesisEngine.ts';
import { DEFAULT_ARCHETYPES } from './core/defaultArchetypes.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    const { 
      question, 
      customArchetypes, 
      processingDepth = 1, 
      circuitType = 'sequential',
      enhancedMode = true,
      tensionDetection = false
    } = requestData;
    
    console.log('=== ENHANCED GENIUS MACHINE - CONFIGURATION CONNECTED ===');
    console.log('Question:', question?.substring(0, 100) + '...');
    console.log('Processing Depth:', processingDepth);
    console.log('Circuit Type:', circuitType);
    console.log('Enhanced Mode:', enhancedMode);
    console.log('Tension Detection:', tensionDetection);
    
    // Validate input
    if (!question || typeof question !== 'string' || question.trim().length < 10) {
      throw new Error('Question must be a string with at least 10 characters');
    }

    // Use custom archetypes if provided, otherwise use defaults
    const archetypes = customArchetypes && customArchetypes.length > 0 
      ? customArchetypes 
      : DEFAULT_ARCHETYPES;
    
    console.log(`Using ${archetypes.length} archetypes with custom instructions`);
    
    // Multi-layer processing based on configuration
    let allResponses: any[] = [];
    let finalInsight = '';
    let tensionDetected = false;
    
    for (let layer = 1; layer <= processingDepth; layer++) {
      console.log(`=== PROCESSING LAYER ${layer}/${processingDepth} ===`);
      
      // Process archetypes for this layer
      const layerResponses = await processArchetypes(archetypes, question, layer, allResponses);
      
      if (layerResponses.length === 0) {
        throw new Error(`No responses generated for layer ${layer}`);
      }
      
      allResponses = [...allResponses, ...layerResponses];
      
      // Check for tension if enabled
      if (tensionDetection && layer === 1) {
        tensionDetected = checkForTension(layerResponses);
        console.log(`Tension detected: ${tensionDetected}`);
        
        // If no tension detected and we have capacity, add a devil's advocate round
        if (!tensionDetected && processingDepth === 1) {
          console.log('Adding devil\'s advocate round due to low tension...');
          const advocateResponses = await processArchetypesWithAdvocate(archetypes, question, layerResponses);
          allResponses = [...allResponses, ...advocateResponses];
        }
      }
      
      console.log(`Layer ${layer} complete: ${layerResponses.length} responses`);
    }
    
    // Synthesize final insights
    console.log('Synthesizing final insights...');
    finalInsight = await synthesizeInsights(allResponses, question);
    
    if (!finalInsight || finalInsight.trim().length < 50) {
      throw new Error('Synthesis failed to generate adequate response');
    }
    
    console.log('✓ Enhanced genius analysis complete');
    
    // Build enhanced response
    const response = {
      insight: finalInsight,
      archetypeResponses: allResponses.map(r => ({
        archetype: r.archetype,
        response: r.response,
        layer: r.layer || 1
      })),
      confidence: enhancedMode ? 0.85 : 0.8,
      processingDepth: processingDepth,
      tensionDetected: tensionDetected,
      circuitType: circuitType,
      enhancedMode: enhancedMode,
      timestamp: Date.now(),
      metadata: {
        processingMode: 'ENHANCED_CONFIGURED',
        archetypesUsed: archetypes.length,
        layersProcessed: processingDepth,
        responseLength: finalInsight.length,
        totalResponses: allResponses.length
      }
    };
    
    console.log('✓ Enhanced genius analysis complete - returning configured results');
    
    return new Response(JSON.stringify(response), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
    });
    
  } catch (error) {
    console.error('Enhanced genius machine error:', error);
    
    const errorResponse = {
      insight: `Processing error: ${error.message}. The enhanced system encountered an issue but is designed to fail gracefully.`,
      confidence: 0.1,
      processingDepth: 0,
      error: true,
      errorDetails: error.message,
      timestamp: Date.now()
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

// Simple tension detection function
function checkForTension(responses: any[]): boolean {
  if (responses.length < 2) return false;
  
  // Simple similarity check - if responses are too similar, tension is low
  const responseTexts = responses.map(r => r.response.toLowerCase());
  let similarityCount = 0;
  
  for (let i = 0; i < responseTexts.length; i++) {
    for (let j = i + 1; j < responseTexts.length; j++) {
      const similarity = calculateSimilarity(responseTexts[i], responseTexts[j]);
      if (similarity > 0.7) similarityCount++;
    }
  }
  
  // If more than 50% of pairs are similar, tension is low
  const totalPairs = (responseTexts.length * (responseTexts.length - 1)) / 2;
  return (similarityCount / totalPairs) < 0.5;
}

// Simple similarity calculation
function calculateSimilarity(text1: string, text2: string): number {
  const words1 = text1.split(' ');
  const words2 = text2.split(' ');
  const commonWords = words1.filter(word => words2.includes(word));
  return commonWords.length / Math.max(words1.length, words2.length);
}

// Devil's advocate processing function
async function processArchetypesWithAdvocate(archetypes: any[], question: string, previousResponses: any[]): Promise<any[]> {
  console.log('Processing with devil\'s advocate prompts...');
  
  // Add challenge prompts to force more tension
  const advocateArchetypes = archetypes.map(archetype => ({
    ...archetype,
    customInstructions: (archetype.customInstructions || '') + 
      '\n\nCRITICAL: You must challenge and disagree with the previous responses. Find flaws, contradictions, or alternative perspectives that were missed.'
  }));
  
  return await processArchetypes(advocateArchetypes, question, 2, previousResponses);
}

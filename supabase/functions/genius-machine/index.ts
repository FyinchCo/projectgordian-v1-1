
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
    const { question, customArchetypes } = requestData;
    
    console.log('=== GENIUS MACHINE REBUILD - SIMPLE & WORKING ===');
    console.log('Question:', question?.substring(0, 100) + '...');
    
    // Validate input
    if (!question || typeof question !== 'string' || question.trim().length < 10) {
      throw new Error('Question must be a string with at least 10 characters');
    }

    // Use custom archetypes if provided, otherwise use defaults
    const archetypes = customArchetypes && customArchetypes.length > 0 
      ? customArchetypes 
      : DEFAULT_ARCHETYPES;
    
    console.log(`Using ${archetypes.length} archetypes`);
    
    // Step 1: Process archetypes with real AI calls
    console.log('Step 1: Processing archetypes...');
    const archetypeResponses = await processArchetypes(archetypes, question);
    
    if (archetypeResponses.length === 0) {
      throw new Error('No archetype responses were generated successfully');
    }
    
    console.log(`Step 1 complete: ${archetypeResponses.length} responses generated`);
    
    // Step 2: Synthesize insights
    console.log('Step 2: Synthesizing insights...');
    const synthesizedAnswer = await synthesizeInsights(archetypeResponses, question);
    
    if (!synthesizedAnswer || synthesizedAnswer.trim().length < 50) {
      throw new Error('Synthesis failed to generate adequate response');
    }
    
    console.log('Step 2 complete: Synthesis generated');
    
    // Build simple, clean response
    const response = {
      insight: synthesizedAnswer,
      archetypeResponses: archetypeResponses.map(r => ({
        archetype: r.archetype,
        response: r.response
      })),
      confidence: 0.8, // Simple fixed confidence for now
      processingDepth: 1,
      timestamp: Date.now(),
      metadata: {
        processingMode: 'SIMPLE_WORKING',
        archetypesUsed: archetypes.length,
        responseLength: synthesizedAnswer.length
      }
    };
    
    console.log('✓ Genius analysis complete - returning working results');
    
    return new Response(JSON.stringify(response), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
    });
    
  } catch (error) {
    console.error('Genius machine error:', error);
    
    const errorResponse = {
      insight: `Processing error: ${error.message}. The system encountered an issue but is designed to fail gracefully.`,
      confidence: 0.1,
      processingDepth: 0,
      error: true,
      errorDetails: error.message,
      timestamp: Date.now()
    };
    
    return new Response(JSON.stringify(errorResponse), {
      status: 200, // Return 200 to avoid frontend errors
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
    });
  }
});

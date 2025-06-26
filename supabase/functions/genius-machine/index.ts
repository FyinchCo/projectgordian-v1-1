
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from '../_shared/cors.ts';
import { validateRequest } from './request/requestValidator.ts';
import { buildArchetypes } from './request/archetypeBuilder.ts';
import { processLayers } from './processing/layerProcessor.ts';
import { buildFinalResponse, buildErrorResponse } from './response/responseBuilder.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    
    console.log('=== OPTIMIZED GENIUS MACHINE REQUEST START ===');
    console.log('Question:', requestData.question?.substring(0, 100) + '...');
    console.log('Processing depth:', requestData.processingDepth);
    console.log('Output type:', requestData.outputType);
    
    // Validate and structure the request
    const validatedRequest = validateRequest(requestData);
    
    // Build archetypes array
    const archetypes = buildArchetypes(validatedRequest.customArchetypes);
    console.log(`Configured ${archetypes.length} archetypes:`, archetypes.map(a => a.name));
    
    // Process layers with circuit breaker
    const layers = await processLayers(
      archetypes,
      validatedRequest.question,
      validatedRequest.circuitType,
      validatedRequest.processingDepth
    );
    
    // Build final response with compression
    const finalResults = await buildFinalResponse(
      layers,
      validatedRequest.question,
      validatedRequest.circuitType,
      validatedRequest.compressionSettings,
      validatedRequest.outputType
    );
    
    return new Response(JSON.stringify(finalResults), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
    });
    
  } catch (error) {
    const errorResponse = buildErrorResponse(error);
    
    return new Response(JSON.stringify(errorResponse), {
      status: 200,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
    });
  }
});

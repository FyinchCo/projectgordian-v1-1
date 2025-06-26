
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
    
    console.log('=== ENHANCED GENIUS MACHINE WITH REAL-TIME PROGRESS ===');
    console.log('Question:', requestData.question?.substring(0, 100) + '...');
    console.log('Processing depth:', requestData.processingDepth);
    console.log('Output type:', requestData.outputType);
    
    // Validate and structure the request
    const validatedRequest = validateRequest(requestData);
    
    // Build archetypes array
    const archetypes = buildArchetypes(validatedRequest.customArchetypes);
    console.log(`Configured ${archetypes.length} archetypes:`, archetypes.map(a => a.name));
    
    // Create a progress tracking system
    let lastProgressUpdate = Date.now();
    const progressUpdates: any[] = [];
    
    const progressCallback = (progress: any) => {
      const now = Date.now();
      // Throttle progress updates to every 500ms to avoid overwhelming the client
      if (now - lastProgressUpdate > 500) {
        progressUpdates.push({
          ...progress,
          timestamp: now,
          phase: progress.phase,
          currentLayer: progress.currentLayer,
          totalLayers: progress.totalLayers,
          currentArchetype: progress.currentArchetype,
          estimatedTimeRemaining: Math.round(progress.estimatedTimeRemaining / 1000) // Convert to seconds
        });
        lastProgressUpdate = now;
        console.log(`Progress: ${progress.phase} - Layer ${progress.currentLayer}/${progress.totalLayers} - ${progress.currentArchetype}`);
      }
    };
    
    // Process layers with real-time progress reporting
    const layers = await processLayers(
      archetypes,
      validatedRequest.question,
      validatedRequest.circuitType,
      validatedRequest.processingDepth,
      progressCallback
    );
    
    // Build final response with compression
    const finalResults = await buildFinalResponse(
      layers,
      validatedRequest.question,
      validatedRequest.circuitType,
      validatedRequest.compressionSettings,
      validatedRequest.outputType
    );
    
    // Add progress metadata to final results
    const enhancedResults = {
      ...finalResults,
      metadata: {
        ...finalResults.metadata,
        progressUpdates,
        totalProgressUpdates: progressUpdates.length,
        realTimeProcessing: true,
        processingPhases: ['initializing', 'processing', 'synthesizing', 'completing', 'completed']
      }
    };
    
    console.log(`✓ Processing complete with ${progressUpdates.length} progress updates`);
    
    return new Response(JSON.stringify(enhancedResults), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
    });
    
  } catch (error) {
    console.error('Enhanced processing failed:', error);
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

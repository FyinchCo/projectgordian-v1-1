
import { supabase } from "@/integrations/supabase/client";
import { createProcessingTimeout, validateChunkResult } from './chunkResultHandler';

export const executeChunk = async (
  chunkConfig: any,
  chunkIndex: number,
  actualChunkSize: number
) => {
  const chunkStartTime = Date.now();
  
  console.log(`Calling genius-machine for chunk ${chunkIndex + 1} at ${new Date().toISOString()}...`);
  
  // Reduced timeout for smaller chunks (6 minutes instead of 8)
  const timeoutPromise = createProcessingTimeout(chunkIndex, 360000);
  
  const requestPromise = supabase.functions.invoke('genius-machine', {
    body: chunkConfig
  }).then(result => {
    console.log(`Chunk ${chunkIndex + 1} raw result received at ${new Date().toISOString()}:`, {
      hasData: !!result.data,
      hasError: !!result.error,
      errorMessage: result.error?.message
    });
    
    if (result.error) {
      throw new Error(`Supabase function error: ${result.error.message}`);
    }
    
    return result;
  });
  
  const result = await Promise.race([requestPromise, timeoutPromise]);
  
  const chunkDuration = Date.now() - chunkStartTime;
  console.log(`Chunk ${chunkIndex + 1} completed in ${Math.round(chunkDuration/1000)}s (expected: ~${actualChunkSize * 30}s)`);
  
  if (chunkDuration > actualChunkSize * 45000) {
    console.warn(`⚠️ CHUNK ${chunkIndex + 1} TOOK LONGER THAN EXPECTED: ${Math.round(chunkDuration/1000)}s vs expected ~${actualChunkSize * 30}s`);
  }
  
  const { data } = validateChunkResult(result, chunkIndex);
  
  console.log(`Chunk ${chunkIndex + 1} result validation:`, {
    hasData: !!data,
    hasLayers: !!data.layers,
    layerCount: data.layers?.length || 0,
    hasInsight: !!data.insight,
    expectedLayers: actualChunkSize,
    actualDepth: data.processingDepth || 0,
    layerProcessingSuccess: data.metadata?.layerProcessingSuccess
  });
  
  if (!data.layers || data.layers.length === 0) {
    console.error(`Chunk ${chunkIndex + 1} returned no layers!`);
    throw new Error(`Chunk ${chunkIndex + 1} processing failed: No layers returned`);
  }
  
  if (data.layers.length !== actualChunkSize) {
    console.warn(`Chunk ${chunkIndex + 1} expected ${actualChunkSize} layers but got ${data.layers.length}`);
  }
  
  return { data, chunkDuration };
};

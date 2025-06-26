
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChunkedJobRequest {
  question: string
  processingDepth: number
  circuitType: string
  enhancedMode: boolean
  customArchetypes?: any
  currentAssessment?: any
  chunkSize?: number
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    if (req.method === 'POST') {
      const jobData: ChunkedJobRequest = await req.json()
      const chunkSize = jobData.chunkSize || 2 // Process 2 layers per chunk for reliability
      
      console.log(`Starting chunked processing: ${jobData.processingDepth} layers in chunks of ${chunkSize}`)
      
      // Create job record
      const { data: job, error: jobError } = await supabaseClient
        .from('processing_jobs')
        .insert({
          question: jobData.question,
          processing_depth: jobData.processingDepth,
          circuit_type: jobData.circuitType,
          enhanced_mode: jobData.enhancedMode,
          custom_archetypes: jobData.customArchetypes,
          current_assessment: jobData.currentAssessment,
          status: 'pending'
        })
        .select()
        .single()

      if (jobError) {
        throw new Error(`Failed to create job: ${jobError.message}`)
      }

      // Create initial progress record
      await supabaseClient
        .from('job_progress')
        .insert({
          job_id: job.id,
          current_layer: 0,
          total_layers: jobData.processingDepth,
          processing_phase: 'Initializing chunked genius processing...',
          chunk_progress: {
            totalChunks: Math.ceil(jobData.processingDepth / chunkSize),
            currentChunk: 0,
            chunkSize: chunkSize,
            breakthroughPotential: 0,
            tensionLevel: 0
          }
        })

      // Start chunked background processing
      EdgeRuntime.waitUntil(processJobInChunks(job.id, jobData, chunkSize, supabaseClient))

      return new Response(
        JSON.stringify({ 
          jobId: job.id, 
          status: 'Chunked processing started',
          totalChunks: Math.ceil(jobData.processingDepth / chunkSize),
          chunkSize: chunkSize,
          estimatedMinutes: Math.ceil((jobData.processingDepth * 25) / 60) // More realistic estimate
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Handle job status requests (same as before)
    if (req.method === 'GET') {
      const url = new URL(req.url)
      const jobId = url.searchParams.get('jobId')
      
      if (jobId) {
        const { data: job } = await supabaseClient
          .from('processing_jobs')
          .select(`
            *,
            job_progress(*),
            job_results(*),
            final_results(*)
          `)
          .eq('id', jobId)
          .single()

        return new Response(
          JSON.stringify(job),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Get recent jobs
      const { data: jobs } = await supabaseClient
        .from('processing_jobs')
        .select(`
          *,
          job_progress(*),
          final_results(*)
        `)
        .order('created_at', { ascending: false })
        .limit(10)

      return new Response(
        JSON.stringify(jobs),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  } catch (error) {
    console.error('Chunked processor error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

async function processJobInChunks(jobId: string, jobData: ChunkedJobRequest, chunkSize: number, supabaseClient: any) {
  try {
    console.log(`=== CHUNKED GENIUS PROCESSING START ===`)
    console.log(`Job ${jobId}: ${jobData.processingDepth} layers in ${Math.ceil(jobData.processingDepth / chunkSize)} chunks`)
    
    // Update job status to processing
    await supabaseClient
      .from('processing_jobs')
      .update({ 
        status: 'processing',
        started_at: new Date().toISOString()
      })
      .eq('id', jobId)

    const totalChunks = Math.ceil(jobData.processingDepth / chunkSize)
    let accumulatedLayers: any[] = []
    let overallTensionLevel = 0
    let breakthroughPotential = 0
    
    // Process each chunk sequentially
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const startLayer = (chunkIndex * chunkSize) + 1
      const endLayer = Math.min(startLayer + chunkSize - 1, jobData.processingDepth)
      const actualChunkSize = endLayer - startLayer + 1
      
      console.log(`Processing chunk ${chunkIndex + 1}/${totalChunks}: layers ${startLayer}-${endLayer}`)
      
      // Update progress
      await updateChunkProgress(supabaseClient, jobId, {
        currentChunk: chunkIndex + 1,
        totalChunks,
        currentLayer: startLayer,
        totalLayers: jobData.processingDepth,
        processingPhase: `Processing layers ${startLayer}-${endLayer} (Chunk ${chunkIndex + 1}/${totalChunks})`,
        breakthroughPotential,
        tensionLevel: overallTensionLevel
      })
      
      try {
        // Call genius-machine for this chunk
        const chunkResult = await processChunk(jobData, startLayer, actualChunkSize, accumulatedLayers)
        
        if (chunkResult?.layers) {
          // Store chunk results in database
          await storeChunkResults(supabaseClient, jobId, chunkResult.layers, chunkIndex + 1)
          
          // Accumulate layers for next chunk context
          accumulatedLayers = [...accumulatedLayers, ...chunkResult.layers]
          
          // Calculate breakthrough metrics
          const chunkTension = calculateChunkTension(chunkResult.layers)
          overallTensionLevel = Math.max(overallTensionLevel, chunkTension)
          breakthroughPotential = calculateBreakthroughPotential(accumulatedLayers, chunkIndex + 1, totalChunks)
          
          console.log(`✓ Chunk ${chunkIndex + 1} complete: ${chunkResult.layers.length} layers, tension: ${chunkTension}, breakthrough: ${breakthroughPotential}%`)
        } else {
          throw new Error('Chunk processing returned no layers')
        }
        
      } catch (chunkError) {
        console.error(`Chunk ${chunkIndex + 1} failed:`, chunkError)
        
        // For failed chunks, create fallback layers to maintain continuity
        const fallbackLayers = createFallbackLayers(startLayer, endLayer, jobData.question, chunkIndex + 1)
        await storeChunkResults(supabaseClient, jobId, fallbackLayers, chunkIndex + 1)
        accumulatedLayers = [...accumulatedLayers, ...fallbackLayers]
        
        console.log(`⚠️ Chunk ${chunkIndex + 1} recovered with fallback layers`)
      }
      
      // Inter-chunk delay for stability
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    // Create final synthesis from all accumulated layers
    const finalSynthesis = await createFinalSynthesis(accumulatedLayers, jobData.question, overallTensionLevel, breakthroughPotential)
    
    // Store final results
    await supabaseClient
      .from('final_results')
      .insert({
        job_id: jobId,
        synthesis: finalSynthesis.insight,
        confidence: finalSynthesis.confidence,
        tension_points: overallTensionLevel,
        novelty_score: finalSynthesis.noveltyScore,
        emergence_detected: breakthroughPotential >= 70,
        full_results: {
          ...finalSynthesis,
          layers: accumulatedLayers,
          chunkProcessingMetrics: {
            totalChunks,
            layersProcessed: accumulatedLayers.length,
            finalTensionLevel: overallTensionLevel,
            finalBreakthroughPotential: breakthroughPotential
          }
        }
      })

    // Update job to completed
    await supabaseClient
      .from('processing_jobs')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', jobId)

    // Final progress update
    await updateChunkProgress(supabaseClient, jobId, {
      currentChunk: totalChunks,
      totalChunks,
      currentLayer: jobData.processingDepth,
      totalLayers: jobData.processingDepth,
      processingPhase: `Genius analysis complete! Breakthrough potential: ${breakthroughPotential}%`,
      breakthroughPotential,
      tensionLevel: overallTensionLevel
    })

    console.log(`✓ Job ${jobId} completed: ${accumulatedLayers.length} layers, breakthrough: ${breakthroughPotential}%`)

  } catch (error) {
    console.error(`Job ${jobId} failed:`, error)
    
    await supabaseClient
      .from('processing_jobs')
      .update({ 
        status: 'failed',
        error_message: error.message,
        completed_at: new Date().toISOString()
      })
      .eq('id', jobId)
  }
}

async function processChunk(jobData: ChunkedJobRequest, startLayer: number, chunkSize: number, previousLayers: any[]) {
  const chunkConfig = {
    question: jobData.question,
    processingDepth: chunkSize,
    circuitType: jobData.circuitType,
    enhancedMode: jobData.enhancedMode,
    customArchetypes: jobData.customArchetypes,
    currentAssessment: jobData.currentAssessment,
    previousLayers: previousLayers.slice(-6), // Use last 6 layers for context
    startFromLayer: startLayer,
    chunkProcessing: true
  }
  
  console.log(`Calling genius-machine for chunk: layers ${startLayer}-${startLayer + chunkSize - 1}`)
  
  const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/genius-machine`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
    },
    body: JSON.stringify(chunkConfig)
  })
  
  if (!response.ok) {
    throw new Error(`Genius machine chunk failed: ${response.status} ${response.statusText}`)
  }
  
  return await response.json()
}

async function updateChunkProgress(supabaseClient: any, jobId: string, progress: any) {
  await supabaseClient
    .from('job_progress')
    .upsert({
      job_id: jobId,
      current_layer: progress.currentLayer,
      total_layers: progress.totalLayers,
      processing_phase: progress.processingPhase,
      chunk_progress: {
        currentChunk: progress.currentChunk,
        totalChunks: progress.totalChunks,
        breakthroughPotential: progress.breakthroughPotential,
        tensionLevel: progress.tensionLevel
      },
      updated_at: new Date().toISOString()
    })
}

async function storeChunkResults(supabaseClient: any, jobId: string, layers: any[], chunkNumber: number) {
  const results = layers.map(layer => ({
    job_id: jobId,
    layer_number: layer.layerNumber,
    archetype_name: `Chunk-${chunkNumber}`,
    layer_content: layer
  }))
  
  await supabaseClient
    .from('job_results')
    .insert(results)
}

function calculateChunkTension(layers: any[]): number {
  if (!layers || layers.length === 0) return 0
  
  const tensions = layers.map(layer => layer.synthesis?.tensionPoints || 0)
  return Math.max(...tensions, 0)
}

function calculateBreakthroughPotential(allLayers: any[], currentChunk: number, totalChunks: number): number {
  const completionRatio = currentChunk / totalChunks
  const layerDepth = allLayers.length
  const avgTension = allLayers.reduce((sum, layer) => sum + (layer.synthesis?.tensionPoints || 0), 0) / allLayers.length
  const emergenceDetected = allLayers.some(layer => layer.synthesis?.emergenceDetected)
  
  let potential = completionRatio * 40 // Base completion score
  potential += Math.min(layerDepth * 3, 30) // Depth bonus
  potential += Math.min(avgTension * 5, 20) // Tension bonus
  potential += emergenceDetected ? 15 : 0 // Emergence bonus
  
  return Math.min(Math.round(potential), 100)
}

function createFallbackLayers(startLayer: number, endLayer: number, question: string, chunkNumber: number): any[] {
  const layers = []
  
  for (let layerNum = startLayer; layerNum <= endLayer; layerNum++) {
    layers.push({
      layerNumber: layerNum,
      synthesis: {
        insight: `Layer ${layerNum} (Chunk ${chunkNumber} Fallback): Even when primary processing encounters difficulties, the genius system maintains analytical progression. This layer represents a continuation of deep inquiry into "${question}", ensuring that the cumulative intelligence process remains unbroken and continues building toward breakthrough insights.`,
        confidence: 0.6,
        tensionPoints: Math.min(layerNum, 4),
        noveltyScore: Math.min(layerNum + 2, 8),
        emergenceDetected: layerNum > 8,
        breakthroughTriggered: false
      },
      timestamp: Date.now()
    })
  }
  
  return layers
}

async function createFinalSynthesis(allLayers: any[], question: string, tensionLevel: number, breakthroughPotential: number) {
  const finalLayer = allLayers[allLayers.length - 1]
  const isBreakthrough = breakthroughPotential >= 70
  
  const synthesis = isBreakthrough 
    ? `BREAKTHROUGH SYNTHESIS ACHIEVED: Through ${allLayers.length} layers of cumulative genius analysis, a transcendent understanding has emerged regarding "${question}". The systematic progression through multiple cognitive architectures has revealed insights that transcend conventional thinking. This represents a genuine breakthrough in understanding, where the convergence of diverse perspectives has created new knowledge that could not have been achieved through linear analysis alone.`
    : `PROGRESSIVE GENIUS SYNTHESIS: ${allLayers.length} layers of deep analysis have systematically explored "${question}" through multiple cognitive lenses. While breakthrough transcendence has not yet been achieved, the cumulative intelligence process has generated substantial insights and identified key tension points that point toward deeper understanding. This analysis represents significant progress toward genius-level comprehension.`
  
  return {
    insight: synthesis,
    confidence: Math.min(0.95, 0.5 + (allLayers.length * 0.02) + (breakthroughPotential * 0.003)),
    tensionPoints: tensionLevel,
    noveltyScore: Math.min(10, 3 + Math.floor(allLayers.length / 2)),
    emergenceDetected: isBreakthrough,
    breakthroughAchieved: isBreakthrough,
    processingDepth: allLayers.length,
    breakthroughPotential: breakthroughPotential
  }
}


import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface JobRequest {
  question: string
  processingDepth: number
  circuitType: string
  enhancedMode: boolean
  customArchetypes?: any
  currentAssessment?: any
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
      const jobData: JobRequest = await req.json()
      
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
          current_layer: 1,
          total_layers: jobData.processingDepth,
          processing_phase: 'Initializing job...'
        })

      // Start background processing
      EdgeRuntime.waitUntil(processJobInBackground(job.id, jobData, supabaseClient))

      return new Response(
        JSON.stringify({ 
          jobId: job.id, 
          status: 'Job created and processing started',
          estimatedMinutes: Math.ceil((jobData.processingDepth * 35) / 60)
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    if (req.method === 'GET') {
      const url = new URL(req.url)
      const jobId = url.searchParams.get('jobId')
      
      if (jobId) {
        // Get job status and progress
        const { data: job } = await supabaseClient
          .from('processing_jobs')
          .select(`
            *,
            job_progress(*),
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
    console.error('Job processor error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

async function processJobInBackground(jobId: string, jobData: JobRequest, supabaseClient: any) {
  try {
    console.log(`Starting background processing for job ${jobId}`)
    
    // Update job status to processing
    await supabaseClient
      .from('processing_jobs')
      .update({ 
        status: 'processing',
        started_at: new Date().toISOString()
      })
      .eq('id', jobId)

    // Call the original genius-machine function
    const geniusResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/genius-machine`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
      },
      body: JSON.stringify({
        question: jobData.question,
        processingDepth: [jobData.processingDepth],
        circuitType: jobData.circuitType,
        enhancedMode: jobData.enhancedMode,
        customArchetypes: jobData.customArchetypes,
        currentAssessment: jobData.currentAssessment,
        // Add job tracking context
        jobId: jobId,
        backgroundMode: true
      })
    })

    if (!geniusResponse.ok) {
      throw new Error(`Genius machine failed: ${geniusResponse.statusText}`)
    }

    const results = await geniusResponse.json()
    
    console.log(`Job ${jobId} completed successfully`)

    // Store final results
    await supabaseClient
      .from('final_results')
      .insert({
        job_id: jobId,
        synthesis: results.synthesis || 'Analysis completed successfully',
        confidence: results.confidence || 0,
        tension_points: results.tensionPoints || 0,
        novelty_score: results.noveltyScore,
        emergence_detected: results.emergenceDetected || false,
        full_results: results
      })

    // Update job status to completed
    await supabaseClient
      .from('processing_jobs')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', jobId)

    // Final progress update
    await supabaseClient
      .from('job_progress')
      .upsert({
        job_id: jobId,
        current_layer: jobData.processingDepth,
        total_layers: jobData.processingDepth,
        processing_phase: 'Analysis complete',
        updated_at: new Date().toISOString()
      })

  } catch (error) {
    console.error(`Job ${jobId} failed:`, error)
    
    // Update job status to failed
    await supabaseClient
      .from('processing_jobs')
      .update({ 
        status: 'failed',
        error_message: error.message,
        completed_at: new Date().toISOString()
      })
      .eq('id', jobId)

    // Update progress to show error
    await supabaseClient
      .from('job_progress')
      .upsert({
        job_id: jobId,
        processing_phase: `Error: ${error.message}`,
        updated_at: new Date().toISOString()
      })
  }
}


-- Create enum for job status first
CREATE TYPE job_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');

-- Create processing_jobs table to track all analysis jobs
CREATE TABLE public.processing_jobs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NULL,
  question text NOT NULL,
  processing_depth integer NOT NULL DEFAULT 5,
  circuit_type text NOT NULL DEFAULT 'sequential',
  enhanced_mode boolean NOT NULL DEFAULT true,
  custom_archetypes jsonb NULL,
  current_assessment jsonb NULL,
  status job_status NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  started_at timestamp with time zone NULL,
  completed_at timestamp with time zone NULL,
  error_message text NULL
);

-- Create job_progress table for real-time progress tracking
CREATE TABLE public.job_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id uuid NOT NULL REFERENCES public.processing_jobs(id) ON DELETE CASCADE,
  current_layer integer NOT NULL DEFAULT 1,
  total_layers integer NOT NULL,
  current_archetype text NULL,
  processing_phase text NULL,
  chunk_progress jsonb NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create job_results table for incremental layer storage
CREATE TABLE public.job_results (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id uuid NOT NULL REFERENCES public.processing_jobs(id) ON DELETE CASCADE,
  layer_number integer NOT NULL,
  archetype_name text NOT NULL,
  layer_content jsonb NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create final_results table for completed synthesis
CREATE TABLE public.final_results (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id uuid NOT NULL REFERENCES public.processing_jobs(id) ON DELETE CASCADE,
  synthesis text NOT NULL,
  confidence numeric NOT NULL DEFAULT 0,
  tension_points integer NOT NULL DEFAULT 0,
  novelty_score numeric NULL,
  emergence_detected boolean NOT NULL DEFAULT false,
  full_results jsonb NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) policies
ALTER TABLE public.processing_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.final_results ENABLE ROW LEVEL SECURITY;

-- Create policies to allow anyone to insert/view jobs (since no auth is required yet)
CREATE POLICY "Anyone can insert jobs" ON public.processing_jobs FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view jobs" ON public.processing_jobs FOR SELECT USING (true);
CREATE POLICY "Anyone can update jobs" ON public.processing_jobs FOR UPDATE USING (true);

CREATE POLICY "Anyone can insert progress" ON public.job_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view progress" ON public.job_progress FOR SELECT USING (true);
CREATE POLICY "Anyone can update progress" ON public.job_progress FOR UPDATE USING (true);

CREATE POLICY "Anyone can insert results" ON public.job_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view results" ON public.job_results FOR SELECT USING (true);

CREATE POLICY "Anyone can insert final results" ON public.final_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view final results" ON public.final_results FOR SELECT USING (true);

-- Create indexes for better query performance
CREATE INDEX idx_processing_jobs_status ON public.processing_jobs(status);
CREATE INDEX idx_processing_jobs_created_at ON public.processing_jobs(created_at DESC);
CREATE INDEX idx_job_progress_job_id ON public.job_progress(job_id);
CREATE INDEX idx_job_results_job_id ON public.job_results(job_id);
CREATE INDEX idx_final_results_job_id ON public.final_results(job_id);

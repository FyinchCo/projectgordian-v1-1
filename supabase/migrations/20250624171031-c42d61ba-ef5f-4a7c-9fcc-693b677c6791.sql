
-- Create the insights_history table to store user insights
CREATE TABLE public.insights_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question text NOT NULL,
  insight text NOT NULL,
  confidence numeric NOT NULL DEFAULT 0,
  tension_points integer NOT NULL DEFAULT 0,
  processing_depth integer NOT NULL DEFAULT 1,
  circuit_type text NOT NULL DEFAULT 'sequential',
  novelty_score numeric NULL,
  emergence_detected boolean NOT NULL DEFAULT false,
  full_results jsonb NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NULL
);

-- Add Row Level Security (RLS) policies for the insights_history table
ALTER TABLE public.insights_history ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert insights (since no auth is required yet)
CREATE POLICY "Anyone can insert insights" 
  ON public.insights_history 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow anyone to select insights (since no auth is required yet)
CREATE POLICY "Anyone can view insights" 
  ON public.insights_history 
  FOR SELECT 
  USING (true);

-- Create policy to allow anyone to delete insights (since no auth is required yet)
CREATE POLICY "Anyone can delete insights" 
  ON public.insights_history 
  FOR DELETE 
  USING (true);

-- Create index for better query performance
CREATE INDEX idx_insights_history_created_at ON public.insights_history(created_at DESC);
CREATE INDEX idx_insights_history_question ON public.insights_history USING gin(to_tsvector('english', question));
CREATE INDEX idx_insights_history_insight ON public.insights_history USING gin(to_tsvector('english', insight));

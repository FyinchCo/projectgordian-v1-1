
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Job {
  id: string;
  question: string;
  processing_depth: number;
  circuit_type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  job_progress?: Array<{
    current_layer: number;
    total_layers: number;
    current_archetype?: string;
    processing_phase?: string;
    chunk_progress?: any;
    updated_at: string;
  }>;
  final_results?: Array<{
    synthesis: string;
    confidence: number;
    tension_points: number;
    novelty_score?: number;
    emergence_detected: boolean;
    full_results: any;
  }>;
}

export const useJobMonitoring = (jobId?: string) => {
  const [job, setJob] = useState<Job | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Submit a new job
  const submitJob = async (jobData: {
    question: string;
    processingDepth: number;
    circuitType: string;
    enhancedMode: boolean;
    customArchetypes?: any;
    currentAssessment?: any;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/genius-job-processor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.supabaseKey}`
        },
        body: JSON.stringify(jobData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit job');
      }

      const result = await response.json();
      return result.jobId;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch job status
  const fetchJob = async (id: string) => {
    try {
      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/genius-job-processor?jobId=${id}`, {
        headers: {
          'Authorization': `Bearer ${supabase.supabaseKey}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch job');
      }

      const jobData = await response.json();
      setJob(jobData);
      return jobData;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  // Fetch recent jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/genius-job-processor`, {
        headers: {
          'Authorization': `Bearer ${supabase.supabaseKey}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const jobsData = await response.json();
      setJobs(jobsData);
      return jobsData;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Real-time subscription for job updates
  useEffect(() => {
    if (!jobId) return;

    const channel = supabase
      .channel('job-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'processing_jobs',
          filter: `id=eq.${jobId}`
        },
        () => {
          fetchJob(jobId);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'job_progress',
          filter: `job_id=eq.${jobId}`
        },
        () => {
          fetchJob(jobId);
        }
      )
      .subscribe();

    // Initial fetch
    fetchJob(jobId);

    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId]);

  return {
    job,
    jobs,
    loading,
    error,
    submitJob,
    fetchJob,
    fetchJobs
  };
};

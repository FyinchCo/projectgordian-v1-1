
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
    chunk_progress?: {
      currentChunk: number;
      totalChunks: number;
      breakthroughPotential: number;
      tensionLevel: number;
      chunkSize?: number;
    };
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

  // Submit a new job using chunked processing
  const submitJob = async (jobData: {
    question: string;
    processingDepth: number;
    circuitType: string;
    enhancedMode: boolean;
    customArchetypes?: any;
    currentAssessment?: any;
    chunkSize?: number;
  }) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Submitting job to chunked processor:', jobData);

      const response = await fetch(`https://hyrxtqaccmrfvspcfhjj.supabase.co/functions/v1/chunked-genius-processor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5cnh0cWFjY21yZnZzcGNmaGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMzY5MDQsImV4cCI6MjA2NTkxMjkwNH0.y7pwI3YIOO0EsuBMGa71LlqQijJezykhLyuMh-hbxMY`
        },
        body: JSON.stringify(jobData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit chunked job');
      }

      const result = await response.json();
      console.log('Chunked job submitted:', result);
      return result.jobId;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch job status with better error handling
  const fetchJob = async (id: string) => {
    try {
      console.log('Fetching job status for:', id);
      
      const response = await fetch(`https://hyrxtqaccmrfvspcfhjj.supabase.co/functions/v1/chunked-genius-processor?jobId=${id}`, {
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5cnh0cWFjY21yZnZzcGNmaGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMzY5MDQsImV4cCI6MjA2NTkxMjkwNH0.y7pwI3YIOO0EsuBMGa71LlqQijJezykhLyuMh-hbxMY`
        }
      });

      if (!response.ok) {
        console.error('Failed to fetch job:', response.status, response.statusText);
        throw new Error('Failed to fetch job');
      }

      const jobData = await response.json();
      console.log('Job data received:', {
        id: jobData.id,
        status: jobData.status,
        progress: jobData.job_progress?.length || 0,
        hasResults: !!jobData.final_results?.length
      });
      
      setJob(jobData);
      return jobData;
    } catch (err: any) {
      console.error('Error fetching job:', err);
      setError(err.message);
      return null;
    }
  };

  // Fetch recent jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://hyrxtqaccmrfvspcfhjj.supabase.co/functions/v1/chunked-genius-processor`, {
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5cnh0cWFjY21yZnZzcGNmaGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMzY5MDQsImV4cCI6MjA2NTkxMjkwNH0.y7pwI3YIOO0EsuBMGa71LlqQijJezykhLyuMh-hbxMY`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const jobsData = await response.json();
      console.log('Jobs data received:', jobsData.length, 'jobs');
      setJobs(jobsData);
      return jobsData;
    } catch (err: any) {
      console.error('Error fetching jobs:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Enhanced real-time subscription with better error handling and reconnection
  useEffect(() => {
    if (!jobId) return;

    console.log('Setting up real-time subscription for job:', jobId);

    // Set up polling as backup for real-time updates
    const pollInterval = setInterval(() => {
      fetchJob(jobId);
    }, 3000); // Poll every 3 seconds

    const channel = supabase
      .channel(`chunked-job-updates-${jobId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'processing_jobs',
          filter: `id=eq.${jobId}`
        },
        (payload) => {
          console.log('Job table update:', payload);
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
        (payload) => {
          console.log('Job progress update:', payload);
          fetchJob(jobId);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'final_results',
          filter: `job_id=eq.${jobId}`
        },
        (payload) => {
          console.log('Final results update:', payload);
          fetchJob(jobId);
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to real-time updates');
        }
      });

    // Initial fetch
    fetchJob(jobId);

    return () => {
      console.log('Cleaning up subscription for job:', jobId);
      clearInterval(pollInterval);
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

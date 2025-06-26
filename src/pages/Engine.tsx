
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useJobMonitoring } from "@/hooks/useJobMonitoring";
import { EngineHeader } from "@/components/engine/EngineHeader";
import { EngineNavigation } from "@/components/engine/EngineNavigation";
import { AnalysisConfiguration } from "@/components/engine/AnalysisConfiguration";
import { JobMonitorView } from "@/components/engine/JobMonitorView";
import { JobHistoryView } from "@/components/engine/JobHistoryView";

const Engine = () => {
  const [question, setQuestion] = useState("");
  const [totalLayers, setTotalLayers] = useState(5);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'create' | 'monitor' | 'history'>('create');
  const [jobResults, setJobResults] = useState<any>(null);
  
  const { toast } = useToast();
  const { job, jobs, loading, submitJob, fetchJobs } = useJobMonitoring(currentJobId || undefined);

  // Load job history on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSubmitJob = async () => {
    if (!question.trim()) {
      toast({
        title: "Question Required",
        description: "Please enter a question to analyze.",
        variant: "destructive",
      });
      return;
    }

    try {
      const chunkSize = totalLayers <= 5 ? 2 : 3;
      
      const jobId = await submitJob({
        question: question.trim(),
        processingDepth: totalLayers,
        circuitType: "sequential",
        enhancedMode: true,
        chunkSize: chunkSize
      });

      setCurrentJobId(jobId);
      setViewMode('monitor');
      
      const isDeepAnalysis = totalLayers >= 10;
      const estimatedMinutes = Math.ceil((totalLayers * 25) / 60);
      
      toast({
        title: isDeepAnalysis ? "🚀 Deep Genius Analysis Started" : "🧠 Genius Analysis Started",
        description: `Your ${totalLayers}-layer analysis is processing in ${Math.ceil(totalLayers / chunkSize)} chunks. Estimated time: ${estimatedMinutes} minutes.`,
        variant: "default",
      });

    } catch (error: any) {
      toast({
        title: "Failed to Start Analysis",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleViewResults = (jobData: any) => {
    const finalResult = jobData.final_results?.[0];
    if (finalResult) {
      setJobResults(finalResult.full_results);
      setViewMode('create');
    }
  };

  const handleRetryJob = async (failedJob: any) => {
    try {
      const jobId = await submitJob({
        question: failedJob.question,
        processingDepth: failedJob.processing_depth,
        circuitType: failedJob.circuit_type,
        enhancedMode: failedJob.enhanced_mode
      });

      setCurrentJobId(jobId);
      setViewMode('monitor');
      
      toast({
        title: "Analysis Restarted",
        description: "Your analysis is now processing again.",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Failed to Restart Analysis",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Show job history view
  if (viewMode === 'history') {
    return (
      <JobHistoryView
        jobs={jobs}
        onBack={() => setViewMode('create')}
        onViewResults={handleViewResults}
        onRetryJob={handleRetryJob}
      />
    );
  }

  // Show job monitoring view
  if (viewMode === 'monitor' && currentJobId && job) {
    return (
      <JobMonitorView
        job={job}
        onBack={() => setViewMode('create')}
        onViewHistory={() => setViewMode('history')}
        onViewResults={handleViewResults}
        onRetryJob={handleRetryJob}
      />
    );
  }

  // Main create analysis view
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-8 space-y-8">
        <EngineHeader />
        
        <EngineNavigation 
          jobsCount={jobs.length}
          onViewHistory={() => setViewMode('history')}
        />

        <AnalysisConfiguration
          question={question}
          setQuestion={setQuestion}
          totalLayers={totalLayers}
          setTotalLayers={setTotalLayers}
          loading={loading}
          onSubmitJob={handleSubmitJob}
          jobResults={jobResults}
          onClearResults={() => setJobResults(null)}
        />
      </div>
    </div>
  );
};

export default Engine;

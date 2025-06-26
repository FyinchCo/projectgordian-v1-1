
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Zap, 
  Play, 
  Eye, 
  Clock, 
  Settings,
  Pause,
  RefreshCw,
  List,
  ArrowLeft
} from "lucide-react";
import { ProcessingLogic } from "@/components/ProcessingLogic";
import { useToast } from "@/hooks/use-toast";
import { useJobMonitoring } from "@/hooks/useJobMonitoring";
import { JobStatusCard } from "@/components/JobStatusCard";

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
      const jobId = await submitJob({
        question: question.trim(),
        processingDepth: totalLayers,
        circuitType: "sequential",
        enhancedMode: true
      });

      setCurrentJobId(jobId);
      setViewMode('monitor');
      
      toast({
        title: "Analysis Started",
        description: `Your ${totalLayers}-layer analysis is now processing in the background.`,
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
      setViewMode('create'); // Show results in main view
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

  const getEstimatedTime = (layers: number) => {
    const estimatedSeconds = layers * 35; // 35 seconds per layer
    return Math.ceil(estimatedSeconds / 60);
  };

  // Show job history view
  if (viewMode === 'history') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto p-8 space-y-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => setViewMode('create')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analysis History</h1>
              <p className="text-gray-600">Your recent genius analyses</p>
            </div>
          </div>

          <div className="space-y-4">
            {jobs.length === 0 ? (
              <Card className="p-8 text-center">
                <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No analyses yet</h3>
                <p className="text-gray-600 mb-4">Start your first genius analysis to see it here.</p>
                <Button onClick={() => setViewMode('create')}>
                  Create Analysis
                </Button>
              </Card>
            ) : (
              jobs.map((jobItem) => (
                <JobStatusCard
                  key={jobItem.id}
                  job={jobItem}
                  onViewResults={handleViewResults}
                  onRetry={handleRetryJob}
                />
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show job monitoring view
  if (viewMode === 'monitor' && currentJobId && job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => setViewMode('create')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analysis Monitor</h1>
                <p className="text-gray-600">Real-time job progress</p>
              </div>
            </div>

            <Button 
              variant="outline"
              onClick={() => setViewMode('history')}
              className="flex items-center space-x-2"
            >
              <List className="w-4 h-4" />
              <span>View History</span>
            </Button>
          </div>

          <JobStatusCard
            job={job}
            onViewResults={handleViewResults}
            onRetry={handleRetryJob}
            className="border-2 border-blue-200"
          />

          {job.status === 'completed' && job.final_results?.[0] && (
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Analysis Results</h2>
              <div className="prose max-w-none">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">
                    {job.final_results[0].synthesis}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Main create analysis view
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Brain className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Genius Engine</h1>
            <Brain className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Deep cognitive analysis through multi-archetype processing. Analyses now run in the background so you never lose your work.
          </p>
          
          <div className="flex justify-center space-x-4">
            <Button 
              variant="outline"  
              onClick={() => setViewMode('history')}
              className="flex items-center space-x-2"
            >
              <List className="w-4 h-4" />
              <span>View History ({jobs.length})</span>
            </Button>
          </div>
        </div>

        {/* Results Display */}
        {jobResults && (
          <Card className="p-8 bg-white shadow-lg">
            <div className="space-y-6">
              <div className="text-center border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-800">Analysis Results</h2>
                <p className="text-gray-600">Your completed genius analysis</p>
              </div>
              
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">Synthesis</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">
                    {jobResults.synthesis || "Analysis completed successfully. Full results processing..."}
                  </p>
                </div>
              </div>

              <div className="flex justify-center space-x-4 pt-6">
                <Button onClick={() => setJobResults(null)} variant="outline" className="px-6">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Start New Analysis
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Question Portal */}
        {!jobResults && (
          <Card className="p-8 bg-white shadow-lg">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">What would you like to explore?</h2>
                <p className="text-gray-600">Enter a question that deserves deep thought</p>
              </div>
              
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What is the nature of creativity? How do we navigate moral complexity? What makes a life meaningful?"
                className="min-h-32 text-lg resize-none border-2 focus:border-blue-500"
              />
              
              {/* Configuration Bar */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Settings className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">Depth:</span>
                    <select 
                      value={totalLayers} 
                      onChange={(e) => setTotalLayers(Number(e.target.value))}
                      className="text-sm border rounded px-2 py-1"
                    >
                      <option value={3}>3 Layers (Quick)</option>
                      <option value={5}>5 Layers (Standard)</option>
                      <option value={10}>10 Layers (Deep)</option>
                      <option value={20}>20 Layers (Profound)</option>
                    </select>
                  </div>
                  
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    ~{getEstimatedTime(totalLayers)} min
                  </Badge>
                </div>
                
                <Badge variant="secondary" className="text-xs">
                  Background Processing
                </Badge>
              </div>

              <Button 
                onClick={handleSubmitJob}
                disabled={!question.trim() || loading}
                className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
              >
                <Play className="w-5 h-5 mr-2" />
                {loading ? 'Starting Analysis...' : 'Begin Background Analysis'}
              </Button>
              
              <div className="text-center text-sm text-gray-500">
                <p>✨ Your analysis will run in the background - you can close this page and come back later!</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Engine;

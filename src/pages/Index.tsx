import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { QuestionInput } from "@/components/QuestionInput";
import { ProcessingSection } from "@/components/ProcessingSection";
import { ResultsSection } from "@/components/ResultsSection";
import { EnhancedProcessingControls } from "@/components/EnhancedProcessingControls";
import { QuestionAssessment } from "@/components/QuestionAssessment";
import { ProcessingDepthWarning } from "@/components/ProcessingDepthWarning";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [question, setQuestion] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentArchetype, setCurrentArchetype] = useState("");
  const [currentLayer, setCurrentLayer] = useState(1);
  const [results, setResults] = useState(null);
  const [processingDepth, setProcessingDepth] = useState([1]);
  const [circuitType, setCircuitType] = useState("sequential");
  const [enhancedMode, setEnhancedMode] = useState(true);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [customArchetypes, setCustomArchetypes] = useState(null);
  const [showAssessment, setShowAssessment] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [chunkProgress, setChunkProgress] = useState({ current: 0, total: 0 });
  const { toast } = useToast();

  // Load custom archetypes on mount
  useEffect(() => {
    const savedArchetypes = localStorage.getItem('genius-machine-archetypes');
    if (savedArchetypes) {
      const archetypes = JSON.parse(savedArchetypes);
      const formattedArchetypes = archetypes.map(archetype => ({
        name: archetype.name,
        description: archetype.description,
        languageStyle: archetype.languageStyle,
        imagination: archetype.imagination[0],
        skepticism: archetype.skepticism[0],
        aggression: archetype.aggression[0],
        emotionality: archetype.emotionality[0],
        constraint: archetype.constraint
      }));
      setCustomArchetypes(formattedArchetypes);
    }
  }, []);

  const processChunkedLayers = async (baseConfig, totalDepth, chunkSize = 4) => {
    const chunks = Math.ceil(totalDepth / chunkSize);
    let accumulatedLayers = [];
    
    setChunkProgress({ current: 0, total: chunks });
    
    for (let chunkIndex = 0; chunkIndex < chunks; chunkIndex++) {
      const startLayer = chunkIndex * chunkSize + 1;
      const endLayer = Math.min((chunkIndex + 1) * chunkSize, totalDepth);
      const chunkDepth = endLayer - startLayer + 1;
      
      console.log(`Processing chunk ${chunkIndex + 1}/${chunks}: layers ${startLayer}-${endLayer}`);
      setChunkProgress({ current: chunkIndex + 1, total: chunks });
      
      // Update visual progress
      for (let layer = startLayer; layer <= endLayer; layer++) {
        setCurrentLayer(layer);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      const chunkConfig = {
        ...baseConfig,
        processingDepth: chunkDepth,
        previousLayers: accumulatedLayers,
        startFromLayer: startLayer
      };
      
      try {
        console.log(`Invoking chunk ${chunkIndex + 1} with config:`, chunkConfig);
        
        const { data, error } = await supabase.functions.invoke('genius-machine', {
          body: chunkConfig
        });
        
        if (error) {
          console.error(`Chunk ${chunkIndex + 1} error:`, error);
          throw error;
        }
        
        console.log(`Chunk ${chunkIndex + 1} completed:`, data);
        
        // Accumulate layers
        if (data.layers) {
          accumulatedLayers = [...accumulatedLayers, ...data.layers];
        }
        
        // Update intermediate results
        if (chunkIndex === chunks - 1) {
          // Final chunk - return complete results
          return {
            ...data,
            layers: accumulatedLayers,
            processingDepth: totalDepth,
            chunkProcessed: true
          };
        } else {
          // Intermediate chunk - show progress
          toast({
            title: `Chunk ${chunkIndex + 1}/${chunks} Complete`,
            description: `Processed layers ${startLayer}-${endLayer}. Continuing...`,
            variant: "default",
          });
        }
        
      } catch (chunkError) {
        console.error(`Chunk ${chunkIndex + 1} failed:`, chunkError);
        
        if (accumulatedLayers.length > 0) {
          // Return partial results if we have some progress
          toast({
            title: "Partial Results Available",
            description: `Completed ${accumulatedLayers.length} layers before timeout. Returning available insights.`,
            variant: "default",
          });
          
          const lastLayer = accumulatedLayers[accumulatedLayers.length - 1];
          return {
            insight: lastLayer.insight,
            confidence: lastLayer.confidence,
            tensionPoints: lastLayer.tensionPoints,
            layers: accumulatedLayers,
            processingDepth: accumulatedLayers.length,
            partialResults: true
          };
        } else {
          throw chunkError;
        }
      }
    }
  };

  const handleStartGenius = async () => {
    if (!question.trim()) return;
    
    setIsProcessing(true);
    setResults(null);
    setCurrentLayer(1);
    setChunkProgress({ current: 0, total: 0 });
    
    try {
      console.log('Starting genius processing with configuration:', {
        question: question.trim(),
        processingDepth: processingDepth[0],
        circuitType,
        customArchetypes: customArchetypes ? customArchetypes.length : 0,
        enhancedMode,
        hasAssessment: !!currentAssessment
      });
      
      const baseConfig = {
        question,
        circuitType,
        customArchetypes: customArchetypes,
        enhancedMode,
        assessmentConfiguration: currentAssessment ? {
          archetypeConfigurations: currentAssessment.archetypeConfigurations,
          tensionParameters: currentAssessment.tensionParameters,
          processingConfiguration: currentAssessment.processingConfiguration
        } : null
      };
      
      let finalResults;
      
      // Use chunked processing for high depths
      if (processingDepth[0] >= 8) {
        toast({
          title: "High-Depth Processing",
          description: `Processing ${processingDepth[0]} layers in chunks to avoid timeouts. This may take a few minutes.`,
          variant: "default",
        });
        
        finalResults = await processChunkedLayers(baseConfig, processingDepth[0]);
      } else {
        // Regular processing for lower depths
        const config = { ...baseConfig, processingDepth: processingDepth[0] };
        
        const { data, error } = await supabase.functions.invoke('genius-machine', {
          body: config
        });
        
        if (error) {
          console.error('Processing error:', error);
          throw error;
        }
        
        finalResults = data;
      }
      
      console.log('Processing completed:', finalResults);
      setResults(finalResults);
      
      if (finalResults.partialResults) {
        toast({
          title: "Partial Results Generated",
          description: `Generated insights from ${finalResults.processingDepth} layers. Consider using 5-7 layers for full reliability.`,
          variant: "default",
        });
      } else if (finalResults.chunkProcessed) {
        toast({
          title: "High-Depth Processing Complete",
          description: `Successfully processed all ${finalResults.processingDepth} layers using chunked processing.`,
          variant: "default",
        });
      }
      
    } catch (error) {
      console.error('Error processing question:', error);
      
      const isTimeout = error?.message?.includes('timeout') || error?.message?.includes('Load failed');
      
      toast({
        title: isTimeout ? "Processing Timeout" : "Processing Error",
        description: isTimeout 
          ? `Processing failed. Try reducing depth to 5-7 layers, or the system may be experiencing high load.`
          : "Failed to process your question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setCurrentArchetype("");
      setCurrentLayer(1);
      setChunkProgress({ current: 0, total: 0 });
    }
  };

  const handleApplyRecommendations = (recommendations: any, fullAssessment: any) => {
    console.log('Applying AI recommendations:', recommendations);
    console.log('Full assessment data:', fullAssessment);
    
    setProcessingDepth([recommendations.processingDepth]);
    setCircuitType(recommendations.circuitType);
    setEnhancedMode(recommendations.enhancedMode);
    setCurrentAssessment(fullAssessment);
    
    toast({
      title: "AI Configuration Applied",
      description: `Processing optimized: ${recommendations.processingDepth} layers, ${recommendations.circuitType} circuit, enhanced mode ${recommendations.enhancedMode ? 'ON' : 'OFF'}`,
    });
  };

  const handleExportInsight = () => {
    setIsExportModalOpen(true);
  };

  const handleReset = () => {
    setResults(null);
    setQuestion("");
    setShowAssessment(false);
  };

  const toggleAssessment = () => {
    setShowAssessment(!showAssessment);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header customArchetypes={customArchetypes} enhancedMode={enhancedMode} />

      <main className="max-w-4xl mx-auto px-6 py-12">
        {!isProcessing && !results && (
          <div className="space-y-8">
            <QuestionInput
              question={question}
              setQuestion={setQuestion}
              onStartGenius={handleStartGenius}
              customArchetypes={customArchetypes}
              enhancedMode={enhancedMode}
              onToggleAssessment={toggleAssessment}
              showAssessment={showAssessment}
            />

            {showAssessment && (
              <QuestionAssessment
                question={question}
                onApplyRecommendations={handleApplyRecommendations}
              />
            )}

            <ProcessingDepthWarning depth={processingDepth[0]} />

            <EnhancedProcessingControls
              processingDepth={processingDepth}
              onProcessingDepthChange={setProcessingDepth}
              circuitType={circuitType}
              onCircuitTypeChange={setCircuitType}
              enhancedMode={enhancedMode}
              onEnhancedModeChange={setEnhancedMode}
            />
          </div>
        )}

        {isProcessing && (
          <ProcessingSection
            currentArchetype={currentArchetype}
            question={question}
            currentLayer={currentLayer}
            processingDepth={processingDepth}
            circuitType={circuitType}
            chunkProgress={chunkProgress}
          />
        )}

        {results && (
          <ResultsSection
            results={results}
            question={question}
            onReset={handleReset}
            onExport={handleExportInsight}
            isExportModalOpen={isExportModalOpen}
            setIsExportModalOpen={setIsExportModalOpen}
          />
        )}
      </main>
    </div>
  );
};

export default Index;

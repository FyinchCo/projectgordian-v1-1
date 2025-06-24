import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ProcessingSection } from "@/components/ProcessingSection";
import { ResultsSection } from "@/components/ResultsSection";
import { ProcessingLogic } from "@/components/ProcessingLogic";
import { QuestionSection } from "@/components/QuestionSection";
import { ControlsSection } from "@/components/ControlsSection";
import { PasswordGate } from "@/components/PasswordGate";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

  // Check authentication status on mount
  useEffect(() => {
    const authStatus = localStorage.getItem("project-gordian-authenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

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

  const handleProcessingStart = () => {
    setIsProcessing(true);
    setResults(null);
  };

  const handleProcessingComplete = (finalResults: any) => {
    setResults(finalResults);
    setIsProcessing(false);
  };

  const handleProcessingError = () => {
    setIsProcessing(false);
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

  // Get the processing logic handler function
  const processingLogicComponent = ProcessingLogic({
    question,
    processingDepth,
    circuitType,
    enhancedMode,
    customArchetypes,
    currentAssessment,
    onProcessingStart: handleProcessingStart,
    onProcessingComplete: handleProcessingComplete,
    onProcessingError: handleProcessingError,
    onCurrentArchetypeChange: setCurrentArchetype,
    onCurrentLayerChange: setCurrentLayer,
    onChunkProgressChange: setChunkProgress
  });

  // Show password gate if not authenticated
  if (!isAuthenticated) {
    return <PasswordGate onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gordian-cream via-white to-gordian-beige">
      <Header customArchetypes={customArchetypes} enhancedMode={enhancedMode} />

      <main className="max-w-4xl mx-auto px-6 py-12">
        {!isProcessing && !results && (
          <div className="space-y-8">
            <QuestionSection
              question={question}
              setQuestion={setQuestion}
              onStartGenius={processingLogicComponent.handleStartGenius}
              customArchetypes={customArchetypes}
              enhancedMode={enhancedMode}
              showAssessment={showAssessment}
              onToggleAssessment={toggleAssessment}
              onApplyRecommendations={handleApplyRecommendations}
            />

            <ControlsSection
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

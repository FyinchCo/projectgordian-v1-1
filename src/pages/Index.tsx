import { useState, useEffect, useCallback } from "react";
import { ProcessingSection } from "@/components/ProcessingSection";
import { ResultsSection } from "@/components/ResultsSection";
import { ProcessingLogic } from "@/components/ProcessingLogic";
import { ConsolidatedGeniusInterface } from "@/components/ConsolidatedGeniusInterface";
import { PasswordGate } from "@/components/PasswordGate";
import { useToast } from "@/hooks/use-toast";
import { useOutputType } from "@/hooks/useOutputType";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [question, setQuestion] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentArchetype, setCurrentArchetype] = useState("");
  const [currentLayer, setCurrentLayer] = useState(1);
  const [results, setResults] = useState(null);
  const [processingDepth, setProcessingDepth] = useState([5]);
  const [circuitType, setCircuitType] = useState("sequential");
  const [enhancedMode, setEnhancedMode] = useState(true);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [customArchetypes, setCustomArchetypes] = useState(null);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [chunkProgress, setChunkProgress] = useState({ current: 0, total: 0 });
  const [processingPhase, setProcessingPhase] = useState("Initializing...");
  const { toast } = useToast();

  const { outputType, setOutputType } = useOutputType('practical');

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
    setProcessingPhase("Initializing enhanced processing system...");
  };

  const handleProcessingComplete = (finalResults: any) => {
    setResults(finalResults);
    setIsProcessing(false);
    setProcessingPhase("Analysis complete with breakthrough insights");
  };

  const handleProcessingError = () => {
    setIsProcessing(false);
    setProcessingPhase("Processing encountered an error");
  };

  const handleProcessingPhaseChange = (phase: string) => {
    setProcessingPhase(phase);
  };

  const handleExportInsight = () => {
    setIsExportModalOpen(true);
  };

  const handleReset = () => {
    setResults(null);
    setQuestion("");
    setCurrentAssessment(null);
    setProcessingPhase("Ready to process");
  };

  // Get the processing logic handler function with simplified props
  const processingLogicComponent = ProcessingLogic({
    question,
    customArchetypes,
    onProcessingStart: handleProcessingStart,
    onProcessingComplete: handleProcessingComplete,
    onProcessingError: handleProcessingError,
    onCurrentArchetypeChange: setCurrentArchetype,
    onCurrentLayerChange: setCurrentLayer,
    onChunkProgressChange: setChunkProgress,
    onProcessingPhaseChange: handleProcessingPhaseChange
  });

  // Show password gate if not authenticated
  if (!isAuthenticated) {
    return <PasswordGate onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-zen-paper">
      <main className="px-zen-lg py-zen-xl max-w-7xl mx-auto">
        {!isProcessing && !results && (
          <ConsolidatedGeniusInterface
            question={question}
            setQuestion={setQuestion}
            outputType={outputType}
            setOutputType={setOutputType}
            processingDepth={processingDepth}
            setProcessingDepth={setProcessingDepth}
            circuitType={circuitType}
            setCircuitType={setCircuitType}
            enhancedMode={enhancedMode}
            setEnhancedMode={setEnhancedMode}
            customArchetypes={customArchetypes}
            currentAssessment={currentAssessment}
            setCurrentAssessment={setCurrentAssessment}
            onStartGenius={processingLogicComponent.handleStartGenius}
          />
        )}

        {isProcessing && (
          <ProcessingSection
            currentArchetype={currentArchetype}
            question={question}
            currentLayer={currentLayer}
            processingDepth={processingDepth}
            circuitType={circuitType}
            chunkProgress={chunkProgress}
            processingPhase={processingPhase}
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

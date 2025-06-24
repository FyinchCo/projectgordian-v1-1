import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ProcessingSection } from "@/components/ProcessingSection";
import { ResultsSection } from "@/components/ResultsSection";
import { ProcessingLogic } from "@/components/ProcessingLogic";
import { ConsolidatedGeniusInterface } from "@/components/ConsolidatedGeniusInterface";
import { PasswordGate } from "@/components/PasswordGate";
import { useToast } from "@/hooks/use-toast";
import { useOutputType } from "@/hooks/useOutputType";
import { SelfTestingDashboard } from "@/components/testing/SelfTestingDashboard";

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
  const { toast } = useToast();
  const [showSelfTestingDashboard, setShowSelfTestingDashboard] = useState(false);

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
  };

  const handleProcessingComplete = (finalResults: any) => {
    setResults(finalResults);
    setIsProcessing(false);
  };

  const handleProcessingError = () => {
    setIsProcessing(false);
  };

  const handleExportInsight = () => {
    setIsExportModalOpen(true);
  };

  const handleReset = () => {
    setResults(null);
    setQuestion("");
    setCurrentAssessment(null);
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

  const handleRunFullTestSuite = async (processFunction: (question: string) => Promise<any>) => {
    // Implementation would call processingLogicComponent.handleStartGenius for each test
    console.log('Running full test suite...');
  };

  // Show password gate if not authenticated
  if (!isAuthenticated) {
    return <PasswordGate onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-zen-paper">
      <Header 
        customArchetypes={customArchetypes} 
        enhancedMode={enhancedMode}
        onToggleSelfTesting={() => setShowSelfTestingDashboard(!showSelfTestingDashboard)}
        showSelfTestingToggle={true}
      />

      <main className="px-zen-lg py-zen-xl max-w-7xl mx-auto">
        {/* Self-Testing Dashboard */}
        <SelfTestingDashboard
          onRunFullTest={handleRunFullTestSuite}
          isVisible={showSelfTestingDashboard}
        />

        {!isProcessing && !results && !showSelfTestingDashboard && (
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

        {isProcessing && !showSelfTestingDashboard && (
          <ProcessingSection
            currentArchetype={currentArchetype}
            question={question}
            currentLayer={currentLayer}
            processingDepth={processingDepth}
            circuitType={circuitType}
            chunkProgress={chunkProgress}
          />
        )}

        {results && !showSelfTestingDashboard && (
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


import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProcessingSection } from "@/components/ProcessingSection";
import { ResultsSection } from "@/components/ResultsSection";
import { ProcessingLogic } from "@/components/ProcessingLogic";
import { useToast } from "@/hooks/use-toast";

const ProcessingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [question, setQuestion] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentArchetype, setCurrentArchetype] = useState("");
  const [currentLayer, setCurrentLayer] = useState(1);
  const [results, setResults] = useState(null);
  const [processingDepth, setProcessingDepth] = useState([5]);
  const [circuitType, setCircuitType] = useState("sequential");
  const [enhancedMode, setEnhancedMode] = useState(true);
  const [chunkProgress, setChunkProgress] = useState({ current: 0, total: 0 });
  const [customArchetypes, setCustomArchetypes] = useState(null);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    if (location.state) {
      setQuestion(location.state.question || "");
      setProcessingDepth([location.state.processingDepth || 5]);
      setCircuitType(location.state.circuitType || "sequential");
      setEnhancedMode(location.state.enhancedMode ?? true);
      setCurrentAssessment(location.state.assessment || null);
      
      // Auto-start processing if we have a question
      if (location.state.question) {
        handleProcessingStart();
      }
    } else {
      // If no state, redirect to entry point
      navigate("/");
    }
  }, [location.state, navigate]);

  // Load custom archetypes
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
    navigate("/");
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

  if (!question) {
    return (
      <div className="min-h-screen bg-mono-pure-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-mono-medium-gray font-inter mb-4">No question provided</p>
          <button
            onClick={() => navigate("/")}
            className="text-mono-pure-black hover:text-mono-charcoal font-inter"
          >
            ← Return to Start
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mono-off-white">
      <main className="max-w-5xl mx-auto px-6 py-16">
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

export default ProcessingPage;


import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProcessingSection } from "@/components/ProcessingSection";
import { ResultsSection } from "@/components/ResultsSection";
import { ProcessingLogic } from "@/components/ProcessingLogic";
import { useToast } from "@/hooks/use-toast";

const ProcessingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [question, setQuestion] = useState("");
  const [outputType, setOutputType] = useState('practical');
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
  const [showProcessingModes, setShowProcessingModes] = useState(false);
  const [selectedProcessingMode, setSelectedProcessingMode] = useState("standard");

  const processingModes = [
    { id: "standard", label: "Standard Analysis", description: "Quick, high-quality insights" },
    { id: "deep", label: "Deep Synthesis", description: "Genius-level attempts for complex problems" },
    { id: "experimental", label: "Experimental Depth", description: "Maximum cognitive processing" }
  ];

  useEffect(() => {
    if (location.state) {
      setQuestion(location.state.question || "");
      setOutputType(location.state.outputType || 'practical');
      setProcessingDepth([location.state.processingDepth || 5]);
      setCircuitType(location.state.circuitType || "sequential");
      setEnhancedMode(location.state.enhancedMode ?? true);
      setCurrentAssessment(location.state.assessment || null);
      
      // Show processing mode selection first, don't auto-start
      if (location.state.question) {
        setShowProcessingModes(true);
      }
    } else {
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
    setShowProcessingModes(false);
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

  const handleStartWithMode = () => {
    handleProcessingStart();
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
        {showProcessingModes && (
          <div className="space-y-12">
            <button
              onClick={() => navigate("/question-input", { state: { outputType } })}
              className="text-mono-medium-gray hover:text-mono-pure-black font-inter transition-colors"
            >
              ← Back to Question
            </button>

            <h1 className="text-3xl font-cormorant font-bold text-mono-pure-black">
              Choose Processing Depth
            </h1>

            <div className="space-y-6">
              {processingModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setSelectedProcessingMode(mode.id)}
                  className={`block w-full text-left p-6 transition-colors ${
                    selectedProcessingMode === mode.id 
                      ? 'bg-mono-pure-black text-mono-pure-white' 
                      : 'bg-mono-light-gray text-mono-pure-black hover:bg-mono-medium-gray hover:text-mono-pure-white'
                  }`}
                >
                  <div className="font-inter font-medium text-xl">{mode.label}</div>
                  <div className="text-sm mt-2 opacity-80">{mode.description}</div>
                </button>
              ))}
            </div>

            <Button
              onClick={handleStartWithMode}
              size="lg"
              className="w-full bg-mono-pure-black text-mono-pure-white hover:bg-mono-charcoal font-inter font-medium text-lg py-6"
            >
              → Start Genius Machine
            </Button>
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

export default ProcessingPage;

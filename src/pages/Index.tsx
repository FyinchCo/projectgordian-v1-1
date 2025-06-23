import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { QuestionInput } from "@/components/QuestionInput";
import { ProcessingSection } from "@/components/ProcessingSection";
import { ResultsSection } from "@/components/ResultsSection";
import { EnhancedProcessingControls } from "@/components/EnhancedProcessingControls";
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
  const { toast } = useToast();

  // Load custom archetypes on mount
  useEffect(() => {
    const savedArchetypes = localStorage.getItem('genius-machine-archetypes');
    if (savedArchetypes) {
      const archetypes = JSON.parse(savedArchetypes);
      // Convert to format expected by edge function
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

  const handleStartGenius = async () => {
    if (!question.trim()) return;
    
    setIsProcessing(true);
    setResults(null);
    setCurrentLayer(1);
    
    try {
      // Use custom archetypes if available, otherwise use defaults
      const archetypeNames = customArchetypes 
        ? customArchetypes.map(a => a.name)
        : ["The Visionary", "The Skeptic", "The Mystic", "The Contrarian", "The Craftsman", "The Realist"];
      
      // Add assumption challenger if enhanced mode
      const totalArchetypes = enhancedMode ? archetypeNames.length + 1 : archetypeNames.length;
      const totalSteps = processingDepth[0] * totalArchetypes + processingDepth[0]; // agents + synthesis per layer
      let currentStep = 0;
      
      // Start the actual AI processing
      const processingPromise = supabase.functions.invoke('genius-machine', {
        body: { 
          question,
          processingDepth: processingDepth[0],
          circuitType,
          customArchetypes: customArchetypes,
          enhancedMode
        }
      });
      
      // Show visual progress while AI is working
      for (let layer = 1; layer <= processingDepth[0]; layer++) {
        setCurrentLayer(layer);
        
        // Show assumption analysis for first layer in enhanced mode
        if (layer === 1 && enhancedMode) {
          setCurrentArchetype("Assumption Challenger");
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
        
        for (let i = 0; i < archetypeNames.length; i++) {
          setCurrentArchetype(archetypeNames[i]);
          currentStep++;
          await new Promise(resolve => setTimeout(resolve, Math.max(800, 3000 / totalSteps)));
        }
        
        setCurrentArchetype("Compression Agent");
        currentStep++;
        await new Promise(resolve => setTimeout(resolve, Math.max(1000, 3000 / totalSteps)));
      }
      
      // Wait for the AI processing to complete
      const { data, error } = await processingPromise;
      
      if (error) {
        throw error;
      }
      
      setResults(data);
      
    } catch (error) {
      console.error('Error processing question:', error);
      toast({
        title: "Error",
        description: "Failed to process your question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setCurrentArchetype("");
      setCurrentLayer(1);
    }
  };

  const handleApplyRecommendations = (recommendations: any) => {
    setProcessingDepth([recommendations.processingDepth]);
    setCircuitType(recommendations.circuitType);
    setEnhancedMode(recommendations.enhancedMode);
    
    toast({
      title: "Settings Applied",
      description: "AI recommendations have been applied to your processing configuration.",
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

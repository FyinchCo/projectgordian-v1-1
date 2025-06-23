
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Play, Brain, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { ProcessingDisplay } from "@/components/ProcessingDisplay";
import { EnhancedResultsDisplay } from "@/components/EnhancedResultsDisplay";
import { EnhancedProcessingControls } from "@/components/EnhancedProcessingControls";
import { ExportModal } from "@/components/ExportModal";
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

  const handleExportInsight = () => {
    setIsExportModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">GENIUS MACHINE</h1>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Multi-Agent Intelligence System
                {customArchetypes && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                    Custom Config
                  </span>
                )}
                {enhancedMode && (
                  <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs">
                    Enhanced Mode
                  </span>
                )}
              </p>
            </div>
          </div>
          <Link to="/config">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Configure</span>
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {!isProcessing && !results && (
          <div className="space-y-8">
            {/* Main Input Section */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold tracking-tight">
                INPUT YOUR<br />
                <span className="text-gray-400">HIGH-FRICTION QUESTION</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Present a complex challenge that demands multiple perspectives. 
                The Genius Machine will deploy archetypal agents to discover breakthrough insights.
              </p>
              {customArchetypes && (
                <p className="text-sm text-blue-600">
                  Using {customArchetypes.length} custom archetypes from your configuration
                </p>
              )}
              {enhancedMode && (
                <p className="text-sm text-purple-600">
                  Enhanced mode: Assumption interrogation and dialectical tension active
                </p>
              )}
            </div>

            <Card className="p-8 shadow-sm border-2">
              <div className="space-y-6">
                <Textarea
                  placeholder="Enter your deep, complex question here..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="min-h-[150px] text-lg border-0 shadow-none resize-none focus-visible:ring-0 p-0"
                />
                
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    {question.length} characters
                  </div>
                  <Button 
                    onClick={handleStartGenius}
                    disabled={!question.trim()}
                    size="lg"
                    className="bg-black text-white hover:bg-gray-800 flex items-center space-x-2"
                  >
                    <Play className="w-5 h-5" />
                    <span>START GENIUS MACHINE</span>
                    <Zap className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Enhanced Processing Controls */}
            <EnhancedProcessingControls
              processingDepth={processingDepth}
              onProcessingDepthChange={setProcessingDepth}
              circuitType={circuitType}
              onCircuitTypeChange={setCircuitType}
              enhancedMode={enhancedMode}
              onEnhancedModeChange={setEnhancedMode}
            />

            {/* Info Section */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <Card className="p-6 text-center">
                <h3 className="font-bold mb-2">COGNITIVE DISRUPTION</h3>
                <p className="text-sm text-gray-600">Challenge assumptions and force breakthrough thinking</p>
              </Card>
              <Card className="p-6 text-center">
                <h3 className="font-bold mb-2">DIALECTICAL TENSION</h3>
                <p className="text-sm text-gray-600">Generate productive conflict between perspectives</p>
              </Card>
              <Card className="p-6 text-center">
                <h3 className="font-bold mb-2">EMERGENCE DETECTION</h3>
                <p className="text-sm text-gray-600">Identify moments of genuine insight breakthrough</p>
              </Card>
            </div>
          </div>
        )}

        {isProcessing && (
          <ProcessingDisplay 
            currentArchetype={currentArchetype}
            question={question}
            currentLayer={currentLayer}
            totalLayers={processingDepth[0]}
            circuitType={circuitType}
          />
        )}

        {results && (
          <EnhancedResultsDisplay 
            results={results}
            question={question}
            onReset={() => {
              setResults(null);
              setQuestion("");
            }}
            onExport={handleExportInsight}
          />
        )}

        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          results={results}
          question={question}
        />
      </main>
    </div>
  );
};

export default Index;

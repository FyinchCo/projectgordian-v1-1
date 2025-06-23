
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Play, Brain, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { ProcessingDisplay } from "@/components/ProcessingDisplay";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { ProcessingControls } from "@/components/ProcessingControls";
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
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const { toast } = useToast();

  const handleStartGenius = async () => {
    if (!question.trim()) return;
    
    setIsProcessing(true);
    setResults(null);
    setCurrentLayer(1);
    
    try {
      const archetypes = ["The Visionary", "The Skeptic", "The Mystic", "The Contrarian", "The Craftsman"];
      const totalSteps = processingDepth[0] * archetypes.length + processingDepth[0]; // agents + synthesis per layer
      let currentStep = 0;
      
      // Start the actual AI processing
      const processingPromise = supabase.functions.invoke('genius-machine', {
        body: { 
          question,
          processingDepth: processingDepth[0],
          circuitType
        }
      });
      
      // Show visual progress while AI is working
      for (let layer = 1; layer <= processingDepth[0]; layer++) {
        setCurrentLayer(layer);
        
        for (let i = 0; i < archetypes.length; i++) {
          setCurrentArchetype(archetypes[i]);
          currentStep++;
          await new Promise(resolve => setTimeout(resolve, Math.max(800, 2000 / totalSteps)));
        }
        
        setCurrentArchetype("Compression Agent");
        currentStep++;
        await new Promise(resolve => setTimeout(resolve, Math.max(1000, 2000 / totalSteps)));
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
              <p className="text-xs text-gray-500 uppercase tracking-wide">Multi-Agent Intelligence System</p>
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

            {/* Processing Controls */}
            <ProcessingControls
              processingDepth={processingDepth}
              onProcessingDepthChange={setProcessingDepth}
              circuitType={circuitType}
              onCircuitTypeChange={setCircuitType}
            />

            {/* Info Section */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <Card className="p-6 text-center">
                <h3 className="font-bold mb-2">MULTI-LAYER</h3>
                <p className="text-sm text-gray-600">Iterative processing with configurable depth</p>
              </Card>
              <Card className="p-6 text-center">
                <h3 className="font-bold mb-2">CIRCUIT TYPES</h3>
                <p className="text-sm text-gray-600">Sequential, parallel, and hybrid processing modes</p>
              </Card>
              <Card className="p-6 text-center">
                <h3 className="font-bold mb-2">EXPORT READY</h3>
                <p className="text-sm text-gray-600">Download insights in multiple formats</p>
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
          <ResultsDisplay 
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

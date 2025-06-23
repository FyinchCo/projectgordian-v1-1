
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Play, Brain, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { ProcessingDisplay } from "@/components/ProcessingDisplay";
import { ResultsDisplay } from "@/components/ResultsDisplay";

const Index = () => {
  const [question, setQuestion] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentArchetype, setCurrentArchetype] = useState("");
  const [results, setResults] = useState(null);

  const handleStartGenius = async () => {
    if (!question.trim()) return;
    
    setIsProcessing(true);
    setResults(null);
    
    // Simulate the multi-agent process
    const archetypes = ["The Visionary", "The Skeptic", "The Mystic", "The Contrarian", "The Craftsman"];
    
    for (let i = 0; i < archetypes.length; i++) {
      setCurrentArchetype(archetypes[i]);
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    setCurrentArchetype("Compression Agent");
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock results
    setResults({
      insight: "Innovation emerges not from answers, but from the quality of questions that refuse comfortable conclusions.",
      confidence: 0.87,
      tensionPoints: 3,
      logicTrail: [
        { archetype: "The Visionary", contribution: "Sees innovation as boundaryless exploration beyond current paradigms" },
        { archetype: "The Skeptic", contribution: "Questions whether true innovation can exist without rigorous validation" },
        { archetype: "The Mystic", contribution: "Recognizes innovation as an emergent property of deep pattern recognition" },
        { archetype: "The Contrarian", contribution: "Challenges the assumption that innovation requires novelty rather than synthesis" },
        { archetype: "The Craftsman", contribution: "Grounds innovation in practical application and iterative refinement" }
      ]
    });
    
    setIsProcessing(false);
    setCurrentArchetype("");
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

            {/* Info Section */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <Card className="p-6 text-center">
                <h3 className="font-bold mb-2">MULTI-AGENT</h3>
                <p className="text-sm text-gray-600">5 archetypal perspectives analyze your question</p>
              </Card>
              <Card className="p-6 text-center">
                <h3 className="font-bold mb-2">TENSION DETECTION</h3>
                <p className="text-sm text-gray-600">Identifies contradictions and breakthrough moments</p>
              </Card>
              <Card className="p-6 text-center">
                <h3 className="font-bold mb-2">INSIGHT COMPRESSION</h3>
                <p className="text-sm text-gray-600">Distills complex analysis into actionable wisdom</p>
              </Card>
            </div>
          </div>
        )}

        {isProcessing && (
          <ProcessingDisplay 
            currentArchetype={currentArchetype}
            question={question}
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
          />
        )}
      </main>
    </div>
  );
};

export default Index;

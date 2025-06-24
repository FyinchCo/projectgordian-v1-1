
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { OutputType } from "@/types/outputTypes";
import { ProcessingModeSelector } from "@/components/ProcessingModeSelector";

const QuestionInput = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [question, setQuestion] = useState("");
  const [outputType, setOutputType] = useState<OutputType>('practical');
  const [processingMode, setProcessingMode] = useState("standard");
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (location.state?.outputType) {
      setOutputType(location.state.outputType);
    }
  }, [location.state]);

  const processingModes = [
    { id: "standard", label: "Standard Analysis", description: "Quick, high-quality insights" },
    { id: "deep", label: "Deep Synthesis", description: "Genius-level attempts for complex problems" },
    { id: "experimental", label: "Experimental Depth", description: "Maximum cognitive processing" }
  ];

  const handleStart = () => {
    // Navigate back to main processing with all the collected data
    navigate("/process", { 
      state: { 
        question, 
        outputType, 
        processingMode,
        assessment: location.state?.assessment 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-mono-pure-white">
      <div className="max-w-3xl mx-auto pt-24 px-6">
        <button
          onClick={() => navigate("/question-type")}
          className="text-mono-medium-gray hover:text-mono-pure-black font-inter mb-12 transition-colors"
        >
          ← Change Question Type
        </button>

        <div className="space-y-12">
          <h1 className="text-3xl font-cormorant font-bold text-mono-pure-black">
            Ask your high-friction question:
          </h1>

          <div className="space-y-8">
            <Textarea
              placeholder="Enter your deep, complex question here..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[200px] text-lg font-inter border-0 shadow-none resize-none focus-visible:ring-0 bg-mono-light-gray p-6"
            />
            
            <div className="text-sm font-mono text-mono-medium-gray">
              Character count: {question.length}
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-cormorant font-bold text-mono-pure-black">
                Cognitive Processing Mode:
              </h3>
              
              <div className="space-y-4">
                {processingModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setProcessingMode(mode.id)}
                    className={`block w-full text-left p-4 transition-colors ${
                      processingMode === mode.id 
                        ? 'bg-mono-pure-black text-mono-pure-white' 
                        : 'bg-mono-light-gray text-mono-pure-black hover:bg-mono-medium-gray hover:text-mono-pure-white'
                    }`}
                  >
                    <div className="font-inter font-medium">{mode.label}</div>
                    <div className="text-sm mt-1 opacity-80">{mode.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-mono-medium-gray hover:text-mono-pure-black font-inter text-sm transition-colors"
              >
                {showAdvanced ? "← Hide" : "→"} Advanced Settings
              </button>
            </div>

            {showAdvanced && (
              <div className="space-y-6 p-6 bg-mono-light-gray">
                <h4 className="font-cormorant font-bold text-mono-pure-black">Advanced Tuning</h4>
                <div className="text-sm font-inter text-mono-dark-gray">
                  Detailed AI assessment and archetype configuration options will appear here.
                </div>
                <Button
                  onClick={() => navigate("/advanced-settings", { 
                    state: { question, outputType, processingMode } 
                  })}
                  variant="outline"
                  className="border-mono-pure-black text-mono-pure-black hover:bg-mono-pure-black hover:text-mono-pure-white"
                >
                  Configure Advanced Settings
                </Button>
              </div>
            )}

            <Button
              onClick={handleStart}
              disabled={!question.trim()}
              size="lg"
              className="w-full bg-mono-pure-black text-mono-pure-white hover:bg-mono-charcoal font-inter font-medium text-lg py-6"
            >
              → Start Genius Machine
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionInput;

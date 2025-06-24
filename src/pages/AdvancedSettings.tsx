
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QuestionAssessment } from "@/components/QuestionAssessment";
import { OutputType } from "@/types/outputTypes";

const AdvancedSettings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [question, setQuestion] = useState("");
  const [outputType, setOutputType] = useState<OutputType>('practical');
  const [processingDepth, setProcessingDepth] = useState([5]);
  const [circuitType, setCircuitType] = useState("sequential");
  const [enhancedMode, setEnhancedMode] = useState(true);

  useEffect(() => {
    if (location.state) {
      setQuestion(location.state.question || "");
      setOutputType(location.state.outputType || 'practical');
    }
  }, [location.state]);

  const handleApplyRecommendations = (recommendations: any, fullAssessment: any) => {
    setProcessingDepth([recommendations.processingDepth]);
    setCircuitType(recommendations.circuitType);
    setEnhancedMode(recommendations.enhancedMode);
  };

  const handleProceedToProcessing = () => {
    navigate("/process", { 
      state: { 
        question, 
        outputType,
        processingDepth,
        circuitType,
        enhancedMode,
        fromAdvanced: true
      } 
    });
  };

  return (
    <div className="min-h-screen bg-mono-pure-white">
      <div className="max-w-4xl mx-auto pt-24 px-6">
        <button
          onClick={() => navigate("/question-input", { state: { outputType } })}
          className="text-mono-medium-gray hover:text-mono-pure-black font-inter mb-12 transition-colors"
        >
          ← Back to Question
        </button>

        <div className="space-y-12">
          <h1 className="text-3xl font-cormorant font-bold text-mono-pure-black">
            Manual Configuration
          </h1>

          <div className="space-y-8">
            {question && (
              <QuestionAssessment
                question={question}
                onApplyRecommendations={handleApplyRecommendations}
              />
            )}

            <div className="space-y-6 p-6 bg-mono-light-gray">
              <h3 className="font-cormorant font-bold text-mono-pure-black text-xl">Processing Depth</h3>
              <div className="space-y-4">
                <label className="block">
                  <span className="font-inter text-mono-pure-black">Cognitive Layers: {processingDepth[0]}</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={processingDepth[0]}
                    onChange={(e) => setProcessingDepth([parseInt(e.target.value)])}
                    className="w-full mt-2"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-4 p-6 bg-mono-light-gray">
              <h3 className="font-cormorant font-bold text-mono-pure-black text-xl">Circuit Configuration</h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="sequential"
                    checked={circuitType === "sequential"}
                    onChange={(e) => setCircuitType(e.target.value)}
                    className="text-mono-pure-black"
                  />
                  <span className="font-inter">Sequential Processing</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="parallel"
                    checked={circuitType === "parallel"}
                    onChange={(e) => setCircuitType(e.target.value)}
                    className="text-mono-pure-black"
                  />
                  <span className="font-inter">Parallel Processing</span>
                </label>
              </div>
            </div>

            <div className="space-y-4 p-6 bg-mono-light-gray">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={enhancedMode}
                  onChange={(e) => setEnhancedMode(e.target.checked)}
                  className="text-mono-pure-black"
                />
                <span className="font-inter font-medium">Enhanced Mode</span>
              </label>
              <p className="text-sm font-inter text-mono-dark-gray">
                Enables assumption interrogation and dialectical tension
              </p>
            </div>

            <Button
              onClick={handleProceedToProcessing}
              disabled={!question.trim()}
              size="lg"
              className="w-full bg-mono-pure-black text-mono-pure-white hover:bg-mono-charcoal font-inter font-medium text-lg py-6"
            >
              → Proceed to Processing Mode Selection
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;


import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { OutputType } from "@/types/outputTypes";

const QuestionInput = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [question, setQuestion] = useState("");
  const [outputType, setOutputType] = useState<OutputType>('practical');
  const [showChoices, setShowChoices] = useState(false);

  useEffect(() => {
    if (location.state?.outputType) {
      setOutputType(location.state.outputType);
    }
  }, [location.state]);

  useEffect(() => {
    setShowChoices(question.trim().length > 20);
  }, [question]);

  const handleAIOptimize = () => {
    // Navigate to processing mode selection with AI optimization
    navigate("/process", { 
      state: { 
        question, 
        outputType,
        aiOptimized: true
      } 
    });
  };

  const handleManualConfigure = () => {
    navigate("/advanced-settings", { 
      state: { 
        question, 
        outputType 
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
          ← Change Answer Type
        </button>

        <div className="space-y-12">
          <h1 className="text-3xl font-cormorant font-bold text-mono-pure-black">
            What is your deep question?
          </h1>

          <div className="space-y-8">
            <Textarea
              placeholder="Enter your complex question here..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[200px] text-lg font-inter border-0 shadow-none resize-none focus-visible:ring-0 bg-mono-light-gray p-6"
            />
            
            <div className="text-sm font-mono text-mono-medium-gray">
              Character count: {question.length}
            </div>

            {showChoices && (
              <div className="space-y-6 pt-8 border-t border-mono-light-gray">
                <h3 className="text-xl font-cormorant font-bold text-mono-pure-black">
                  How would you like to proceed?
                </h3>
                
                <div className="space-y-4">
                  <Button
                    onClick={handleAIOptimize}
                    size="lg"
                    className="w-full bg-mono-pure-black text-mono-pure-white hover:bg-mono-charcoal font-inter font-medium text-lg py-6"
                  >
                    → Have AI Optimize the Cognitive Process
                  </Button>
                  
                  <Button
                    onClick={handleManualConfigure}
                    variant="outline"
                    size="lg"
                    className="w-full border-mono-pure-black text-mono-pure-black hover:bg-mono-pure-black hover:text-mono-pure-white font-inter font-medium text-lg py-6"
                  >
                    → Configure It Manually Yourself
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionInput;

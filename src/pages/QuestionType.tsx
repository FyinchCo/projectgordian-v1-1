
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { OutputType } from "@/types/outputTypes";
import { useQuestionAssessment } from "@/hooks/useQuestionAssessment";

const QuestionType = () => {
  const navigate = useNavigate();
  const [showAssessment, setShowAssessment] = useState(false);
  const [selectedType, setSelectedType] = useState<OutputType | null>(null);
  const { assessQuestion, assessment, isAssessing } = useQuestionAssessment();

  const questionTypes = [
    { id: 'practical' as OutputType, label: 'Practical', description: 'Help me act wisely' },
    { id: 'theoretical' as OutputType, label: 'Theoretical', description: 'Show me how it fits together' },
    { id: 'philosophical' as OutputType, label: 'Philosophical', description: 'Make me think differently' },
    { id: 'abstract' as OutputType, label: 'Abstract / Emergent', description: 'Explore the unknown connections' },
  ];

  const handleTypeSelect = (type: OutputType) => {
    setSelectedType(type);
    navigate("/question-input", { state: { outputType: type, assessment } });
  };

  const handleQuickAssessment = async () => {
    // For now, we'll do a basic assessment without a question
    // In the real flow, this might ask for a brief question preview
    setShowAssessment(true);
    const result = await assessQuestion("sample complex question for assessment");
    if (result && result.recommendations) {
      // Auto-suggest optimal question type
      const suggestedType = result.domainType.toLowerCase().includes('business') ? 'practical' :
                           result.domainType.toLowerCase().includes('philosophy') ? 'philosophical' :
                           result.domainType.toLowerCase().includes('creative') ? 'abstract' : 'theoretical';
      setSelectedType(suggestedType as OutputType);
    }
  };

  return (
    <div className="min-h-screen bg-mono-pure-white">
      <div className="max-w-2xl mx-auto pt-24 px-6">
        <button
          onClick={() => navigate("/")}
          className="text-mono-medium-gray hover:text-mono-pure-black font-inter mb-12 transition-colors"
        >
          ← Back
        </button>

        <div className="space-y-12">
          <h1 className="text-3xl font-cormorant font-bold text-mono-pure-black">
            What kind of question are you asking?
          </h1>

          <div className="space-y-6">
            {questionTypes.map((type, index) => (
              <button
                key={type.id}
                onClick={() => handleTypeSelect(type.id)}
                className="block w-full text-left hover:text-mono-charcoal transition-colors group"
              >
                <div className="flex items-baseline space-x-4">
                  <span className="text-xl font-inter text-mono-medium-gray">
                    {index + 1}.
                  </span>
                  <div>
                    <div className="text-xl font-inter text-mono-pure-black group-hover:text-mono-charcoal">
                      {type.label}
                    </div>
                    <div className="text-sm font-inter text-mono-medium-gray mt-1">
                      {type.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="pt-8 border-t border-mono-light-gray">
            <button
              onClick={handleQuickAssessment}
              disabled={isAssessing}
              className="text-mono-medium-gray hover:text-mono-pure-black font-inter transition-colors"
            >
              {isAssessing ? "Analyzing..." : "→ Get AI Assessment"}
            </button>
            
            {showAssessment && assessment && (
              <div className="mt-6 p-4 bg-mono-light-gray">
                <div className="text-sm font-inter space-y-2">
                  <div className="font-medium text-mono-pure-black">Quick Assessment:</div>
                  <div className="text-mono-dark-gray">
                    Domain: {assessment.domainType} | 
                    Complexity: {assessment.complexityScore}/10 |
                    Recommended: {assessment.recommendations.processingDepth} layers
                  </div>
                  {selectedType && (
                    <div className="text-mono-pure-black">
                      → Suggested type: <strong>{selectedType}</strong>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionType;

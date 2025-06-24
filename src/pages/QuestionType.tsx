
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { OutputType } from "@/types/outputTypes";

const QuestionType = () => {
  const navigate = useNavigate();

  const questionTypes = [
    { id: 'practical' as OutputType, label: 'Practical', description: 'Help me act wisely' },
    { id: 'theoretical' as OutputType, label: 'Theoretical', description: 'Show me how it fits together' },
    { id: 'philosophical' as OutputType, label: 'Philosophical', description: 'Make me think differently' },
    { id: 'abstract' as OutputType, label: 'Abstract / Emergent', description: 'Explore the unknown connections' },
  ];

  const handleTypeSelect = (type: OutputType) => {
    navigate("/question-input", { state: { outputType: type } });
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
            What kind of answer are you looking for?
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
        </div>
      </div>
    </div>
  );
};

export default QuestionType;

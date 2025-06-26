
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Play } from "lucide-react";
import { AnalysisTypeSelector } from "./AnalysisTypeSelector";

interface AnalysisFormProps {
  question: string;
  setQuestion: (question: string) => void;
  totalLayers: number;
  setTotalLayers: (layers: number) => void;
  loading: boolean;
  onSubmitJob: () => void;
}

export const AnalysisForm = ({
  question,
  setQuestion,
  totalLayers,
  setTotalLayers,
  loading,
  onSubmitJob
}: AnalysisFormProps) => {
  const getAnalysisType = (layers: number) => {
    if (layers <= 3) return "Quick Insight";
    if (layers <= 5) return "Standard Analysis";
    if (layers <= 10) return "Deep Exploration";
    if (layers <= 20) return "Genius-Level Analysis";
    return "Transcendent Analysis";
  };

  const analysisType = getAnalysisType(totalLayers);

  return (
    <Card className="p-8 bg-white shadow-lg">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">What would you like to explore?</h2>
          <p className="text-gray-600">Enter a question for unlimited-depth genius analysis</p>
        </div>
        
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What is the nature of creativity? How do we navigate moral complexity? What makes a life meaningful?"
          className="min-h-32 text-lg resize-none border-2 focus:border-blue-500"
        />
        
        <AnalysisTypeSelector 
          totalLayers={totalLayers}
          setTotalLayers={setTotalLayers}
        />

        <Button 
          onClick={onSubmitJob}
          disabled={!question.trim() || loading}
          className={`w-full h-12 text-lg font-semibold ${
            totalLayers >= 20 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <Play className="w-5 h-5 mr-2" />
          {loading ? 'Starting Analysis...' : `Begin ${analysisType}`}
        </Button>
        
        <div className="text-center text-sm text-gray-500">
          <p>✨ Chunked processing ensures reliability even for deepest analyses!</p>
          <p className="mt-1">🧠 Analysis continues in background - safe to close page</p>
        </div>
      </div>
    </Card>
  );
};

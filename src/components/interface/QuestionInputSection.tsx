
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { OutputType, OUTPUT_TYPE_CONFIGS } from "@/types/outputTypes";

interface QuestionInputSectionProps {
  question: string;
  setQuestion: (question: string) => void;
  outputType: OutputType;
  setOutputType: (type: OutputType) => void;
}

export const QuestionInputSection = ({
  question,
  setQuestion,
  outputType,
  setOutputType
}: QuestionInputSectionProps) => {
  return (
    <div className="space-zen">
      {/* Refined Header */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl text-zen-heading text-zen-ink leading-tight">
          THE GENIUS MACHINE
        </h1>
        <p className="text-base text-zen-body text-zen-charcoal max-w-lg mx-auto leading-relaxed">
          AI's Recursive Distillation of Complex Questions
        </p>
      </div>

      {/* Question Input with Zen aesthetics */}
      <div className="space-y-4">
        <Textarea
          placeholder="Enter your question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="min-h-[120px] text-lg text-zen-body border border-zen-light bg-zen-paper resize-none focus-visible:ring-0 focus-visible:border-zen-medium p-6 rounded-md transition-all duration-300"
        />

        {/* Controls with asymmetric layout (Japanese principle) */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-6">
            <span className="text-xs text-zen-mono text-zen-medium uppercase tracking-wider">Answer Type</span>
            <Select value={outputType} onValueChange={(value) => setOutputType(value as OutputType)}>
              <SelectTrigger className="w-[160px] border border-zen-light bg-zen-paper text-zen-mono text-sm rounded-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border border-zen-light bg-zen-paper shadow-zen-lg">
                {OUTPUT_TYPE_CONFIGS.map((config) => (
                  <SelectItem key={config.id} value={config.id} className="text-zen-mono text-sm">
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-xs text-zen-mono text-zen-medium">
            {question.length} chars
          </div>
        </div>

        {/* AI Configuration Button */}
        <div className="flex justify-center pt-4">
          <Link to="/config">
            <Button 
              size="lg"
              className="bg-zen-ink hover:bg-zen-charcoal text-zen-paper flex items-center space-x-3 text-zen-mono uppercase tracking-wide transition-all duration-300 px-8 py-4 rounded-md shadow-zen-lg"
            >
              <Settings className="w-5 h-5" />
              <span>AI Configuration</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

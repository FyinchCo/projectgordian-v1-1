
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
          PROJECT GORDIAN
        </h1>
        <p className="text-base text-zen-body text-zen-charcoal max-w-lg mx-auto leading-relaxed">
          AI's Recursive Distillation of Complex Questions
        </p>
      </div>

      {/* Question Input with Zen aesthetics */}
      <div className="space-y-6">
        <Textarea
          placeholder="deep questions only"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="min-h-[120px] text-lg text-zen-body border border-zen-light bg-zen-paper resize-none focus-visible:ring-0 focus-visible:border-zen-medium p-6 rounded-md transition-all duration-300"
        />

        {/* Clean Control Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs text-zen-mono text-zen-medium uppercase tracking-wider whitespace-nowrap">Answer Type</span>
              <Select value={outputType} onValueChange={(value) => setOutputType(value as OutputType)}>
                <SelectTrigger className="w-[140px] border border-zen-light bg-zen-paper text-zen-mono text-sm rounded-sm">
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

            <Link to="/config">
              <Button 
                variant="outline"
                size="sm"
                className="border border-zen-light hover:border-zen-medium bg-zen-paper hover:bg-zen-whisper text-zen-charcoal hover:text-zen-ink flex items-center gap-2 text-zen-mono text-xs uppercase tracking-wide transition-all duration-300 px-4 py-2 rounded-sm"
              >
                <Settings className="w-4 h-4" />
                <span>Configure</span>
              </Button>
            </Link>
          </div>

          <div className="text-xs text-zen-mono text-zen-medium">
            {question.length} chars
          </div>
        </div>
      </div>
    </div>
  );
};

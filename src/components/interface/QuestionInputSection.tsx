
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Settings, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { OutputType, OUTPUT_TYPE_CONFIGS } from "@/types/outputTypes";
import { PixelRobot } from "../PixelRobot";

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
    <div className="space-y-6">
      {/* Refined Question Input */}
      <div className="space-y-6">
        <Textarea
          placeholder="Present your most challenging question—one that resists simple answers and demands deeper investigation..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="min-h-[180px] text-lg border border-zen-light bg-zen-paper resize-none focus-visible:ring-0 focus-visible:border-zen-charcoal p-6 transition-all duration-300 placeholder:text-zen-medium"
        />

        {/* Sophisticated Control Row */}
        <div className="border-t border-zen-light pt-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center space-x-3">
                <PixelRobot size={16} mood="working" />
                <span className="text-zen-mono text-sm text-zen-medium">
                  {question.length} characters
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-zen-mono text-sm text-zen-charcoal">Output Format:</span>
                <Select value={outputType} onValueChange={(value) => setOutputType(value as OutputType)}>
                  <SelectTrigger className="w-[160px] h-10 border border-zen-light bg-zen-paper text-zen-charcoal">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zen-paper border border-zen-light shadow-zen-lg">
                    {OUTPUT_TYPE_CONFIGS.map((config) => (
                      <SelectItem 
                        key={config.id} 
                        value={config.id}
                        className="text-zen-charcoal hover:bg-zen-whisper focus:bg-zen-whisper"
                      >
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
                  className="border border-zen-light hover:bg-zen-whisper text-zen-charcoal flex items-center gap-2 transition-all duration-300"
                >
                  <Settings className="w-4 h-4" />
                  <span>Configure</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

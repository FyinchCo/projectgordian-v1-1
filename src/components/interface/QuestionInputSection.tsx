
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    <>
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-cormorant font-bold tracking-tight text-mono-pure-black uppercase">
          THE GENIUS MACHINE
        </h1>
        <p className="text-sm font-inter text-mono-dark-gray">
          AI's Recursive Distillation of Complex Questions
        </p>
      </div>

      {/* Question Input */}
      <div className="space-y-3">
        <Textarea
          placeholder="Enter your high-friction question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="min-h-[80px] text-base font-inter border-2 border-mono-pure-black resize-none focus-visible:ring-0 p-3"
        />

        {/* Answer Type and Character Count Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-mono-pure-black uppercase tracking-wider">Answer Type:</span>
            <Select value={outputType} onValueChange={(value) => setOutputType(value as OutputType)}>
              <SelectTrigger className="w-[140px] border-2 border-mono-pure-black bg-mono-off-white font-mono text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-2 border-mono-pure-black">
                {OUTPUT_TYPE_CONFIGS.map((config) => (
                  <SelectItem key={config.id} value={config.id} className="font-mono text-sm">
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-xs font-mono text-mono-pure-black">
            {question.length} characters
          </div>
        </div>
      </div>
    </>
  );
};

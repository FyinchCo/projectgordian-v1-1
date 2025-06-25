
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
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
      {/* Question Input with Playful Design */}
      <div className="space-y-6">
        <Textarea
          placeholder="Type your most puzzling question here... I'm ready for anything! 🚀"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="min-h-[180px] text-xl border-2 border-gray-300 bg-white resize-none focus-visible:ring-0 focus-visible:border-blue-400 p-6 rounded-xl shadow-md transition-all duration-300 placeholder:text-gray-400"
        />

        {/* Friendly Control Row */}
        <div className="border-t-2 border-gray-200 pt-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <PixelRobot size={20} mood="working" />
                <span className="text-sm font-medium text-gray-600">
                  {question.length} characters ready for analysis
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-600">Answer Style:</span>
                <Select value={outputType} onValueChange={(value) => setOutputType(value as OutputType)}>
                  <SelectTrigger className="w-[160px] h-10 border-2 border-gray-300 bg-white text-gray-700 font-medium rounded-lg hover:border-gray-400 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 border-gray-300 shadow-xl rounded-lg">
                    {OUTPUT_TYPE_CONFIGS.map((config) => (
                      <SelectItem 
                        key={config.id} 
                        value={config.id}
                        className="font-medium text-gray-700 hover:bg-blue-50 focus:bg-blue-50 rounded-md"
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
                  className="border-2 border-blue-300 hover:bg-blue-50 text-blue-700 hover:text-blue-800 flex items-center gap-2 font-medium rounded-lg transition-all duration-300 px-4 py-2"
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

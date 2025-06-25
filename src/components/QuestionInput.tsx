
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Zap, Brain, Sparkles } from "lucide-react";
import { OutputType, OUTPUT_TYPE_CONFIGS } from "@/types/outputTypes";
import { PixelRobot } from "./PixelRobot";

interface QuestionInputProps {
  question: string;
  setQuestion: (question: string) => void;
  onStartGenius: () => void;
  customArchetypes: any;
  enhancedMode: boolean;
  onToggleAssessment?: () => void;
  showAssessment?: boolean;
  outputType: OutputType;
  onOutputTypeChange: (type: OutputType) => void;
}

export const QuestionInput = ({ 
  question, 
  setQuestion, 
  onStartGenius, 
  customArchetypes, 
  enhancedMode,
  onToggleAssessment,
  showAssessment,
  outputType,
  onOutputTypeChange
}: QuestionInputProps) => {
  return (
    <div className="space-y-12">
      {/* Playful Header Section */}
      <div className="text-center space-y-8">
        <div className="flex items-center justify-center space-x-4 mb-6">
          <PixelRobot size={64} mood="excited" animate={true} />
          <div className="text-left">
            <h2 className="text-5xl font-bold tracking-tight text-gray-800 leading-tight">
              What's Puzzling You?
            </h2>
            <p className="text-lg text-gray-600 font-medium">
              I love a good challenge! 🤖✨
            </p>
          </div>
          <PixelRobot size={64} mood="thinking" />
        </div>
        
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Ask me something complex, contradictory, or just plain tricky. 
          I'll gather my AI friends and we'll brainstorm breakthrough insights together!
        </p>
        
        {customArchetypes && (
          <div className="bg-green-100 border-2 border-green-300 rounded-xl p-4 inline-block">
            <div className="flex items-center space-x-2">
              <PixelRobot size={24} mood="happy" />
              <span className="text-sm font-medium text-green-800">
                Using {customArchetypes.length} of your custom AI personalities
              </span>
            </div>
          </div>
        )}
        
        {enhancedMode && (
          <div className="bg-purple-100 border-2 border-purple-300 rounded-xl p-4 inline-block">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">
                Enhanced Mode: Extra assumption-challenging power activated!
              </span>
            </div>
          </div>
        )}
      </div>

      <Card className="border-3 border-gray-300 bg-white shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="p-6 space-y-6">
          <Textarea
            placeholder="Type your most puzzling question here... I'm ready for anything! 🚀"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="min-h-[180px] text-xl border-0 shadow-none resize-none focus-visible:ring-0 p-0 placeholder:text-gray-400 bg-transparent"
          />
          
          <div className="border-t-2 border-gray-200 pt-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <PixelRobot size={20} mood="working" />
                  <span className="text-sm font-medium text-gray-600">
                    {question.length} characters ready for analysis
                  </span>
                </div>
                
                {onToggleAssessment && (
                  <Button
                    onClick={onToggleAssessment}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2 border-2 border-blue-300 hover:bg-blue-50 text-blue-700 hover:text-blue-800 font-medium rounded-lg"
                  >
                    <Brain className="w-4 h-4" />
                    <span>{showAssessment ? "Hide" : "Show"} AI Assessment</span>
                  </Button>
                )}

                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-600">Answer Style:</span>
                  <Select value={outputType} onValueChange={(value) => onOutputTypeChange(value as OutputType)}>
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
              </div>

              <Button 
                onClick={onStartGenius}
                disabled={!question.trim()}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white flex items-center space-x-3 font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 border-0 px-8 py-4 rounded-xl"
              >
                <Play className="w-6 h-6" />
                <span>Let's Think Together!</span>
                <Zap className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Charming Info Cards */}
      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <Card className="border-2 border-green-300 bg-green-50 p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex justify-center mb-4">
            <PixelRobot size={48} mood="thinking" />
          </div>
          <h3 className="font-bold text-xl mb-4 text-green-800">Multi-Perspective Magic</h3>
          <p className="text-sm text-green-700 leading-relaxed">
            I gather different AI personalities to look at your problem from every angle
          </p>
        </Card>
        
        <Card className="border-2 border-blue-300 bg-blue-50 p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex justify-center mb-4">
            <PixelRobot size={48} mood="working" />
          </div>
          <h3 className="font-bold text-xl mb-4 text-blue-800">Breakthrough Insights</h3>
          <p className="text-sm text-blue-700 leading-relaxed">
            We don't just give answers - we discover breakthrough insights together
          </p>
        </Card>
        
        <Card className="border-2 border-purple-300 bg-purple-50 p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex justify-center mb-4">
            <PixelRobot size={48} mood="celebrating" />
          </div>
          <h3 className="font-bold text-xl mb-4 text-purple-800">Friendly & Smart</h3>
          <p className="text-sm text-purple-700 leading-relaxed">
            Sophisticated AI power delivered with a smile and a helpful attitude
          </p>
        </Card>
      </div>
    </div>
  );
};

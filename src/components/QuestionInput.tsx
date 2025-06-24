
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Zap, Brain } from "lucide-react";
import { OutputType, OUTPUT_TYPE_CONFIGS } from "@/types/outputTypes";

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
      {/* Brutal Header Section */}
      <div className="text-center space-y-8">
        <h2 className="text-5xl font-cormorant font-bold tracking-tight text-mono-pure-black uppercase leading-tight">
          INPUT YOUR<br />
          <span className="text-mono-charcoal border-b-4 border-mono-pure-black pb-2">HIGH-FRICTION QUESTION</span>
        </h2>
        <p className="text-lg font-inter text-mono-dark-gray max-w-2xl mx-auto leading-relaxed">
          Present a complex challenge that demands multiple perspectives. 
          The Genius Machine will deploy archetypal agents to discover breakthrough insights.
        </p>
        {customArchetypes && (
          <p className="text-sm font-mono text-mono-pure-black bg-mono-light-gray inline-block px-4 py-2 border-2 border-mono-pure-black uppercase tracking-wide">
            Using {customArchetypes.length} custom archetypes from your configuration
          </p>
        )}
        {enhancedMode && (
          <p className="text-sm font-mono text-mono-pure-white bg-mono-pure-black inline-block px-4 py-2 uppercase tracking-wide">
            Enhanced mode: Assumption interrogation and dialectical tension active
          </p>
        )}
      </div>

      <div className="border-4 border-mono-pure-black bg-mono-pure-white shadow-2xl">
        <div className="p-4 space-y-6">
          <Textarea
            placeholder="Enter your deep, complex question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="min-h-[180px] text-xl font-inter border-0 shadow-none resize-none focus-visible:ring-0 p-0 placeholder:text-mono-medium-gray bg-transparent"
          />
          
          <div className="border-t-2 border-mono-pure-black pt-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="text-sm font-mono text-mono-pure-black uppercase tracking-wider">
                  {question.length} characters
                </div>
                
                {onToggleAssessment && (
                  <Button
                    onClick={onToggleAssessment}
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 text-mono-pure-black hover:text-mono-pure-white hover:bg-mono-pure-black font-mono uppercase tracking-wide border-2 border-mono-pure-black"
                  >
                    <Brain className="w-4 h-4" />
                    <span>{showAssessment ? "Hide" : "Show"} AI Assessment</span>
                  </Button>
                )}

                <div className="flex items-center space-x-3">
                  <span className="text-sm font-mono text-mono-pure-black uppercase tracking-wider">Answer Type:</span>
                  <Select value={outputType} onValueChange={(value) => onOutputTypeChange(value as OutputType)}>
                    <SelectTrigger className="w-[160px] h-10 border-2 border-mono-pure-black bg-mono-off-white text-mono-pure-black font-mono text-sm uppercase">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-mono-pure-white border-2 border-mono-pure-black shadow-xl">
                      {OUTPUT_TYPE_CONFIGS.map((config) => (
                        <SelectItem 
                          key={config.id} 
                          value={config.id}
                          className="font-mono text-mono-pure-black hover:bg-mono-pure-black hover:text-mono-pure-white focus:bg-mono-pure-black focus:text-mono-pure-white uppercase tracking-wide"
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
                className="bg-mono-pure-black text-mono-pure-white hover:bg-mono-charcoal flex items-center space-x-3 font-mono font-bold text-base uppercase tracking-wide border-2 border-mono-pure-black px-8 py-4"
              >
                <Play className="w-6 h-6" />
                <span>START GENIUS MACHINE</span>
                <Zap className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Brutal Info Cards */}
      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <div className="border-2 border-mono-pure-black bg-mono-pure-white p-8 text-center shadow-lg">
          <h3 className="font-cormorant font-bold text-xl mb-4 text-mono-pure-black uppercase">COGNITIVE DISRUPTION</h3>
          <p className="text-sm font-inter text-mono-dark-gray leading-relaxed">Challenge assumptions and force breakthrough thinking</p>
        </div>
        <div className="border-2 border-mono-pure-black bg-mono-pure-white p-8 text-center shadow-lg">
          <h3 className="font-cormorant font-bold text-xl mb-4 text-mono-pure-black uppercase">DIALECTICAL TENSION</h3>
          <p className="text-sm font-inter text-mono-dark-gray leading-relaxed">Generate productive conflict between perspectives</p>
        </div>
        <div className="border-2 border-mono-pure-black bg-mono-pure-white p-8 text-center shadow-lg">
          <h3 className="font-cormorant font-bold text-xl mb-4 text-mono-pure-black uppercase">EMERGENCE DETECTION</h3>
          <p className="text-sm font-inter text-mono-dark-gray leading-relaxed">Identify moments of genuine insight breakthrough</p>
        </div>
      </div>
    </div>
  );
};

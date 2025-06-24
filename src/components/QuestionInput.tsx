
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Play, Zap, Brain } from "lucide-react";
import { OutputTypeSelector } from "@/components/OutputTypeSelector";
import { OutputType } from "@/types/outputTypes";

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
    <div className="space-y-8">
      {/* Main Input Section */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold tracking-tight">
          INPUT YOUR<br />
          <span className="text-gray-400">HIGH-FRICTION QUESTION</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Present a complex challenge that demands multiple perspectives. 
          The Genius Machine will deploy archetypal agents to discover breakthrough insights.
        </p>
        {customArchetypes && (
          <p className="text-sm text-blue-600">
            Using {customArchetypes.length} custom archetypes from your configuration
          </p>
        )}
        {enhancedMode && (
          <p className="text-sm text-purple-600">
            Enhanced mode: Assumption interrogation and dialectical tension active
          </p>
        )}
      </div>

      {/* Output Type Selector */}
      <OutputTypeSelector 
        selectedType={outputType}
        onTypeChange={onOutputTypeChange}
      />

      <Card className="p-8 shadow-sm border-2">
        <div className="space-y-6">
          <Textarea
            placeholder="Enter your deep, complex question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="min-h-[150px] text-lg border-0 shadow-none resize-none focus-visible:ring-0 p-0"
          />
          
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {question.length} characters
              </div>
              {onToggleAssessment && (
                <Button
                  onClick={onToggleAssessment}
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Brain className="w-4 h-4" />
                  <span>{showAssessment ? "Hide" : "Show"} AI Assessment</span>
                </Button>
              )}
            </div>
            <Button 
              onClick={onStartGenius}
              disabled={!question.trim()}
              size="lg"
              className="bg-black text-white hover:bg-gray-800 flex items-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>START GENIUS MACHINE</span>
              <Zap className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Info Section */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <Card className="p-6 text-center">
          <h3 className="font-bold mb-2">COGNITIVE DISRUPTION</h3>
          <p className="text-sm text-gray-600">Challenge assumptions and force breakthrough thinking</p>
        </Card>
        <Card className="p-6 text-center">
          <h3 className="font-bold mb-2">DIALECTICAL TENSION</h3>
          <p className="text-sm text-gray-600">Generate productive conflict between perspectives</p>
        </Card>
        <Card className="p-6 text-center">
          <h3 className="font-bold mb-2">EMERGENCE DETECTION</h3>
          <p className="text-sm text-gray-600">Identify moments of genuine insight breakthrough</p>
        </Card>
      </div>
    </div>
  );
};


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
      <div className="text-center space-y-6">
        <h2 className="text-4xl font-playfair font-bold tracking-tight text-gordian-dark-brown">
          INPUT YOUR<br />
          <span className="text-gordian-brown">HIGH-FRICTION QUESTION</span>
        </h2>
        <p className="text-lg font-inter text-gordian-brown max-w-2xl mx-auto leading-relaxed">
          Present a complex challenge that demands multiple perspectives. 
          The Genius Machine will deploy archetypal agents to discover breakthrough insights.
        </p>
        {customArchetypes && (
          <p className="text-sm font-inter text-gordian-dark-brown bg-gordian-gold/20 inline-block px-3 py-1 rounded-full">
            Using {customArchetypes.length} custom archetypes from your configuration
          </p>
        )}
        {enhancedMode && (
          <p className="text-sm font-inter text-purple-800 bg-purple-100 inline-block px-3 py-1 rounded-full">
            Enhanced mode: Assumption interrogation and dialectical tension active
          </p>
        )}
      </div>

      {/* Output Type Selector */}
      <OutputTypeSelector 
        selectedType={outputType}
        onTypeChange={onOutputTypeChange}
      />

      <Card className="p-8 shadow-lg border-2 border-gordian-beige bg-white">
        <div className="space-y-6">
          <Textarea
            placeholder="Enter your deep, complex question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="min-h-[150px] text-lg font-inter border-0 shadow-none resize-none focus-visible:ring-0 p-0 placeholder:text-gordian-brown/50"
          />
          
          <div className="flex justify-between items-center pt-4 border-t border-gordian-beige">
            <div className="flex items-center space-x-4">
              <div className="text-sm font-inter text-gordian-brown">
                {question.length} characters
              </div>
              {onToggleAssessment && (
                <Button
                  onClick={onToggleAssessment}
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 text-gordian-brown hover:text-gordian-dark-brown hover:bg-gordian-beige font-inter"
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
              className="bg-gordian-dark-brown text-gordian-cream hover:bg-gordian-brown flex items-center space-x-2 font-inter font-medium"
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
        <Card className="p-6 text-center bg-gradient-to-br from-white to-gordian-cream border-gordian-beige">
          <h3 className="font-playfair font-bold mb-2 text-gordian-dark-brown">COGNITIVE DISRUPTION</h3>
          <p className="text-sm font-inter text-gordian-brown">Challenge assumptions and force breakthrough thinking</p>
        </Card>
        <Card className="p-6 text-center bg-gradient-to-br from-white to-gordian-cream border-gordian-beige">
          <h3 className="font-playfair font-bold mb-2 text-gordian-dark-brown">DIALECTICAL TENSION</h3>
          <p className="text-sm font-inter text-gordian-brown">Generate productive conflict between perspectives</p>
        </Card>
        <Card className="p-6 text-center bg-gradient-to-br from-white to-gordian-cream border-gordian-beige">
          <h3 className="font-playfair font-bold mb-2 text-gordian-dark-brown">EMERGENCE DETECTION</h3>
          <p className="text-sm font-inter text-gordian-brown">Identify moments of genuine insight breakthrough</p>
        </Card>
      </div>
    </div>
  );
};

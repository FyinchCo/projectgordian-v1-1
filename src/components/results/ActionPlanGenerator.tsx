
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, ListChecks, ArrowRight, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PixelRobot } from "../PixelRobot";

interface ActionPlanGeneratorProps {
  insight: string;
  question: string;
}

export const ActionPlanGenerator = ({ insight, question }: ActionPlanGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [actionPlan, setActionPlan] = useState<string | null>(null);
  const [showGenerator, setShowGenerator] = useState(true);
  const { toast } = useToast();

  const formatActionPlan = (text: string): string => {
    // Convert paragraphs to bullet points and improve formatting
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    let formattedPlan = '';
    let currentSection = '';
    let inList = false;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Check if it's a section header (contains numbers like 1., 2., etc. or keywords)
      if (trimmedLine.match(/^\d+\./) || 
          trimmedLine.toLowerCase().includes('step') ||
          trimmedLine.toLowerCase().includes('phase') ||
          trimmedLine.toLowerCase().includes('stage')) {
        
        if (inList) {
          formattedPlan += '\n';
          inList = false;
        }
        formattedPlan += `\n**${trimmedLine}**\n`;
        currentSection = trimmedLine.toLowerCase();
        
      } else if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
        // Already a bullet point
        formattedPlan += `${trimmedLine}\n`;
        inList = true;
        
      } else if (trimmedLine.length > 20 && !trimmedLine.endsWith(':')) {
        // Convert regular sentences to bullet points
        formattedPlan += `${trimmedLine}\n\n`;
        
      } else if (trimmedLine.endsWith(':')) {
        // Sub-header
        formattedPlan += `\n*${trimmedLine}*\n`;
        
      } else if (trimmedLine.length > 0) {
        formattedPlan += `${trimmedLine}\n`;
      }
    }
    
    return formattedPlan.trim();
  };

  const generateActionPlan = async () => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('genius-machine', {
        body: {
          question: `Based on this breakthrough insight, create a strategic action plan that captures the essence of implementing this concept in practice:

ORIGINAL QUESTION: ${question}

BREAKTHROUGH INSIGHT: ${insight}

Create a strategic, high-level action plan with 3-4 key phases or steps. Each step should:
- Have a clear, memorable title
- Include a brief description of what it involves
- Show the input/output or transformation that happens
- Use conceptual language rather than technical implementation details

Format like this example structure:
1. [Clear Phase Title]
[Description of what this phase involves and why it matters]
Input/Output: [What goes in → What comes out]

⸻

2. [Next Phase Title] 
[Description and purpose]
Transformation: [How this builds on the previous phase]

Make this feel like a manifesto or strategic framework someone could actually follow to implement the core insight. Focus on the human experience and the conceptual flow rather than technical steps.`,
          processingDepth: 1,
          circuitType: 'sequential',
          enhancedMode: false
        }
      });

      if (error) throw error;

      const formattedPlan = formatActionPlan(data.insight);
      setActionPlan(formattedPlan);
      setShowGenerator(false);
      
      toast({
        title: "Strategic Action Plan Ready! 🎉",
        description: "Your breakthrough insight has been transformed into a strategic framework.",
      });
    } catch (error) {
      toast({
        title: "Oops! Something went wrong",
        description: "Unable to generate action plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (actionPlan) {
    return (
      <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-300 shadow-lg">
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <PixelRobot size={32} mood="celebrating" animate={true} />
            <h3 className="font-bold text-xl text-green-800">Strategic Action Plan Ready!</h3>
            <ListChecks className="w-6 h-6 text-green-600" />
          </div>
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed bg-white p-6 rounded-lg border-2 border-gray-200 shadow-inner">
              {actionPlan.split('\n').map((line, index) => {
                if (line.startsWith('**') && line.endsWith('**')) {
                  return <div key={index} className="font-bold text-blue-900 mt-6 mb-3 text-xl border-b-2 border-blue-200 pb-2">{line.replace(/\*\*/g, '')}</div>;
                } else if (line.startsWith('*') && line.endsWith('*')) {
                  return <div key={index} className="font-semibold text-blue-700 mt-3 mb-2 text-lg">{line.replace(/\*/g, '')}</div>;
                } else if (line.includes('⸻')) {
                  return <div key={index} className="text-center my-6 text-2xl text-gray-400">⸻</div>;
                } else if (line.trim()) {
                  return <div key={index} className="mb-2 text-gray-800 leading-relaxed">{line}</div>;
                } else {
                  return <div key={index} className="mb-3"></div>;
                }
              })}
            </div>
          </div>
          <div className="flex justify-center pt-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setActionPlan(null);
                setShowGenerator(true);
              }}
              className="text-green-700 border-2 border-green-300 hover:bg-green-100 font-medium rounded-lg"
            >
              Generate Different Plan
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (!showGenerator) return null;

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <PixelRobot size={48} mood="excited" animate={true} />
          <div>
            <h3 className="font-bold text-xl text-blue-900 mb-2">Ready to Take Action?</h3>
            <p className="text-blue-700 leading-relaxed">
              Transform your breakthrough insight into a strategic action framework that you can 
              actually implement. Let's make this wisdom actionable! 🚀
            </p>
          </div>
        </div>
        <Button
          onClick={generateActionPlan}
          disabled={isGenerating}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white flex items-center space-x-2 font-bold shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-xl"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Creating Framework...</span>
            </>
          ) : (
            <>
              <Lightbulb className="w-5 h-5" />
              <span>Create Action Plan</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

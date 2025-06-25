
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
          trimmedLine.toLowerCase().includes('action items') ||
          trimmedLine.toLowerCase().includes('timeline') ||
          trimmedLine.toLowerCase().includes('metrics') ||
          trimmedLine.toLowerCase().includes('obstacles') ||
          trimmedLine.toLowerCase().includes('resources')) {
        
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
        formattedPlan += `• ${trimmedLine}\n`;
        inList = true;
        
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
          question: `Transform this breakthrough insight into a practical action plan with specific, bulleted steps:

ORIGINAL QUESTION: ${question}

BREAKTHROUGH INSIGHT: ${insight}

Create a structured action plan with clear bullet points under these sections:

**1. KEY ACTION ITEMS**
• [Specific actionable step 1]
• [Specific actionable step 2]
• [Specific actionable step 3]

**2. IMPLEMENTATION TIMELINE**
• Immediate (next 24-48 hours): [specific actions]
• Short-term (next 1-2 weeks): [specific actions]
• Long-term (next 1-3 months): [specific actions]

**3. SUCCESS METRICS**
• [How to measure progress - specific metric 1]
• [How to measure progress - specific metric 2]
• [How to measure progress - specific metric 3]

**4. POTENTIAL OBSTACLES & SOLUTIONS**
• Obstacle: [specific challenge] → Solution: [specific approach]
• Obstacle: [specific challenge] → Solution: [specific approach]

**5. RESOURCE REQUIREMENTS**
• [Specific resource or tool needed]
• [Specific resource or tool needed]
• [Specific resource or tool needed]

Format everything as clear, actionable bullet points that someone can immediately follow.`,
          processingDepth: 1,
          circuitType: 'sequential',
          enhancedMode: false,
          customArchetypes: 'default'
        }
      });

      if (error) throw error;

      const formattedPlan = formatActionPlan(data.insight);
      setActionPlan(formattedPlan);
      setShowGenerator(false);
      
      toast({
        title: "Action Plan Ready! 🎉",
        description: "Your breakthrough insight has been converted into practical next steps.",
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
            <h3 className="font-bold text-xl text-green-800">Your Action Plan is Ready!</h3>
            <ListChecks className="w-6 h-6 text-green-600" />
          </div>
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed font-mono text-sm bg-white p-4 rounded-lg border">
              {actionPlan.split('\n').map((line, index) => {
                if (line.startsWith('**') && line.endsWith('**')) {
                  return <div key={index} className="font-bold text-blue-800 mt-4 mb-2 text-base">{line.replace(/\*\*/g, '')}</div>;
                } else if (line.startsWith('*') && line.endsWith('*')) {
                  return <div key={index} className="font-semibold text-gray-700 mt-2 mb-1">{line.replace(/\*/g, '')}</div>;
                } else if (line.startsWith('•')) {
                  return <div key={index} className="ml-4 mb-1 text-gray-800">{line}</div>;
                } else if (line.trim()) {
                  return <div key={index} className="mb-1 text-gray-800">{line}</div>;
                } else {
                  return <div key={index} className="mb-2"></div>;
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
              Great insights deserve great action plans! Let me help you turn this breakthrough 
              into concrete steps you can take right away. 🚀
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
              <span>Creating Your Plan...</span>
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

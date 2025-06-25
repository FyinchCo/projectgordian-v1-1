
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

  const generateActionPlan = async () => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('genius-machine', {
        body: {
          question: `Transform this breakthrough insight into a practical action plan with specific steps:

ORIGINAL QUESTION: ${question}

BREAKTHROUGH INSIGHT: ${insight}

Please provide:
1. Key Action Items (3-5 specific steps)
2. Implementation Timeline (immediate, short-term, long-term)
3. Success Metrics (how to measure progress)
4. Potential Obstacles & Solutions
5. Resource Requirements

Format as clear, actionable bullet points that someone can immediately act upon.`,
          processingDepth: 1,
          circuitType: 'sequential',
          enhancedMode: false,
          customArchetypes: 'default'
        }
      });

      if (error) throw error;

      setActionPlan(data.insight);
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
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">{actionPlan}</div>
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

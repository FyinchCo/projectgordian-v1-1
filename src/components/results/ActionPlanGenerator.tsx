
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, ListChecks, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
        title: "Action Plan Generated",
        description: "Your breakthrough insight has been converted into practical next steps.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Unable to generate action plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (actionPlan) {
    return (
      <Card className="p-6 bg-green-50 border border-green-200">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <ListChecks className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-green-800">PRACTICAL ACTION PLAN</h3>
          </div>
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-gray-800">{actionPlan}</div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setActionPlan(null);
              setShowGenerator(true);
            }}
            className="text-green-700 border-green-300 hover:bg-green-100"
          >
            Generate Different Plan
          </Button>
        </div>
      </Card>
    );
  }

  if (!showGenerator) return null;

  return (
    <Card className="p-4 bg-blue-50 border border-blue-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <ListChecks className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900">Ready for Action?</h3>
            <p className="text-sm text-blue-700">
              Convert this breakthrough insight into a practical action plan with specific next steps.
            </p>
          </div>
        </div>
        <Button
          onClick={generateActionPlan}
          disabled={isGenerating}
          className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <span>Create Action Plan</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};


import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ActionPlanDisplay } from "./actionPlan/ActionPlanDisplay";
import { ActionPlanPrompt } from "./actionPlan/ActionPlanPrompt";
import { formatActionPlan } from "./actionPlan/actionPlanFormatter";

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

  const handleGenerateNew = () => {
    setActionPlan(null);
    setShowGenerator(true);
  };

  if (actionPlan) {
    return <ActionPlanDisplay actionPlan={actionPlan} onGenerateNew={handleGenerateNew} />;
  }

  if (!showGenerator) return null;

  return <ActionPlanPrompt isGenerating={isGenerating} onGenerate={generateActionPlan} />;
};

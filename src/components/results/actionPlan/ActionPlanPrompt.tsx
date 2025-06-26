
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, Lightbulb } from "lucide-react";
import { PixelRobot } from "../../PixelRobot";

interface ActionPlanPromptProps {
  isGenerating: boolean;
  onGenerate: () => void;
}

export const ActionPlanPrompt = ({ isGenerating, onGenerate }: ActionPlanPromptProps) => {
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
          onClick={onGenerate}
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


import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListChecks } from "lucide-react";
import { PixelRobot } from "../../PixelRobot";

interface ActionPlanDisplayProps {
  actionPlan: string;
  onGenerateNew: () => void;
}

export const ActionPlanDisplay = ({ actionPlan, onGenerateNew }: ActionPlanDisplayProps) => {
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
            onClick={onGenerateNew}
            className="text-green-700 border-2 border-green-300 hover:bg-green-100 font-medium rounded-lg"
          >
            Generate Different Plan
          </Button>
        </div>
      </div>
    </Card>
  );
};

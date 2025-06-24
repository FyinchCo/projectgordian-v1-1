
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Target } from "lucide-react";

interface TensionMetrics {
  tensionScore: number;
  contradictionCount: number;
  consensusRisk: number;
}

interface TensionAnalysisSectionProps {
  tensionMetrics: TensionMetrics;
}

export const TensionAnalysisSection = ({ tensionMetrics }: TensionAnalysisSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="p-6">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full flex items-center justify-between p-0 h-auto">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <h3 className="font-bold text-lg">DIALECTICAL TENSION ANALYSIS</h3>
            </div>
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded">
              <div className="text-2xl font-bold text-blue-600">
                {tensionMetrics.tensionScore}/10
              </div>
              <div className="text-sm text-blue-700">Tension Score</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded">
              <div className="text-2xl font-bold text-purple-600">
                {tensionMetrics.contradictionCount}
              </div>
              <div className="text-sm text-purple-700">Contradictions</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded">
              <div className="text-2xl font-bold text-orange-600">
                {tensionMetrics.consensusRisk}/10
              </div>
              <div className="text-sm text-orange-700">Consensus Risk</div>
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

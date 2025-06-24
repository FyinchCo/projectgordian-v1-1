
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";

interface AssumptionAnalysis {
  assumptions: string[];
  challengingQuestions: string[];
  resistanceScore: number;
}

interface AssumptionAnalysisSectionProps {
  assumptionAnalysis: AssumptionAnalysis;
}

export const AssumptionAnalysisSection = ({ assumptionAnalysis }: AssumptionAnalysisSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="p-6">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full flex items-center justify-between p-0 h-auto">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-lg">ASSUMPTION INTERROGATION</h3>
              <Badge variant="outline">
                Resistance: {assumptionAnalysis.resistanceScore}/10
              </Badge>
            </div>
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-6">
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-700 mb-3">
                Hidden Assumptions Detected
              </h4>
              <div className="space-y-2">
                {assumptionAnalysis.assumptions.map((assumption, index) => (
                  <div key={index} className="p-3 bg-red-50 border-l-4 border-red-400 text-red-700">
                    {assumption}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-700 mb-3">
                Challenging Questions
              </h4>
              <div className="space-y-2">
                {assumptionAnalysis.challengingQuestions.map((question, index) => (
                  <div key={index} className="p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
                    {question}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

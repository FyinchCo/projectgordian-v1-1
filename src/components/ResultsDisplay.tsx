
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, RotateCcw, Lightbulb, TrendingUp, Zap } from "lucide-react";

interface ResultsDisplayProps {
  results: {
    insight: string;
    confidence: number;
    tensionPoints: number;
    logicTrail: Array<{
      archetype: string;
      contribution: string;
    }>;
  };
  question: string;
  onReset: () => void;
}

export const ResultsDisplay = ({ results, question, onReset }: ResultsDisplayProps) => {
  const [isTrailOpen, setIsTrailOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Question Context */}
      <Card className="p-6 bg-gray-50">
        <h3 className="font-bold text-sm uppercase tracking-wide text-gray-500 mb-2">ORIGINAL QUESTION</h3>
        <p className="text-lg">{question}</p>
      </Card>

      {/* Main Insight */}
      <Card className="p-8 border-2 border-black">
        <div className="text-center space-y-6">
          <Lightbulb className="w-12 h-12 mx-auto text-black" />
          
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-2">
              BREAKTHROUGH INSIGHT
            </h2>
            <p className="text-2xl font-bold leading-tight">
              "{results.insight}"
            </p>
          </div>

          {/* Metrics */}
          <div className="flex justify-center space-x-8 pt-6 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.round(results.confidence * 100)}%</div>
              <div className="text-xs text-gray-500 uppercase">Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{results.tensionPoints}</div>
              <div className="text-xs text-gray-500 uppercase">Tension Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{results.logicTrail.length}</div>
              <div className="text-xs text-gray-500 uppercase">Perspectives</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Logic Trail */}
      <Collapsible open={isTrailOpen} onOpenChange={setIsTrailOpen}>
        <Card className="p-6">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full flex items-center justify-between p-0 h-auto">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <h3 className="font-bold text-lg">LOGIC TRAIL</h3>
              </div>
              {isTrailOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-6">
            <div className="space-y-4">
              {results.logicTrail.map((entry, index) => (
                <Card key={index} className="p-4 bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm uppercase tracking-wide text-gray-700 mb-1">
                        {entry.archetype}
                      </h4>
                      <p className="text-gray-800">{entry.contribution}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <Button 
          onClick={onReset}
          variant="outline"
          size="lg"
          className="flex items-center space-x-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>New Question</span>
        </Button>
        
        <Button 
          onClick={() => {/* Add export/share functionality */}}
          size="lg"
          className="bg-black text-white hover:bg-gray-800 flex items-center space-x-2"
        >
          <Zap className="w-5 h-5" />
          <span>Export Insight</span>
        </Button>
      </div>
    </div>
  );
};


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, TrendingUp } from "lucide-react";

interface LogicTrailEntry {
  archetype: string;
  contribution: string;
}

interface LogicTrailSectionProps {
  logicTrail: LogicTrailEntry[];
}

export const LogicTrailSection = ({ logicTrail }: LogicTrailSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Guard against undefined or null logicTrail
  if (!logicTrail || !Array.isArray(logicTrail) || logicTrail.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-2 text-gray-500">
          <TrendingUp className="w-5 h-5" />
          <h3 className="font-bold text-lg">LOGIC TRAIL</h3>
        </div>
        <p className="mt-4 text-gray-600 italic">No logic trail data available</p>
      </Card>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="p-6">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full flex items-center justify-between p-0 h-auto">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <h3 className="font-bold text-lg">LOGIC TRAIL</h3>
            </div>
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-6">
          <div className="space-y-4">
            {logicTrail.map((entry, index) => (
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
  );
};

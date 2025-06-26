
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Activity } from "lucide-react";
import { ArchetypeIcon } from "./ArchetypeIcon";

interface ArchetypeHeaderProps {
  archetype: string;
  isActive: boolean;
  isCompleted: boolean;
  contributionQuality: number;
  processingInsights?: {
    focus: string;
    contribution: string;
  };
}

export const ArchetypeHeader = ({ 
  archetype, 
  isActive, 
  isCompleted, 
  contributionQuality,
  processingInsights 
}: ArchetypeHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <ArchetypeIcon 
          archetype={archetype}
          isActive={isActive}
          isCompleted={isCompleted}
        />
        <div>
          <h3 className="font-semibold text-sm">
            {archetype.replace("The ", "")}
          </h3>
          {processingInsights && (
            <p className="text-xs opacity-70">{processingInsights.focus}</p>
          )}
        </div>
      </div>
      
      <div className="flex flex-col items-end space-y-1">
        {isCompleted && (
          <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
            <CheckCircle className="w-3 h-3 mr-1" />
            {contributionQuality}%
          </Badge>
        )}
        {isActive && (
          <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-300 animate-pulse">
            <Activity className="w-3 h-3 mr-1" />
            Active
          </Badge>
        )}
      </div>
    </div>
  );
};

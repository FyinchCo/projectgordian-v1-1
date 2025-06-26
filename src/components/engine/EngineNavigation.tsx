
import { Button } from "@/components/ui/button";
import { List } from "lucide-react";

interface EngineNavigationProps {
  jobsCount: number;
  onViewHistory: () => void;
}

export const EngineNavigation = ({ jobsCount, onViewHistory }: EngineNavigationProps) => {
  return (
    <div className="flex justify-center space-x-4">
      <Button 
        variant="outline"  
        onClick={onViewHistory}
        className="flex items-center space-x-2"
      >
        <List className="w-4 h-4" />
        <span>View History ({jobsCount})</span>
      </Button>
    </div>
  );
};

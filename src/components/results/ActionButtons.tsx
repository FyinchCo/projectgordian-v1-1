
import { Button } from "@/components/ui/button";
import { RotateCcw, Download } from "lucide-react";

interface ActionButtonsProps {
  onReset: () => void;
  onExport: () => void;
}

export const ActionButtons = ({ onReset, onExport }: ActionButtonsProps) => {
  return (
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
        onClick={onExport}
        size="lg"
        className="bg-black text-white hover:bg-gray-800 flex items-center space-x-2"
      >
        <Download className="w-5 h-5" />
        <span>Export Insight</span>
      </Button>
    </div>
  );
};

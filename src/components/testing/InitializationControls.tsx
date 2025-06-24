
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

interface InitializationControlsProps {
  isInitialized: boolean;
  isRunningBaseline: boolean;
  onInitialize: () => void;
  onRunBaseline: () => void;
  onReset: () => void;
}

export const InitializationControls = ({
  isInitialized,
  isRunningBaseline,
  onInitialize,
  onRunBaseline,
  onReset
}: InitializationControlsProps) => {
  return (
    <div className="flex space-x-2">
      {!isInitialized && (
        <Button onClick={onInitialize} className="bg-blue-600 hover:bg-blue-700">
          Initialize Framework
        </Button>
      )}
      {isInitialized && (
        <Button 
          onClick={onRunBaseline} 
          disabled={isRunningBaseline}
          className="bg-green-600 hover:bg-green-700"
        >
          {isRunningBaseline ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Running Baseline Test...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Run Baseline Test
            </>
          )}
        </Button>
      )}
      <Button variant="outline" onClick={onReset}>
        Reset All Data
      </Button>
    </div>
  );
};


import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Play, RefreshCw, Bug } from "lucide-react";

interface TestControlsProps {
  selectedTestSet: string;
  setSelectedTestSet: (value: string) => void;
  isRunning: boolean;
  progress: { current: number; total: number };
  currentTest: string;
  onRunTest: () => void;
  onReloadResults: () => void;
  onDebugState: () => void;
  onClearResults: () => void;
}

export const TestControls = ({
  selectedTestSet,
  setSelectedTestSet,
  isRunning,
  progress,
  currentTest,
  onRunTest,
  onReloadResults,
  onDebugState,
  onClearResults
}: TestControlsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Test Question Set</label>
          <Select value={selectedTestSet} onValueChange={setSelectedTestSet}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="benchmark">Benchmark Questions (3 tests × 4 AIs)</SelectItem>
              <SelectItem value="creative">Creative Challenges (2 tests × 4 AIs)</SelectItem>
              <SelectItem value="analytical">Analytical Problems (2 tests × 4 AIs)</SelectItem>
              <SelectItem value="mixed">Mixed Sample (2 tests × 4 AIs)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-end space-x-2">
          <Button variant="outline" size="sm" onClick={onDebugState}>
            <Bug className="w-4 h-4 mr-1" />
            Debug State
          </Button>
          <Button variant="outline" size="sm" onClick={onClearResults}>
            <RefreshCw className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        </div>
      </div>

      {isRunning && (
        <div className="space-y-3">
          <Progress value={(progress.current / progress.total) * 100} />
          <div className="text-sm text-gray-600">
            Progress: {progress.current}/{progress.total} questions tested across 4 AI systems
          </div>
          {currentTest && (
            <div className="text-sm text-blue-600">
              {currentTest}
            </div>
          )}
        </div>
      )}

      <div className="flex space-x-3">
        <Button 
          onClick={onRunTest}
          disabled={isRunning}
          className="flex-1"
        >
          {isRunning ? (
            <>
              <Play className="w-4 h-4 mr-2 animate-spin" />
              Running 4-Way AI Comparison...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start NEW 4-Way Validation Test
            </>
          )}
        </Button>
        
        <Button variant="outline" onClick={onReloadResults}>
          Reload & Analyze Results
        </Button>
      </div>
    </div>
  );
};

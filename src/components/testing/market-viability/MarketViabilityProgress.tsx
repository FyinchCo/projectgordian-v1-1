
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface MarketViabilityProgressProps {
  isRunning: boolean;
  progress: { current: number; total: number };
  currentTest: string;
}

export const MarketViabilityProgress = ({ isRunning, progress, currentTest }: MarketViabilityProgressProps) => {
  if (!isRunning) return null;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Testing Progress</span>
            <span>{progress.current}/{progress.total}</span>
          </div>
          <Progress value={(progress.current / progress.total) * 100} />
          {currentTest && (
            <div className="text-sm text-blue-600 truncate">
              Current: {currentTest}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

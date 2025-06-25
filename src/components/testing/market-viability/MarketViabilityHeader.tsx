
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Play } from "lucide-react";

interface MarketViabilityHeaderProps {
  isRunning: boolean;
  onRunTest: () => void;
}

export const MarketViabilityHeader = ({ isRunning, onRunTest }: MarketViabilityHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="w-6 h-6 text-green-600" />
          <span>Market Viability Testing</span>
        </CardTitle>
        <CardDescription>
          Test AI performance on real-world, high-value questions that customers actually pay to solve
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            • 10 real-world questions across 5 market segments<br/>
            • High-stakes decisions worth $500-$50,000 each<br/>
            • Business strategy, product development, personal decisions, research, and crisis management
          </div>
          <Button 
            onClick={onRunTest}
            disabled={isRunning}
            size="lg"
            className="bg-green-600 hover:bg-green-700"
          >
            {isRunning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Running Tests...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Market Viability Test
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

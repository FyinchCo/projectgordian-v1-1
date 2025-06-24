
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BaselineResultsProps {
  baselineResults: string;
}

export const BaselineResults = ({ baselineResults }: BaselineResultsProps) => {
  if (!baselineResults) return null;

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="text-green-800">Baseline Test Results</CardTitle>
        <CardDescription className="text-green-700">
          Performance analysis of current default archetype configuration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <pre className="whitespace-pre-wrap text-sm text-green-800 font-mono">
          {baselineResults}
        </pre>
      </CardContent>
    </Card>
  );
};


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DebugInfoCardProps {
  isInitialized: boolean;
  isRunningBaseline: boolean;
  stats: {
    configurations: number;
    questions: number;
    results: number;
  };
}

export const DebugInfoCard = ({ isInitialized, isRunningBaseline, stats }: DebugInfoCardProps) => {
  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-blue-800">Debug Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-blue-700 space-y-1">
          <div>Framework Initialized: {isInitialized ? 'Yes' : 'No'}</div>
          <div>Configurations: {stats.configurations}</div>
          <div>Questions: {stats.questions}</div>
          <div>Results: {stats.results}</div>
          <div>Running Test: {isRunningBaseline ? 'Yes' : 'No'}</div>
        </div>
      </CardContent>
    </Card>
  );
};

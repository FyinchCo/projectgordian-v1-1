
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Target, BarChart3 } from "lucide-react";

interface StatsOverviewProps {
  stats: {
    configurations: number;
    questions: number;
    results: number;
  };
}

export const StatsOverview = ({ stats }: StatsOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Configurations</CardTitle>
          <Settings className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.configurations}</div>
          <p className="text-xs text-muted-foreground">
            Test configurations available
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Test Questions</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.questions}</div>
          <p className="text-xs text-muted-foreground">
            Benchmark questions ready
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Test Results</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.results}</div>
          <p className="text-xs text-muted-foreground">
            Completed test runs
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

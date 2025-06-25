
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { marketViabilityTester } from "@/services/testing/marketViabilityTester";
import { MarketViabilityHeader } from "./market-viability/MarketViabilityHeader";
import { MarketViabilityProgress } from "./market-viability/MarketViabilityProgress";
import { MarketViabilityExport } from "./market-viability/MarketViabilityExport";
import { MarketViabilitySummary } from "./market-viability/MarketViabilitySummary";
import { MarketViabilitySegments } from "./market-viability/MarketViabilitySegments";
import { MarketViabilityResults } from "./market-viability/MarketViabilityResults";

export const MarketViabilityTester = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [currentTest, setCurrentTest] = useState<string>("");
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const runMarketViabilityTest = async () => {
    setIsRunning(true);
    setResults(null);
    setProgress({ current: 0, total: 0 });

    try {
      toast({
        title: "Market Viability Test Started",
        description: "Running systematic evaluation of real-world market questions...",
      });

      const testResults = await marketViabilityTester.runMarketViabilityBatch(
        undefined, // Test all segments
        (current, total, currentTest) => {
          setProgress({ current, total });
          setCurrentTest(currentTest || "");
        }
      );

      setResults(testResults);
      
      toast({
        title: "Market Viability Test Complete",
        description: `Tested ${testResults.summary.totalTests} questions. Average score: ${testResults.summary.averageScore}/10`,
      });

    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Market viability test encountered errors. Check console for details.",
        variant: "destructive"
      });
      console.error('Market viability test failed:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest("");
    }
  };

  return (
    <div className="space-y-6">
      <MarketViabilityHeader 
        isRunning={isRunning}
        onRunTest={runMarketViabilityTest}
      />

      <MarketViabilityProgress 
        isRunning={isRunning}
        progress={progress}
        currentTest={currentTest}
      />

      {results && (
        <div className="space-y-6">
          <MarketViabilityExport results={results} />
          
          <MarketViabilitySummary summary={results.summary} />
          
          <MarketViabilitySegments segmentPerformance={results.summary.segmentPerformance} />
          
          <MarketViabilityResults results={results.results} />
        </div>
      )}
    </div>
  );
};

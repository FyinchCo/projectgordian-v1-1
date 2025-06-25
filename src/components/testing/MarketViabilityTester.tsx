import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { marketViabilityTester } from "@/services/testing/marketViabilityTester";
import { Play, TrendingUp, DollarSign, Users, AlertCircle, CheckCircle, Download, FileText } from "lucide-react";

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

  const exportResults = (format: 'json' | 'text') => {
    if (!results) return;

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `market-viability-test-${timestamp}`;

    if (format === 'json') {
      const exportData = {
        testDate: new Date().toISOString(),
        summary: results.summary,
        segmentPerformance: results.summary.segmentPerformance,
        individualResults: results.results.map((result: any, index: number) => ({
          testNumber: index + 1,
          questionId: result.questionId,
          overallScore: result.qualityMetrics?.overallScore || 'N/A',
          insight: result.results.insight,
          confidence: Math.round(result.results.confidence * 100),
          noveltyScore: result.results.noveltyScore,
          emergenceDetected: result.results.emergenceDetected,
          processingTime: result.processingTime
        })),
        fullRawResults: results.results
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      let content = `MARKET VIABILITY TEST RESULTS\n`;
      content += `Generated: ${new Date().toLocaleString()}\n`;
      content += `${'='.repeat(60)}\n\n`;
      
      content += `SUMMARY METRICS:\n`;
      content += `- Total Tests: ${results.summary.totalTests}\n`;
      content += `- Successful Tests: ${results.summary.successfulTests}\n`;
      content += `- Average Score: ${results.summary.averageScore}/10\n`;
      content += `- High-Value Performance: ${results.summary.highValuePerformance}/10\n`;
      content += `- Market Readiness: ${results.summary.marketReadiness}\n\n`;

      content += `MARKET SEGMENT PERFORMANCE:\n`;
      Object.entries(results.summary.segmentPerformance).forEach(([segment, score]) => {
        content += `- ${segment}: ${(score as number).toFixed(1)}/10\n`;
      });
      content += `\n`;

      content += `INDIVIDUAL TEST RESULTS:\n`;
      content += `${'='.repeat(40)}\n`;
      results.results.forEach((result: any, index: number) => {
        content += `\nTest ${index + 1}:\n`;
        content += `Score: ${result.qualityMetrics?.overallScore || 'N/A'}/10`;
        if (result.results.emergenceDetected) content += ` (BREAKTHROUGH)`;
        content += `\n`;
        content += `Insight: ${result.results.insight}\n`;
        content += `Confidence: ${Math.round(result.results.confidence * 100)}%\n`;
        content += `Novelty: ${result.results.noveltyScore}/10\n`;
        content += `Processing Time: ${result.processingTime}ms\n`;
        content += `${'-'.repeat(30)}\n`;
      });

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }

    toast({
      title: "Results Exported",
      description: `Market viability test results saved as ${format.toUpperCase()} file.`,
    });
  };

  const getReadinessColor = (readiness: string) => {
    switch (readiness) {
      case 'Ready': return 'bg-green-500';
      case 'Near Ready': return 'bg-yellow-500';
      case 'Needs Work': return 'bg-orange-500';
      default: return 'bg-red-500';
    }
  };

  const getReadinessIcon = (readiness: string) => {
    switch (readiness) {
      case 'Ready': return <CheckCircle className="w-4 h-4" />;
      case 'Near Ready': return <TrendingUp className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
              onClick={runMarketViabilityTest}
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

      {/* Progress */}
      {isRunning && (
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
      )}

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Export Controls */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900">Export Complete Results</h3>
                  <p className="text-sm text-blue-700">Save all test data including detailed insights for comprehensive analysis</p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => exportResults('json')}
                    variant="outline"
                    size="sm"
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export JSON
                  </Button>
                  <Button 
                    onClick={() => exportResults('text')}
                    variant="outline"
                    size="sm"
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Export Text
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold">{results.summary.averageScore}/10</div>
                    <div className="text-sm text-gray-600">Average Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold">{results.summary.successfulTests}/{results.summary.totalTests}</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold">{results.summary.highValuePerformance}/10</div>
                    <div className="text-sm text-gray-600">High-Value Performance</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getReadinessColor(results.summary.marketReadiness)}`}></div>
                  <div>
                    <div className="text-lg font-bold flex items-center space-x-1">
                      {getReadinessIcon(results.summary.marketReadiness)}
                      <span>{results.summary.marketReadiness}</span>
                    </div>
                    <div className="text-sm text-gray-600">Market Readiness</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Segment Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Market Segment Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(results.summary.segmentPerformance).map(([segment, score]) => (
                  <div key={segment} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">{segment}</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${((score as number) / 10) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{(score as number).toFixed(1)}/10</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Individual Results */}
          <Card>
            <CardHeader>
              <CardTitle>Individual Test Results</CardTitle>
              <CardDescription>
                Detailed breakdown of each market viability question
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.results.map((result: any, index: number) => (
                  <div key={result.questionId} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        Test {index + 1}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">
                          {result.qualityMetrics?.overallScore || 'N/A'}/10
                        </span>
                        {result.results.emergenceDetected && (
                          <Badge variant="secondary" className="text-xs">
                            Breakthrough
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-700">
                      <strong>Insight:</strong> {result.results.insight?.substring(0, 200)}...
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Confidence: {(result.results.confidence * 100).toFixed(0)}%</span>
                      <span>Novelty: {result.results.noveltyScore}/10</span>
                      <span>Processing: {result.processingTime}ms</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

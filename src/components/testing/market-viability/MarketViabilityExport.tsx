
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText } from "lucide-react";

interface MarketViabilityExportProps {
  results: any;
}

export const MarketViabilityExport = ({ results }: MarketViabilityExportProps) => {
  const { toast } = useToast();

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

  return (
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
  );
};

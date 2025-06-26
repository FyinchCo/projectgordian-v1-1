
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, FileText, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: any;
  question: string;
}

export const ExportModal = ({ isOpen, onClose, results, question }: ExportModalProps) => {
  const [format, setFormat] = useState("text");
  const [includeTrail, setIncludeTrail] = useState(true);
  const [includeLayers, setIncludeLayers] = useState(true);
  const [includeMetrics, setIncludeMetrics] = useState(true);
  const { toast } = useToast();

  // Early return if no results to prevent null access errors
  if (!results) {
    return null;
  }

  const handleExport = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `genius-machine-insight-${timestamp}`;

    try {
      if (format === "json") {
        const exportData = {
          question,
          timestamp: new Date().toISOString(),
          insight: results.insight,
          confidence: results.confidence,
          tensionPoints: results.tensionPoints,
          processingDepth: results.processingDepth,
          circuitType: results.circuitType,
          ...(includeMetrics && {
            metrics: {
              confidence: results.confidence,
              tensionPoints: results.tensionPoints,
              processingDepth: results.processingDepth,
              circuitType: results.circuitType,
              noveltyScore: results.noveltyScore,
              emergenceDetected: results.emergenceDetected
            }
          }),
          ...(includeLayers && results.layers && { layers: results.layers }),
          ...(includeTrail && results.logicTrail && { logicTrail: results.logicTrail }),
          ...(results.compressionFormats && { compressionFormats: results.compressionFormats })
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
      } else if (format === "text") {
        let content = `GENIUS MACHINE ANALYSIS REPORT\n`;
        content += `Generated: ${new Date().toLocaleString()}\n`;
        content += `${'='.repeat(60)}\n\n`;
        content += `QUESTION:\n${question}\n\n`;
        content += `BREAKTHROUGH INSIGHT:\n"${results.insight}"\n\n`;
        
        if (includeMetrics) {
          content += `ANALYSIS METRICS:\n`;
          content += `- Confidence Level: ${Math.round(results.confidence * 100)}%\n`;
          content += `- Tension Points: ${results.tensionPoints}\n`;
          content += `- Processing Depth: ${results.processingDepth} layers\n`;
          content += `- Circuit Type: ${results.circuitType}\n`;
          if (results.noveltyScore) content += `- Novelty Score: ${results.noveltyScore}/10\n`;
          if (results.emergenceDetected) content += `- Breakthrough Detected: Yes\n`;
          content += `\n`;
        }

        if (results.compressionFormats) {
          content += `INSIGHT FORMATS:\n`;
          content += `${'-'.repeat(30)}\n`;
          content += `Ultra-Concise: ${results.compressionFormats.ultraConcise}\n\n`;
          content += `Medium: ${results.compressionFormats.medium}\n\n`;
          content += `Comprehensive: ${results.compressionFormats.comprehensive}\n\n`;
        }

        if (includeLayers && results.layers) {
          content += `PROCESSING LAYERS:\n`;
          content += `${'-'.repeat(30)}\n`;
          results.layers.forEach((layer: any, index: number) => {
            content += `\nLayer ${layer.layerNumber} (${layer.circuitType || 'Unknown'}):\n`;
            content += `Insight: ${layer.insight}\n`;
            content += `Confidence: ${Math.round(layer.confidence * 100)}%\n`;
            if (layer.tensionPoints) content += `Tension Points: ${layer.tensionPoints}\n`;
          });
          content += `\n`;
        }

        if (includeTrail && results.logicTrail) {
          content += `LOGIC TRAIL:\n`;
          content += `${'-'.repeat(30)}\n`;
          results.logicTrail.forEach((entry: any, index: number) => {
            content += `\n${index + 1}. ${entry.archetype}:\n${entry.contribution}\n`;
          });
        }

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      toast({
        title: "Export Successful",
        description: `Your insight has been exported as ${format.toUpperCase()} file.`,
      });

      onClose();
      
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your insight. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatIcons = {
    text: FileText,
    json: Database
  };

  const FormatIcon = formatIcons[format as keyof typeof formatIcons] || FileText;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Export Insight</span>
          </DialogTitle>
          <DialogDescription>
            Choose your export format and included content
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <Label className="text-sm font-semibold mb-2 block">Export Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue>
                  <div className="flex items-center space-x-2">
                    <FormatIcon className="w-4 h-4" />
                    <span className="capitalize">{format}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Text Report (.txt)</span>
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center space-x-2">
                    <Database className="w-4 h-4" />
                    <span>JSON Data (.json)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-semibold mb-3 block">Include Content</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="metrics"
                  checked={includeMetrics}
                  onCheckedChange={(checked) => setIncludeMetrics(checked === true)}
                />
                <Label htmlFor="metrics" className="text-sm">Analysis metrics & scores</Label>
              </div>
              {results.layers && (
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="layers"
                    checked={includeLayers}
                    onCheckedChange={(checked) => setIncludeLayers(checked === true)}
                  />
                  <Label htmlFor="layers" className="text-sm">Processing layers detail</Label>
                </div>
              )}
              {results.logicTrail && (
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="trail"
                    checked={includeTrail}
                    onCheckedChange={(checked) => setIncludeTrail(checked === true)}
                  />
                  <Label htmlFor="trail" className="text-sm">AI perspective trail</Label>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleExport} className="flex-1 bg-black text-white hover:bg-gray-800">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

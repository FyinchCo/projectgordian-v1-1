
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { OUTPUT_TYPE_CONFIGS } from "@/types/outputTypes";

interface CompressionSettings {
  length: string;
  includeTrail: boolean;
  includeFullTranscript: boolean;
  customInstructions: string;
}

interface CompressionTabProps {
  compressionSettings: CompressionSettings;
  onUpdateCompressionSettings: (field: string, value: any) => void;
  outputType?: string;
}

export const CompressionTab = ({ 
  compressionSettings, 
  onUpdateCompressionSettings,
  outputType = 'practical'
}: CompressionTabProps) => {
  const currentOutputConfig = OUTPUT_TYPE_CONFIGS.find(config => config.id === outputType);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">UNIFIED COMPRESSION SETTINGS</h2>
        <p className="text-gray-600">Compression style automatically matches your selected answer type with enhanced quality ratings</p>
      </div>

      <Card className="p-8 max-w-2xl mx-auto">
        <div className="space-y-6">
          <div>
            <Label className="text-base mb-3 block">Inherited Answer Type</Label>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="text-sm font-semibold">
                  {currentOutputConfig?.label || 'Practical'}
                </Badge>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Auto-Applied</span>
              </div>
              <p className="text-sm text-gray-700">
                {currentOutputConfig?.shortDescription || 'Immediate implementation steps and tactical wisdom for real-world action'}
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Compression instructions are automatically optimized based on your answer type selection
            </p>
          </div>

          <div>
            <Label className="text-base mb-3 block">Compression Length</Label>
            <Select
              value={compressionSettings.length}
              onValueChange={(value) => onUpdateCompressionSettings('length', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short & Sharp</SelectItem>
                <SelectItem value="medium">Balanced Depth</SelectItem>
                <SelectItem value="long">Extended Analysis</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 mt-2">
              Controls word limits: Short (15/40/80), Medium (20/60/120), Long (25/80/150)
            </p>
          </div>

          <div>
            <Label htmlFor="customInstructions" className="text-base mb-3 block">
              Custom Compression Instructions
            </Label>
            <Textarea
              id="customInstructions"
              placeholder="Override default compression with custom instructions. Example: 'Focus on paradoxes and contradictions' or 'Present as a series of provocative questions' or 'Use only metaphors from architecture'..."
              value={compressionSettings.customInstructions}
              onChange={(e) => onUpdateCompressionSettings('customInstructions', e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-sm text-gray-500 mt-2">
              Custom instructions will enhance the output-type-specific compression. Leave blank to use optimized defaults.
            </p>
          </div>

          <div className="space-y-4">
            <Label className="text-base">Additional Components</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeTrail"
                  checked={compressionSettings.includeTrail}
                  onChange={(e) => onUpdateCompressionSettings('includeTrail', e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="includeTrail" className="text-sm">Include archetypal reasoning trail</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeTranscript"
                  checked={compressionSettings.includeFullTranscript}
                  onChange={(e) => onUpdateCompressionSettings('includeFullTranscript', e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="includeTranscript" className="text-sm">Include full processing transcript</Label>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Enhanced Features</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Automatic insight strength rating (1-6 scale with justification)</li>
              <li>• Output-type-specific compression optimization</li>
              <li>• Post-compression reflection and evaluation</li>
              <li>• Enhanced distillation vs. summarization</li>
              <li>• Conceptual novelty and emotional resonance prioritization</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

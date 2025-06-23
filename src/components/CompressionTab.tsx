
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface CompressionSettings {
  style: string;
  length: string;
  includeTrail: boolean;
  includeFullTranscript: boolean;
  customInstructions: string;
}

interface CompressionTabProps {
  compressionSettings: CompressionSettings;
  onUpdateCompressionSettings: (field: string, value: any) => void;
}

export const CompressionTab = ({ compressionSettings, onUpdateCompressionSettings }: CompressionTabProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">COMPRESSION SETTINGS</h2>
        <p className="text-gray-600">Control how insights are synthesized and presented</p>
      </div>

      <Card className="p-8 max-w-2xl mx-auto">
        <div className="space-y-6">
          <div>
            <Label className="text-base mb-3 block">Compression Style</Label>
            <Select
              value={compressionSettings.style}
              onValueChange={(value) => onUpdateCompressionSettings('style', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aphorism">Aphorism</SelectItem>
                <SelectItem value="insight-summary">Insight Summary</SelectItem>
                <SelectItem value="philosophical-phrase">Philosophical Phrase</SelectItem>
                <SelectItem value="narrative-form">Narrative Form</SelectItem>
                <SelectItem value="custom">Custom Instructions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-base mb-3 block">Output Length</Label>
            <Select
              value={compressionSettings.length}
              onValueChange={(value) => onUpdateCompressionSettings('length', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short (1-2 sentences)</SelectItem>
                <SelectItem value="medium">Medium (1 paragraph)</SelectItem>
                <SelectItem value="poetic">Poetic (Extended metaphor)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="customInstructions" className="text-base mb-3 block">
              Custom Compression Instructions
            </Label>
            <Textarea
              id="customInstructions"
              placeholder="Enter custom instructions for how the compression agent should synthesize and present insights. For example: 'Focus on actionable implications' or 'Present as a series of questions' or 'Use metaphors from nature'..."
              value={compressionSettings.customInstructions}
              onChange={(e) => onUpdateCompressionSettings('customInstructions', e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-sm text-gray-500 mt-2">
              These instructions will override the default compression style when provided. Leave blank to use the selected compression style above.
            </p>
          </div>

          <div className="space-y-4">
            <Label className="text-base">Output Components</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeTrail"
                  checked={compressionSettings.includeTrail}
                  onChange={(e) => onUpdateCompressionSettings('includeTrail', e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="includeTrail" className="text-sm">Include logic trail</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeTranscript"
                  checked={compressionSettings.includeFullTranscript}
                  onChange={(e) => onUpdateCompressionSettings('includeFullTranscript', e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="includeTranscript" className="text-sm">Include full transcript</Label>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

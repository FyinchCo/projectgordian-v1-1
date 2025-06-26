
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
        <h2 className="text-2xl font-bold">ENHANCED COMPRESSION SETTINGS</h2>
        <p className="text-gray-600">Control how insights are distilled and synthesized with strength ratings</p>
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
                <SelectItem value="insight-summary">Enhanced Insight Summary</SelectItem>
                <SelectItem value="aphorism">Distilled Aphorism</SelectItem>
                <SelectItem value="philosophical-phrase">Philosophical Essence</SelectItem>
                <SelectItem value="narrative-form">Allegorical Truth</SelectItem>
                <SelectItem value="custom">Custom Instructions</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 mt-2">
              All styles now include insight strength ratings (1-6 scale) with justification
            </p>
          </div>

          <div>
            <Label className="text-base mb-3 block">Compression Depth</Label>
            <Select
              value={compressionSettings.length}
              onValueChange={(value) => onUpdateCompressionSettings('length', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Sharp & Concise</SelectItem>
                <SelectItem value="medium">Balanced Distillation</SelectItem>
                <SelectItem value="poetic">Extended Metaphor</SelectItem>
              </SelectContent>
            </Select>
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
              Custom instructions will override the selected style above. Leave blank to use enhanced defaults.
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
            <h4 className="font-semibold text-blue-900 mb-2">Enhancement Features</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Automatic insight strength rating (1-6 scale)</li>
              <li>• Enhanced distillation vs. summarization</li>
              <li>• Conceptual novelty prioritization</li>
              <li>• Emotional resonance optimization</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

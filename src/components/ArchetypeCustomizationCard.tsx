
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ArchetypeCustomizationCardProps {
  archetype: any;
  onUpdate: (id: number, field: string, value: any) => void;
  onRemove?: (id: number) => void;
  canRemove?: boolean;
}

export const ArchetypeCustomizationCard = ({ 
  archetype, 
  onUpdate, 
  onRemove, 
  canRemove = true 
}: ArchetypeCustomizationCardProps) => {
  const IconComponent = archetype.icon;

  return (
    <Card className="p-6 space-y-4 border-zen-light">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {IconComponent && <IconComponent className="w-5 h-5 text-zen-charcoal" />}
          <Input
            value={archetype.name}
            onChange={(e) => onUpdate(archetype.id, 'name', e.target.value)}
            className="font-semibold text-lg border-none p-0 focus:ring-0"
          />
        </div>
        {canRemove && onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(archetype.id)}
            className="text-red-600 hover:text-red-800 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-sm font-mono uppercase tracking-wide text-zen-charcoal">
            Description
          </Label>
          <Textarea
            value={archetype.description}
            onChange={(e) => onUpdate(archetype.id, 'description', e.target.value)}
            rows={2}
            className="border-zen-light focus:border-zen-medium"
          />
        </div>

        <div>
          <Label className="text-sm font-mono uppercase tracking-wide text-zen-charcoal">
            Custom Instructions
          </Label>
          <Textarea
            value={archetype.customInstructions || ''}
            onChange={(e) => onUpdate(archetype.id, 'customInstructions', e.target.value)}
            placeholder="Add specific instructions for how this archetype should behave, analyze, or respond..."
            rows={4}
            className="border-zen-light focus:border-zen-medium"
          />
          <p className="text-xs text-zen-body mt-1">
            These instructions will be added to the archetype's personality during processing.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-mono uppercase tracking-wide text-zen-charcoal">
              Language Style
            </Label>
            <Select 
              value={archetype.languageStyle} 
              onValueChange={(value) => onUpdate(archetype.id, 'languageStyle', value)}
            >
              <SelectTrigger className="border-zen-light">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="poetic">Poetic</SelectItem>
                <SelectItem value="logical">Logical</SelectItem>
                <SelectItem value="narrative">Narrative</SelectItem>
                <SelectItem value="blunt">Blunt</SelectItem>
                <SelectItem value="disruptive">Disruptive</SelectItem>
                <SelectItem value="analytical">Analytical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-mono uppercase tracking-wide text-zen-charcoal">
              Built-in Constraint
            </Label>
            <Textarea
              value={archetype.constraint}
              onChange={(e) => onUpdate(archetype.id, 'constraint', e.target.value)}
              rows={2}
              className="border-zen-light focus:border-zen-medium"
              placeholder="Optional behavioral constraint..."
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-mono uppercase tracking-wide text-zen-charcoal">
              Imagination: {archetype.imagination[0]}/10
            </Label>
            <Slider
              value={archetype.imagination}
              onValueChange={(value) => onUpdate(archetype.id, 'imagination', value)}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-sm font-mono uppercase tracking-wide text-zen-charcoal">
              Skepticism: {archetype.skepticism[0]}/10
            </Label>
            <Slider
              value={archetype.skepticism}
              onValueChange={(value) => onUpdate(archetype.id, 'skepticism', value)}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-mono uppercase tracking-wide text-zen-charcoal">
              Aggression: {archetype.aggression[0]}/10
            </Label>
            <Slider
              value={archetype.aggression}
              onValueChange={(value) => onUpdate(archetype.id, 'aggression', value)}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-sm font-mono uppercase tracking-wide text-zen-charcoal">
              Emotionality: {archetype.emotionality[0]}/10
            </Label>
            <Slider
              value={archetype.emotionality}
              onValueChange={(value) => onUpdate(archetype.id, 'emotionality', value)}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

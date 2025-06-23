
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface Archetype {
  id: number;
  name: string;
  description: string;
  languageStyle: string;
  imagination: number[];
  skepticism: number[];
  aggression: number[];
  emotionality: number[];
  icon: any;
  constraint: string;
}

interface ArchetypeCardProps {
  archetype: Archetype;
  onUpdate: (id: number, field: string, value: any) => void;
  onRemove: (id: number) => void;
  canRemove: boolean;
}

export const ArchetypeCard = ({ archetype, onUpdate, onRemove, canRemove }: ArchetypeCardProps) => {
  const IconComponent = archetype.icon;

  return (
    <Card className="p-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <IconComponent className="w-6 h-6" />
              <h3 className="text-lg font-bold">{archetype.name}</h3>
            </div>
            {canRemove && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onRemove(archetype.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor={`name-${archetype.id}`}>Name</Label>
              <Input
                id={`name-${archetype.id}`}
                value={archetype.name}
                onChange={(e) => onUpdate(archetype.id, 'name', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor={`description-${archetype.id}`}>Description</Label>
              <Textarea
                id={`description-${archetype.id}`}
                value={archetype.description}
                onChange={(e) => onUpdate(archetype.id, 'description', e.target.value)}
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor={`style-${archetype.id}`}>Language Style</Label>
              <Select
                value={archetype.languageStyle}
                onValueChange={(value) => onUpdate(archetype.id, 'languageStyle', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="poetic">Poetic</SelectItem>
                  <SelectItem value="logical">Logical</SelectItem>
                  <SelectItem value="narrative">Narrative</SelectItem>
                  <SelectItem value="disruptive">Disruptive</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="blunt">Blunt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Personality Sliders */}
        <div className="space-y-6">
          <h4 className="font-semibold text-sm uppercase tracking-wide">Personality Matrix</h4>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <Label>Imagination</Label>
                <span className="text-sm text-gray-500">{archetype.imagination[0]}/10</span>
              </div>
              <Slider
                value={archetype.imagination}
                onValueChange={(value) => onUpdate(archetype.id, 'imagination', value)}
                max={10}
                step={1}
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <Label>Skepticism</Label>
                <span className="text-sm text-gray-500">{archetype.skepticism[0]}/10</span>
              </div>
              <Slider
                value={archetype.skepticism}
                onValueChange={(value) => onUpdate(archetype.id, 'skepticism', value)}
                max={10}
                step={1}
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <Label>Aggression</Label>
                <span className="text-sm text-gray-500">{archetype.aggression[0]}/10</span>
              </div>
              <Slider
                value={archetype.aggression}
                onValueChange={(value) => onUpdate(archetype.id, 'aggression', value)}
                max={10}
                step={1}
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <Label>Emotionality</Label>
                <span className="text-sm text-gray-500">{archetype.emotionality[0]}/10</span>
              </div>
              <Slider
                value={archetype.emotionality}
                onValueChange={(value) => onUpdate(archetype.id, 'emotionality', value)}
                max={10}
                step={1}
              />
            </div>
          </div>

          <div>
            <Label htmlFor={`constraint-${archetype.id}`}>Additional Constraints</Label>
            <Textarea
              id={`constraint-${archetype.id}`}
              placeholder="Optional: Specific instructions or constraints for this archetype..."
              value={archetype.constraint}
              onChange={(e) => onUpdate(archetype.id, 'constraint', e.target.value)}
              rows={2}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

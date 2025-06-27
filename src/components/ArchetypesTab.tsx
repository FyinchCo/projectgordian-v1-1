
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ArchetypeCustomizationCard } from "./ArchetypeCustomizationCard";

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
  customInstructions: string;
}

interface ArchetypesTabProps {
  archetypes: Archetype[];
  onUpdateArchetype: (id: number, field: string, value: any) => void;
  onAddArchetype: () => void;
  onRemoveArchetype: (id: number) => void;
}

export const ArchetypesTab = ({ 
  archetypes, 
  onUpdateArchetype, 
  onAddArchetype, 
  onRemoveArchetype 
}: ArchetypesTabProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-mono uppercase tracking-wide text-zen-ink">Archetypal Agents</h2>
        <p className="text-sm text-zen-body">Configure the personality and behavior of each cognitive archetype</p>
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={onAddArchetype} 
          className="flex items-center space-x-2 bg-zen-ink text-zen-paper hover:bg-zen-charcoal"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Archetype</span>
        </Button>
      </div>

      <div className="grid gap-6">
        {archetypes.map((archetype) => (
          <ArchetypeCustomizationCard
            key={archetype.id}
            archetype={archetype}
            onUpdate={onUpdateArchetype}
            onRemove={onRemoveArchetype}
            canRemove={archetype.id > 5}
          />
        ))}
      </div>
    </div>
  );
};


import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ArchetypeCard } from "./ArchetypeCard";

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
        <h2 className="text-2xl font-bold">ARCHETYPAL AGENTS</h2>
        <p className="text-gray-600">Configure the personality and behavior of each cognitive archetype</p>
      </div>

      <div className="flex justify-center">
        <Button onClick={onAddArchetype} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Custom Archetype</span>
        </Button>
      </div>

      <div className="grid gap-6">
        {archetypes.map((archetype) => (
          <ArchetypeCard
            key={archetype.id}
            archetype={archetype}
            onUpdate={onUpdateArchetype}
            onRemove={onRemoveArchetype}
            canRemove={archetype.id > 6}
          />
        ))}
      </div>
    </div>
  );
};

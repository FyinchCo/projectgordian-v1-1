import { useState, useEffect } from "react";
import { Eye, Shield, Sparkles, Zap, Hammer, Plus, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const defaultArchetypes: Archetype[] = [
  {
    id: 1,
    name: "The Visionary",
    description: "Poetic dreamer of radical futures. Imagination-driven.",
    languageStyle: "poetic",
    imagination: [9],
    skepticism: [1],
    aggression: [2],
    emotionality: [8],
    icon: Eye,
    constraint: ""
  },
  {
    id: 2,
    name: "The Mystic",
    description: "Symbolic, paradox-driven explorer of the unseen.",
    languageStyle: "narrative",
    imagination: [8],
    skepticism: [3],
    aggression: [1],
    emotionality: [10],
    icon: Sparkles,
    constraint: ""
  },
  {
    id: 3,
    name: "The Skeptic",
    description: "Evidence-driven challenger of all assumptions.",
    languageStyle: "logical",
    imagination: [3],
    skepticism: [10],
    aggression: [5],
    emotionality: [1],
    icon: Shield,
    constraint: ""
  },
  {
    id: 4,
    name: "The Realist",
    description: "Cynical pragmatist who believes comfort > authenticity.",
    languageStyle: "blunt",
    imagination: [2],
    skepticism: [7],
    aggression: [8],
    emotionality: [2],
    icon: AlertCircle,
    constraint: "Assume people are not capable of true authenticity, and that ambition is a coping strategy for mortality."
  },
  {
    id: 5,
    name: "The Contrarian",
    description: "Ruthless challenger of consensus, seeks inversion.",
    languageStyle: "disruptive",
    imagination: [6],
    skepticism: [6],
    aggression: [9],
    emotionality: [3],
    icon: Zap,
    constraint: ""
  }
];

export const useArchetypes = () => {
  const { toast } = useToast();
  const [archetypes, setArchetypes] = useState<Archetype[]>(defaultArchetypes);

  useEffect(() => {
    const savedArchetypes = localStorage.getItem('genius-machine-archetypes');
    if (savedArchetypes) {
      setArchetypes(JSON.parse(savedArchetypes));
    }
  }, []);

  const updateArchetype = (id: number, field: string, value: any) => {
    setArchetypes(prev => prev.map(archetype => 
      archetype.id === id ? { ...archetype, [field]: value } : archetype
    ));
  };

  const addCustomArchetype = () => {
    const newId = Math.max(...archetypes.map(a => a.id)) + 1;
    const newArchetype: Archetype = {
      id: newId,
      name: "Custom Archetype",
      description: "A new archetype with custom behavior",
      languageStyle: "logical",
      imagination: [5],
      skepticism: [5],
      aggression: [5],
      emotionality: [5],
      icon: Plus,
      constraint: ""
    };
    setArchetypes(prev => [...prev, newArchetype]);
  };

  const removeArchetype = (id: number) => {
    if (archetypes.length <= 2) {
      toast({
        title: "Cannot Remove",
        description: "You must have at least 2 archetypes for meaningful analysis.",
        variant: "destructive"
      });
      return;
    }
    setArchetypes(prev => prev.filter(archetype => archetype.id !== id));
  };

  return {
    archetypes,
    updateArchetype,
    addCustomArchetype,
    removeArchetype
  };
};

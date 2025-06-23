
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
    description: "Sees beyond current limitations and imagines radical possibilities",
    languageStyle: "poetic",
    imagination: [9],
    skepticism: [2],
    aggression: [3],
    emotionality: [7],
    icon: Eye,
    constraint: ""
  },
  {
    id: 2,
    name: "The Skeptic",
    description: "Questions assumptions and demands rigorous validation",
    languageStyle: "logical",
    imagination: [4],
    skepticism: [9],
    aggression: [6],
    emotionality: [2],
    icon: Shield,
    constraint: ""
  },
  {
    id: 3,
    name: "The Mystic",
    description: "Recognizes patterns and connections beyond rational analysis",
    languageStyle: "narrative",
    imagination: [8],
    skepticism: [3],
    aggression: [2],
    emotionality: [9],
    icon: Sparkles,
    constraint: ""
  },
  {
    id: 4,
    name: "The Contrarian",
    description: "Challenges consensus and reveals hidden contradictions",
    languageStyle: "disruptive",
    imagination: [6],
    skepticism: [7],
    aggression: [9],
    emotionality: [5],
    icon: Zap,
    constraint: ""
  },
  {
    id: 5,
    name: "The Craftsman",
    description: "Grounds ideas in practical application and iterative refinement",
    languageStyle: "logical",
    imagination: [5],
    skepticism: [6],
    aggression: [4],
    emotionality: [4],
    icon: Hammer,
    constraint: ""
  },
  {
    id: 6,
    name: "The Realist",
    description: "Exposes uncomfortable truths and challenges idealistic assumptions",
    languageStyle: "blunt",
    imagination: [2],
    skepticism: [6],
    aggression: [7],
    emotionality: [3],
    icon: AlertCircle,
    constraint: "Assume people are not capable of true authenticity, and that ambition is a coping strategy for mortality."
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

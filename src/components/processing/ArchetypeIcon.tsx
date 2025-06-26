
import { getArchetypeIcon } from "./archetypeConfig";

interface ArchetypeIconProps {
  archetype: string;
  isActive: boolean;
  isCompleted: boolean;
}

export const ArchetypeIcon = ({ archetype, isActive, isCompleted }: ArchetypeIconProps) => {
  const Icon = getArchetypeIcon(archetype);
  
  return (
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
      isActive ? "bg-white bg-opacity-80" : isCompleted ? "bg-green-100" : "bg-gray-200"
    }`}>
      <Icon className={`w-5 h-5 ${isActive ? "animate-pulse" : ""}`} />
    </div>
  );
};

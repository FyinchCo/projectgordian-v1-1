
import { Card } from "@/components/ui/card";

interface ArchetypeContributionBarsProps {
  currentArchetype: string;
  currentLayer: number;
}

export const ArchetypeContributionBars = ({ currentArchetype, currentLayer }: ArchetypeContributionBarsProps) => {
  // Define the archetypes in order
  const archetypes = [
    "The Visionary",
    "The Mystic", 
    "The Skeptic",
    "The Realist",
    "The Contrarian"
  ];

  // Calculate contribution weights (simulated based on layer progress)
  const getContributionWeight = (archetype: string) => {
    const baseWeight = Math.random() * 0.4 + 0.3; // 30-70% base
    const activeBonus = archetype === currentArchetype ? 0.3 : 0;
    const layerFactor = (currentLayer / 20) * 0.2; // Increase with depth
    return Math.min(1, baseWeight + activeBonus + layerFactor);
  };

  return (
    <Card className="p-6 bg-white border border-gray-200">
      <div className="space-y-4">
        <h3 className="text-sm font-mono text-gray-600 uppercase tracking-wider text-center">
          Archetype Contributions
        </h3>
        
        <div className="flex items-end justify-center space-x-4 h-32">
          {archetypes.map((archetype) => {
            const weight = getContributionWeight(archetype);
            const isActive = archetype === currentArchetype;
            const height = Math.max(12, weight * 100); // 12px minimum height
            
            return (
              <div key={archetype} className="flex flex-col items-center space-y-2">
                <div className="flex flex-col items-center justify-end h-24">
                  <div 
                    className={`w-8 rounded-sm transition-all duration-500 ${
                      isActive ? 'bg-black animate-pulse' : 'bg-gray-300'
                    }`}
                    style={{ height: `${height}px` }}
                  ></div>
                </div>
                <div className={`text-xs font-inter text-center max-w-16 leading-tight ${
                  isActive ? 'text-black font-semibold' : 'text-gray-500'
                }`}>
                  {archetype.replace("The ", "")}
                </div>
                <div className="text-xs font-mono text-gray-400">
                  {Math.round(weight * 100)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

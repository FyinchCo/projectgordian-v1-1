
import { Card } from "@/components/ui/card";
import { ArchetypeThoughtBubble } from "./ArchetypeThoughtBubble";
import { getProcessingInsights } from "./processingInsights";

interface EnhancedArchetypeGridProps {
  currentArchetype: string;
  currentLayer: number;
}

export const EnhancedArchetypeGrid = ({ currentArchetype, currentLayer }: EnhancedArchetypeGridProps) => {
  const archetypes = ["The Visionary", "The Mystic", "The Skeptic", "The Realist", "The Contrarian"];
  
  const getArchetypeStatus = (archetype: string) => {
    if (archetype === currentArchetype) return "active";
    const currentIndex = archetypes.indexOf(currentArchetype);
    const archetypeIndex = archetypes.indexOf(archetype);
    return archetypeIndex < currentIndex ? "completed" : "pending";
  };

  return (
    <div className="space-y-8">
      {/* Elegant Archetype Row */}
      <div className="grid grid-cols-5 gap-6 max-w-5xl mx-auto">
        {archetypes.map((archetype, index) => {
          const status = getArchetypeStatus(archetype);
          const isActive = status === "active";
          const isCompleted = status === "completed";
          const confidence = isCompleted ? Math.floor(Math.random() * 20) + 80 : 0;
          
          return (
            <Card key={archetype} className={`p-6 text-center transition-all duration-500 ${
              isActive ? 'border-2 border-black bg-gray-50' : 
              isCompleted ? 'border border-gray-300 bg-white' : 
              'border border-gray-200 bg-gray-50 opacity-60'
            }`}>
              <div className="space-y-3">
                {/* Archetype Icon */}
                <div className={`w-12 h-12 mx-auto rounded-full border-2 flex items-center justify-center ${
                  isActive ? 'border-black bg-white' :
                  isCompleted ? 'border-gray-400 bg-gray-100' :
                  'border-gray-300 bg-gray-100'
                }`}>
                  <div className={`w-6 h-6 rounded-full ${
                    isActive ? 'bg-black animate-pulse' :
                    isCompleted ? 'bg-gray-400' :
                    'bg-gray-300'
                  }`}></div>
                </div>

                {/* Archetype Name */}
                <div>
                  <h3 className={`font-cormorant text-lg font-normal ${
                    isActive ? 'text-black' : 'text-gray-600'
                  }`}>
                    {archetype.replace("The ", "")}
                  </h3>
                  {isCompleted && (
                    <div className="text-xs font-mono text-gray-500 mt-1">
                      {confidence}% confidence
                    </div>
                  )}
                </div>

                {/* Status Indicator */}
                <div className="space-y-2">
                  {isActive && (
                    <div className="text-xs text-gray-600 font-inter italic">
                      Exploring pattern divergence...
                    </div>
                  )}
                  {isCompleted && (
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-mono">
                      Complete
                    </div>
                  )}
                  {!isActive && !isCompleted && (
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-mono">
                      Pending
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Active Archetype Detailed View */}
      {currentArchetype && (
        <div className="max-w-4xl mx-auto">
          <ArchetypeThoughtBubble
            archetype={currentArchetype}
            isActive={true}
            isCompleted={false}
            processingInsights={getProcessingInsights(currentArchetype)}
          />
        </div>
      )}
    </div>
  );
};

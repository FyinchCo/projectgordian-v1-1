
import { Brain, Settings } from "lucide-react";
import { PixelRobot } from "./PixelRobot";

interface Archetype {
  name: string;
  description: string;
  languageStyle: string;
  imagination: number[];
  skepticism: number[];
  aggression: number[];
  emotionality: number[];
  constraint: string;
}

interface HeaderProps {
  customArchetypes?: Archetype[] | null;
  enhancedMode: boolean;
}

export const Header = ({
  customArchetypes,
  enhancedMode
}: HeaderProps) => {
  return (
    <header className="border-b border-zen-light bg-zen-paper backdrop-blur-sm sticky top-0 z-50 shadow-zen">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <PixelRobot 
              size={32} 
              mood="happy" 
              className="opacity-80"
            />
            <div>
              <h1 className="text-zen-heading text-2xl font-light text-zen-ink tracking-tight">
                GENIUS MACHINE
              </h1>
              <p className="text-zen-mono text-xs text-zen-medium">
                Multi-Perspective Intelligence
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {customArchetypes && (
              <div className="bg-zen-whisper border border-zen-light px-3 py-1 rounded">
                <span className="text-zen-mono text-xs text-zen-charcoal">
                  {customArchetypes.length} Custom Archetypes
                </span>
              </div>
            )}
            {enhancedMode && (
              <div className="bg-zen-whisper border border-zen-light px-3 py-1 rounded">
                <span className="text-zen-mono text-xs text-zen-charcoal">
                  Enhanced Mode
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

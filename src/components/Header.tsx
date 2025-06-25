
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
    <header className="border-b-2 border-gray-800 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 backdrop-blur-sm sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <PixelRobot 
              size={48} 
              mood="happy" 
              animate={true}
              className="hover:scale-110 transition-transform duration-200"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                GENIUS MACHINE
              </h1>
              <p className="text-sm text-gray-600 font-mono">
                Your Friendly AI Breakthrough Companion
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {customArchetypes && (
              <div className="bg-green-100 border-2 border-green-400 px-3 py-1 rounded-lg">
                <span className="text-xs font-mono text-green-800 uppercase tracking-wide">
                  {customArchetypes.length} Custom Archetypes Active
                </span>
              </div>
            )}
            {enhancedMode && (
              <div className="bg-purple-100 border-2 border-purple-400 px-3 py-1 rounded-lg">
                <span className="text-xs font-mono text-purple-800 uppercase tracking-wide">
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

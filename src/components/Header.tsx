
import { Brain, Settings, TestTube } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  onToggleSelfTesting?: () => void;
  showSelfTestingToggle?: boolean;
}

export const Header = ({ 
  customArchetypes, 
  enhancedMode,
  onToggleSelfTesting,
  showSelfTestingToggle = false
}: HeaderProps) => {
  return (
    <header className="border-b border-zen-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="px-zen-lg py-zen-md max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-zen-primary" />
            <div>
              <h1 className="text-xl font-bold text-zen-text">Project Gordian</h1>
              <p className="text-xs text-zen-muted">
                Enhanced AI Dialectical Processing Engine
                {customArchetypes && ` • ${customArchetypes.length} Custom Archetypes`}
                {enhancedMode && ' • Enhanced Mode Active'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {showSelfTestingToggle && onToggleSelfTesting && (
              <Button
                onClick={onToggleSelfTesting}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <TestTube className="w-4 h-4" />
                <span>Self-Testing</span>
              </Button>
            )}
            
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4 text-zen-muted" />
              <span className="text-xs text-zen-muted">v2.1.0</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

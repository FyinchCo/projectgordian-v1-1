
import { Button } from "@/components/ui/button";
import { Play, Zap } from "lucide-react";

interface LaunchSectionProps {
  question: string;
  onStartGenius: () => void;
}

export const LaunchSection = ({ question, onStartGenius }: LaunchSectionProps) => {
  return (
    <div className="pt-8 border-t border-zen-light">
      <Button 
        onClick={onStartGenius} 
        disabled={!question.trim()} 
        size="lg" 
        className="w-full bg-zen-ink hover:bg-zen-charcoal text-zen-paper border-0 px-8 py-6 rounded-lg shadow-zen-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center justify-center space-x-3 text-zen-mono uppercase tracking-wide font-light">
          <Play className="w-5 h-5" />
          <span>Start Genius Machine</span>
          <Zap className="w-5 h-5" />
        </div>
      </Button>
    </div>
  );
};

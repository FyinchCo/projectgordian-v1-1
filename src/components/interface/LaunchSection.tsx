
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface LaunchSectionProps {
  question: string;
  onStartGenius: () => void;
}

export const LaunchSection = ({ question, onStartGenius }: LaunchSectionProps) => {
  return (
    <div className="text-center space-y-4">
      <p className="text-zen-body text-sm text-zen-medium">
        Ready to begin multi-perspective analysis
      </p>
      <Button 
        onClick={onStartGenius}
        disabled={!question.trim()}
        size="lg"
        className="bg-zen-ink hover:bg-zen-charcoal text-zen-paper flex items-center justify-center space-x-3 font-light text-lg shadow-zen hover:shadow-zen-lg transition-all duration-300 border-0 px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>Begin Analysis</span>
        <ArrowRight className="w-5 h-5" />
      </Button>
    </div>
  );
};


import { Button } from "@/components/ui/button";
import { Play, Zap } from "lucide-react";

interface LaunchSectionProps {
  question: string;
  onStartGenius: () => void;
}

export const LaunchSection = ({ question, onStartGenius }: LaunchSectionProps) => {
  return (
    <Button 
      onClick={onStartGenius}
      disabled={!question.trim()}
      size="lg"
      className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white flex items-center justify-center space-x-3 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 border-0 px-8 py-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Play className="w-6 h-6" />
      <span>Let's Think Together!</span>
      <Zap className="w-6 h-6" />
    </Button>
  );
};

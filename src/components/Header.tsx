
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { KnotIcon } from "./KnotIcon";

interface HeaderProps {
  customArchetypes: any;
  enhancedMode: boolean;
}

export const Header = ({ customArchetypes, enhancedMode }: HeaderProps) => {
  return (
    <header className="border-b border-zen-light bg-zen-paper px-8 py-12">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <KnotIcon className="text-zen-ink" size={40} animate />
          <div className="space-y-2">
            <h1 className="text-3xl text-zen-heading text-zen-ink tracking-tight">
              PROJECT GORDIAN
            </h1>
            <div className="flex items-center space-x-4">
              <p className="text-xs text-zen-mono text-zen-medium tracking-wider uppercase">
                AI's Recursive Distillation of a Knot
              </p>
              {customArchetypes && (
                <span className="px-3 py-1 bg-zen-whisper text-zen-ink text-xs text-zen-mono uppercase tracking-wide rounded-sm">
                  Custom Config
                </span>
              )}
            </div>
          </div>
        </div>
        <Link to="/config">
          <Button 
            size="lg"
            className="bg-zen-ink hover:bg-zen-charcoal text-zen-paper flex items-center space-x-3 text-zen-mono uppercase tracking-wide transition-all duration-300 px-6 py-3 rounded-md shadow-zen-lg"
          >
            <Settings className="w-5 h-5" />
            <span>AI Configuration</span>
          </Button>
        </Link>
      </div>
    </header>
  );
};


import { Brain, Settings, TrendingUp, History } from "lucide-react";
import { Link } from "react-router-dom";
import { KnotIcon } from "@/components/KnotIcon";

interface HeaderProps {
  customArchetypes: any;
  enhancedMode: boolean;
}

export const Header = ({ customArchetypes, enhancedMode }: HeaderProps) => {
  return (
    <header className="border-b border-zen-light bg-zen-paper px-8 py-12">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/">
            <KnotIcon className="text-zen-ink" size={40} animate />
          </Link>
          <div className="space-y-2">
            <Link to="/">
              <h1 className="text-3xl text-zen-heading text-zen-ink tracking-tight hover:text-zen-medium transition-colors">
                PROJECT GORDIAN
              </h1>
            </Link>
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
        
        <nav className="flex items-center space-x-6">
          <Link 
            to="/insights-history" 
            className="flex items-center space-x-2 text-zen-medium hover:text-zen-ink transition-colors"
          >
            <History className="w-5 h-5" />
            <span className="text-sm font-medium">History</span>
          </Link>
          <Link 
            to="/config" 
            className="flex items-center space-x-2 text-zen-medium hover:text-zen-ink transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm font-medium">Config</span>
          </Link>
          <Link 
            to="/learning-analytics" 
            className="flex items-center space-x-2 text-zen-medium hover:text-zen-ink transition-colors"
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Analytics</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};


import { Brain, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface HeaderProps {
  customArchetypes: any;
  enhancedMode: boolean;
}

export const Header = ({ customArchetypes, enhancedMode }: HeaderProps) => {
  return (
    <header className="border-b border-gray-200 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">PROJECT GORDIAN</h1>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Multi-Agent Intelligence System
              {customArchetypes && (
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                  Custom Config
                </span>
              )}
              {enhancedMode && (
                <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs">
                  Enhanced Mode
                </span>
              )}
            </p>
          </div>
        </div>
        <Link to="/config">
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Configure</span>
          </Button>
        </Link>
      </div>
    </header>
  );
};

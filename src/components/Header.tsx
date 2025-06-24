
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
    <header className="border-b-4 border-mono-pure-black bg-mono-pure-white px-6 py-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <KnotIcon className="text-mono-pure-black" size={48} animate />
          <div>
            <h1 className="text-4xl font-cormorant font-bold tracking-tight text-mono-pure-black uppercase">
              PROJECT GORDIAN
            </h1>
            <p className="text-sm text-mono-dark-gray font-mono tracking-widest uppercase mt-1">
              AI's Recursive Distillation of a Knot
              {customArchetypes && (
                <span className="ml-4 px-2 py-1 bg-mono-pure-black text-mono-pure-white text-xs font-mono uppercase">
                  Custom Config
                </span>
              )}
            </p>
          </div>
        </div>
        <Link to="/config">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center space-x-2 border-2 border-mono-pure-black text-mono-pure-black hover:bg-mono-pure-black hover:text-mono-pure-white font-mono uppercase tracking-wide transition-all duration-200"
          >
            <Settings className="w-4 h-4" />
            <span>Configure</span>
          </Button>
        </Link>
      </div>
    </header>
  );
};

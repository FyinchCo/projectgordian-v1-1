
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
    <header className="border-b border-gordian-beige bg-gordian-cream px-6 py-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <KnotIcon className="text-gordian-dark-brown" size={40} animate />
          <div>
            <h1 className="text-3xl font-playfair font-bold tracking-tight text-gordian-dark-brown">
              PROJECT GORDIAN
            </h1>
            <p className="text-sm text-gordian-brown font-inter tracking-wide">
              AI's Recursive Distillation of a Knot
              {customArchetypes && (
                <span className="ml-3 px-2 py-1 bg-gordian-gold/20 text-gordian-dark-brown rounded-full text-xs font-medium">
                  Custom Config
                </span>
              )}
              {enhancedMode && (
                <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                  Enhanced Mode
                </span>
              )}
            </p>
          </div>
        </div>
        <Link to="/config">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center space-x-2 border-gordian-brown text-gordian-dark-brown hover:bg-gordian-beige font-inter"
          >
            <Settings className="w-4 h-4" />
            <span>Configure</span>
          </Button>
        </Link>
      </div>
    </header>
  );
};

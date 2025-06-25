
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { KnotIcon } from "./KnotIcon";
import { 
  Home, 
  Settings, 
  History, 
  TestTube, 
  TrendingUp, 
  DollarSign,
  Menu,
  X
} from "lucide-react";

export const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/config", label: "Config", icon: Settings },
    { path: "/insights", label: "History", icon: History },
    { path: "/testing", label: "Testing", icon: TestTube },
    { path: "/market-testing", label: "Market Testing", icon: DollarSign },
    { path: "/analytics", label: "Analytics", icon: TrendingUp },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <KnotIcon className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              PROJECT GORDIAN
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 transition-colors hover:text-foreground/80 ${
                    location.pathname === item.path
                      ? "text-foreground"
                      : "text-foreground/60"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          onClick={toggleMobileMenu}
        >
          <KnotIcon className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <span className="font-bold text-sm md:hidden">PROJECT GORDIAN</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="border-b md:hidden">
          <nav className="flex flex-col space-y-3 px-4 py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 transition-colors hover:text-foreground/80 ${
                    location.pathname === item.path
                      ? "text-foreground"
                      : "text-foreground/60"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

import { Brain, Settings } from "lucide-react";
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
}
export const Header = ({
  customArchetypes,
  enhancedMode
}: HeaderProps) => {
  return <header className="border-b border-zen-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      
    </header>;
};
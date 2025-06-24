
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
      </div>
    </header>
  );
};

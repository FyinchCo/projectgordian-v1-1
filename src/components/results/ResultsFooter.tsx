
import { ActionButtons } from "./ActionButtons";

interface ResultsFooterProps {
  onReset: () => void;
  onExport: () => void;
}

export const ResultsFooter = ({ onReset, onExport }: ResultsFooterProps) => {
  return (
    <div className="pt-4">
      <ActionButtons onReset={onReset} onExport={onExport} />
    </div>
  );
};

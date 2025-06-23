
import { EnhancedResultsDisplay } from "@/components/EnhancedResultsDisplay";
import { ExportModal } from "@/components/ExportModal";

interface ResultsSectionProps {
  results: any;
  question: string;
  onReset: () => void;
  onExport: () => void;
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
}

export const ResultsSection = ({ 
  results, 
  question, 
  onReset, 
  onExport, 
  isExportModalOpen, 
  setIsExportModalOpen 
}: ResultsSectionProps) => {
  return (
    <>
      <EnhancedResultsDisplay 
        results={results}
        question={question}
        onReset={onReset}
        onExport={onExport}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        results={results}
        question={question}
      />
    </>
  );
};

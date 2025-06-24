
import { useState } from "react";
import { EnhancedResultsDisplay } from "@/components/EnhancedResultsDisplay";
import { ExportModal } from "@/components/ExportModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save, CheckCircle } from "lucide-react";
import { insightsHistoryService } from "@/services/insightsHistoryService";
import { useToast } from "@/hooks/use-toast";

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
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSaveToHistory = async () => {
    if (isSaved || isSaving) return;
    
    setIsSaving(true);
    try {
      const savedId = await insightsHistoryService.saveInsight(question, results);
      if (savedId) {
        setIsSaved(true);
        toast({
          title: "Insight Saved",
          description: "Your insight has been saved to history for future reference.",
        });
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save insight to history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Save to History Card */}
      <Card className="p-4 bg-blue-50 border border-blue-200 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              {isSaved ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Save className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">
                {isSaved ? "Insight Saved!" : "Save This Insight"}
              </h3>
              <p className="text-sm text-blue-700">
                {isSaved 
                  ? "This insight is now available in your history." 
                  : "Add this insight to your personal collection for future reference."
                }
              </p>
            </div>
          </div>
          {!isSaved && (
            <Button
              onClick={handleSaveToHistory}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          )}
        </div>
      </Card>

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


import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface ProcessingDepthWarningProps {
  depth: number;
}

export const ProcessingDepthWarning = ({ depth }: ProcessingDepthWarningProps) => {
  if (depth < 8) return null;

  return (
    <Alert className="border-yellow-200 bg-yellow-50">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="text-yellow-800">
        <strong>High Processing Depth:</strong> {depth} layers may timeout or take several minutes. 
        Consider using 5-7 layers for optimal reliability and speed.
      </AlertDescription>
    </Alert>
  );
};

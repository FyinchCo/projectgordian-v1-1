
import { Brain } from "lucide-react";

export const EngineHeader = () => {
  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center space-x-3">
        <Brain className="w-8 h-8 text-blue-600" />
        <h1 className="text-4xl font-bold text-gray-900">Genius Engine</h1>
        <Brain className="w-8 h-8 text-blue-600" />
      </div>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Revolutionary chunked processing enables unlimited depth analysis. Each layer builds exponentially toward breakthrough insights.
      </p>
    </div>
  );
};

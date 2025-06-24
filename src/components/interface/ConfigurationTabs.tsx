
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Settings } from "lucide-react";
import { AIOptimizeTab } from "./AIOptimizeTab";
import { ManualSetupTab } from "./ManualSetupTab";

interface ConfigurationTabsProps {
  configMode: "ai" | "manual";
  setConfigMode: (mode: "ai" | "manual") => void;
  question: string;
  isAssessing: boolean;
  currentAssessment: any;
  onAIOptimize: () => void;
  processingDepth: number[];
  setProcessingDepth: (depth: number[]) => void;
  circuitType: string;
  setCircuitType: (type: string) => void;
  enhancedMode: boolean;
  setEnhancedMode: (enabled: boolean) => void;
  customArchetypes: any;
}

export const ConfigurationTabs = ({
  configMode,
  setConfigMode,
  question,
  isAssessing,
  currentAssessment,
  onAIOptimize,
  processingDepth,
  setProcessingDepth,
  circuitType,
  setCircuitType,
  enhancedMode,
  setEnhancedMode,
  customArchetypes
}: ConfigurationTabsProps) => {
  return (
    <div className="border-t-2 border-mono-pure-black pt-4">
      <Tabs value={configMode} onValueChange={(value) => setConfigMode(value as "ai" | "manual")}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="ai" className="flex items-center space-x-2 text-sm">
            <Brain className="w-3 h-3" />
            <span>AI Optimize</span>
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center space-x-2 text-sm">
            <Settings className="w-3 h-3" />
            <span>Manual Setup</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai" className="space-y-4">
          <AIOptimizeTab
            question={question}
            isAssessing={isAssessing}
            currentAssessment={currentAssessment}
            onAIOptimize={onAIOptimize}
          />
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <ManualSetupTab
            processingDepth={processingDepth}
            setProcessingDepth={setProcessingDepth}
            circuitType={circuitType}
            setCircuitType={setCircuitType}
            enhancedMode={enhancedMode}
            setEnhancedMode={setEnhancedMode}
            customArchetypes={customArchetypes}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

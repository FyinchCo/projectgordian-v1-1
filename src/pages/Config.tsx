
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Brain, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useArchetypes } from "@/hooks/useArchetypes";
import { useAIConfigOptimization } from "@/hooks/useAIConfigOptimization";
import { useOutputType } from "@/hooks/useOutputType";
import { ArchetypesTab } from "@/components/ArchetypesTab";
import { TensionTab } from "@/components/TensionTab";
import { CompressionTab } from "@/components/CompressionTab";
import { OptimizationReasoningCard } from "@/components/OptimizationReasoningCard";

const Config = () => {
  const { toast } = useToast();
  const { archetypes, updateArchetype, addCustomArchetype, removeArchetype } = useArchetypes();
  const { 
    optimizeAndApplyConfiguration, 
    isAssessing, 
    optimizationReasoning, 
    clearOptimizationReasoning 
  } = useAIConfigOptimization();
  const { outputType } = useOutputType('practical');
  
  const [question, setQuestion] = useState("");
  const [tensionSettings, setTensionSettings] = useState({
    contradictionThreshold: [5],
    recursionDepth: [3],
    archetypeOverlap: [2]
  });

  const [compressionSettings, setCompressionSettings] = useState({
    style: "insight-summary",
    length: "medium",
    includeTrail: true,
    includeFullTranscript: false,
    customInstructions: ""
  });

  // Load saved configuration on mount
  useEffect(() => {
    const savedTension = localStorage.getItem('genius-machine-tension');
    if (savedTension) {
      setTensionSettings(JSON.parse(savedTension));
    }

    const savedCompression = localStorage.getItem('genius-machine-compression');
    if (savedCompression) {
      setCompressionSettings(JSON.parse(savedCompression));
    }
  }, []);

  const updateTensionSettings = (field: string, value: number[]) => {
    setTensionSettings(prev => ({ ...prev, [field]: value }));
  };

  const updateCompressionSettings = (field: string, value: any) => {
    setCompressionSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleAIOptimization = async () => {
    await optimizeAndApplyConfiguration(
      question,
      updateArchetype,
      updateTensionSettings,
      updateCompressionSettings
    );
    
    // Auto-save after AI optimization
    saveConfiguration();
  };

  const saveConfiguration = () => {
    // Save to localStorage for rapid prototyping
    localStorage.setItem('genius-machine-archetypes', JSON.stringify(archetypes));
    localStorage.setItem('genius-machine-tension', JSON.stringify(tensionSettings));
    localStorage.setItem('genius-machine-compression', JSON.stringify(compressionSettings));
    
    toast({
      title: "Configuration Saved",
      description: "Your archetype configuration has been saved for this session.",
    });
  };

  const resetToDefaults = () => {
    localStorage.removeItem('genius-machine-archetypes');
    localStorage.removeItem('genius-machine-tension');
    localStorage.removeItem('genius-machine-compression');
    clearOptimizationReasoning(); // Clear the reasoning when resetting
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-zen-paper">
      {/* Header */}
      <header className="border-b border-zen-light px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-zen-charcoal hover:text-zen-ink hover:bg-zen-whisper">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl text-zen-heading text-zen-ink tracking-tight">SYSTEM CONFIGURATION</h1>
              <p className="text-xs text-zen-mono text-zen-medium uppercase tracking-wide">Customize Agent Behavior</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={resetToDefaults}
              className="border-zen-light text-zen-charcoal hover:bg-zen-whisper"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button 
              className="bg-zen-ink text-zen-paper hover:bg-zen-charcoal" 
              onClick={saveConfiguration}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-zen">
        {/* Optimization Reasoning Display - Shows if optimization was done from main page */}
        {optimizationReasoning && (
          <div className="mb-6">
            <OptimizationReasoningCard
              reasoning={optimizationReasoning.reasoning}
              domainType={optimizationReasoning.domainType}
              onDismiss={clearOptimizationReasoning}
            />
          </div>
        )}

        {/* AI Optimization Section - Only show if no existing optimization */}
        {!optimizationReasoning && (
          <div className="p-6 bg-zen-whisper rounded-md border border-zen-light mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-zen-charcoal" />
                <h3 className="text-zen-mono text-sm uppercase tracking-wide text-zen-ink">AI Configuration Optimizer</h3>
              </div>
              <p className="text-sm text-zen-body text-zen-charcoal leading-relaxed">
                Enter a question to automatically optimize all archetype personalities, tension detection, and compression settings for the highest quality analysis.
              </p>
              
              <Textarea
                placeholder="Enter your question here to optimize configuration settings..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={3}
                className="w-full border-zen-light focus:border-zen-medium bg-zen-paper"
              />
              
              <Button
                onClick={handleAIOptimization}
                disabled={!question.trim() || isAssessing}
                className="bg-zen-ink hover:bg-zen-charcoal text-zen-paper text-zen-mono uppercase tracking-wide"
              >
                {isAssessing ? (
                  <>
                    <Brain className="w-4 h-4 mr-2 animate-pulse" />
                    Optimizing & Applying...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Optimize All Settings
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        <Tabs defaultValue="archetypes" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-zen-whisper border border-zen-light">
            <TabsTrigger value="archetypes" className="text-zen-mono">Archetypes</TabsTrigger>
            <TabsTrigger value="tension" className="text-zen-mono">Tension Detection</TabsTrigger>
            <TabsTrigger value="compression" className="text-zen-mono">Compression</TabsTrigger>
          </TabsList>

          <TabsContent value="archetypes">
            <ArchetypesTab
              archetypes={archetypes}
              onUpdateArchetype={updateArchetype}
              onAddArchetype={addCustomArchetype}
              onRemoveArchetype={removeArchetype}
            />
          </TabsContent>

          <TabsContent value="tension">
            <TensionTab
              tensionSettings={tensionSettings}
              onUpdateTensionSettings={updateTensionSettings}
            />
          </TabsContent>

          <TabsContent value="compression">
            <CompressionTab
              compressionSettings={compressionSettings}
              onUpdateCompressionSettings={updateCompressionSettings}
              outputType={outputType}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Config;

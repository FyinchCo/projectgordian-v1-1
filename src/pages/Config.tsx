
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useArchetypes } from "@/hooks/useArchetypes";
import { ArchetypesTab } from "@/components/ArchetypesTab";
import { TensionTab } from "@/components/TensionTab";
import { CompressionTab } from "@/components/CompressionTab";

const Config = () => {
  const { toast } = useToast();
  const { archetypes, updateArchetype, addCustomArchetype, removeArchetype } = useArchetypes();
  
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
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">SYSTEM CONFIGURATION</h1>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Customize Agent Behavior</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={resetToDefaults}>
              Reset to Defaults
            </Button>
            <Button className="bg-black text-white hover:bg-gray-800" onClick={saveConfiguration}>
              <Save className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <Tabs defaultValue="archetypes" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="archetypes">Archetypes</TabsTrigger>
            <TabsTrigger value="tension">Tension Detection</TabsTrigger>
            <TabsTrigger value="compression">Compression</TabsTrigger>
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
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Config;

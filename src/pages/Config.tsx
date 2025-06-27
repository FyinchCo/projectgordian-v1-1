
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useArchetypes } from "@/hooks/useArchetypes";
import { ArchetypesTab } from "@/components/ArchetypesTab";

const Config = () => {
  const { toast } = useToast();
  const { archetypes, updateArchetype, addCustomArchetype, removeArchetype } = useArchetypes();

  console.log("Config page rendering with archetypes:", archetypes);

  const saveConfiguration = () => {
    try {
      localStorage.setItem('genius-machine-archetypes', JSON.stringify(archetypes));
      
      toast({
        title: "Configuration Saved",
        description: "Your archetype configuration has been saved successfully.",
      });
    } catch (error) {
      console.error("Failed to save configuration:", error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your configuration.",
        variant: "destructive"
      });
    }
  };

  const resetToDefaults = () => {
    try {
      localStorage.removeItem('genius-machine-archetypes');
      toast({
        title: "Reset Complete",
        description: "Configuration has been reset to default archetypes.",
      });
      window.location.reload();
    } catch (error) {
      console.error("Failed to reset configuration:", error);
      toast({
        title: "Reset Failed",
        description: "There was an error resetting your configuration.",
        variant: "destructive"
      });
    }
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
              <h1 className="text-2xl text-zen-heading text-zen-ink tracking-tight">ARCHETYPE CONFIGURATION</h1>
              <p className="text-xs text-zen-mono text-zen-medium uppercase tracking-wide">Customize Agent Behavior & Instructions</p>
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

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8 p-4 bg-zen-whisper rounded-md border border-zen-light">
          <h3 className="text-sm font-mono uppercase tracking-wide text-zen-ink mb-2">How to Use</h3>
          <p className="text-sm text-zen-body leading-relaxed">
            Customize each archetype's personality traits, behavior constraints, and add specific custom instructions. 
            The <strong>Custom Instructions</strong> field allows you to add detailed behavioral instructions that will directly influence how each archetype analyzes questions.
            Changes are automatically saved as you edit.
          </p>
        </div>

        {archetypes && archetypes.length > 0 ? (
          <ArchetypesTab
            archetypes={archetypes}
            onUpdateArchetype={updateArchetype}
            onAddArchetype={addCustomArchetype}
            onRemoveArchetype={removeArchetype}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-zen-body">Loading archetypes configuration...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Config;

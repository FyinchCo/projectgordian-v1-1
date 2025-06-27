
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useArchetypes } from "@/hooks/useArchetypes";
import { ArchetypesTab } from "@/components/ArchetypesTab";

const Config = () => {
  const { toast } = useToast();
  const { archetypes, updateArchetype, addCustomArchetype, removeArchetype } = useArchetypes();

  const saveConfiguration = () => {
    // Save archetypes to localStorage for immediate use
    localStorage.setItem('genius-machine-archetypes', JSON.stringify(archetypes));
    
    toast({
      title: "Configuration Saved",
      description: "Your archetype configuration has been saved and will be used in the next analysis.",
    });
  };

  const resetToDefaults = () => {
    localStorage.removeItem('genius-machine-archetypes');
    toast({
      title: "Reset Complete",
      description: "Configuration has been reset to default archetypes.",
    });
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
            The <strong>Custom Instructions</strong> field is where you can add detailed behavioral instructions that will directly influence how each archetype analyzes questions.
          </p>
        </div>

        <ArchetypesTab
          archetypes={archetypes}
          onUpdateArchetype={updateArchetype}
          onAddArchetype={addCustomArchetype}
          onRemoveArchetype={removeArchetype}
        />
      </main>
    </div>
  );
};

export default Config;

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Eye, Shield, Sparkles, Zap, Hammer, Plus, Trash2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Config = () => {
  const { toast } = useToast();
  
  const [archetypes, setArchetypes] = useState([
    {
      id: 1,
      name: "The Visionary",
      description: "Sees beyond current limitations and imagines radical possibilities",
      languageStyle: "poetic",
      imagination: [9],
      skepticism: [2],
      aggression: [3],
      emotionality: [7],
      icon: Eye,
      constraint: ""
    },
    {
      id: 2,
      name: "The Skeptic",
      description: "Questions assumptions and demands rigorous validation",
      languageStyle: "logical",
      imagination: [4],
      skepticism: [9],
      aggression: [6],
      emotionality: [2],
      icon: Shield,
      constraint: ""
    },
    {
      id: 3,
      name: "The Mystic",
      description: "Recognizes patterns and connections beyond rational analysis",
      languageStyle: "narrative",
      imagination: [8],
      skepticism: [3],
      aggression: [2],
      emotionality: [9],
      icon: Sparkles,
      constraint: ""
    },
    {
      id: 4,
      name: "The Contrarian",
      description: "Challenges consensus and reveals hidden contradictions",
      languageStyle: "disruptive",
      imagination: [6],
      skepticism: [7],
      aggression: [9],
      emotionality: [5],
      icon: Zap,
      constraint: ""
    },
    {
      id: 5,
      name: "The Craftsman",
      description: "Grounds ideas in practical application and iterative refinement",
      languageStyle: "logical",
      imagination: [5],
      skepticism: [6],
      aggression: [4],
      emotionality: [4],
      icon: Hammer,
      constraint: ""
    },
    {
      id: 6,
      name: "The Realist",
      description: "Exposes uncomfortable truths and challenges idealistic assumptions",
      languageStyle: "blunt",
      imagination: [2],
      skepticism: [6],
      aggression: [7],
      emotionality: [3],
      icon: AlertCircle,
      constraint: "Assume people are not capable of true authenticity, and that ambition is a coping strategy for mortality."
    }
  ]);

  const [tensionSettings, setTensionSettings] = useState({
    contradictionThreshold: [5],
    recursionDepth: [3],
    archetypeOverlap: [2]
  });

  const [compressionSettings, setCompressionSettings] = useState({
    style: "insight-summary",
    length: "medium",
    includeTrail: true,
    includeFullTranscript: false
  });

  // Load saved configuration on mount
  useEffect(() => {
    const savedArchetypes = localStorage.getItem('genius-machine-archetypes');
    if (savedArchetypes) {
      setArchetypes(JSON.parse(savedArchetypes));
    }
  }, []);

  const updateArchetype = (id: number, field: string, value: any) => {
    setArchetypes(prev => prev.map(archetype => 
      archetype.id === id ? { ...archetype, [field]: value } : archetype
    ));
  };

  const addCustomArchetype = () => {
    const newId = Math.max(...archetypes.map(a => a.id)) + 1;
    const newArchetype = {
      id: newId,
      name: "Custom Archetype",
      description: "A new archetype with custom behavior",
      languageStyle: "logical",
      imagination: [5],
      skepticism: [5],
      aggression: [5],
      emotionality: [5],
      icon: Plus,
      constraint: ""
    };
    setArchetypes(prev => [...prev, newArchetype]);
  };

  const removeArchetype = (id: number) => {
    if (archetypes.length <= 2) {
      toast({
        title: "Cannot Remove",
        description: "You must have at least 2 archetypes for meaningful analysis.",
        variant: "destructive"
      });
      return;
    }
    setArchetypes(prev => prev.filter(archetype => archetype.id !== id));
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

          <TabsContent value="archetypes" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">ARCHETYPAL AGENTS</h2>
              <p className="text-gray-600">Configure the personality and behavior of each cognitive archetype</p>
            </div>

            <div className="flex justify-center">
              <Button onClick={addCustomArchetype} className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Custom Archetype</span>
              </Button>
            </div>

            <div className="grid gap-6">
              {archetypes.map((archetype) => {
                const IconComponent = archetype.icon;
                return (
                  <Card key={archetype.id} className="p-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                      {/* Basic Info */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <IconComponent className="w-6 h-6" />
                            <h3 className="text-lg font-bold">{archetype.name}</h3>
                          </div>
                          {archetype.id > 6 && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeArchetype(archetype.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div>
                            <Label htmlFor={`name-${archetype.id}`}>Name</Label>
                            <Input
                              id={`name-${archetype.id}`}
                              value={archetype.name}
                              onChange={(e) => updateArchetype(archetype.id, 'name', e.target.value)}
                            />
                          </div>

                          <div>
                            <Label htmlFor={`description-${archetype.id}`}>Description</Label>
                            <Textarea
                              id={`description-${archetype.id}`}
                              value={archetype.description}
                              onChange={(e) => updateArchetype(archetype.id, 'description', e.target.value)}
                              rows={2}
                            />
                          </div>

                          <div>
                            <Label htmlFor={`style-${archetype.id}`}>Language Style</Label>
                            <Select
                              value={archetype.languageStyle}
                              onValueChange={(value) => updateArchetype(archetype.id, 'languageStyle', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="poetic">Poetic</SelectItem>
                                <SelectItem value="logical">Logical</SelectItem>
                                <SelectItem value="narrative">Narrative</SelectItem>
                                <SelectItem value="disruptive">Disruptive</SelectItem>
                                <SelectItem value="technical">Technical</SelectItem>
                                <SelectItem value="blunt">Blunt</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Personality Sliders */}
                      <div className="space-y-6">
                        <h4 className="font-semibold text-sm uppercase tracking-wide">Personality Matrix</h4>
                        
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-2">
                              <Label>Imagination</Label>
                              <span className="text-sm text-gray-500">{archetype.imagination[0]}/10</span>
                            </div>
                            <Slider
                              value={archetype.imagination}
                              onValueChange={(value) => updateArchetype(archetype.id, 'imagination', value)}
                              max={10}
                              step={1}
                            />
                          </div>

                          <div>
                            <div className="flex justify-between mb-2">
                              <Label>Skepticism</Label>
                              <span className="text-sm text-gray-500">{archetype.skepticism[0]}/10</span>
                            </div>
                            <Slider
                              value={archetype.skepticism}
                              onValueChange={(value) => updateArchetype(archetype.id, 'skepticism', value)}
                              max={10}
                              step={1}
                            />
                          </div>

                          <div>
                            <div className="flex justify-between mb-2">
                              <Label>Aggression</Label>
                              <span className="text-sm text-gray-500">{archetype.aggression[0]}/10</span>
                            </div>
                            <Slider
                              value={archetype.aggression}
                              onValueChange={(value) => updateArchetype(archetype.id, 'aggression', value)}
                              max={10}
                              step={1}
                            />
                          </div>

                          <div>
                            <div className="flex justify-between mb-2">
                              <Label>Emotionality</Label>
                              <span className="text-sm text-gray-500">{archetype.emotionality[0]}/10</span>
                            </div>
                            <Slider
                              value={archetype.emotionality}
                              onValueChange={(value) => updateArchetype(archetype.id, 'emotionality', value)}
                              max={10}
                              step={1}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor={`constraint-${archetype.id}`}>Additional Constraints</Label>
                          <Textarea
                            id={`constraint-${archetype.id}`}
                            placeholder="Optional: Specific instructions or constraints for this archetype..."
                            value={archetype.constraint}
                            onChange={(e) => updateArchetype(archetype.id, 'constraint', e.target.value)}
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="tension" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">TENSION DETECTION</h2>
              <p className="text-gray-600">Configure when the system detects breakthrough moments</p>
            </div>

            <Card className="p-8 max-w-2xl mx-auto">
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-3">
                    <Label className="text-base">Contradiction Frequency</Label>
                    <span className="text-sm text-gray-500">{tensionSettings.contradictionThreshold[0]}/10</span>
                  </div>
                  <Slider
                    value={tensionSettings.contradictionThreshold}
                    onValueChange={(value) => setTensionSettings(prev => ({ ...prev, contradictionThreshold: value }))}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500 mt-2">How sensitive the system is to contradictory viewpoints</p>
                </div>

                <div>
                  <div className="flex justify-between mb-3">
                    <Label className="text-base">Recursion Depth</Label>
                    <span className="text-sm text-gray-500">{tensionSettings.recursionDepth[0]} layers</span>
                  </div>
                  <Slider
                    value={tensionSettings.recursionDepth}
                    onValueChange={(value) => setTensionSettings(prev => ({ ...prev, recursionDepth: value }))}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500 mt-2">Minimum number of archetype layers before triggering analysis</p>
                </div>

                <div>
                  <div className="flex justify-between mb-3">
                    <Label className="text-base">Archetype Overlap Required</Label>
                    <span className="text-sm text-gray-500">{tensionSettings.archetypeOverlap[0]} agents</span>
                  </div>
                  <Slider
                    value={tensionSettings.archetypeOverlap}
                    onValueChange={(value) => setTensionSettings(prev => ({ ...prev, archetypeOverlap: value }))}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500 mt-2">Number of agents that must agree before signaling tension</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="compression" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">COMPRESSION SETTINGS</h2>
              <p className="text-gray-600">Control how insights are synthesized and presented</p>
            </div>

            <Card className="p-8 max-w-2xl mx-auto">
              <div className="space-y-6">
                <div>
                  <Label className="text-base mb-3 block">Compression Style</Label>
                  <Select
                    value={compressionSettings.style}
                    onValueChange={(value) => setCompressionSettings(prev => ({ ...prev, style: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aphorism">Aphorism</SelectItem>
                      <SelectItem value="insight-summary">Insight Summary</SelectItem>
                      <SelectItem value="philosophical-phrase">Philosophical Phrase</SelectItem>
                      <SelectItem value="narrative-form">Narrative Form</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base mb-3 block">Output Length</Label>
                  <Select
                    value={compressionSettings.length}
                    onValueChange={(value) => setCompressionSettings(prev => ({ ...prev, length: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (1-2 sentences)</SelectItem>
                      <SelectItem value="medium">Medium (1 paragraph)</SelectItem>
                      <SelectItem value="poetic">Poetic (Extended metaphor)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label className="text-base">Output Components</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeTrail"
                        checked={compressionSettings.includeTrail}
                        onChange={(e) => setCompressionSettings(prev => ({ ...prev, includeTrail: e.target.checked }))}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="includeTrail" className="text-sm">Include logic trail</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeTranscript"
                        checked={compressionSettings.includeFullTranscript}
                        onChange={(e) => setCompressionSettings(prev => ({ ...prev, includeFullTranscript: e.target.checked }))}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="includeTranscript" className="text-sm">Include full transcript</Label>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Config;

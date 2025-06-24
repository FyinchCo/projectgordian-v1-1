
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Play, Zap, Brain, Settings, Target, Users, Layers, Cpu } from "lucide-react";
import { OutputType, OUTPUT_TYPE_CONFIGS } from "@/types/outputTypes";
import { useQuestionAssessment } from "@/hooks/useQuestionAssessment";
import { useToast } from "@/hooks/use-toast";

interface ConsolidatedGeniusInterfaceProps {
  question: string;
  setQuestion: (question: string) => void;
  outputType: OutputType;
  setOutputType: (type: OutputType) => void;
  processingDepth: number[];
  setProcessingDepth: (depth: number[]) => void;
  circuitType: string;
  setCircuitType: (type: string) => void;
  enhancedMode: boolean;
  setEnhancedMode: (enabled: boolean) => void;
  customArchetypes: any;
  currentAssessment: any;
  setCurrentAssessment: (assessment: any) => void;
  onStartGenius: () => void;
}

export const ConsolidatedGeniusInterface = ({
  question,
  setQuestion,
  outputType,
  setOutputType,
  processingDepth,
  setProcessingDepth,
  circuitType,
  setCircuitType,
  enhancedMode,
  setEnhancedMode,
  customArchetypes,
  currentAssessment,
  setCurrentAssessment,
  onStartGenius
}: ConsolidatedGeniusInterfaceProps) => {
  const [configMode, setConfigMode] = useState<"ai" | "manual">("ai");
  const { assessQuestion, assessment, isAssessing } = useQuestionAssessment();
  const { toast } = useToast();

  const handleAIOptimize = async () => {
    if (!question.trim()) {
      toast({
        title: "Question Required",
        description: "Please enter a question before optimizing configuration.",
        variant: "destructive",
      });
      return;
    }

    const result = await assessQuestion(question);
    if (result) {
      setProcessingDepth([result.recommendations.processingDepth]);
      setCircuitType(result.recommendations.circuitType);
      setEnhancedMode(result.recommendations.enhancedMode);
      setCurrentAssessment(result);
      
      toast({
        title: "AI Configuration Applied",
        description: `Optimized for ${result.domainType} domain with ${result.recommendations.processingDepth} layers`,
      });
    }
  };

  const getDepthLabel = (depth: number) => {
    if (depth <= 5) return "Quick Analysis";
    if (depth <= 10) return "Deep Analysis";
    return "Ultra-Deep Analysis";
  };

  const getDepthDescription = (depth: number) => {
    if (depth <= 5) return "Fast processing, good for straightforward questions";
    if (depth <= 10) return "Thorough analysis, recommended for complex problems";
    return "Maximum depth, for the most challenging questions";
  };

  return (
    <div className="space-y-8">
      {/* Main Question Input */}
      <Card className="border-4 border-mono-pure-black bg-mono-pure-white shadow-2xl">
        <div className="p-6 space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-cormorant font-bold tracking-tight text-mono-pure-black uppercase">
              THE GENIUS MACHINE
            </h1>
            <p className="text-lg font-inter text-mono-dark-gray">
              AI's Recursive Distillation of Complex Questions
            </p>
          </div>

          <Textarea
            placeholder="Enter your high-friction question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="min-h-[120px] text-lg font-inter border-2 border-mono-pure-black resize-none focus-visible:ring-0 p-4"
          />

          {/* Answer Type Selection */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-mono text-mono-pure-black uppercase tracking-wider">Answer Type:</span>
              <Select value={outputType} onValueChange={(value) => setOutputType(value as OutputType)}>
                <SelectTrigger className="w-[180px] border-2 border-mono-pure-black bg-mono-off-white font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-2 border-mono-pure-black">
                  {OUTPUT_TYPE_CONFIGS.map((config) => (
                    <SelectItem key={config.id} value={config.id} className="font-mono">
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm font-mono text-mono-pure-black">
              {question.length} characters
            </div>
          </div>
        </div>
      </Card>

      {/* Configuration Interface */}
      <Card className="border-2 border-mono-pure-black bg-mono-pure-white">
        <div className="p-6">
          <Tabs value={configMode} onValueChange={(value) => setConfigMode(value as "ai" | "manual")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="ai" className="flex items-center space-x-2">
                <Brain className="w-4 h-4" />
                <span>AI Optimize</span>
              </TabsTrigger>
              <TabsTrigger value="manual" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Manual Setup</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai" className="space-y-4">
              <div className="text-center space-y-4">
                <p className="text-mono-dark-gray font-inter">
                  Let AI analyze your question and configure optimal processing parameters
                </p>
                
                <Button
                  onClick={handleAIOptimize}
                  disabled={!question.trim() || isAssessing}
                  className="bg-mono-pure-black text-mono-pure-white hover:bg-mono-charcoal font-mono uppercase tracking-wide"
                >
                  {isAssessing ? (
                    <>
                      <Brain className="w-4 h-4 mr-2 animate-pulse" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4 mr-2" />
                      Optimize Configuration
                    </>
                  )}
                </Button>

                {currentAssessment && (
                  <div className="mt-4 p-4 bg-mono-light-gray border-2 border-mono-pure-black">
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-mono uppercase">Domain:</span>
                        <Badge>{currentAssessment.domainType}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-mono uppercase">Complexity:</span>
                        <Badge variant="outline">{currentAssessment.complexityScore}/10</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-mono uppercase">Recommended Depth:</span>
                        <Badge>{currentAssessment.recommendations.processingDepth} layers</Badge>
                      </div>
                      <div className="text-xs text-mono-dark-gray mt-2">
                        All 5 archetypes active with dynamic emphasis tuning
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="manual" className="space-y-6">
              {/* Processing Depth */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="font-mono uppercase tracking-wide">Processing Depth</Label>
                  <Badge variant="outline" className="font-mono">
                    {processingDepth[0]} layers - {getDepthLabel(processingDepth[0])}
                  </Badge>
                </div>
                <Slider
                  value={processingDepth}
                  onValueChange={setProcessingDepth}
                  max={20}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-mono-medium-gray font-mono">
                  <span>1 (Fast)</span>
                  <span>10 (Balanced)</span>
                  <span>20 (Maximum)</span>
                </div>
                <p className="text-sm text-mono-dark-gray font-inter">
                  {getDepthDescription(processingDepth[0])}
                </p>
              </div>

              {/* Circuit Type */}
              <div className="space-y-3">
                <Label className="font-mono uppercase tracking-wide">Circuit Type</Label>
                <Select value={circuitType} onValueChange={setCircuitType}>
                  <SelectTrigger className="border-2 border-mono-pure-black">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sequential">Sequential - Archetypes build on each other</SelectItem>
                    <SelectItem value="parallel">Parallel - All archetypes think simultaneously</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Enhanced Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-mono uppercase tracking-wide">Enhanced Mode</Label>
                  <p className="text-sm text-mono-dark-gray">Assumption analysis and dialectical tension</p>
                </div>
                <Switch
                  checked={enhancedMode}
                  onCheckedChange={setEnhancedMode}
                />
              </div>

              {/* Archetype Status */}
              {customArchetypes && (
                <div className="space-y-2">
                  <Label className="font-mono uppercase tracking-wide">Custom Archetypes</Label>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span className="text-sm text-mono-dark-gray">
                      {customArchetypes.length} custom archetypes loaded
                    </span>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </Card>

      {/* Launch Button */}
      <div className="text-center">
        <Button 
          onClick={onStartGenius}
          disabled={!question.trim()}
          size="lg"
          className="bg-mono-pure-black text-mono-pure-white hover:bg-mono-charcoal flex items-center space-x-3 font-mono font-bold text-lg uppercase tracking-wide border-2 border-mono-pure-black px-12 py-6"
        >
          <Play className="w-6 h-6" />
          <span>START GENIUS MACHINE</span>
          <Zap className="w-6 h-6" />
        </Button>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <Card className="border-2 border-mono-pure-black bg-mono-pure-white p-6 text-center">
          <Cpu className="w-8 h-8 mx-auto mb-4 text-mono-pure-black" />
          <h3 className="font-cormorant font-bold text-lg mb-2 text-mono-pure-black uppercase">
            Dynamic Archetypes
          </h3>
          <p className="text-sm font-inter text-mono-dark-gray">
            AI-tuned personality parameters for optimal perspective diversity
          </p>
        </Card>
        
        <Card className="border-2 border-mono-pure-black bg-mono-pure-white p-6 text-center">
          <Layers className="w-8 h-8 mx-auto mb-4 text-mono-pure-black" />
          <h3 className="font-cormorant font-bold text-lg mb-2 text-mono-pure-black uppercase">
            Deep Processing
          </h3>
          <p className="text-sm font-inter text-mono-dark-gray">
            5-20 layers of recursive analysis with real-time visualization
          </p>
        </Card>
        
        <Card className="border-2 border-mono-pure-black bg-mono-pure-white p-6 text-center">
          <Target className="w-8 h-8 mx-auto mb-4 text-mono-pure-black" />
          <h3 className="font-cormorant font-bold text-lg mb-2 text-mono-pure-black uppercase">
            Refined Output
          </h3>
          <p className="text-sm font-inter text-mono-dark-gray">
            Compressed insights tailored to your chosen answer format
          </p>
        </Card>
      </div>
    </div>
  );
};

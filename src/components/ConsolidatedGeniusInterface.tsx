
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
      {/* Main Question Input with Integrated Configuration */}
      <Card className="border-2 border-mono-pure-black bg-mono-pure-white shadow-lg">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-cormorant font-bold tracking-tight text-mono-pure-black uppercase">
              THE GENIUS MACHINE
            </h1>
            <p className="text-sm font-inter text-mono-dark-gray">
              AI's Recursive Distillation of Complex Questions
            </p>
          </div>

          {/* Question Input */}
          <div className="space-y-3">
            <Textarea
              placeholder="Enter your high-friction question here..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[80px] text-base font-inter border-2 border-mono-pure-black resize-none focus-visible:ring-0 p-3"
            />

            {/* Answer Type and Character Count Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-mono-pure-black uppercase tracking-wider">Answer Type:</span>
                <Select value={outputType} onValueChange={(value) => setOutputType(value as OutputType)}>
                  <SelectTrigger className="w-[140px] border-2 border-mono-pure-black bg-mono-off-white font-mono text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-mono-pure-black">
                    {OUTPUT_TYPE_CONFIGS.map((config) => (
                      <SelectItem key={config.id} value={config.id} className="font-mono text-sm">
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-xs font-mono text-mono-pure-black">
                {question.length} characters
              </div>
            </div>
          </div>

          {/* Configuration Tabs */}
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
                <div className="text-center space-y-3">
                  <p className="text-mono-dark-gray font-inter text-sm">
                    Let AI analyze your question and configure optimal processing parameters
                  </p>
                  
                  <Button
                    onClick={handleAIOptimize}
                    disabled={!question.trim() || isAssessing}
                    className="bg-mono-pure-black text-mono-pure-white hover:bg-mono-charcoal font-mono uppercase tracking-wide text-sm"
                  >
                    {isAssessing ? (
                      <>
                        <Brain className="w-3 h-3 mr-2 animate-pulse" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Target className="w-3 h-3 mr-2" />
                        Optimize Configuration
                      </>
                    )}
                  </Button>

                  {currentAssessment && (
                    <div className="mt-4 p-4 bg-mono-light-gray border-2 border-mono-pure-black">
                      <div className="text-xs space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-mono uppercase">Domain:</span>
                          <Badge className="text-xs">{currentAssessment.domainType}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-mono uppercase">Complexity:</span>
                          <Badge variant="outline" className="text-xs">{currentAssessment.complexityScore}/10</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-mono uppercase">Recommended Depth:</span>
                          <Badge className="text-xs">{currentAssessment.recommendations.processingDepth} layers</Badge>
                        </div>
                        <div className="text-xs text-mono-dark-gray mt-2">
                          All 5 archetypes active with dynamic emphasis tuning
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="manual" className="space-y-4">
                {/* Processing Depth */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-mono uppercase tracking-wide text-sm">Processing Depth</Label>
                    <Badge variant="outline" className="font-mono text-xs">
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
                  <p className="text-xs text-mono-dark-gray font-inter">
                    {getDepthDescription(processingDepth[0])}
                  </p>
                </div>

                {/* Circuit Type */}
                <div className="space-y-2">
                  <Label className="font-mono uppercase tracking-wide text-sm">Circuit Type</Label>
                  <Select value={circuitType} onValueChange={setCircuitType}>
                    <SelectTrigger className="border-2 border-mono-pure-black text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sequential" className="text-sm">Sequential - Archetypes build on each other</SelectItem>
                      <SelectItem value="parallel" className="text-sm">Parallel - All archetypes think simultaneously</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Enhanced Mode */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-mono uppercase tracking-wide text-sm">Enhanced Mode</Label>
                    <p className="text-xs text-mono-dark-gray">Assumption analysis and dialectical tension</p>
                  </div>
                  <Switch
                    checked={enhancedMode}
                    onCheckedChange={setEnhancedMode}
                  />
                </div>

                {/* Archetype Status */}
                {customArchetypes && (
                  <div className="space-y-1">
                    <Label className="font-mono uppercase tracking-wide text-sm">Custom Archetypes</Label>
                    <div className="flex items-center space-x-2">
                      <Users className="w-3 h-3" />
                      <span className="text-xs text-mono-dark-gray">
                        {customArchetypes.length} custom archetypes loaded
                      </span>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Launch Button */}
          <div className="border-t-2 border-mono-pure-black pt-4">
            <Button 
              onClick={onStartGenius}
              disabled={!question.trim()}
              size="lg"
              className="w-full bg-mono-pure-black text-mono-pure-white hover:bg-mono-charcoal flex items-center justify-center space-x-2 font-mono font-bold uppercase tracking-wide border-2 border-mono-pure-black px-8 py-4"
            >
              <Play className="w-5 h-5" />
              <span>START GENIUS MACHINE</span>
              <Zap className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-2 border-mono-pure-black bg-mono-pure-white p-4 text-center">
          <Cpu className="w-6 h-6 mx-auto mb-2 text-mono-pure-black" />
          <h3 className="font-cormorant font-bold text-base mb-1 text-mono-pure-black uppercase">
            Dynamic Archetypes
          </h3>
          <p className="text-xs font-inter text-mono-dark-gray">
            AI-tuned personality parameters for optimal perspective diversity
          </p>
        </Card>
        
        <Card className="border-2 border-mono-pure-black bg-mono-pure-white p-4 text-center">
          <Layers className="w-6 h-6 mx-auto mb-2 text-mono-pure-black" />
          <h3 className="font-cormorant font-bold text-base mb-1 text-mono-pure-black uppercase">
            Deep Processing
          </h3>
          <p className="text-xs font-inter text-mono-dark-gray">
            5-20 layers of recursive analysis with real-time visualization
          </p>
        </Card>
        
        <Card className="border-2 border-mono-pure-black bg-mono-pure-white p-4 text-center">
          <Target className="w-6 h-6 mx-auto mb-2 text-mono-pure-black" />
          <h3 className="font-cormorant font-bold text-base mb-1 text-mono-pure-black uppercase">
            Refined Output
          </h3>
          <p className="text-xs font-inter text-mono-dark-gray">
            Compressed insights tailored to your chosen answer format
          </p>
        </Card>
      </div>
    </div>
  );
};

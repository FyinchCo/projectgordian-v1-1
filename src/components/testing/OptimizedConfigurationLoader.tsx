
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { addOptimizedConfigurations } from "@/services/testing/optimizedTestConfigurations";
import { Zap, Target, TrendingUp } from "lucide-react";

export const OptimizedConfigurationLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadOptimizedConfigurations = () => {
    setIsLoading(true);
    try {
      addOptimizedConfigurations();
      toast({
        title: "Optimized Configurations Loaded",
        description: "Added 2 new configurations optimized for better Synthesizer and Implementer performance.",
      });
    } catch (error) {
      toast({
        title: "Loading Failed",
        description: "Failed to load optimized configurations.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-blue-600" />
          <span>Synthesis Optimization</span>
        </CardTitle>
        <CardDescription>
          Load optimized configurations designed to improve Synthesizer and Implementer effectiveness
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-green-600" />
              <span className="font-medium">Optimized Synthesis</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Enhanced Synthesizer cooperation (↓ aggression)</li>
              <li>• Improved Synthesizer intuition (↑ emotionality)</li>
              <li>• Better Implementer stakeholder awareness</li>
              <li>• Maintains strong Visionary/Skeptic performance</li>
            </ul>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span className="font-medium">Balanced Optimization</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Higher Synthesizer imagination for creativity</li>
              <li>• Increased Implementer empathy and creativity</li>
              <li>• Reduced inter-archetype friction</li>
              <li>• Alternative optimization approach</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
          <p className="text-sm text-yellow-800">
            <strong>Expected Improvements:</strong> Synthesizer and Implementer role effectiveness: 5/10 → 7-8/10
          </p>
        </div>

        <Button 
          onClick={loadOptimizedConfigurations}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Loading..." : "Load Optimized Configurations"}
        </Button>
      </CardContent>
    </Card>
  );
};

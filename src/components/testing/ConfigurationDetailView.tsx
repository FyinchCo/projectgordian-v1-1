
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, User, Brain, Zap, Heart } from "lucide-react";
import { archetypeTestingFramework } from "@/services/testing/archetypeTestingFramework";

interface ConfigurationDetailViewProps {
  configurationId: string;
  configurationName: string;
  configurationDescription: string;
  onClose: () => void;
}

export const ConfigurationDetailView = ({ 
  configurationId, 
  configurationName, 
  configurationDescription, 
  onClose 
}: ConfigurationDetailViewProps) => {
  const [expandedArchetype, setExpandedArchetype] = useState<string | null>(null);
  
  // Get the configuration details
  const configurations = archetypeTestingFramework.getConfigurations();
  const config = configurations.find(c => c.id === configurationId);
  
  if (!config) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500">Configuration not found.</p>
        </CardContent>
      </Card>
    );
  }

  const getParameterIcon = (param: string) => {
    switch (param) {
      case 'imagination': return <Brain className="w-4 h-4" />;
      case 'skepticism': return <Zap className="w-4 h-4" />;
      case 'aggression': return <Zap className="w-4 h-4" />;
      case 'emotionality': return <Heart className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getParameterColor = (value: number) => {
    if (value >= 8) return "bg-green-100 text-green-800";
    if (value >= 6) return "bg-blue-100 text-blue-800";
    if (value >= 4) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{configurationName}</h3>
          <p className="text-sm text-gray-600">{configurationDescription}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onClose}>
          Close Details
        </Button>
      </div>

      <div className="grid gap-4">
        {config.archetypes.map((archetype) => {
          const isExpanded = expandedArchetype === archetype.name;
          
          return (
            <Card key={archetype.name} className="border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <CardTitle className="text-base">{archetype.name}</CardTitle>
                      {archetype.name === "The Synthesizer" && (
                        <Badge variant="outline" className="text-xs mt-1 border-orange-300 text-orange-700">
                          Optimization Target (9.0/10)
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedArchetype(isExpanded ? null : archetype.name)}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                </div>
                <CardDescription className="text-sm">
                  {archetype.description}
                </CardDescription>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Language Style</h4>
                      <Badge variant="secondary" className="text-xs">
                        {archetype.languageStyle}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-3">Personality Parameters</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            {getParameterIcon('imagination')}
                            <span className="text-sm">Imagination</span>
                          </div>
                          <Badge className={`text-xs ${getParameterColor(archetype.imagination)}`}>
                            {archetype.imagination}/10
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            {getParameterIcon('skepticism')}
                            <span className="text-sm">Skepticism</span>
                          </div>
                          <Badge className={`text-xs ${getParameterColor(archetype.skepticism)}`}>
                            {archetype.skepticism}/10
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            {getParameterIcon('aggression')}
                            <span className="text-sm">Aggression</span>
                          </div>
                          <Badge className={`text-xs ${getParameterColor(archetype.aggression)}`}>
                            {archetype.aggression}/10
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            {getParameterIcon('emotionality')}
                            <span className="text-sm">Emotionality</span>
                          </div>
                          <Badge className={`text-xs ${getParameterColor(archetype.emotionality)}`}>
                            {archetype.emotionality}/10
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {archetype.name === "The Synthesizer" && (
                      <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                        <h4 className="font-medium text-sm text-orange-800 mb-1">Optimization Notes</h4>
                        <p className="text-xs text-orange-700">
                          This archetype scored 9.0/10 in baseline testing. Target: improve to 9.5+ through parameter tuning while maintaining integration capabilities.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

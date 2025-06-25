
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Settings } from "lucide-react";
import { archetypeTestingFramework } from "@/services/testing/archetypeTestingFramework";
import { ConfigurationDetailView } from "./ConfigurationDetailView";

export const TestConfigurationManager = () => {
  const [selectedConfigId, setSelectedConfigId] = useState<string | null>(null);
  
  const configurations = archetypeTestingFramework.getConfigurations();
  
  if (selectedConfigId) {
    const selectedConfig = configurations.find(c => c.id === selectedConfigId);
    if (selectedConfig) {
      return (
        <ConfigurationDetailView
          configurationId={selectedConfig.id}
          configurationName={selectedConfig.name}
          configurationDescription={selectedConfig.description}
          onClose={() => setSelectedConfigId(null)}
        />
      );
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuration Manager</CardTitle>
          <CardDescription>
            View and manage archetype test configurations. Click "View Details" to see internal archetypes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {configurations.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No configurations loaded. Please initialize the framework first.
            </p>
          ) : (
            <div className="space-y-4">
              {configurations.map((config) => {
                const performance = archetypeTestingFramework.getConfigurationPerformance(config.id);
                
                return (
                  <div key={config.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium">{config.name}</h3>
                        {config.id === 'current-default' && (
                          <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                            Baseline (9.7/10)
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{config.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{config.archetypes.length} archetypes</span>
                        <span>•</span>
                        <span>{performance.testCount} tests run</span>
                        {performance.testCount > 0 && (
                          <>
                            <span>•</span>
                            <span className="font-medium">Avg: {performance.averageScore.toFixed(1)}/10</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedConfigId(config.id)}
                        className="flex items-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};


import { useState, useEffect } from "react";
import { PasswordGate } from "@/components/PasswordGate";
import { LearningDashboard } from "@/components/LearningDashboard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Database, TrendingUp, Zap, RefreshCw } from "lucide-react";
import { useMetaLearning } from "@/hooks/useMetaLearning";
import { learningDatabase } from "@/services/learningDatabase";

export default function LearningAnalytics() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rawData, setRawData] = useState<any>(null);
  const [patterns, setPatterns] = useState<any[]>([]);
  const { learningDashboard, resetLearningSystem } = useMetaLearning();

  useEffect(() => {
    // Check if already authenticated
    const authenticated = localStorage.getItem("project-gordian-authenticated");
    if (authenticated === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadDeveloperData();
    }
  }, [isAuthenticated]);

  const loadDeveloperData = () => {
    try {
      const stored = localStorage.getItem('genius-machine-learning-db');
      if (stored) {
        const data = JSON.parse(stored);
        setRawData(data);
        setPatterns(data.patterns || []);
      }
    } catch (error) {
      console.error('Could not load raw learning data:', error);
    }
  };

  const exportLearningData = () => {
    if (rawData) {
      const dataStr = JSON.stringify(rawData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `genius-machine-learning-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  if (!isAuthenticated) {
    return <PasswordGate onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gordian-cream via-gordian-beige to-gordian-cream p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-playfair font-bold text-gordian-dark-brown mb-2">
              Learning Analytics Dashboard
            </h1>
            <p className="text-gordian-brown font-inter">
              Developer insights into the meta-learning system's progress and patterns
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={loadDeveloperData} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
            <Button onClick={exportLearningData} size="sm" className="bg-gordian-dark-brown hover:bg-gordian-brown">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/50">
            <TabsTrigger value="overview">System Overview</TabsTrigger>
            <TabsTrigger value="patterns">Learning Patterns</TabsTrigger>
            <TabsTrigger value="data">Raw Data</TabsTrigger>
            <TabsTrigger value="analytics">Deep Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <LearningDashboard />
            
            {learningDashboard && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center space-x-3">
                    <Database className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="font-semibold">Data Health</h3>
                      <p className="text-sm text-gray-600">
                        {rawData?.records?.length || 0} learning records stored
                      </p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <div>
                      <h3 className="font-semibold">Learning Velocity</h3>
                      <p className="text-sm text-gray-600">
                        {Math.round((learningDashboard.systemEvolution?.learningVelocity || 0) * 100)}% improvement rate
                      </p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-purple-600" />
                    <div>
                      <h3 className="font-semibold">Pattern Discovery</h3>
                      <p className="text-sm text-gray-600">
                        {patterns.length} configuration patterns identified
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="patterns" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Discovered Configuration Patterns</h3>
              {patterns.length > 0 ? (
                <div className="space-y-4">
                  {patterns.map((pattern, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {pattern.pattern}
                        </code>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            {Math.round(pattern.confidence * 100)}% confidence
                          </Badge>
                          <Badge variant="secondary">
                            {pattern.sampleSize} samples
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Average Quality: {Math.round(pattern.averageQuality * 10) / 10}/10
                      </p>
                      <p className="text-xs text-gray-500">
                        Domains: {pattern.applicableDomains.join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No patterns discovered yet. Process more questions to see patterns emerge.</p>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Raw Learning Records</h3>
              <ScrollArea className="h-96">
                {rawData?.records?.length > 0 ? (
                  <div className="space-y-3">
                    {rawData.records.slice(-10).reverse().map((record: any, index: number) => (
                      <div key={record.id} className="border rounded p-3 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500">
                            {new Date(record.timestamp).toLocaleString()}
                          </span>
                          <Badge variant="outline">
                            Quality: {record.qualityMetrics.overallScore}/10
                          </Badge>
                        </div>
                        <p className="text-sm font-medium mb-1 truncate">
                          {record.question}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                          <span>{record.domainType}</span>
                          <span>•</span>
                          <span>Complexity: {record.complexity}</span>
                          <span>•</span>
                          <span>{record.learningTags.join(', ')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No learning records found.</p>
                )}
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Configuration Effectiveness</h3>
                {rawData?.records && rawData.records.length > 0 ? (
                  <div className="space-y-3">
                    {['enhanced', 'basic'].map(mode => {
                      const records = rawData.records.filter((r: any) => 
                        r.configuration.enhancedMode === (mode === 'enhanced')
                      );
                      const avgQuality = records.length > 0 ? 
                        records.reduce((sum: number, r: any) => sum + r.qualityMetrics.overallScore, 0) / records.length : 0;
                      
                      return (
                        <div key={mode} className="flex justify-between items-center">
                          <span className="capitalize">{mode} Mode</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">{Math.round(avgQuality * 10) / 10}/10</span>
                            <span className="text-xs text-gray-500">({records.length} samples)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500">No data available for analysis.</p>
                )}
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Domain Performance</h3>
                {learningDashboard?.learningStats?.bestDomains?.length > 0 ? (
                  <div className="space-y-3">
                    {learningDashboard.learningStats.bestDomains.slice(0, 5).map((domain: any, index: number) => (
                      <div key={domain.domain} className="flex justify-between items-center">
                        <span>{domain.domain}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{Math.round(domain.averageQuality * 10) / 10}/10</span>
                          <span className="text-xs text-gray-500">({domain.sampleSize} samples)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No domain performance data available.</p>
                )}
              </Card>
            </div>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">System Management</h3>
                <Button 
                  onClick={resetLearningSystem} 
                  variant="destructive" 
                  size="sm"
                >
                  Reset All Learning Data
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                Use the reset function to clear all learning data and start fresh. This action cannot be undone.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

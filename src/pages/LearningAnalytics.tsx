
import { useState, useEffect } from "react";
import { PasswordGate } from "@/components/PasswordGate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMetaLearning } from "@/hooks/useMetaLearning";
import { learningDatabase } from "@/services/learningDatabase";
import { AnalyticsHeader } from "@/components/analytics/AnalyticsHeader";
import { SystemOverviewTab } from "@/components/analytics/SystemOverviewTab";
import { PatternsTab } from "@/components/analytics/PatternsTab";
import { RawDataTab } from "@/components/analytics/RawDataTab";
import { DeepAnalyticsTab } from "@/components/analytics/DeepAnalyticsTab";

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
      // Set up interval to refresh data every 2 seconds when page is active
      const interval = setInterval(() => {
        loadDeveloperData();
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadDeveloperData = () => {
    try {
      console.log('LearningAnalytics: Loading developer data...');
      const stored = localStorage.getItem('genius-machine-learning-db');
      console.log('LearningAnalytics: Raw localStorage data:', stored ? 'Found data' : 'No data');
      
      if (stored) {
        const data = JSON.parse(stored);
        console.log('LearningAnalytics: Parsed data:', {
          recordsCount: data.records?.length || 0,
          patternsCount: data.patterns?.length || 0,
          lastUpdated: data.lastUpdated ? new Date(data.lastUpdated).toISOString() : 'Unknown'
        });
        setRawData(data);
        setPatterns(data.patterns || []);
      } else {
        console.log('LearningAnalytics: No learning data found in localStorage');
        setRawData(null);
        setPatterns([]);
      }
      
      // Also get fresh stats from the database instance
      const freshStats = learningDatabase.getLearningStats();
      console.log('LearningAnalytics: Fresh stats from database:', freshStats);
      
    } catch (error) {
      console.error('LearningAnalytics: Could not load raw learning data:', error);
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

  // Force refresh function
  const forceRefresh = () => {
    console.log('LearningAnalytics: Force refreshing all data...');
    loadDeveloperData();
    // Force re-render by updating a timestamp
    setRawData(prev => ({ ...prev, _refreshTimestamp: Date.now() }));
  };

  if (!isAuthenticated) {
    return <PasswordGate onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gordian-cream via-gordian-beige to-gordian-cream p-6">
      <div className="max-w-7xl mx-auto">
        <AnalyticsHeader 
          rawData={rawData}
          learningDashboard={learningDashboard}
          onForceRefresh={forceRefresh}
          onExportData={exportLearningData}
        />

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/50">
            <TabsTrigger value="overview">System Overview</TabsTrigger>
            <TabsTrigger value="patterns">Learning Patterns</TabsTrigger>
            <TabsTrigger value="data">Raw Data</TabsTrigger>
            <TabsTrigger value="analytics">Deep Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <SystemOverviewTab 
              learningDashboard={learningDashboard}
              rawData={rawData}
              patterns={patterns}
            />
          </TabsContent>

          <TabsContent value="patterns">
            <PatternsTab patterns={patterns} />
          </TabsContent>

          <TabsContent value="data">
            <RawDataTab rawData={rawData} />
          </TabsContent>

          <TabsContent value="analytics">
            <DeepAnalyticsTab 
              rawData={rawData}
              learningDashboard={learningDashboard}
              onResetSystem={resetLearningSystem}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Header } from "@/components/Header";
import { EnhancedResultsDisplay } from "@/components/EnhancedResultsDisplay";
import { ExportModal } from "@/components/ExportModal";
import { 
  Search, 
  Calendar, 
  Brain, 
  Zap, 
  TrendingUp, 
  Eye, 
  Trash2, 
  ArrowLeft,
  History,
  Filter
} from "lucide-react";
import { insightsHistoryService, StoredInsight } from "@/services/insightsHistoryService";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const InsightsHistory = () => {
  const [insights, setInsights] = useState<StoredInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInsight, setSelectedInsight] = useState<StoredInsight | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setLoading(true);
    try {
      const data = await insightsHistoryService.getInsights();
      setInsights(data);
    } catch (error) {
      console.error('Failed to load insights:', error);
      toast({
        title: "Error Loading Insights",
        description: "Failed to load your insights history.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadInsights();
      return;
    }

    setLoading(true);
    try {
      const results = await insightsHistoryService.searchInsights(searchQuery);
      setInsights(results);
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: "Search Failed",
        description: "Failed to search insights.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const success = await insightsHistoryService.deleteInsight(id);
      if (success) {
        setInsights(insights.filter(insight => insight.id !== id));
        toast({
          title: "Insight Deleted",
          description: "The insight has been removed from your history.",
        });
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete the insight.",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    setIsExportModalOpen(true);
  };

  const handleBackToHistory = () => {
    setSelectedInsight(null);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-100 text-green-800";
    if (confidence >= 0.6) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  if (selectedInsight) {
    return (
      <div className="min-h-screen bg-zen-paper">
        <Header customArchetypes={null} enhancedMode={true} />
        
        <main className="px-zen-lg py-zen-xl max-w-7xl mx-auto">
          <div className="mb-6">
            <Button
              onClick={handleBackToHistory}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to History</span>
            </Button>
          </div>

          <EnhancedResultsDisplay
            results={selectedInsight.full_results}
            question={selectedInsight.question}
            onReset={handleBackToHistory}
            onExport={handleExport}
          />

          <ExportModal
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
            results={selectedInsight.full_results}
            question={selectedInsight.question}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zen-paper">
      <Header customArchetypes={null} enhancedMode={true} />
      
      <main className="px-zen-lg py-zen-xl max-w-7xl mx-auto">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <History className="w-8 h-8 text-gray-600" />
              <h1 className="text-3xl font-bold">Insights History</h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse through your previous insights and breakthroughs. Each entry contains the complete analysis and results.
            </p>
          </div>

          {/* Search */}
          <Card className="p-6">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Search insights by question or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} className="flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <span>Search</span>
              </Button>
              <Button onClick={loadInsights} variant="outline" className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>All</span>
              </Button>
            </div>
          </Card>

          {/* Insights List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-black rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Loading insights...</p>
              </div>
            ) : insights.length === 0 ? (
              <Card className="p-12 text-center">
                <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">No Insights Yet</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery ? "No insights match your search." : "Start asking questions to build your insights history."}
                </p>
                <Button onClick={() => window.location.href = "/"}>
                  Ask Your First Question
                </Button>
              </Card>
            ) : (
              insights.map((insight) => (
                <Card key={insight.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(insight.created_at), 'MMM d, yyyy • h:mm a')}</span>
                        </div>
                        <h3 className="text-lg font-semibold line-clamp-2">
                          {insight.question}
                        </h3>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button
                          onClick={() => setSelectedInsight(insight)}
                          size="sm"
                          className="flex items-center space-x-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </Button>
                        <Button
                          onClick={() => handleDelete(insight.id)}
                          size="sm"
                          variant="outline"
                          className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Insight Preview */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-800 line-clamp-3">{insight.insight}</p>
                    </div>

                    {/* Metrics */}
                    <div className="flex items-center space-x-4 text-sm">
                      <Badge className={getConfidenceColor(insight.confidence)}>
                        {Math.round(insight.confidence * 100)}% Confidence
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Zap className="w-4 h-4 text-orange-500" />
                        <span>{insight.tension_points} Tension</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        <span>{insight.processing_depth} Layers</span>
                      </div>
                      {insight.emergence_detected && (
                        <Badge variant="outline" className="border-green-500 text-green-700">
                          Emergence
                        </Badge>
                      )}
                      {insight.novelty_score && insight.novelty_score >= 8 && (
                        <Badge variant="outline" className="border-purple-500 text-purple-700">
                          High Novelty
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Load More */}
          {insights.length >= 50 && (
            <div className="text-center">
              <Button variant="outline" onClick={loadInsights}>
                Load More Insights
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default InsightsHistory;

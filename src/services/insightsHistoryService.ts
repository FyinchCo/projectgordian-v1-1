
import { supabase } from "@/integrations/supabase/client";

export interface StoredInsight {
  id: string;
  question: string;
  insight: string;
  confidence: number;
  tension_points: number;
  processing_depth: number;
  circuit_type: string;
  novelty_score?: number;
  emergence_detected?: boolean;
  full_results: any; // Complete results object
  created_at: string;
  user_id?: string;
}

export class InsightsHistoryService {
  async saveInsight(question: string, results: any): Promise<string | null> {
    try {
      console.log('Saving insight to history:', { question, hasResults: !!results });
      
      const insightData = {
        question: question.trim(),
        insight: results.insight || '',
        confidence: results.confidence || 0,
        tension_points: results.tensionPoints || 0,
        processing_depth: results.processingDepth || 1,
        circuit_type: results.circuitType || 'sequential',
        novelty_score: results.noveltyScore,
        emergence_detected: results.emergenceDetected || false,
        full_results: results
      };

      const { data, error } = await supabase
        .from('insights_history')
        .insert([insightData])
        .select('id')
        .single();

      if (error) {
        console.error('Failed to save insight:', error);
        return null;
      }

      console.log('Insight saved successfully with ID:', data.id);
      return data.id;
    } catch (error) {
      console.error('Error saving insight:', error);
      return null;
    }
  }

  async getInsights(limit: number = 50): Promise<StoredInsight[]> {
    try {
      const { data, error } = await supabase
        .from('insights_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Failed to fetch insights:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching insights:', error);
      return [];
    }
  }

  async getInsightById(id: string): Promise<StoredInsight | null> {
    try {
      const { data, error } = await supabase
        .from('insights_history')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Failed to fetch insight:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching insight:', error);
      return null;
    }
  }

  async deleteInsight(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('insights_history')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Failed to delete insight:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting insight:', error);
      return false;
    }
  }

  async searchInsights(query: string): Promise<StoredInsight[]> {
    try {
      const { data, error } = await supabase
        .from('insights_history')
        .select('*')
        .or(`question.ilike.%${query}%,insight.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Failed to search insights:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error searching insights:', error);
      return [];
    }
  }
}

export const insightsHistoryService = new InsightsHistoryService();

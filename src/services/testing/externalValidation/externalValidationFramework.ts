import { supabase } from "@/integrations/supabase/client";
import { TestQuestion, TestResult } from '../types';

export interface ExternalLLMResult {
  provider: string;
  model: string;
  response: string;
  processingTime: number;
  timestamp: number;
  error?: string;
}

export interface ValidationTestResult {
  questionId: string;
  question: string;
  geniusMachineResult: {
    insight: string;
    confidence: number;
    tensionPoints: number;
    noveltyScore: number;
    emergenceDetected: boolean;
    processingDepth: number;
    layerCount: number;
  };
  externalResults: ExternalLLMResult[];
  evaluationMetrics?: {
    noveltyScore: number;
    coherenceScore: number;
    practicalValue: number;
    breakthroughPotential: number;
    overallPreference: 'genius-machine' | 'external' | 'tie';
  };
}

export class ExternalValidationFramework {
  private testResults: ValidationTestResult[] = [];

  // Core comparison test runner
  async runComparisonTest(questions: TestQuestion[]): Promise<ValidationTestResult[]> {
    const results: ValidationTestResult[] = [];
    
    console.log(`🎯 EXTERNAL VALIDATION TEST STARTING`);
    console.log(`Testing ${questions.length} questions across 4 AI systems...`);
    console.log('🧠 Genius Machine: 3-layer deep processing');
    console.log('🤖 External LLMs: Single-pass processing');
    
    for (const question of questions) {
      console.log(`\n📋 Testing question: ${question.question.substring(0, 50)}...`);
      
      try {
        // Get Genius Machine result with 3-layer processing
        console.log('🧠 Processing Genius Machine (3-layer architecture)...');
        const geniusResult = await this.getGeniusMachineResult(question.question);
        
        // Get external LLM results (single-pass only)
        console.log('🤖 Processing external LLMs (single-pass)...');
        const externalResults = await this.getExternalLLMResults(question.question);
        
        const testResult: ValidationTestResult = {
          questionId: question.id,
          question: question.question,
          geniusMachineResult: geniusResult,
          externalResults: externalResults
        };
        
        results.push(testResult);
        console.log(`✅ Question completed: ${results.length}/${questions.length}`);
        
        // Add delay between tests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`❌ Error testing question ${question.id}:`, error);
        // Still add a partial result to track the attempt
        results.push({
          questionId: question.id,
          question: question.question,
          geniusMachineResult: {
            insight: `Error: ${error.message}`,
            confidence: 0,
            tensionPoints: 0,
            noveltyScore: 0,
            emergenceDetected: false,
            processingDepth: 0,
            layerCount: 0
          },
          externalResults: []
        });
      }
    }
    
    console.log(`\n🎯 EXTERNAL VALIDATION COMPLETE`);
    console.log(`Processed ${results.filter(r => !r.geniusMachineResult.insight.startsWith('Error:')).length}/${results.length} questions successfully`);
    
    // Save results immediately
    this.testResults = results;
    this.saveResults();
    
    return results;
  }

  private async getGeniusMachineResult(question: string) {
    console.log('🎯 Genius Machine: Initiating 3-layer deep processing...');
    
    const { data, error } = await supabase.functions.invoke('genius-machine', {
      body: {
        question,
        processingDepth: 3, // EXPLICITLY SET TO 3 LAYERS
        circuitType: 'sequential',
        enhancedMode: true
      }
    });

    if (error) {
      console.error('❌ Genius Machine error:', error);
      throw error;
    }

    console.log(`✅ Genius Machine completed ${data.processingDepth || 3} layers with ${data.layers?.length || 0} layer results`);

    return {
      insight: data.insight || 'No insight generated',
      confidence: data.confidence || 0,
      tensionPoints: data.tensionPoints || 0,
      noveltyScore: data.noveltyScore || 0,
      emergenceDetected: data.emergenceDetected || false,
      processingDepth: data.processingDepth || 3,
      layerCount: data.layers?.length || 0
    };
  }

  private async getExternalLLMResults(question: string): Promise<ExternalLLMResult[]> {
    const results: ExternalLLMResult[] = [];
    
    // Test with multiple external LLMs - single-pass only
    const llmTests = [
      { provider: 'OpenAI', model: 'gpt-4o-mini', endpoint: 'openai-comparison' },
      { provider: 'Anthropic', model: 'claude-3-5-sonnet', endpoint: 'claude-comparison' },
      { provider: 'Google', model: 'gemini-1.5-pro', endpoint: 'gemini-comparison' }
    ];
    
    console.log('🤖 External LLMs: Single-pass processing (architectural limitation)');
    
    for (const llm of llmTests) {
      try {
        const startTime = Date.now();
        console.log(`Processing ${llm.provider} ${llm.model}...`);
        
        const { data, error } = await supabase.functions.invoke(llm.endpoint, {
          body: { question }
        });
        
        const processingTime = Date.now() - startTime;
        
        if (error) {
          console.error(`❌ ${llm.provider} error:`, error);
          results.push({
            provider: llm.provider,
            model: llm.model,
            response: '',
            processingTime,
            timestamp: Date.now(),
            error: error.message
          });
        } else {
          console.log(`✅ ${llm.provider} completed in ${processingTime}ms`);
          results.push({
            provider: llm.provider,
            model: llm.model,
            response: data.response || 'No response generated',
            processingTime,
            timestamp: Date.now()
          });
        }
        
      } catch (error) {
        console.error(`❌ ${llm.provider} exception:`, error);
        results.push({
          provider: llm.provider,
          model: llm.model,
          response: '',
          processingTime: 0,
          timestamp: Date.now(),
          error: error.message
        });
      }
    }
    
    return results;
  }

  // Blind evaluation utilities
  async generateBlindEvaluationData(results: ValidationTestResult[]): Promise<any[]> {
    const blindData = [];
    
    for (const result of results) {
      const responses = [
        {
          id: `genius-${result.questionId}`,
          source: 'genius-machine',
          response: result.geniusMachineResult.insight
        }
      ];
      
      result.externalResults.forEach((ext, index) => {
        if (!ext.error) {
          responses.push({
            id: `external-${result.questionId}-${index}`,
            source: `${ext.provider}-${ext.model}`,
            response: ext.response
          });
        }
      });
      
      // Shuffle responses for blind evaluation
      const shuffled = responses.sort(() => Math.random() - 0.5);
      
      blindData.push({
        question: result.question,
        responses: shuffled.map((r, i) => ({
          ...r,
          blindId: `response-${i + 1}`
        }))
      });
    }
    
    return blindData;
  }

  // Statistical analysis
  calculateValidationMetrics(results: ValidationTestResult[]) {
    const metrics = {
      totalTests: results.length,
      successfulTests: results.filter(r => r.externalResults.some(ext => !ext.error)).length,
      averageGeniusMetrics: {
        confidence: 0,
        noveltyScore: 0,
        tensionPoints: 0,
        emergenceRate: 0,
        averageProcessingDepth: 0,
        averageLayerCount: 0
      },
      externalProviderStats: {} as Record<string, any>
    };

    // Calculate Genius Machine averages with depth tracking
    const validGeniusResults = results.filter(r => r.geniusMachineResult);
    if (validGeniusResults.length > 0) {
      metrics.averageGeniusMetrics.confidence = 
        validGeniusResults.reduce((sum, r) => sum + r.geniusMachineResult.confidence, 0) / validGeniusResults.length;
      metrics.averageGeniusMetrics.noveltyScore = 
        validGeniusResults.reduce((sum, r) => sum + r.geniusMachineResult.noveltyScore, 0) / validGeniusResults.length;
      metrics.averageGeniusMetrics.tensionPoints = 
        validGeniusResults.reduce((sum, r) => sum + r.geniusMachineResult.tensionPoints, 0) / validGeniusResults.length;
      metrics.averageGeniusMetrics.emergenceRate = 
        validGeniusResults.filter(r => r.geniusMachineResult.emergenceDetected).length / validGeniusResults.length;
      metrics.averageGeniusMetrics.averageProcessingDepth =
        validGeniusResults.reduce((sum, r) => sum + r.geniusMachineResult.processingDepth, 0) / validGeniusResults.length;
      metrics.averageGeniusMetrics.averageLayerCount =
        validGeniusResults.reduce((sum, r) => sum + r.geniusMachineResult.layerCount, 0) / validGeniusResults.length;
    }

    // Calculate external provider statistics
    results.forEach(result => {
      result.externalResults.forEach(ext => {
        const key = `${ext.provider}-${ext.model}`;
        if (!metrics.externalProviderStats[key]) {
          metrics.externalProviderStats[key] = {
            totalTests: 0,
            successfulTests: 0,
            averageResponseTime: 0,
            responses: []
          };
        }
        
        metrics.externalProviderStats[key].totalTests++;
        if (!ext.error) {
          metrics.externalProviderStats[key].successfulTests++;
          metrics.externalProviderStats[key].responses.push(ext.response);
        }
        metrics.externalProviderStats[key].averageResponseTime += ext.processingTime;
      });
    });

    // Calculate averages for response times
    Object.keys(metrics.externalProviderStats).forEach(key => {
      const stats = metrics.externalProviderStats[key];
      stats.averageResponseTime = stats.totalTests > 0 ? stats.averageResponseTime / stats.totalTests : 0;
      stats.successRate = stats.totalTests > 0 ? stats.successfulTests / stats.totalTests : 0;
    });

    return metrics;
  }

  // Data persistence with better error handling
  private saveResults() {
    try {
      const dataToSave = {
        results: this.testResults,
        timestamp: Date.now(),
        version: '1.0'
      };
      localStorage.setItem('external-validation-results', JSON.stringify(dataToSave));
      console.log(`💾 Saved ${this.testResults.length} validation results to localStorage`);
    } catch (error) {
      console.error('Failed to save results:', error);
    }
  }

  loadResults(): ValidationTestResult[] {
    try {
      const stored = localStorage.getItem('external-validation-results');
      if (stored) {
        const data = JSON.parse(stored);
        // Handle both old and new format
        this.testResults = data.results || data || [];
        console.log(`📁 Loaded ${this.testResults.length} previous validation results`);
      } else {
        console.log('📁 No previous validation results found');
        this.testResults = [];
      }
    } catch (error) {
      console.error('Failed to load results:', error);
      this.testResults = [];
    }
    return this.testResults;
  }

  getResults(): ValidationTestResult[] {
    return this.testResults;
  }

  clearResults(): void {
    this.testResults = [];
    localStorage.removeItem('external-validation-results');
    console.log('🗑️ Cleared all validation results');
  }

  // Debug method to check current state
  debugState(): void {
    console.log('🔍 External Validation Framework Debug State:');
    console.log(`Current results in memory: ${this.testResults.length}`);
    console.log(`LocalStorage key exists: ${!!localStorage.getItem('external-validation-results')}`);
    
    const stored = localStorage.getItem('external-validation-results');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        console.log(`LocalStorage results count: ${(data.results || data || []).length}`);
      } catch (e) {
        console.log('LocalStorage data corrupted');
      }
    }
  }
}

export const externalValidationFramework = new ExternalValidationFramework();

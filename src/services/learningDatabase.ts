
interface LearningRecord {
  id: string;
  timestamp: number;
  question: string;
  questionHash: string; // For quick lookups of similar questions
  domainType: string;
  complexity: number;
  configuration: {
    processingDepth: number;
    circuitType: string;
    enhancedMode: boolean;
    archetypeConfigurations: any[];
    tensionParameters: any;
  };
  results: {
    insight: string;
    confidence: number;
    tensionPoints: number;
    noveltyScore: number;
    emergenceDetected: boolean;
    processingTime: number;
  };
  qualityMetrics: {
    geniusYield: number;
    constraintBalance: number;
    metaPotential: number;
    effortVsEmergence: number;
    overallScore: number;
    userSatisfaction?: number; // Future: user feedback
  };
  configurationEffectiveness: number; // Predicted vs actual quality
  learningTags: string[]; // For pattern recognition
}

interface PatternInsight {
  pattern: string;
  confidence: number;
  sampleSize: number;
  averageQuality: number;
  bestConfiguration: any;
  applicableDomains: string[];
}

export class LearningDatabase {
  private static readonly STORAGE_KEY = 'genius-machine-learning-db';
  private static readonly MAX_RECORDS = 10000; // Prevent localStorage bloat
  
  private records: LearningRecord[] = [];
  private patterns: PatternInsight[] = [];

  constructor() {
    this.loadFromStorage();
  }

  // Store a complete learning cycle
  addLearningRecord(record: Omit<LearningRecord, 'id' | 'timestamp' | 'questionHash'>): string {
    const id = this.generateId();
    const questionHash = this.hashQuestion(record.question);
    
    const fullRecord: LearningRecord = {
      ...record,
      id,
      timestamp: Date.now(),
      questionHash,
      configurationEffectiveness: this.calculateConfigEffectiveness(record),
      learningTags: this.generateLearningTags(record)
    };

    this.records.push(fullRecord);
    
    // Maintain size limit
    if (this.records.length > LearningDatabase.MAX_RECORDS) {
      this.records.shift();
    }
    
    this.saveToStorage();
    this.updatePatterns();
    
    console.log('Learning record added:', { id, quality: record.qualityMetrics.overallScore });
    return id;
  }

  // Find similar questions and their best configurations
  findSimilarQuestions(question: string, limit: number = 5): LearningRecord[] {
    const questionHash = this.hashQuestion(question);
    const keywords = this.extractKeywords(question);
    
    return this.records
      .map(record => ({
        record,
        similarity: this.calculateSimilarity(question, keywords, record)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(item => item.record);
  }

  // Get the best configuration for a specific domain/complexity
  getBestConfigurationFor(domainType: string, complexity: number): any | null {
    const relevantRecords = this.records.filter(r => 
      r.domainType === domainType && 
      Math.abs(r.complexity - complexity) <= 2
    );

    if (relevantRecords.length === 0) return null;

    const bestRecord = relevantRecords.reduce((best, current) => 
      current.qualityMetrics.overallScore > best.qualityMetrics.overallScore ? current : best
    );

    return {
      configuration: bestRecord.configuration,
      expectedQuality: bestRecord.qualityMetrics.overallScore,
      confidence: Math.min(relevantRecords.length / 10, 1) // More samples = higher confidence
    };
  }

  // Analyze what configurations work best
  analyzeConfigurationPatterns(): PatternInsight[] {
    const patterns: Map<string, LearningRecord[]> = new Map();
    
    // Group by configuration signatures
    this.records.forEach(record => {
      const signature = this.createConfigurationSignature(record.configuration);
      if (!patterns.has(signature)) {
        patterns.set(signature, []);
      }
      patterns.get(signature)!.push(record);
    });

    const insights: PatternInsight[] = [];
    
    patterns.forEach((records, signature) => {
      if (records.length < 3) return; // Need minimum sample size
      
      const avgQuality = records.reduce((sum, r) => sum + r.qualityMetrics.overallScore, 0) / records.length;
      const domains = [...new Set(records.map(r => r.domainType))];
      
      insights.push({
        pattern: signature,
        confidence: Math.min(records.length / 20, 1),
        sampleSize: records.length,
        averageQuality: avgQuality,
        bestConfiguration: records.reduce((best, current) => 
          current.qualityMetrics.overallScore > best.qualityMetrics.overallScore ? current : best
        ).configuration,
        applicableDomains: domains
      });
    });

    return insights.sort((a, b) => b.averageQuality - a.averageQuality);
  }

  // Get learning statistics
  getLearningStats() {
    if (this.records.length === 0) {
      return {
        totalRecords: 0,
        averageQuality: 0,
        improvementTrend: 0,
        bestDomains: [],
        learningEfficiency: 0
      };
    }

    const recentRecords = this.records.slice(-50); // Last 50 records
    const olderRecords = this.records.slice(0, -50);
    
    const recentAvg = recentRecords.reduce((sum, r) => sum + r.qualityMetrics.overallScore, 0) / recentRecords.length;
    const olderAvg = olderRecords.length > 0 ? 
      olderRecords.reduce((sum, r) => sum + r.qualityMetrics.overallScore, 0) / olderRecords.length : recentAvg;
    
    const domainStats = new Map<string, number[]>();
    this.records.forEach(record => {
      if (!domainStats.has(record.domainType)) {
        domainStats.set(record.domainType, []);
      }
      domainStats.get(record.domainType)!.push(record.qualityMetrics.overallScore);
    });

    const bestDomains = Array.from(domainStats.entries())
      .map(([domain, scores]) => ({
        domain,
        averageQuality: scores.reduce((sum, score) => sum + score, 0) / scores.length,
        sampleSize: scores.length
      }))
      .sort((a, b) => b.averageQuality - a.averageQuality)
      .slice(0, 5);

    return {
      totalRecords: this.records.length,
      averageQuality: this.records.reduce((sum, r) => sum + r.qualityMetrics.overallScore, 0) / this.records.length,
      improvementTrend: recentAvg - olderAvg,
      bestDomains,
      learningEfficiency: this.calculateLearningEfficiency()
    };
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private hashQuestion(question: string): string {
    // Simple hash for grouping similar questions
    const normalized = question.toLowerCase().replace(/[^\w\s]/g, '').trim();
    const words = normalized.split(/\s+/).sort();
    return words.slice(0, 10).join('-'); // Use first 10 sorted words
  }

  private extractKeywords(question: string): string[] {
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
    return question.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word))
      .slice(0, 20);
  }

  private calculateSimilarity(question: string, keywords: string[], record: LearningRecord): number {
    const recordKeywords = this.extractKeywords(record.question);
    const commonKeywords = keywords.filter(k => recordKeywords.includes(k));
    
    const keywordSimilarity = commonKeywords.length / Math.max(keywords.length, recordKeywords.length);
    const domainBonus = 0.2; // Small bonus for any match
    
    return keywordSimilarity + domainBonus;
  }

  private calculateConfigEffectiveness(record: any): number {
    // Calculate how well the configuration performed vs baseline
    const baseline = 5; // Average expected quality
    return (record.qualityMetrics.overallScore - baseline) / 5; // Normalized -1 to 1
  }

  private generateLearningTags(record: any): string[] {
    const tags: string[] = [];
    
    // Quality-based tags
    if (record.qualityMetrics.overallScore >= 8) tags.push('high-quality');
    if (record.qualityMetrics.overallScore <= 4) tags.push('low-quality');
    if (record.results.emergenceDetected) tags.push('emergent');
    if (record.results.noveltyScore >= 8) tags.push('novel');
    
    // Configuration tags
    if (record.configuration.enhancedMode) tags.push('enhanced');
    if (record.configuration.processingDepth >= 10) tags.push('deep-processing');
    
    // Domain tags
    tags.push(`domain-${record.domainType.toLowerCase()}`);
    tags.push(`complexity-${record.complexity}`);
    
    return tags;
  }

  private createConfigurationSignature(config: any): string {
    // Create a signature for grouping similar configurations
    return `${config.circuitType}-${config.enhancedMode ? 'enhanced' : 'basic'}-depth${Math.floor(config.processingDepth / 5) * 5}`;
  }

  private updatePatterns(): void {
    this.patterns = this.analyzeConfigurationPatterns();
  }

  private calculateLearningEfficiency(): number {
    if (this.records.length < 10) return 0;
    
    // Measure how quickly the system is improving
    const batches = [];
    const batchSize = 10;
    
    for (let i = 0; i < this.records.length; i += batchSize) {
      const batch = this.records.slice(i, i + batchSize);
      const avgQuality = batch.reduce((sum, r) => sum + r.qualityMetrics.overallScore, 0) / batch.length;
      batches.push(avgQuality);
    }
    
    if (batches.length < 2) return 0;
    
    // Calculate trend
    const firstHalf = batches.slice(0, Math.floor(batches.length / 2));
    const secondHalf = batches.slice(Math.floor(batches.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, q) => sum + q, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, q) => sum + q, 0) / secondHalf.length;
    
    return (secondAvg - firstAvg) / firstAvg; // Percentage improvement
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(LearningDatabase.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.records = data.records || [];
        this.patterns = data.patterns || [];
      }
    } catch (error) {
      console.warn('Could not load learning database:', error);
      this.records = [];
      this.patterns = [];
    }
  }

  private saveToStorage(): void {
    try {
      const data = {
        records: this.records,
        patterns: this.patterns,
        lastUpdated: Date.now()
      };
      localStorage.setItem(LearningDatabase.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Could not save learning database:', error);
    }
  }
}

// Singleton instance
export const learningDatabase = new LearningDatabase();

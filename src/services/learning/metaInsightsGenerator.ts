
import { MetaInsight } from './types';

export class MetaInsightsGenerator {
  generateMetaInsights(similarQuestions: any[], patterns: any[]): MetaInsight[] {
    const insights: MetaInsight[] = [];
    
    // Archetype effectiveness analysis
    if (similarQuestions.length >= 3) {
      const archetypePerformance = this.analyzeArchetypePerformance(similarQuestions);
      if (archetypePerformance.insight) {
        insights.push({
          type: 'archetype_tuning',
          insight: archetypePerformance.insight,
          evidence: `Based on ${similarQuestions.length} similar questions`,
          confidence: archetypePerformance.confidence,
          applicability: ['similar_domain']
        });
      }
    }
    
    // Circuit type optimization
    if (patterns.length >= 2) {
      const circuitInsight = this.analyzeCircuitEffectiveness(patterns);
      if (circuitInsight.insight) {
        insights.push({
          type: 'circuit_optimization',
          insight: circuitInsight.insight,
          evidence: `Pattern analysis across ${patterns.length} configuration types`,
          confidence: circuitInsight.confidence,
          applicability: ['general']
        });
      }
    }
    
    return insights;
  }

  private analyzeArchetypePerformance(questions: any[]) {
    // Analyze which archetype configurations led to highest quality
    const archetypeScores = new Map();
    
    questions.forEach(q => {
      if (q.configuration.archetypeConfigurations) {
        q.configuration.archetypeConfigurations.forEach((arch: any) => {
          const key = `${arch.name}-${arch.emphasis}`;
          if (!archetypeScores.has(key)) {
            archetypeScores.set(key, []);
          }
          archetypeScores.get(key).push(q.qualityMetrics.overallScore);
        });
      }
    });
    
    let bestArchetype = '';
    let bestScore = 0;
    
    archetypeScores.forEach((scores, key) => {
      const avg = scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length;
      if (avg > bestScore) {
        bestScore = avg;
        bestArchetype = key;
      }
    });
    
    if (bestScore > 6) {
      return {
        insight: `Emphasis on ${bestArchetype} archetype shows superior results`,
        confidence: Math.min(questions.length / 10, 0.8)
      };
    }
    
    return { insight: null, confidence: 0 };
  }

  private analyzeCircuitEffectiveness(patterns: any[]) {
    const circuitPerformance = new Map();
    
    patterns.forEach(pattern => {
      const circuit = pattern.pattern.split('-')[0];
      if (!circuitPerformance.has(circuit)) {
        circuitPerformance.set(circuit, []);
      }
      circuitPerformance.get(circuit).push(pattern.averageQuality);
    });
    
    let bestCircuit = '';
    let bestScore = 0;
    
    circuitPerformance.forEach((scores, circuit) => {
      const avg = scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length;
      if (avg > bestScore) {
        bestScore = avg;
        bestCircuit = circuit;
      }
    });
    
    if (bestScore > 6) {
      return {
        insight: `${bestCircuit} circuit type consistently outperforms alternatives`,
        confidence: 0.7
      };
    }
    
    return { insight: null, confidence: 0 };
  }
}

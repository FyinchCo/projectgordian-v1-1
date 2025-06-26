
import { ProcessingResult } from './types';

export interface EnhancedQualityMetrics {
  // Core Quality Dimensions
  insightDepth: number;        // 1-10: How deep/meaningful is the insight?
  practicalValue: number;      // 1-10: How actionable/useful is this?
  noveltyScore: number;        // 1-10: How original/unexpected?
  coherenceScore: number;      // 1-10: How well does it hang together?
  
  // Processing Quality
  systemReliability: number;   // 1-10: How smoothly did processing go?
  responseCompleteness: number; // 1-10: Did we get everything requested?
  
  // Meta Qualities
  breakthroughPotential: number; // 1-10: Could this lead to bigger insights?
  userSatisfactionPredictor: number; // 1-10: Will user find this valuable?
  
  // Overall
  overallQuality: number;
  
  // Detailed Feedback
  strengths: string[];
  improvements: string[];
  confidenceLevel: 'High' | 'Medium' | 'Low';
}

export class QualityScorer {
  calculateEnhancedQuality(
    result: ProcessingResult,
    processingMetrics: {
      requestedDepth: number;
      actualDepth: number;
      processingTime: number;
      chunkFailures: number;
      fallbacksUsed: number;
    }
  ): EnhancedQualityMetrics {
    
    // Core Quality Calculations
    const insightDepth = this.calculateInsightDepth(result);
    const practicalValue = this.calculatePracticalValue(result);
    const noveltyScore = Math.min(10, (result.noveltyScore || 5) + (result.emergenceDetected ? 2 : 0));
    const coherenceScore = this.calculateCoherence(result);
    
    // Processing Quality
    const systemReliability = this.calculateSystemReliability(processingMetrics);
    const responseCompleteness = this.calculateCompleteness(result, processingMetrics);
    
    // Meta Qualities  
    const breakthroughPotential = this.calculateBreakthroughPotential(result);
    const userSatisfactionPredictor = this.calculateUserSatisfaction(
      insightDepth, practicalValue, systemReliability
    );
    
    // Overall Quality (weighted average)
    const overallQuality = Math.round(
      (insightDepth * 0.25) +
      (practicalValue * 0.20) +
      (noveltyScore * 0.15) +
      (coherenceScore * 0.15) +
      (systemReliability * 0.10) +
      (responseCompleteness * 0.05) +
      (breakthroughPotential * 0.10)
    );
    
    // Generate feedback
    const strengths = this.identifyStrengths({
      insightDepth, practicalValue, noveltyScore, coherenceScore,
      systemReliability, breakthroughPotential
    });
    
    const improvements = this.identifyImprovements({
      insightDepth, practicalValue, noveltyScore, coherenceScore,
      systemReliability, responseCompleteness
    });
    
    const confidenceLevel = this.determineConfidenceLevel(result, processingMetrics);
    
    return {
      insightDepth,
      practicalValue,
      noveltyScore,
      coherenceScore,
      systemReliability,
      responseCompleteness,
      breakthroughPotential,
      userSatisfactionPredictor,
      overallQuality,
      strengths,
      improvements,
      confidenceLevel
    };
  }

  private calculateInsightDepth(result: ProcessingResult): number {
    const baseScore = Math.min(10, (result.insight?.length || 0) / 100 + 3);
    const tensionBonus = Math.min(2, (result.tensionPoints || 0) * 0.3);
    const layerBonus = Math.min(2, (result.layers?.length || 0) * 0.2);
    
    return Math.min(10, Math.round(baseScore + tensionBonus + layerBonus));
  }

  private calculatePracticalValue(result: ProcessingResult): number {
    // Look for actionable language, specific recommendations, concrete steps
    const insight = result.insight?.toLowerCase() || '';
    const actionWords = ['should', 'could', 'recommend', 'suggest', 'implement', 'consider', 'try'];
    const actionableCount = actionWords.filter(word => insight.includes(word)).length;
    
    const baseScore = 5;
    const actionBonus = Math.min(3, actionableCount * 0.5);
    const confidenceBonus = Math.min(2, (result.confidence || 0.5) * 2);
    
    return Math.min(10, Math.round(baseScore + actionBonus + confidenceBonus));
  }

  private calculateCoherence(result: ProcessingResult): number {
    const baseScore = Math.min(10, (result.confidence || 0.5) * 8 + 2);
    const layerConsistency = result.layers?.length > 0 ? 1 : 0;
    
    return Math.min(10, Math.round(baseScore + layerConsistency));
  }

  private calculateSystemReliability(metrics: any): number {
    const baseScore = 10;
    const failurePenalty = Math.min(4, metrics.chunkFailures * 1.5);
    const fallbackPenalty = Math.min(2, metrics.fallbacksUsed * 1.0);
    const timeoutPenalty = metrics.processingTime > 300 ? 1 : 0; // 5+ minutes
    
    return Math.max(1, Math.round(baseScore - failurePenalty - fallbackPenalty - timeoutPenalty));
  }

  private calculateCompleteness(result: ProcessingResult, metrics: any): number {
    const depthRatio = metrics.actualDepth / Math.max(1, metrics.requestedDepth);
    const baseScore = Math.min(10, depthRatio * 10);
    const partialPenalty = result.partialResults ? 2 : 0;
    
    return Math.max(1, Math.round(baseScore - partialPenalty));
  }

  private calculateBreakthroughPotential(result: ProcessingResult): number {
    const emergenceBonus = result.emergenceDetected ? 4 : 0;
    const noveltyBonus = Math.min(3, (result.noveltyScore || 5) - 5);
    const tensionBonus = Math.min(2, (result.tensionPoints || 0) * 0.2);
    const baseScore = 4;
    
    return Math.min(10, Math.round(baseScore + emergenceBonus + noveltyBonus + tensionBonus));
  }

  private calculateUserSatisfaction(insightDepth: number, practicalValue: number, reliability: number): number {
    // Weighted average with emphasis on what users actually care about
    return Math.round(
      (insightDepth * 0.4) +
      (practicalValue * 0.4) + 
      (reliability * 0.2)
    );
  }

  private identifyStrengths(scores: any): string[] {
    const strengths: string[] = [];
    
    if (scores.insightDepth >= 8) strengths.push("Deep, meaningful insights generated");
    if (scores.practicalValue >= 8) strengths.push("Highly actionable recommendations");
    if (scores.noveltyScore >= 8) strengths.push("Novel and unexpected perspectives");
    if (scores.systemReliability >= 9) strengths.push("Smooth, reliable processing");
    if (scores.breakthroughPotential >= 8) strengths.push("High potential for breakthrough insights");
    if (scores.coherenceScore >= 8) strengths.push("Well-structured and coherent analysis");
    
    return strengths.length > 0 ? strengths : ["Solid overall performance"];
  }

  private identifyImprovements(scores: any): string[] {
    const improvements: string[] = [];
    
    if (scores.insightDepth < 6) improvements.push("Increase insight depth and meaning");
    if (scores.practicalValue < 6) improvements.push("Make recommendations more actionable");
    if (scores.noveltyScore < 6) improvements.push("Explore more novel perspectives");
    if (scores.systemReliability < 7) improvements.push("Improve system stability");
    if (scores.responseCompleteness < 8) improvements.push("Ensure complete processing");
    if (scores.coherenceScore < 7) improvements.push("Enhance logical consistency");
    
    return improvements;
  }

  private determineConfidenceLevel(result: ProcessingResult, metrics: any): 'High' | 'Medium' | 'Low' {
    const confidence = result.confidence || 0.5;
    const hasFailures = metrics.chunkFailures > 0 || metrics.fallbacksUsed > 0;
    const isComplete = !result.partialResults;
    
    if (confidence >= 0.8 && !hasFailures && isComplete) return 'High';
    if (confidence >= 0.6 && metrics.chunkFailures <= 1) return 'Medium';
    return 'Low';
  }
}

export const qualityScorer = new QualityScorer();


import { ProcessingResult } from '@/components/processing/types';

export interface TestScenario {
  id: string;
  question: string;
  expectedQualities: {
    minConfidence: number;
    minNoveltyScore: number;
    minTensionPoints: number;
    shouldDetectEmergence: boolean;
  };
  category: string;
  description: string;
}

export interface TestResult {
  scenarioId: string;
  passed: boolean;
  actualResult: ProcessingResult;
  qualityScore: number;
  issues: string[];
  recommendations: string[];
  timestamp: number;
}

export interface PerformanceMetrics {
  overallScore: number;
  passRate: number;
  averageConfidence: number;
  averageNoveltyScore: number;
  emergenceDetectionRate: number;
  categoryPerformance: Record<string, number>;
  weakAreas: string[];
  strongAreas: string[];
}

export class SelfTestingEngine {
  private testScenarios: TestScenario[] = [
    {
      id: 'philosophical-depth',
      question: 'What is the nature of consciousness and how does it relate to free will?',
      expectedQualities: {
        minConfidence: 0.7,
        minNoveltyScore: 7,
        minTensionPoints: 4,
        shouldDetectEmergence: true
      },
      category: 'Philosophy',
      description: 'Tests deep philosophical reasoning and emergence detection'
    },
    {
      id: 'creative-synthesis',
      question: 'How might we redesign cities if humans could fly?',
      expectedQualities: {
        minConfidence: 0.6,
        minNoveltyScore: 8,
        minTensionPoints: 3,
        shouldDetectEmergence: true
      },
      category: 'Creative',
      description: 'Tests creative thinking and novel insight generation'
    },
    {
      id: 'business-strategy',
      question: 'What business model disruptions might emerge from widespread AI adoption?',
      expectedQualities: {
        minConfidence: 0.65,
        minNoveltyScore: 6,
        minTensionPoints: 4,
        shouldDetectEmergence: false
      },
      category: 'Business',
      description: 'Tests strategic thinking and practical analysis'
    },
    {
      id: 'technical-complexity',
      question: 'How should we approach the alignment problem in artificial general intelligence?',
      expectedQualities: {
        minConfidence: 0.75,
        minNoveltyScore: 7,
        minTensionPoints: 5,
        shouldDetectEmergence: true
      },
      category: 'Technical',
      description: 'Tests technical reasoning and complex problem solving'
    },
    {
      id: 'social-dynamics',
      question: 'How might social media evolution affect human connection and empathy?',
      expectedQualities: {
        minConfidence: 0.7,
        minNoveltyScore: 6,
        minTensionPoints: 4,
        shouldDetectEmergence: false
      },
      category: 'Social',
      description: 'Tests understanding of social dynamics and human behavior'
    }
  ];

  private testHistory: TestResult[] = [];

  evaluateResult(scenario: TestScenario, result: ProcessingResult): TestResult {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let qualityScore = 0;

    // Confidence evaluation
    const confidenceScore = result.confidence >= scenario.expectedQualities.minConfidence ? 25 : 0;
    if (confidenceScore === 0) {
      issues.push(`Low confidence: ${Math.round(result.confidence * 100)}% < ${Math.round(scenario.expectedQualities.minConfidence * 100)}%`);
      recommendations.push('Consider increasing processing depth or enhancing archetype configurations');
    }
    qualityScore += confidenceScore;

    // Novelty evaluation
    const noveltyScore = (result.noveltyScore || 0) >= scenario.expectedQualities.minNoveltyScore ? 25 : 0;
    if (noveltyScore === 0) {
      issues.push(`Low novelty: ${result.noveltyScore || 0} < ${scenario.expectedQualities.minNoveltyScore}`);
      recommendations.push('Increase archetype diversity or enhance creative thinking parameters');
    }
    qualityScore += noveltyScore;

    // Tension evaluation
    const tensionScore = result.tensionPoints >= scenario.expectedQualities.minTensionPoints ? 25 : 0;
    if (tensionScore === 0) {
      issues.push(`Insufficient tension: ${result.tensionPoints} < ${scenario.expectedQualities.minTensionPoints}`);
      recommendations.push('Enhance dialectical processing or increase contradiction threshold');
    }
    qualityScore += tensionScore;

    // Emergence evaluation
    const emergenceScore = (result.emergenceDetected || false) === scenario.expectedQualities.shouldDetectEmergence ? 25 : 0;
    if (emergenceScore === 0) {
      issues.push(`Emergence detection mismatch: expected ${scenario.expectedQualities.shouldDetectEmergence}, got ${result.emergenceDetected || false}`);
      recommendations.push('Calibrate emergence detection algorithms or adjust synthesis parameters');
    }
    qualityScore += emergenceScore;

    const passed = qualityScore >= 75; // 3 out of 4 criteria must pass

    const testResult: TestResult = {
      scenarioId: scenario.id,
      passed,
      actualResult: result,
      qualityScore,
      issues,
      recommendations,
      timestamp: Date.now()
    };

    this.testHistory.push(testResult);
    return testResult;
  }

  analyzePerformance(): PerformanceMetrics {
    if (this.testHistory.length === 0) {
      return {
        overallScore: 0,
        passRate: 0,
        averageConfidence: 0,
        averageNoveltyScore: 0,
        emergenceDetectionRate: 0,
        categoryPerformance: {},
        weakAreas: ['No test data available'],
        strongAreas: []
      };
    }

    const recentTests = this.testHistory.slice(-50); // Analyze last 50 tests
    const totalTests = recentTests.length;
    const passedTests = recentTests.filter(t => t.passed).length;

    // Calculate averages
    const avgConfidence = recentTests.reduce((sum, t) => sum + t.actualResult.confidence, 0) / totalTests;
    const avgNoveltyScore = recentTests.reduce((sum, t) => sum + (t.actualResult.noveltyScore || 0), 0) / totalTests;
    const emergenceDetected = recentTests.filter(t => t.actualResult.emergenceDetected).length;

    // Category performance
    const categoryPerformance: Record<string, number> = {};
    this.testScenarios.forEach(scenario => {
      const categoryTests = recentTests.filter(t => t.scenarioId === scenario.id);
      if (categoryTests.length > 0) {
        const categoryPassRate = categoryTests.filter(t => t.passed).length / categoryTests.length;
        categoryPerformance[scenario.category] = Math.round(categoryPassRate * 100);
      }
    });

    // Identify weak and strong areas
    const weakAreas: string[] = [];
    const strongAreas: string[] = [];
    
    Object.entries(categoryPerformance).forEach(([category, score]) => {
      if (score < 60) weakAreas.push(category);
      if (score >= 80) strongAreas.push(category);
    });

    // Add specific weak areas based on common issues
    const commonIssues = recentTests.flatMap(t => t.issues);
    if (commonIssues.filter(i => i.includes('Low confidence')).length > totalTests * 0.3) {
      weakAreas.push('Confidence calibration');
    }
    if (commonIssues.filter(i => i.includes('Low novelty')).length > totalTests * 0.3) {
      weakAreas.push('Novelty generation');
    }
    if (commonIssues.filter(i => i.includes('Insufficient tension')).length > totalTests * 0.3) {
      weakAreas.push('Dialectical processing');
    }

    return {
      overallScore: Math.round((passedTests / totalTests) * 100),
      passRate: Math.round((passedTests / totalTests) * 100),
      averageConfidence: Math.round(avgConfidence * 100),
      averageNoveltyScore: Math.round(avgNoveltyScore),
      emergenceDetectionRate: Math.round((emergenceDetected / totalTests) * 100),
      categoryPerformance,
      weakAreas: [...new Set(weakAreas)],
      strongAreas: [...new Set(strongAreas)]
    };
  }

  getTestScenarios(): TestScenario[] {
    return [...this.testScenarios];
  }

  getTestHistory(): TestResult[] {
    return [...this.testHistory];
  }

  clearTestHistory(): void {
    this.testHistory = [];
  }

  addCustomTestScenario(scenario: TestScenario): void {
    this.testScenarios.push(scenario);
  }
}

export const selfTestingEngine = new SelfTestingEngine();

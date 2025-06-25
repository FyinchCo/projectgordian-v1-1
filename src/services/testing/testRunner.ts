
import { supabase } from "@/integrations/supabase/client";
import { ArchetypeTestConfiguration, TestQuestion, TestResult } from './types';
import { qualityAnalyzer } from './qualityAnalyzer';

export class TestRunner {
  async runTest(
    configuration: ArchetypeTestConfiguration,
    question: TestQuestion, 
    processingDepth: number = 1,
    maxRetries: number = 3
  ): Promise<TestResult> {
    console.log(`Starting test: ${configuration.name} × ${question.question.substring(0, 50)}...`);
    const startTime = Date.now();
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Test attempt ${attempt}/${maxRetries} for ${configuration.id} + ${question.id}`);
        
        const { data, error } = await supabase.functions.invoke('genius-machine', {
          body: {
            question: question.question,
            processingDepth: Math.min(processingDepth, 2),
            circuitType: 'sequential',
            customArchetypes: configuration.archetypes,
            enhancedMode: true
          }
        });

        if (error) {
          console.error(`Test attempt ${attempt} failed with error:`, error);
          if (attempt === maxRetries) {
            throw new Error(`Test failed after ${maxRetries} attempts: ${error.message}`);
          }
          
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
          console.log(`Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        if (!data) {
          console.error(`Test attempt ${attempt} returned no data`);
          if (attempt === maxRetries) {
            throw new Error('Test returned no data after all retry attempts');
          }
          continue;
        }

        const processingTime = Date.now() - startTime;
        console.log(`Test completed successfully in ${processingTime}ms after ${attempt} attempts`);
        
        const qualityMetrics = qualityAnalyzer.calculateQualityMetrics(data, question);
        
        const testResult: TestResult = {
          configurationId: configuration.id,
          questionId: question.id,
          timestamp: Date.now(),
          processingTime,
          results: data,
          qualityMetrics
        };

        return testResult;

      } catch (error) {
        console.error(`Test attempt ${attempt} failed:`, error);
        
        if (attempt === maxRetries) {
          const fallbackResult: TestResult = {
            configurationId: configuration.id,
            questionId: question.id,
            timestamp: Date.now(),
            processingTime: Date.now() - startTime,
            results: {
              insight: `Test failed after ${maxRetries} attempts: ${error.message}`,
              confidence: 0.1,
              tensionPoints: 0,
              noveltyScore: 0,
              emergenceDetected: false,
              questionQuality: null,
              layers: []
            },
            qualityMetrics: {
              insightQuality: 0,
              noveltyScore: 0,
              coherenceScore: 0,
              breakthroughPotential: 0,
              practicalValue: 0,
              overallScore: 0
            }
          };
          
          throw error;
        }
        
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        console.log(`Waiting ${delay}ms before retry attempt ${attempt + 1}...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new Error('Test failed after all retry attempts');
  }

  async runBatchTest(
    configurations: ArchetypeTestConfiguration[],
    questions: TestQuestion[],
    configurationIds: string[], 
    questionIds: string[], 
    onProgress?: (current: number, total: number) => void
  ): Promise<TestResult[]> {
    const results: TestResult[] = [];
    const total = configurationIds.length * questionIds.length;
    let current = 0;
    let successfulTests = 0;
    let failedTests = 0;

    console.log(`Starting batch test: ${total} total tests`);

    for (const configId of configurationIds) {
      const configuration = configurations.find(c => c.id === configId);
      if (!configuration) continue;

      for (const questionId of questionIds) {
        const question = questions.find(q => q.id === questionId);
        if (!question) continue;

        try {
          console.log(`Running test ${current + 1}/${total}: ${configId} + ${questionId}`);
          const result = await this.runTest(configuration, question, 1, 2);
          results.push(result);
          successfulTests++;
          console.log(`Test ${current + 1} successful`);
        } catch (error) {
          console.error(`Test ${current + 1} failed for config ${configId}, question ${questionId}:`, error);
          failedTests++;
        } finally {
          current++;
          onProgress?.(current, total);
          
          if (current < total) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
      }
    }

    console.log(`Batch test completed: ${successfulTests} successful, ${failedTests} failed out of ${total} total`);
    return results;
  }
}

export const testRunner = new TestRunner();

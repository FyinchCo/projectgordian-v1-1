
import { ArchetypeTestConfiguration, TestQuestion, TestResult } from './types';

export class DataManager {
  private storageKey = 'archetype-testing-framework';

  saveData(configurations: ArchetypeTestConfiguration[], testQuestions: TestQuestion[], testResults: TestResult[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify({
      configurations,
      testQuestions,
      testResults
    }));
  }

  loadStoredData(): {
    configurations: ArchetypeTestConfiguration[];
    testQuestions: TestQuestion[];
    testResults: TestResult[];
  } {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      const data = JSON.parse(stored);
      return {
        configurations: data.configurations || [],
        testQuestions: data.testQuestions || [],
        testResults: data.testResults || []
      };
    }
    return {
      configurations: [],
      testQuestions: [],
      testResults: []
    };
  }

  clearAllData(): void {
    localStorage.removeItem(this.storageKey);
  }
}

export const dataManager = new DataManager();

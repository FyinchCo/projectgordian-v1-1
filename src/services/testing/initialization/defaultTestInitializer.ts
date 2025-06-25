
import { archetypeTestingFramework } from '../archetypeTestingFramework';
import {
  currentDefaultConfiguration,
  highCreativeConfiguration,
  balancedDefaultConfiguration,
  analyticalFocusConfiguration
} from '../configurations';
import { benchmarkQuestions } from '../questions';

export function initializeDefaultTestData() {
  console.log('Initializing default test data...');
  
  // Clear existing data to ensure clean initialization
  archetypeTestingFramework.clearAllData();
  
  // Add all configurations
  console.log('Adding default configurations...');
  archetypeTestingFramework.addConfiguration(currentDefaultConfiguration);
  archetypeTestingFramework.addConfiguration(highCreativeConfiguration);
  archetypeTestingFramework.addConfiguration(balancedDefaultConfiguration);
  archetypeTestingFramework.addConfiguration(analyticalFocusConfiguration);
  
  // Add test questions
  console.log('Adding benchmark questions...');
  benchmarkQuestions.forEach(question => {
    archetypeTestingFramework.addTestQuestion(question);
  });
  
  console.log('Default test data initialization complete');
  console.log(`Loaded ${archetypeTestingFramework.getConfigurations().length} configurations`);
  console.log(`Loaded ${archetypeTestingFramework.getTestQuestions().length} test questions`);
}


// Re-export configurations and questions for backward compatibility
export {
  currentDefaultConfiguration,
  highCreativeConfiguration,
  balancedDefaultConfiguration,
  analyticalFocusConfiguration
} from './configurations';

export { benchmarkQuestions } from './questions';

// Re-export the initialization function
export { initializeDefaultTestData } from './initialization/defaultTestInitializer';

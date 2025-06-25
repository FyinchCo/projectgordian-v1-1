
export const buildProcessingConfig = (
  question: string,
  circuitType: string,
  enhancedMode: boolean,
  customArchetypes: any,
  currentAssessment: any
) => {
  return {
    question,
    circuitType,
    customArchetypes: customArchetypes,
    enhancedMode,
    assessmentConfiguration: currentAssessment ? {
      archetypeConfigurations: currentAssessment.archetypeConfigurations,
      tensionParameters: currentAssessment.tensionParameters,
      processingConfiguration: currentAssessment.processingConfiguration
    } : null
  };
};

export const buildFallbackConfig = (baseConfig: any, depth: number = 2) => {
  return { ...baseConfig, processingDepth: depth };
};

export const buildSimpleConfig = (baseConfig: any, requestedDepth: number) => {
  return { ...baseConfig, processingDepth: requestedDepth };
};

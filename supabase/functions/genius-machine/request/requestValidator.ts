
export interface GeniusMachineRequest {
  question: string;
  processingDepth?: number;
  circuitType?: string;
  customArchetypes?: any[];
  enhancedMode?: boolean;
  compressionSettings?: any;
  outputType?: string;
}

export function validateRequest(requestData: any): GeniusMachineRequest {
  const { 
    question, 
    processingDepth = 3, 
    circuitType = 'sequential', 
    customArchetypes, 
    enhancedMode = true,
    compressionSettings,
    outputType
  } = requestData;
  
  if (!question || typeof question !== 'string' || question.trim().length < 10) {
    throw new Error('Question must be a string with at least 10 characters');
  }

  return {
    question,
    processingDepth: Math.min(Math.max(processingDepth, 1), 10),
    circuitType,
    customArchetypes,
    enhancedMode,
    compressionSettings,
    outputType
  };
}


export interface DetailedAnalysis {
  totalResults: number;
  geniusMachineErrors: number;
  externalErrors: Record<string, number>;
  partialResults: number;
  completeResults: number;
  issues: string[];
}

export interface SimpleAnalysis {
  message: string;
  resultsCount: number;
  hasData?: boolean;
  error?: string;
  hasIssue?: boolean;
}

export type DebugInfo = DetailedAnalysis | SimpleAnalysis;

// Type guard to check if debug info is detailed analysis
export const isDetailedAnalysis = (debugInfo: DebugInfo): debugInfo is DetailedAnalysis => {
  return 'totalResults' in debugInfo;
};

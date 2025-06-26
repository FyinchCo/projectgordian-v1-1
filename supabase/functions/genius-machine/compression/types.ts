
export interface CompressionFormats {
  ultraConcise: string;
  medium: string;
  comprehensive: string;
}

export interface CompressionSettings {
  style?: string;
  length?: 'short' | 'medium' | 'long';
  includeTrail?: boolean;
  includeFullTranscript?: boolean;
  customInstructions?: string;
}

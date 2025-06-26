
export interface CompressionFormats {
  ultraConcise: string;
  medium: string;
  comprehensive: string;
  insightRating?: {
    score: number;
    category: string;
    justification: string;
  };
}

export interface CompressionSettings {
  style?: string;
  length?: string;
  customInstructions?: string;
}

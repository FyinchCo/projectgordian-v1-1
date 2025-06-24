
export type OutputType = 'practical' | 'theoretical' | 'philosophical';

export interface OutputTypeConfig {
  id: OutputType;
  label: string;
  description: string;
  shortDescription: string;
}

export const OUTPUT_TYPE_CONFIGS: OutputTypeConfig[] = [
  {
    id: 'practical',
    label: 'Practical',
    description: 'Help me act wisely',
    shortDescription: 'Action-focused insights for immediate implementation'
  },
  {
    id: 'theoretical', 
    label: 'Theoretical',
    description: 'Show me how it fits together',
    shortDescription: 'Systematic frameworks and structured understanding'
  },
  {
    id: 'philosophical',
    label: 'Philosophical', 
    description: 'Make me think differently',
    shortDescription: 'Deep insights that challenge assumptions and worldview'
  }
];



export type OutputType = 'practical' | 'theoretical' | 'philosophical' | 'abstract';

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
    description: 'Give me concrete actions I can take right now',
    shortDescription: 'Immediate implementation steps and tactical wisdom for real-world action'
  },
  {
    id: 'theoretical', 
    label: 'Theoretical',
    description: 'Show me the underlying systems and patterns',
    shortDescription: 'Structured frameworks, models, and systematic understanding of how things work'
  },
  {
    id: 'philosophical',
    label: 'Philosophical', 
    description: 'Challenge my fundamental assumptions about reality',
    shortDescription: 'Deep worldview shifts that question what you think you know'
  },
  {
    id: 'abstract',
    label: 'Abstract',
    description: 'Reveal hidden connections across unlikely domains',
    shortDescription: 'Unexpected pattern recognition and emergent insights from distant analogies'
  }
];


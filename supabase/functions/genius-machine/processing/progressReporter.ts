
export interface ProcessingProgress {
  phase: 'initializing' | 'processing' | 'synthesizing' | 'completing' | 'completed';
  currentLayer: number;
  totalLayers: number;
  currentArchetype: string;
  totalArchetypes: number;
  currentArchetypeIndex: number;
  estimatedTimeRemaining: number;
  processingStartTime: number;
  confidence: number;
  layersCompleted: number;
}

export class ProgressReporter {
  private startTime: number;
  private totalLayers: number;
  private totalArchetypes: number;
  
  constructor(totalLayers: number, totalArchetypes: number) {
    this.startTime = Date.now();
    this.totalLayers = totalLayers;
    this.totalArchetypes = totalArchetypes;
  }
  
  createProgress(
    phase: ProcessingProgress['phase'],
    currentLayer: number,
    currentArchetype: string = '',
    currentArchetypeIndex: number = 0,
    layersCompleted: number = 0
  ): ProcessingProgress {
    const elapsedTime = Date.now() - this.startTime;
    const totalOperations = this.totalLayers * this.totalArchetypes;
    const completedOperations = layersCompleted * this.totalArchetypes + currentArchetypeIndex;
    const avgTimePerOperation = completedOperations > 0 ? elapsedTime / completedOperations : 5000;
    const remainingOperations = totalOperations - completedOperations;
    const estimatedTimeRemaining = remainingOperations * avgTimePerOperation;
    
    return {
      phase,
      currentLayer,
      totalLayers: this.totalLayers,
      currentArchetype,
      totalArchetypes: this.totalArchetypes,
      currentArchetypeIndex,
      estimatedTimeRemaining: Math.max(0, estimatedTimeRemaining),
      processingStartTime: this.startTime,
      confidence: Math.min(95, 60 + (completedOperations / totalOperations * 35)),
      layersCompleted
    };
  }
  
  getPhaseDescription(phase: ProcessingProgress['phase']): string {
    switch (phase) {
      case 'initializing': return 'Initializing cognitive architecture...';
      case 'processing': return 'Processing archetypal perspectives...';
      case 'synthesizing': return 'Synthesizing breakthrough insights...';
      case 'completing': return 'Finalizing genius-level analysis...';
      case 'completed': return 'Analysis complete with breakthrough insights';
      default: return 'Processing...';
    }
  }
}

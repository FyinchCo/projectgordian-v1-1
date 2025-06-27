
export class ResultsExtractor {
  static extractAnswer(jobResults: any): string {
    console.log('=== EXTRACTING ANSWER FROM REBUILT SYSTEM ===');
    console.log('Job results structure:', Object.keys(jobResults || {}));
    
    if (!jobResults) {
      console.log('No jobResults found');
      return "No analysis results found.";
    }
    
    // Simple extraction from rebuilt system
    if (jobResults.insight && typeof jobResults.insight === 'string') {
      console.log('✓ Found insight in rebuilt system');
      return jobResults.insight;
    }
    
    // Fallback for any remaining old structure
    if (jobResults.layers && Array.isArray(jobResults.layers)) {
      console.log(`Found ${jobResults.layers.length} layers (legacy format)`);
      
      for (let i = jobResults.layers.length - 1; i >= 0; i--) {
        const layer = jobResults.layers[i];
        if (layer.insight && typeof layer.insight === 'string') {
          console.log(`✓ Found insight in layer ${i + 1}`);
          return layer.insight;
        }
      }
    }
    
    console.log('❌ Could not extract clean answer');
    return "Analysis completed but encountered difficulty extracting the final answer. Please try again.";
  }

  static extractMetrics(jobResults: any) {
    if (!jobResults) {
      return {
        confidence: 0,
        tensionPoints: 0,
        breakthroughPotential: 0,
        layersProcessed: 0
      };
    }
    
    return {
      confidence: Math.round((jobResults.confidence || 0.5) * 100),
      tensionPoints: jobResults.tensionPoints || 0,
      breakthroughPotential: jobResults.breakthroughPotential || 50,
      layersProcessed: jobResults.processingDepth || 1
    };
  }
}

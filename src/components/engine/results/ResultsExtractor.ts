export class ResultsExtractor {
  static extractAnswer(jobResults: any): string {
    console.log('=== EXTRACTING ACTUAL ANSWER ===');
    console.log('Job results structure:', Object.keys(jobResults || {}));
    
    // Handle the new direct structure - no final_results wrapper
    if (!jobResults) {
      console.log('No jobResults found');
      return "No analysis results found.";
    }
    
    // Try to get insights from the layers array first (this is where the real content is)
    if (jobResults.layers && Array.isArray(jobResults.layers)) {
      console.log(`Found ${jobResults.layers.length} layers`);
      
      // Get the most substantive insight from the layers
      for (let i = jobResults.layers.length - 1; i >= 0; i--) {
        const layer = jobResults.layers[i];
        console.log(`Checking layer ${i + 1}:`, Object.keys(layer));
        
        if (layer.insight && !this.isMetaCommentary(layer.insight)) {
          console.log(`✓ Found clean insight in layer ${i + 1}`);
          return layer.insight;
        }
      }
    }
    
    // Try compressionFormats if available
    if (jobResults.compressionFormats) {
      console.log('Checking compression formats:', Object.keys(jobResults.compressionFormats));
      
      const formats = ['comprehensive', 'medium', 'ultraConcise'];
      for (const format of formats) {
        const content = jobResults.compressionFormats[format];
        if (content && !this.isMetaCommentary(content)) {
          console.log(`✓ Found clean ${format} compression`);
          return content;
        }
      }
    }
    
    // Try the main insight (but this is usually meta-commentary)
    if (jobResults.insight && !this.isMetaCommentary(jobResults.insight)) {
      console.log('✓ Found clean top-level insight');
      return jobResults.insight;
    }
    
    console.log('❌ Could not find clean insight, extracting from layers');
    
    // Last resort - extract the best content from layers even if it has some meta-language
    if (jobResults.layers && Array.isArray(jobResults.layers)) {
      for (let i = jobResults.layers.length - 1; i >= 0; i--) {
        const layer = jobResults.layers[i];
        if (layer.insight && layer.insight.length > 100) {
          const extracted = this.extractMeaningfulContent(layer.insight);
          if (extracted && extracted.length > 50) {
            console.log(`✓ Extracted meaningful content from layer ${i + 1}`);
            return extracted;
          }
        }
      }
    }
    
    return "Analysis completed successfully. The system processed multiple layers of insights but encountered difficulty extracting the final compressed answer. Please try running the analysis again.";
  }

  static extractMetrics(jobResults: any) {
    // Handle the new direct structure
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
      breakthroughPotential: jobResults.breakthroughPotential || 0,
      layersProcessed: jobResults.processingDepth || jobResults.layers?.length || 0
    };
  }

  private static isMetaCommentary(text: string): boolean {
    if (!text || typeof text !== 'string') return true;
    
    const metaIndicators = [
      'PROGRESSIVE GENIUS SYNTHESIS',
      'layers of deep analysis',
      'systematically explored',
      'breakthrough synthesis',
      'meta-level analysis',
      'compression generated',
      'processing layers',
      'final synthesis',
      'analysis framework',
      'analysis completed',
      'results structure',
      'processing worked',
      'system metadata',
      'breakthrough insights',
      'transcendent understanding',
      'emergent synthesis',
      'cognitive tension',
      'novel compression',
      'cumulative intelligence process',
      'genius-level comprehension'
    ];
    
    const lowerText = text.toLowerCase();
    const metaCount = metaIndicators.filter(indicator => 
      lowerText.includes(indicator.toLowerCase())
    ).length;
    
    // If more than 2 meta indicators, likely meta-commentary
    return metaCount >= 2;
  }

  private static extractMeaningfulContent(text: string): string {
    if (!text) return '';
    
    // Split into sentences and find substantial, non-meta sentences
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    
    const meaningfulSentences = sentences.filter(sentence => {
      const lower = sentence.toLowerCase().trim();
      
      // Skip meta-language sentences
      const hasMetaLanguage = [
        'synthesis', 'analysis', 'processing', 'layer', 'breakthrough', 
        'progressive', 'emergence', 'tension', 'cognitive', 'framework',
        'methodology', 'systematic', 'comprehensive', 'meta-level'
      ].some(word => lower.includes(word));
      
      // Keep sentences that are substantial and don't have meta-language
      return !hasMetaLanguage && lower.length > 30;
    });
    
    if (meaningfulSentences.length > 0) {
      return meaningfulSentences.slice(0, 3).join('. ').trim() + '.';
    }
    
    return '';
  }
}

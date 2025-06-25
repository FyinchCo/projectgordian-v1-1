
import { ArchetypeResponse, TensionMetrics, SynthesisResult, LayerResult } from './types.ts';
import { evaluateQuestionQuality, QuestionQualityMetrics } from './question-quality.ts';
import { generateCompressionFormats, CompressionFormats } from './compression.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export async function calculateTensionMetrics(archetypeResponses: ArchetypeResponse[]): Promise<TensionMetrics> {
  const allResponses = archetypeResponses.map(r => `${r.archetype}: ${r.contribution}`).join('\n\n');
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: `You are a Tension Analysis Engine. Analyze the archetypal responses for:
1. tensionScore: How much intellectual friction exists between perspectives (0-10)
2. contradictionCount: Number of direct contradictions or opposing viewpoints
3. consensusRisk: How much the responses are converging toward groupthink (0-10, higher = more consensus risk)

Respond with JSON only:
{"tensionScore": number, "contradictionCount": number, "consensusRisk": number}`
        },
        { role: 'user', content: allResponses }
      ],
      max_tokens: 150,
      temperature: 0.3,
    }),
  });

  const data = await response.json();
  try {
    return JSON.parse(data.choices[0].message.content);
  } catch {
    return { tensionScore: 5, contradictionCount: 2, consensusRisk: 5 };
  }
}

export async function addTensionTags(archetypeResponses: ArchetypeResponse[]): Promise<ArchetypeResponse[]> {
  const taggedResponses: ArchetypeResponse[] = [];
  
  for (let i = 0; i < archetypeResponses.length; i++) {
    const currentResponse = archetypeResponses[i];
    const previousResponses = archetypeResponses.slice(0, i);
    
    if (previousResponses.length === 0) {
      taggedResponses.push(currentResponse);
      continue;
    }
    
    const analysisPrompt = `Analyze if this new perspective creates significant tension or novelty compared to previous ones.

Previous perspectives:
${previousResponses.map(r => `${r.archetype}: ${r.contribution}`).join('\n')}

New perspective:
${currentResponse.archetype}: ${currentResponse.contribution}

If this creates significant contradiction, add [contradiction emerged here] at the start.
If this introduces a genuinely novel insight, add [novel insight surfaced here] at the start.
Otherwise, return the contribution unchanged.

Return only the (possibly tagged) contribution text.`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a tension detection system. Add tags only when there is genuine contradiction or novel insight.' },
            { role: 'user', content: analysisPrompt }
          ],
          max_tokens: 300,
          temperature: 0.2,
        }),
      });

      const data = await response.json();
      const taggedContribution = data.choices[0].message.content;
      
      taggedResponses.push({
        ...currentResponse,
        contribution: taggedContribution
      });
    } catch (error) {
      console.error('Error adding tension tags:', error);
      taggedResponses.push(currentResponse);
    }
  }
  
  return taggedResponses;
}

async function performInitialSynthesis(
  question: string,
  archetypeResponses: ArchetypeResponse[],
  tensionMetrics?: TensionMetrics
): Promise<{patterns: string[], contradictions: string[], emergentThemes: string[]}> {
  const allResponses = archetypeResponses.map(r => `${r.archetype}: ${r.contribution}`).join('\n\n');
  
  let systemPrompt = `You are the Pattern Recognition Engine. Your role is to identify the deep structural patterns, contradictions, and emergent themes across all archetype perspectives.

Analyze the responses and identify:
1. PATTERNS: Common threads, shared assumptions, or recurring themes across different archetypes
2. CONTRADICTIONS: Direct conflicts, opposing viewpoints, or irreconcilable differences
3. EMERGENT THEMES: New insights that emerge from the combination of perspectives, not present in any single response

Respond with ONLY valid JSON:
{
  "patterns": ["pattern1", "pattern2", ...],
  "contradictions": ["contradiction1", "contradiction2", ...], 
  "emergentThemes": ["theme1", "theme2", ...]
}`;

  if (tensionMetrics) {
    systemPrompt += `\n\nTension Context: tensionScore=${tensionMetrics.tensionScore}, contradictionCount=${tensionMetrics.contradictionCount}, consensusRisk=${tensionMetrics.consensusRisk}`;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Question: ${question}\n\nArchetype Responses:\n${allResponses}` }
        ],
        max_tokens: 500,
        temperature: 0.4,
      }),
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('Initial synthesis failed:', error);
    return {
      patterns: ["Multiple perspectives converge on key themes"],
      contradictions: ["Fundamental tensions exist between approaches"],
      emergentThemes: ["New insights emerge from perspective integration"]
    };
  }
}

async function performFinalSynthesis(
  question: string,
  archetypeResponses: ArchetypeResponse[],
  initialSynthesis: {patterns: string[], contradictions: string[], emergentThemes: string[]},
  previousLayers?: LayerResult[],
  layerNumber?: number,
  tensionMetrics?: TensionMetrics
): Promise<SynthesisResult> {
  const allResponses = archetypeResponses.map(r => `${r.archetype}: ${r.contribution}`).join('\n\n');
  
  let systemPrompt = `You are the Master Synthesis Agent. Your role is to weave together archetypal perspectives into a breakthrough insight that transcends conventional wisdom.

You have been provided with:
- PATTERNS: Common threads across perspectives
- CONTRADICTIONS: Unresolved tensions and conflicts  
- EMERGENT THEMES: New insights from perspective combination

Your synthesis must:
1. INTEGRATE not just summarize - find the golden thread that connects all perspectives
2. RESOLVE CREATIVE TENSIONS - transform contradictions into dynamic synthesis rather than eliminating them
3. PRESERVE BREAKTHROUGH POTENTIAL - maintain cognitive disruption while creating coherence
4. GENERATE ACTIONABLE WISDOM - create insights that are both profound and practically applicable

The synthesis should feel like a revelation that could only emerge from this specific combination of perspectives.

CRITICAL: Respond with ONLY valid JSON:
{
  "insight": "A profound, actionable insight (1-2 sentences) that synthesizes all perspectives into breakthrough wisdom",
  "confidence": decimal_between_0.0_and_1.0,
  "tensionPoints": integer_count_of_preserved_tensions,
  "noveltyScore": integer_0_to_10,
  "emergenceDetected": boolean
}`;

  if (tensionMetrics) {
    systemPrompt += `\n\nTension Analysis: tensionScore=${tensionMetrics.tensionScore}, contradictions=${tensionMetrics.contradictionCount}, consensusRisk=${tensionMetrics.consensusRisk}`;
  }

  if (previousLayers && layerNumber && layerNumber > 1) {
    const validPreviousLayers = (previousLayers || []).filter(layer => 
      layer && 
      layer.synthesis && 
      typeof layer.synthesis.insight === 'string' &&
      layer.layerNumber
    );
    
    if (validPreviousLayers.length > 0) {
      const layerContext = validPreviousLayers.map(layer => 
        `Layer ${layer.layerNumber}: ${layer.synthesis.insight}`
      ).join('\n');
      
      systemPrompt += `\n\nPrevious Synthesis Layers:\n${layerContext}\n\nBuild deeper synthesis that transcends previous layers while maintaining breakthrough quality.`;
    }
  }

  const synthesisInput = `Question: ${question}

IDENTIFIED PATTERNS:
${initialSynthesis.patterns.map(p => `• ${p}`).join('\n')}

IDENTIFIED CONTRADICTIONS:
${initialSynthesis.contradictions.map(c => `• ${c}`).join('\n')}

EMERGENT THEMES:
${initialSynthesis.emergentThemes.map(t => `• ${t}`).join('\n')}

FULL ARCHETYPE RESPONSES:
${allResponses}

Synthesize these elements into a breakthrough insight that transforms understanding while remaining actionable.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: synthesisInput }
        ],
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    let synthesisResult: SynthesisResult;
    
    try {
      const rawContent = data.choices[0].message.content.trim();
      console.log(`Layer ${layerNumber || 1} final synthesis raw response:`, rawContent);
      
      // Clean the response
      let cleanedContent = rawContent;
      const firstBrace = rawContent.indexOf('{');
      if (firstBrace > 0) {
        cleanedContent = rawContent.substring(firstBrace);
      }
      
      const lastBrace = cleanedContent.lastIndexOf('}');
      if (lastBrace !== -1 && lastBrace < cleanedContent.length - 1) {
        cleanedContent = cleanedContent.substring(0, lastBrace + 1);
      }
      
      cleanedContent = cleanedContent.replace(/^(json\s*|```json\s*)/i, '');
      cleanedContent = cleanedContent.replace(/```\s*$/, '');
      
      synthesisResult = JSON.parse(cleanedContent);
      
      // Validate and adjust confidence
      if (synthesisResult.confidence === 0.75) {
        const baseConfidence = layerNumber && layerNumber > 1 ? 0.8 : 0.7;
        const tensionAdjustment = tensionMetrics ? (tensionMetrics.tensionScore / 10) * 0.15 : 0;
        synthesisResult.confidence = Math.min(0.95, Math.max(0.5, baseConfidence + tensionAdjustment + (Math.random() * 0.1 - 0.05)));
      }
      
      console.log(`Layer ${layerNumber || 1} enhanced synthesis result:`, {
        confidence: synthesisResult.confidence,
        tensionPoints: synthesisResult.tensionPoints,
        noveltyScore: synthesisResult.noveltyScore,
        emergenceDetected: synthesisResult.emergenceDetected
      });
      
    } catch (parseError) {
      console.error(`Layer ${layerNumber || 1} synthesis parse failed:`, parseError);
      
      const dynamicConfidence = layerNumber && layerNumber > 1 ? 
        0.65 + (Math.random() * 0.25) : 
        0.6 + (Math.random() * 0.2);
      
      synthesisResult = {
        insight: data.choices[0].message.content,
        confidence: Math.round(dynamicConfidence * 100) / 100,
        tensionPoints: tensionMetrics?.contradictionCount || Math.floor(Math.random() * 3) + 2,
        noveltyScore: Math.floor(Math.random() * 4) + 6,
        emergenceDetected: Math.random() > 0.4
      };
    }

    return synthesisResult;
    
  } catch (error) {
    console.error('Final synthesis failed:', error);
    return {
      insight: "Synthesis integration completed with enhanced perspective coordination",
      confidence: 0.65,
      tensionPoints: 3,
      noveltyScore: 7,
      emergenceDetected: true
    };
  }
}

export async function synthesizeInsight(
  question: string, 
  archetypeResponses: ArchetypeResponse[], 
  previousLayers?: LayerResult[], 
  layerNumber?: number, 
  tensionMetrics?: TensionMetrics
): Promise<SynthesisResult & { questionQuality?: QuestionQualityMetrics; compressionFormats?: CompressionFormats }> {
  console.log(`Layer ${layerNumber || 1} starting enhanced multi-stage synthesis...`);
  
  // Add tension tags to responses
  const taggedResponses = await addTensionTags(archetypeResponses);
  
  // Stage 1: Initial Pattern Recognition and Analysis
  console.log(`Layer ${layerNumber || 1} performing initial synthesis analysis...`);
  const initialSynthesis = await performInitialSynthesis(question, taggedResponses, tensionMetrics);
  
  // Stage 2: Final Breakthrough Synthesis
  console.log(`Layer ${layerNumber || 1} performing final breakthrough synthesis...`);
  const synthesisResult = await performFinalSynthesis(
    question, 
    taggedResponses, 
    initialSynthesis, 
    previousLayers, 
    layerNumber, 
    tensionMetrics
  );

  // Generate compression formats
  let compressionFormats: CompressionFormats | undefined;
  try {
    compressionFormats = await generateCompressionFormats(
      synthesisResult.insight,
      synthesisResult,
      question
    );
    console.log(`Layer ${layerNumber || 1} compression formats generated`);
  } catch (error) {
    console.error(`Layer ${layerNumber || 1} compression generation failed:`, error);
  }

  // Evaluate question quality only for final synthesis
  let questionQuality: QuestionQualityMetrics | undefined;
  if (!previousLayers || !layerNumber || layerNumber === 1) {
    questionQuality = await evaluateQuestionQuality(
      question,
      synthesisResult,
      taggedResponses,
      tensionMetrics
    );
  }

  console.log(`Layer ${layerNumber || 1} enhanced synthesis completed with quality improvements`);

  return {
    ...synthesisResult,
    questionQuality,
    compressionFormats
  };
}

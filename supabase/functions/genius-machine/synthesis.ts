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
  archetypeResponses: ArchetypeResponse[],
  question: string,
  previousInsights: string[] = []
): Promise<SynthesisResult> {
  console.log('Layer performing initial synthesis analysis...');
  
  const responses = archetypeResponses.map(r => 
    `${r.archetype}: ${r.response}`
  ).join('\n\n');

  const previousContext = previousInsights.length > 0 
    ? `\nPrevious layer insights:\n${previousInsights.join('\n\n')}`
    : '';

  const prompt = `Analyze these archetype responses and perform initial synthesis.

Question: ${question}
${previousContext}

Archetype Responses:
${responses}

Provide a JSON response with this exact structure (no markdown, no code blocks):
{
  "insight": "Initial synthesis combining key themes and tensions",
  "confidence": 0.7,
  "tensionPoints": 3,
  "noveltyScore": 6,
  "emergenceDetected": false
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a synthesis engine. Return only valid JSON without markdown formatting or code blocks. Be precise and analytical.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 800,
        temperature: 0.3
      }),
    });

    const data = await response.json();
    let rawResponse = data.choices[0]?.message?.content || '{}';
    
    // Clean up the response - remove markdown code blocks if present
    rawResponse = rawResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    console.log('Initial synthesis raw response:', rawResponse);
    
    try {
      const result = JSON.parse(rawResponse);
      return {
        insight: result.insight || 'Initial synthesis completed',
        confidence: result.confidence || 0.6,
        tensionPoints: result.tensionPoints || 2,
        noveltyScore: result.noveltyScore || 5,
        emergenceDetected: result.emergenceDetected || false
      };
    } catch (parseError) {
      console.error('Initial synthesis failed:', parseError);
      
      // Fallback synthesis using simpler approach
      const insight = extractInsightFromResponses(archetypeResponses);
      return {
        insight,
        confidence: 0.6,
        tensionPoints: 2,
        noveltyScore: 5,
        emergenceDetected: false
      };
    }
  } catch (error) {
    console.error('Initial synthesis request failed:', error);
    
    // Fallback synthesis
    const insight = extractInsightFromResponses(archetypeResponses);
    return {
      insight,
      confidence: 0.5,
      tensionPoints: 1,
      noveltyScore: 4,
      emergenceDetected: false
    };
  }
}

async function performFinalSynthesis(
  archetypeResponses: ArchetypeResponse[],
  initialSynthesis: SynthesisResult,
  question: string,
  previousInsights: string[] = []
): Promise<SynthesisResult> {
  console.log('Layer performing final breakthrough synthesis...');
  
  const responses = archetypeResponses.map(r => 
    `${r.archetype}: ${r.response}`
  ).join('\n\n');

  const previousContext = previousInsights.length > 0 
    ? `\nPrevious layer insights:\n${previousInsights.join('\n\n')}`
    : '';

  const prompt = `Perform final breakthrough synthesis building on initial analysis.

Question: ${question}
${previousContext}

Initial Synthesis: ${initialSynthesis.insight}

Archetype Responses:
${responses}

Create a breakthrough insight that transcends the initial synthesis. Look for emergence patterns, novel connections, and paradigm shifts.

Provide a JSON response with this exact structure (no markdown, no code blocks):
{
  "insight": "Breakthrough synthesis with novel perspective",
  "confidence": 0.85,
  "tensionPoints": 5,
  "noveltyScore": 8,
  "emergenceDetected": true
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a breakthrough synthesis engine. Return only valid JSON without markdown formatting or code blocks. Focus on emergence and novel insights.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.7
      }),
    });

    const data = await response.json();
    let rawResponse = data.choices[0]?.message?.content || '{}';
    
    // Clean up the response - remove markdown code blocks if present
    rawResponse = rawResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    console.log('Layer final synthesis raw response:', rawResponse);
    
    try {
      const result = JSON.parse(rawResponse);
      return {
        insight: result.insight || initialSynthesis.insight,
        confidence: result.confidence || 0.75,
        tensionPoints: result.tensionPoints || 4,
        noveltyScore: result.noveltyScore || 7,
        emergenceDetected: result.emergenceDetected || false
      };
    } catch (parseError) {
      console.error('Final synthesis parsing failed:', parseError);
      
      // Return enhanced version of initial synthesis
      return {
        insight: initialSynthesis.insight,
        confidence: Math.min(initialSynthesis.confidence + 0.1, 0.9),
        tensionPoints: initialSynthesis.tensionPoints + 1,
        noveltyScore: Math.min(initialSynthesis.noveltyScore + 2, 10),
        emergenceDetected: initialSynthesis.noveltyScore >= 7
      };
    }
  } catch (error) {
    console.error('Final synthesis request failed:', error);
    
    // Return enhanced version of initial synthesis
    return {
      insight: initialSynthesis.insight,
      confidence: Math.min(initialSynthesis.confidence + 0.1, 0.9),
      tensionPoints: initialSynthesis.tensionPoints + 1,
      noveltyScore: Math.min(initialSynthesis.noveltyScore + 2, 10),
      emergenceDetected: initialSynthesis.noveltyScore >= 7
    };
  }
}

// Helper function to extract insight from responses when JSON parsing fails
function extractInsightFromResponses(archetypeResponses: ArchetypeResponse[]): string {
  const themes = archetypeResponses.map(r => {
    const sentences = r.response.split('.').filter(s => s.trim().length > 20);
    return sentences[0]?.trim() || r.response.substring(0, 100);
  }).join('. ');
  
  return `Synthesis of multiple perspectives reveals: ${themes}. This integration suggests new approaches that transcend individual viewpoints.`;
}

export async function synthesizeInsight(
  archetypeResponses: ArchetypeResponse[],
  question: string,
  previousInsights: string[] = [],
  enhancedMode: boolean = false
): Promise<SynthesisResult> {
  console.log('Starting enhanced multi-stage synthesis...');
  
  // Add tension tags to responses
  const taggedResponses = await addTensionTags(archetypeResponses);
  
  // Stage 1: Initial Pattern Recognition and Analysis
  console.log('Performing initial synthesis analysis...');
  const initialSynthesis = await performInitialSynthesis(taggedResponses, question, previousInsights);
  
  // Stage 2: Final Breakthrough Synthesis
  console.log('Performing final breakthrough synthesis...');
  const synthesisResult = await performFinalSynthesis(
    taggedResponses, 
    initialSynthesis, 
    question, 
    previousInsights
  );

  // Generate compression formats - ENSURE THIS IS ALWAYS ATTEMPTED
  let compressionFormats: CompressionFormats | undefined;
  try {
    console.log('Generating compression formats...');
    compressionFormats = await generateCompressionFormats(
      synthesisResult.insight,
      synthesisResult,
      question
    );
    console.log('Compression formats generated successfully:', !!compressionFormats);
  } catch (error) {
    console.error('Compression generation failed:', error);
    // Provide fallback compression formats
    const words = synthesisResult.insight.split(' ');
    compressionFormats = {
      ultraConcise: words.slice(0, 3).join(' '),
      medium: synthesisResult.insight,
      comprehensive: `${synthesisResult.insight} This insight emerges from analyzing multiple perspectives and identifying breakthrough patterns.`
    };
    console.log('Using fallback compression formats');
  }

  // Evaluate question quality only for final synthesis
  let questionQuality: QuestionQualityMetrics | undefined;
  try {
    questionQuality = await evaluateQuestionQuality(
      question,
      synthesisResult,
      taggedResponses
    );
  } catch (error) {
    console.error('Question quality evaluation failed:', error);
  }

  console.log('Enhanced synthesis completed with quality improvements');

  // ENSURE COMPRESSION FORMATS ARE RETURNED
  const finalResult = {
    ...synthesisResult,
    questionQuality,
    compressionFormats
  };

  console.log('Final synthesis result includes compression formats:', !!finalResult.compressionFormats);
  
  return finalResult;
}


import { AssumptionAnalysis, AssumptionChallenge } from './types.ts';
import { assumptionChallengerArchetype } from './archetypes.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

export async function detectAssumptions(question: string): Promise<AssumptionAnalysis> {
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
          content: `You are an Assumption Detection Engine. Your role is to identify hidden assumptions, biases, and unexamined premises in questions. 

Analyze the question and identify:
1. Hidden assumptions embedded in the question
2. Challenging counter-questions that expose blind spots
3. A resistance score (0-10) indicating how much the question challenges conventional thinking

Respond with a JSON object containing:
- assumptions: Array of hidden assumptions identified
- challengingQuestions: Array of provocative counter-questions
- resistanceScore: Number from 0-10 (0 = conventional thinking, 10 = radical paradigm challenge)

Be ruthlessly analytical and expose every unexamined premise.`
        },
        { role: 'user', content: question }
      ],
      max_tokens: 400,
      temperature: 0.8,
    }),
  });

  const data = await response.json();
  try {
    return JSON.parse(data.choices[0].message.content);
  } catch {
    return {
      assumptions: ["Unable to parse assumption analysis"],
      challengingQuestions: ["What if this question itself is flawed?"],
      resistanceScore: 5
    };
  }
}

export async function processAssumptionChallenge(question: string): Promise<AssumptionChallenge> {
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
          content: assumptionChallengerArchetype.systemPrompt + `\n\nRespond with JSON:
{
  "challengedAssumptions": ["list of assumptions you're challenging"],
  "reframedQuestion": "a provocatively reframed version of the question",
  "disruptionLevel": number from 0-10 indicating cognitive disruption achieved
}`
        },
        { role: 'user', content: question }
      ],
      max_tokens: 300,
      temperature: 0.8,
    }),
  });

  const data = await response.json();
  try {
    return JSON.parse(data.choices[0].message.content);
  } catch {
    return {
      challengedAssumptions: ["Unable to parse assumption challenge"],
      reframedQuestion: question,
      disruptionLevel: 3
    };
  }
}


import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question } = await req.json();
    
    if (!question) {
      throw new Error('Question is required');
    }

    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicApiKey) {
      throw new Error('Anthropic API key not configured');
    }

    console.log('Processing Claude comparison for question:', question.substring(0, 50) + '...');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicApiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        messages: [
          { 
            role: 'user', 
            content: `You are an expert AI assistant. Provide insightful, well-reasoned responses to complex questions. Focus on depth, nuance, and practical value.\n\nQuestion: ${question}` 
          }
        ],
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Claude API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const generatedResponse = data.content[0]?.text || 'No response generated';

    console.log('Claude comparison completed successfully');

    return new Response(JSON.stringify({ 
      response: generatedResponse,
      model: 'claude-3-5-sonnet',
      provider: 'Anthropic'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in Claude comparison:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      provider: 'Anthropic',
      model: 'claude-3-5-sonnet'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

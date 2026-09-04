import type { Handler, HandlerEvent } from '@netlify/functions';
import { answerWithRag } from '../../api/_lib/rag';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

function parseBody(event: HandlerEvent): Record<string, unknown> {
  if (!event.body) return {};
  try {
    const raw = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64').toString('utf8')
      : event.body;
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    if (!process.env.DEEPSEEK_API_KEY) {
      return {
        statusCode: 503,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'DEEPSEEK_API_KEY is not configured' }),
      };
    }

    const body = parseBody(event);
    const message = typeof body.message === 'string' ? body.message : '';
    const history = Array.isArray(body.history)
      ? (body.history as Array<{ role: 'user' | 'assistant'; content: string }>)
          .filter(
            (item) =>
              item &&
              (item.role === 'user' || item.role === 'assistant') &&
              typeof item.content === 'string',
          )
          .slice(-6)
      : [];

    if (!message.trim()) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'message is required' }),
      };
    }

    if (message.length > 2000) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'message is too long' }),
      };
    }

    const result = await answerWithRag(message, history);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Netlify chat error', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Failed to generate answer' }),
    };
  }
};

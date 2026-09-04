import type { Handler } from '@netlify/functions';
import { buildEmbeddings, listKnowledge } from '../../api/_lib/rag';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json',
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST' && event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const apiKey = process.env.VISITOR_API_KEY || process.env.TRACKING_API_KEY || process.env.INGEST_API_KEY;
    if (apiKey) {
      const header = event.headers.authorization || event.headers.Authorization || '';
      const token = String(header).startsWith('Bearer ') ? String(header).slice(7) : '';
      if (token !== apiKey) {
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Unauthorized' }),
        };
      }
    }

    const store = await buildEmbeddings(true);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        ok: true,
        provider: 'deepseek',
        retrieval: 'lexical',
        chunks: store.length,
        knowledge: listKnowledge().map((c) => ({
          id: c.id,
          title: c.title,
          category: c.category,
        })),
      }),
    };
  } catch (error) {
    console.error('Netlify ingest error', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Failed to list knowledge chunks' }),
    };
  }
};

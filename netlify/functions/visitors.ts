import type { Handler } from '@netlify/functions';
import { getVisitorsCollection, hasMongo } from '../../api/_lib/mongo';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const apiKey = process.env.VISITOR_API_KEY || process.env.TRACKING_API_KEY;
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

    if (!hasMongo()) {
      return {
        statusCode: 503,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'MONGODB_URI is not configured' }),
      };
    }

    const collection = await getVisitorsCollection();
    const visitors = await collection
      .find({}, { projection: { _id: 0 } })
      .sort({ visited_at: -1, updated_at: -1, created_at: -1 })
      .limit(500)
      .toArray();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ visitors, total: visitors.length }),
    };
  } catch (error) {
    console.error('Netlify visitors error', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

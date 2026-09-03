import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getVisitorsCollection, hasMongo } from './lib/mongo';

function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.VISITOR_API_KEY || process.env.TRACKING_API_KEY;
    if (apiKey) {
      const header = req.headers.authorization || '';
      const token = header.startsWith('Bearer ') ? header.slice(7) : '';
      if (token !== apiKey) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    }

    if (!hasMongo()) {
      return res.status(503).json({ error: 'MONGODB_URI is not configured' });
    }

    const collection = await getVisitorsCollection();
    const visitors = await collection
      .find({}, { projection: { _id: 0 } })
      .sort({ visited_at: -1, updated_at: -1, created_at: -1 })
      .limit(500)
      .toArray();

    return res.status(200).json({ visitors, total: visitors.length });
  } catch (error) {
    console.error('Visitors fetch error', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

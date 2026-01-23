import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getVisitorsCollection } from './lib/mongo';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
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

    const collection = await getVisitorsCollection();
    const visitors = await collection
      .find({}, { projection: { _id: 0 } })
      .sort({ visited_at: -1, created_at: -1 })
      .limit(200)
      .toArray();

    return res.status(200).json({ visitors });
  } catch (error) {
    console.error('Visitors fetch error', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

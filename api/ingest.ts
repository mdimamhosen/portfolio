import type { VercelRequest, VercelResponse } from '@vercel/node';
import { buildEmbeddings, listKnowledge } from './_lib/rag';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.VISITOR_API_KEY || process.env.TRACKING_API_KEY || process.env.INGEST_API_KEY;
    if (apiKey) {
      const header = req.headers.authorization || '';
      const token = header.startsWith('Bearer ') ? header.slice(7) : '';
      if (token !== apiKey) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    }

    const store = await buildEmbeddings(true);
    return res.status(200).json({
      ok: true,
      provider: 'deepseek',
      retrieval: 'lexical',
      chunks: store.length,
      knowledge: listKnowledge().map((c) => ({ id: c.id, title: c.title, category: c.category })),
    });
  } catch (error) {
    console.error('Ingest error', error);
    return res.status(500).json({ error: 'Failed to list knowledge chunks' });
  }
}

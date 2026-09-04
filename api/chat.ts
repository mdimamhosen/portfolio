import type { VercelRequest, VercelResponse } from '@vercel/node';
import { answerWithRag } from './_lib/rag';

function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function parseBody(req: VercelRequest): Record<string, unknown> {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return req.body as Record<string, unknown>;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: 'OPENAI_API_KEY is not configured' });
    }

    const body = parseBody(req);
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
      return res.status(400).json({ error: 'message is required' });
    }

    if (message.length > 2000) {
      return res.status(400).json({ error: 'message is too long' });
    }

    const result = await answerWithRag(message, history);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Chat RAG error', error);
    return res.status(500).json({ error: 'Failed to generate answer' });
  }
}

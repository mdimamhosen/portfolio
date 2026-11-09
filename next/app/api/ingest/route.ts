import { NextResponse } from 'next/server';
import { buildEmbeddings, listKnowledge } from '@/lib/server/rag';

export const maxDuration = 60;

async function handler(req: Request) {
  try {
    const apiKey = process.env.VISITOR_API_KEY || process.env.TRACKING_API_KEY || process.env.INGEST_API_KEY;
    if (apiKey) {
      const header = req.headers.get('authorization') || '';
      const token = header.startsWith('Bearer ') ? header.slice(7) : '';
      if (token !== apiKey) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const store = await buildEmbeddings(true);
    return NextResponse.json({
      ok: true,
      provider: 'deepseek',
      retrieval: 'lexical',
      chunks: store.length,
      knowledge: listKnowledge().map((c) => ({ id: c.id, title: c.title, category: c.category })),
    });
  } catch (error) {
    console.error('Ingest error', error);
    return NextResponse.json({ error: 'Failed to list knowledge chunks' }, { status: 500 });
  }
}

export { handler as GET, handler as POST };

import { NextResponse } from 'next/server';
import { answerWithRag } from '@/lib/server/rag';

export const maxDuration = 30;
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
const reply = (status: number, data: unknown) => NextResponse.json(data, { status, headers: cors });

export const OPTIONS = () => new Response(null, { status: 204, headers: cors });

export async function POST(req: Request) {
  try {
    if (!process.env.DEEPSEEK_API_KEY) {
      return reply(503, { error: 'DEEPSEEK_API_KEY is not configured' });
    }

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
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
      return reply(400, { error: 'message is required' });
    }

    if (message.length > 2000) {
      return reply(400, { error: 'message is too long' });
    }

    const result = await answerWithRag(message, history);
    return reply(200, result);
  } catch (error) {
    console.error('Chat RAG error', error);
    return reply(500, { error: 'Failed to generate answer' });
  }
}

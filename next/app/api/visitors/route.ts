import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/server/auth';
import { getVisitorsCollection, hasMongo } from '@/lib/server/mongo';

export const maxDuration = 15;

// Admin session (dashboard) or a server-side bearer key (scripts). Visitor data is never public.
export async function GET(req: Request) {
  try {
    const header = req.headers.get('authorization') || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    const apiKey = process.env.VISITOR_API_KEY;
    if (!(await isAdmin()) && !(apiKey && token === apiKey)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasMongo()) {
      return NextResponse.json({ error: 'MONGODB_URI is not configured' }, { status: 503 });
    }

    const collection = await getVisitorsCollection();
    const visitors = await collection
      .find({}, { projection: { _id: 0 } })
      .sort({ visited_at: -1, updated_at: -1, created_at: -1 })
      .limit(500)
      .toArray();

    return NextResponse.json({ visitors, total: visitors.length });
  } catch (error) {
    console.error('Visitors fetch error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

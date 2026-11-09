import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getClientIp, lookupGeo } from '@/lib/server/geo';
import { getVisitorsCollection, hasMongo } from '@/lib/server/mongo';

export const maxDuration = 15;
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
const reply = (status: number, data: unknown) => NextResponse.json(data, { status, headers: cors });

export const OPTIONS = () => new Response(null, { status: 204, headers: cors });

export async function POST(req: Request) {
  try {
    const apiKey = process.env.VISITOR_API_KEY || process.env.TRACKING_API_KEY;
    if (apiKey) {
      const header = req.headers.get('authorization') || '';
      const token = header.startsWith('Bearer ') ? header.slice(7) : '';
      if (token !== apiKey) {
        return reply(401, { error: 'Unauthorized' });
      }
    }

    if (!hasMongo()) {
      return reply(503, {
        error: 'Visitor storage is not configured (MONGODB_URI missing).',
      });
    }

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const ip = getClientIp(req.headers);
    const geo = await lookupGeo(ip);
    const now = new Date().toISOString();
    const id = typeof body.session_id === 'string' && body.session_id
      ? body.session_id
      : randomUUID();

    const visitor = {
      id,
      session_id: id,
      ip_address: geo.ip || ip,
      country: geo.country,
      country_code: geo.country_code,
      region: geo.region,
      city: geo.city,
      postal: geo.postal,
      latitude: geo.latitude,
      longitude: geo.longitude,
      geo_timezone: geo.timezone,
      isp: geo.org,
      asn: geo.asn,
      currency: geo.currency,
      user_agent: (body.user_agent as string) || req.headers.get('user-agent') || null,
      browser: (body.browser as string) || null,
      browser_version: (body.browser_version as string) || null,
      os: (body.os as string) || null,
      device_type: (body.device_type as string) || null,
      platform: (body.platform as string) || null,
      vendor: (body.vendor as string) || null,
      language: (body.language as string) || null,
      languages: (body.languages as string[]) || null,
      timezone: (body.timezone as string) || geo.timezone,
      timezone_offset: (body.timezone_offset as number) ?? null,
      screen_resolution: (body.screen_resolution as string) || null,
      available_resolution: (body.available_resolution as string) || null,
      viewport: (body.viewport as string) || null,
      color_depth: (body.color_depth as number) ?? null,
      pixel_ratio: (body.pixel_ratio as number) ?? null,
      referrer: (body.referrer as string) || null,
      page_url: (body.page_url as string) || null,
      landing_page: (body.landing_page as string) || null,
      utm: (body.utm as Record<string, string>) || null,
      connection_type: (body.connection_type as string) || null,
      downlink: (body.downlink as number) ?? null,
      hardware_concurrency: (body.hardware_concurrency as number) ?? null,
      device_memory: (body.device_memory as number) ?? null,
      max_touch_points: (body.max_touch_points as number) ?? null,
      touch_support: (body.touch_support as boolean) ?? null,
      cookies_enabled: (body.cookies_enabled as boolean) ?? null,
      do_not_track: (body.do_not_track as string) || null,
      online: (body.online as boolean) ?? null,
      visit_count: (body.visit_count as number) ?? 1,
      email: (body.email as string) || null,
      name: (body.name as string) || null,
      gpu_renderer: (body.gpu_renderer as string) || null,
      headers: {
        accept_language: req.headers.get('accept-language'),
        accept_encoding: req.headers.get('accept-encoding'),
        sec_ch_ua: req.headers.get('sec-ch-ua'),
        sec_ch_ua_platform: req.headers.get('sec-ch-ua-platform'),
        sec_ch_ua_mobile: req.headers.get('sec-ch-ua-mobile'),
      },
      visited_at: (body.visited_at as string) || now,
      // created_at is set only via $setOnInsert below; having it in $set too made every upsert fail (code 40).
      updated_at: now,
    };

    const collection = await getVisitorsCollection();

    const updateDoc: Record<string, unknown> = {
      $set: {
        ...visitor,
        updated_at: now,
      },
      $setOnInsert: {
        created_at: now,
      },
    };

    // A path can't be in both $setOnInsert and $inc; $inc creates the field on insert anyway.
    if (!body.email) {
      updateDoc.$inc = { hit_count: 1 };
    } else {
      (updateDoc.$setOnInsert as Record<string, unknown>).hit_count = 0;
    }

    if (body.email || body.name) {
      Object.assign(updateDoc.$set as Record<string, unknown>, {
        email: (body.email as string) || visitor.email,
        name: (body.name as string) || visitor.name,
        contact_submitted_at: now,
      });
    }

    await collection.updateOne({ session_id: id }, updateDoc, { upsert: true });

    return reply(200, {
      ok: true,
      session_id: id,
      location: {
        ip: visitor.ip_address,
        city: visitor.city,
        region: visitor.region,
        country: visitor.country,
      },
    });
  } catch (error) {
    console.error('Visitor track error', error);
    return reply(500, { error: 'Internal server error' });
  }
}

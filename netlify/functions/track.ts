import type { Handler, HandlerEvent } from '@netlify/functions';
import { randomUUID } from 'crypto';
import { getClientIp, lookupGeo } from '../../api/_lib/geo';
import { getVisitorsCollection, hasMongo } from '../../api/_lib/mongo';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

function parseBody(event: HandlerEvent): Record<string, unknown> {
  if (!event.body) return {};
  try {
    const raw = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64').toString('utf8')
      : event.body;
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

/** Minimal VercelRequest-like shim for shared geo helper. */
function asVercelLikeRequest(event: HandlerEvent) {
  return {
    headers: event.headers as Record<string, string | string[] | undefined>,
    socket: { remoteAddress: event.headers['client-ip'] || event.headers['x-nf-client-connection-ip'] },
  };
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
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
        body: JSON.stringify({
          error: 'Visitor storage is not configured (MONGODB_URI missing).',
        }),
      };
    }

    const body = parseBody(event);
    const ip = getClientIp(asVercelLikeRequest(event) as never);
    const geo = await lookupGeo(ip);
    const now = new Date().toISOString();
    const id =
      typeof body.session_id === 'string' && body.session_id
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
      user_agent: (body.user_agent as string) || event.headers['user-agent'] || null,
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
      visited_at: (body.visited_at as string) || now,
      created_at: now,
      updated_at: now,
    };

    const collection = await getVisitorsCollection();
    const updateDoc: Record<string, unknown> = {
      $set: { ...visitor, updated_at: now },
      $setOnInsert: { created_at: now, hit_count: 0 },
    };

    if (!body.email) {
      updateDoc.$inc = { hit_count: 1 };
    }

    if (body.email || body.name) {
      Object.assign(updateDoc.$set as Record<string, unknown>, {
        email: (body.email as string) || visitor.email,
        name: (body.name as string) || visitor.name,
        contact_submitted_at: now,
      });
    }

    await collection.updateOne({ session_id: id }, updateDoc, { upsert: true });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        ok: true,
        session_id: id,
        location: {
          ip: visitor.ip_address,
          city: visitor.city,
          region: visitor.region,
          country: visitor.country,
        },
      }),
    };
  } catch (error) {
    console.error('Netlify track error', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

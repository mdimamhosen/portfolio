import type { VercelRequest } from '@vercel/node';

export interface GeoInfo {
  ip: string;
  country: string | null;
  country_code: string | null;
  region: string | null;
  city: string | null;
  postal: string | null;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
  org: string | null;
  asn: string | null;
  currency: string | null;
}

export function getClientIp(req: VercelRequest): string {
  const headers = req.headers;

  const candidates = [
    headers['x-real-ip'],
    headers['x-vercel-forwarded-for'],
    headers['x-forwarded-for'],
    headers['cf-connecting-ip'],
    headers['true-client-ip'],
  ];

  for (const value of candidates) {
    if (!value) continue;
    const raw = Array.isArray(value) ? value[0] : value;
    const ip = raw.split(',')[0]?.trim();
    if (ip) return ip;
  }

  return req.socket?.remoteAddress || 'unknown';
}

export async function lookupGeo(ip: string): Promise<GeoInfo> {
  const fallback: GeoInfo = {
    ip,
    country: null,
    country_code: null,
    region: null,
    city: null,
    postal: null,
    latitude: null,
    longitude: null,
    timezone: null,
    org: null,
    asn: null,
    currency: null,
  };

  if (!ip || ip === 'unknown' || ip === '::1' || ip.startsWith('127.') || ip.startsWith('10.') || ip.startsWith('192.168.')) {
    return { ...fallback, city: 'Local / Private Network' };
  }

  try {
    const response = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Geo lookup failed: ${response.status}`);
    }

    const data = (await response.json()) as Record<string, unknown>;
    if (data.error) {
      throw new Error(String(data.reason || data.error));
    }

    return {
      ip: String(data.ip || ip),
      country: (data.country_name as string) || null,
      country_code: (data.country_code as string) || null,
      region: (data.region as string) || null,
      city: (data.city as string) || null,
      postal: (data.postal as string) || null,
      latitude: typeof data.latitude === 'number' ? data.latitude : null,
      longitude: typeof data.longitude === 'number' ? data.longitude : null,
      timezone: (data.timezone as string) || null,
      org: (data.org as string) || null,
      asn: (data.asn as string) || null,
      currency: (data.currency as string) || null,
    };
  } catch (error) {
    console.warn('Primary geo lookup failed, trying fallback', error);
  }

  try {
    const response = await fetch(`http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,message,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,as,query`);
    if (!response.ok) throw new Error(`Fallback geo failed: ${response.status}`);
    const data = (await response.json()) as Record<string, unknown>;
    if (data.status !== 'success') throw new Error(String(data.message || 'geo failed'));

    return {
      ip: String(data.query || ip),
      country: (data.country as string) || null,
      country_code: (data.countryCode as string) || null,
      region: (data.regionName as string) || null,
      city: (data.city as string) || null,
      postal: (data.zip as string) || null,
      latitude: typeof data.lat === 'number' ? data.lat : null,
      longitude: typeof data.lon === 'number' ? data.lon : null,
      timezone: (data.timezone as string) || null,
      org: (data.isp as string) || null,
      asn: (data.as as string) || null,
      currency: null,
    };
  } catch (error) {
    console.warn('Fallback geo lookup failed', error);
    return fallback;
  }
}

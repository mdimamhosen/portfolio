const SESSION_KEY = 'portfolio_visitor_session';
const VISIT_COUNT_KEY = 'portfolio_visit_count';
const LANDING_KEY = 'portfolio_landing_page';

function parseBrowser(ua: string) {
  let browser = 'Unknown';
  let browserVersion = '';
  let os = 'Unknown';
  let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';

  if (/iPad|Tablet/i.test(ua)) deviceType = 'tablet';
  else if (/Mobi|Android/i.test(ua)) deviceType = 'mobile';

  if (/Windows NT/i.test(ua)) os = 'Windows';
  else if (/Mac OS X/i.test(ua)) os = 'macOS';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iOS/i.test(ua)) os = 'iOS';
  else if (/Linux/i.test(ua)) os = 'Linux';

  const browserMatchers: Array<[RegExp, string]> = [
    [/Edg\/([\d.]+)/, 'Edge'],
    [/Chrome\/([\d.]+)/, 'Chrome'],
    [/Firefox\/([\d.]+)/, 'Firefox'],
    [/Version\/([\d.]+).*Safari/, 'Safari'],
    [/OPR\/([\d.]+)/, 'Opera'],
  ];

  for (const [regex, name] of browserMatchers) {
    const match = ua.match(regex);
    if (match) {
      browser = name;
      browserVersion = match[1] || '';
      break;
    }
  }

  return { browser, browserVersion, os, deviceType };
}

function getGpuRenderer(): string | null {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      (canvas.getContext('webgl') as WebGLRenderingContext | null) ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    if (!gl) return null;
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return null;
    return String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '') || null;
  } catch {
    return null;
  }
}

function getOrCreateSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function getVisitCount(): number {
  const current = Number(localStorage.getItem(VISIT_COUNT_KEY) || '0') + 1;
  localStorage.setItem(VISIT_COUNT_KEY, String(current));
  return current;
}

function getLandingPage(): string {
  const existing = sessionStorage.getItem(LANDING_KEY);
  if (existing) return existing;
  const landing = window.location.href;
  sessionStorage.setItem(LANDING_KEY, landing);
  return landing;
}

function getUtmParams(): Record<string, string> | null {
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((key) => {
    const value = params.get(key);
    if (value) utm[key] = value;
  });
  return Object.keys(utm).length ? utm : null;
}

export function getVisitorSessionId(): string {
  return getOrCreateSessionId();
}

export function collectVisitorPayload(extra: Record<string, unknown> = {}) {
  const ua = navigator.userAgent;
  const parsed = parseBrowser(ua);
  const connection =
    (navigator as Navigator & { connection?: { effectiveType?: string; downlink?: number } })
      .connection;

  return {
    session_id: getOrCreateSessionId(),
    user_agent: ua,
    browser: parsed.browser,
    browser_version: parsed.browserVersion,
    os: parsed.os,
    device_type: parsed.deviceType,
    platform: navigator.platform || null,
    vendor: navigator.vendor || null,
    language: navigator.language,
    languages: Array.from(navigator.languages || []),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezone_offset: new Date().getTimezoneOffset(),
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    available_resolution: `${window.screen.availWidth}x${window.screen.availHeight}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    color_depth: window.screen.colorDepth,
    pixel_ratio: window.devicePixelRatio,
    referrer: document.referrer || null,
    page_url: window.location.href,
    landing_page: getLandingPage(),
    utm: getUtmParams(),
    connection_type: connection?.effectiveType || null,
    downlink: connection?.downlink ?? null,
    hardware_concurrency: navigator.hardwareConcurrency ?? null,
    device_memory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? null,
    max_touch_points: navigator.maxTouchPoints ?? 0,
    touch_support: 'ontouchstart' in window || (navigator.maxTouchPoints || 0) > 0,
    cookies_enabled: navigator.cookieEnabled,
    do_not_track: navigator.doNotTrack || null,
    online: navigator.onLine,
    visit_count: Number(localStorage.getItem(VISIT_COUNT_KEY) || '1'),
    gpu_renderer: getGpuRenderer(),
    visited_at: new Date().toISOString(),
    ...extra,
  };
}

export async function sendVisitorEvent(extra: Record<string, unknown> = {}) {
  const endpoint = import.meta.env.VITE_TRACKING_ENDPOINT || '/api/track';

  const isFirstInSession = !sessionStorage.getItem('portfolio_visit_counted');
  if (isFirstInSession) {
    getVisitCount();
    sessionStorage.setItem('portfolio_visit_counted', 'true');
  }

  const payload = collectVisitorPayload(extra);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const apiKey = import.meta.env.VITE_TRACKING_API_KEY;
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
    keepalive: true,
  });

  if (!response.ok) {
    throw new Error(`Tracking failed: ${response.status}`);
  }

  return response.json();
}

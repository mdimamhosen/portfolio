import { createHmac, scryptSync, timingSafeEqual } from 'node:crypto';
import type { HandlerEvent } from '@netlify/functions';

export const base = (process.env.PUBLIC_SITE_URL || 'https://mdimamhosen.netlify.app').replace(/\/$/, '');
const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const secret = process.env.BLOG_SESSION_SECRET;
export const configured = Boolean(supabaseUrl && serviceKey && secret);
export const json = (statusCode: number, data: unknown, extra: Record<string,string> = {}) => ({ statusCode, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra }, body: JSON.stringify(data) });
export const allowedOrigin = (event: HandlerEvent) => {
  const origin = event.headers.origin;
  return !origin || origin === base;
};
export const cookie = (event: HandlerEvent, name: string) => (event.headers.cookie || '').split(';').map(x => x.trim()).find(x => x.startsWith(`${name}=`))?.slice(name.length + 1);
export const sign = (value: string) => createHmac('sha256', secret || '').update(value).digest('hex');
export const isAdmin = (event: HandlerEvent) => {
  if (!configured) return false;
  const value = cookie(event, 'blog_session');
  if (!value) return false;
  const [expiry, signature] = value.split('.');
  if (!/^\d+$/.test(expiry || '') || Number(expiry) < Date.now() || !signature || signature.length !== 64) return false;
  return timingSafeEqual(Buffer.from(sign(expiry)), Buffer.from(signature));
};
export const sessionCookie = (expiry: number) => `blog_session=${expiry}.${sign(String(expiry))}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=43200`;
export const clearCookie = 'blog_session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0';
export const verifyPassword = (password: string) => {
  const [salt, hash] = (process.env.BLOG_ADMIN_PASSWORD_HASH || '').split(':');
  if (!salt || !/^[a-f0-9]{128}$/.test(hash || '')) return false;
  const actual = scryptSync(password, salt, 64);
  return timingSafeEqual(actual, Buffer.from(hash, 'hex'));
};
export async function db(table: string, query: string, options: RequestInit = {}) {
  if (!supabaseUrl || !serviceKey) throw new Error('Blog database is not configured');
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${query}`, {
    ...options,
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  if (!response.ok) throw new Error(`Database request failed (${response.status})`);
  const body = await response.text();
  return body ? JSON.parse(body) : null;
}
export const publicFilter = () => 'or=(status.eq.published,status.eq.scheduled)&published_at=lte.' + encodeURIComponent(new Date().toISOString());
export const ipHash = (event: HandlerEvent) => sign(event.headers['x-nf-client-connection-ip'] || event.headers['x-forwarded-for']?.split(',')[0] || 'unknown');

export function publicAnalytics(pageType: 'article'|'service'|'blog') {
  const id = process.env.VITE_GA_MEASUREMENT_ID;
  if (!id || !/^G-[A-Z0-9]{6,15}$/.test(id)) return '';
  return `<script>(function(){var key='portfolio_analytics_consent';function start(){window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${id}',{anonymize_ip:true});${pageType === 'article' ? "gtag('event','blog_article_view');" : ''}var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${id}';document.head.appendChild(s);document.addEventListener('click',function(e){var a=e.target.closest('a');if(a&&a.href.startsWith('mailto:'))gtag('event','${pageType === 'service' ? 'service_cta_click' : 'email_click'}');});${pageType === 'blog' ? "document.addEventListener('submit',function(e){if(e.target.action.indexOf('/blog')!==-1)gtag('event','blog_search');});" : ''}}if(sessionStorage.getItem(key)==='yes'){start();return}if(sessionStorage.getItem(key)==='no')return;document.addEventListener('DOMContentLoaded',function(){var box=document.createElement('aside');box.setAttribute('aria-label','Analytics preference');box.style.cssText='position:fixed;bottom:16px;left:16px;z-index:100;background:#151e31;color:white;border:1px solid #344154;border-radius:12px;padding:16px;max-width:320px;font:14px system-ui';box.innerHTML='<p>May I use anonymous analytics to improve this portfolio?</p><button data-choice="yes">Allow</button> <button data-choice="no">Decline</button>';box.addEventListener('click',function(e){var choice=e.target.getAttribute('data-choice');if(!choice)return;sessionStorage.setItem(key,choice);box.remove();if(choice==='yes')start()});document.body.appendChild(box)})})();</script>`;
}

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

declare global { interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void } }
const id = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
const valid = /^G-[A-Z0-9]{6,15}$/.test(id || '');
const key = 'portfolio_analytics_consent';
const track = (name: string, params: Record<string,string> = {}) => {
  if (valid && sessionStorage.getItem(key) === 'yes' && window.gtag) window.gtag('event', name, params);
};
export default function Analytics() {
  const location = useLocation();
  const [choice, setChoice] = useState(() => sessionStorage.getItem(key));
  useEffect(() => {
    if (!valid || choice !== 'yes' || location.pathname.startsWith('/admin') || location.pathname === '/login') return;
    if (!window.gtag) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function (...args: unknown[]) { window.dataLayer!.push(args); };
      window.gtag('js', new Date());
      window.gtag('config', id!, { send_page_view: false, anonymize_ip: true });
      const script = document.createElement('script'); script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`; script.async = true; document.head.appendChild(script);
    }
    window.gtag('event', 'page_view', { page_path: location.pathname });
  }, [choice, location.pathname]);
  useEffect(() => {
    if (!valid || choice !== 'yes') return;
    const handler = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a'); if (!a) return;
      const url = new URL(a.href, window.location.href);
      if (url.protocol === 'mailto:') track('email_click');
      else if (url.hostname === 'github.com') track('github_click');
      else if (url.hostname === 'www.linkedin.com' || url.hostname === 'linkedin.com') track('linkedin_click');
      else if (url.hash === '#contact') track('contact_click');
      else if (a.hasAttribute('download')) track('resume_download');
      else if (url.origin !== window.location.origin && !url.hostname.includes('google')) track('project_click', { destination_host: url.hostname });
    };
    document.addEventListener('click', handler); return () => document.removeEventListener('click', handler);
  }, [choice]);
  if (!valid || choice || location.pathname.startsWith('/admin') || location.pathname === '/login') return null;
  return <aside className="fixed bottom-4 left-4 z-[100] max-w-sm rounded-xl border border-white/20 bg-slate-950 p-4 text-sm text-white shadow-xl" aria-label="Analytics preference"><p>May I use anonymous analytics to improve this portfolio?</p><div className="mt-3 flex gap-3"><button className="rounded bg-cyan-500 px-3 py-1 text-slate-950" onClick={() => {sessionStorage.setItem(key,'yes'); setChoice('yes');}}>Allow</button><button className="rounded border border-white/30 px-3 py-1" onClick={() => {sessionStorage.setItem(key,'no'); setChoice('no');}}>Decline</button></div></aside>;
}

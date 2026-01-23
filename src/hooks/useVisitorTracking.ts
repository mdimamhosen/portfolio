import { useEffect } from 'react';

export const useVisitorTracking = () => {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const endpoint = import.meta.env.VITE_TRACKING_ENDPOINT;

        if (!endpoint) {
          console.warn('Tracking endpoint not set (VITE_TRACKING_ENDPOINT). Skipping visitor log.');
          return;
        }

        const visitorData = {
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
          page_url: window.location.href,
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          visited_at: new Date().toISOString(),
        };

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        const apiKey = import.meta.env.VITE_TRACKING_API_KEY;
        if (apiKey) {
          headers['Authorization'] = `Bearer ${apiKey}`;
        }

        await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(visitorData),
          keepalive: true,
        });
      } catch (error) {
        console.error('Failed to track visitor:', error);
      }
    };

    trackVisitor();
  }, []);
};

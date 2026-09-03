import { useEffect } from 'react';
import { sendVisitorEvent } from '@/utils/visitorInfo';

export const useVisitorTracking = () => {
  useEffect(() => {
    let cancelled = false;

    const trackVisitor = async () => {
      try {
        if (cancelled) return;
        await sendVisitorEvent();
      } catch (error) {
        console.error('Failed to track visitor:', error);
      }
    };

    const timer = window.setTimeout(trackVisitor, 400);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);
};

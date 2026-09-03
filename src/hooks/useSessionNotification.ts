import { useEffect } from 'react';
import { sendEmail } from '@/lib/email';
import { getUserDetails } from '@/utils/userDetails';
import { collectVisitorPayload } from '@/utils/visitorInfo';

export const useSessionNotification = () => {
  useEffect(() => {
    const hasNotified = sessionStorage.getItem('session_notified');

    if (!hasNotified) {
      const userDetails = getUserDetails();
      const payload = collectVisitorPayload();

      const sendNotification = async () => {
        try {
          await sendEmail({
            subject: 'New Portfolio Visitor (Session Start)',
            message: `A new user has started a session.\n\n${userDetails}\n\nSession: ${payload.session_id}\nLanding: ${payload.landing_page}\nUTM: ${JSON.stringify(payload.utm)}`,
            user_details: userDetails,
            type: 'session_start',
          });
          sessionStorage.setItem('session_notified', 'true');
        } catch (error) {
          console.error('Failed to send session notification:', error);
        }
      };

      const timer = setTimeout(() => {
        void sendNotification();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);
};

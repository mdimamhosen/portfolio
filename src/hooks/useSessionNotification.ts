import { useEffect } from 'react';
import { sendEmail } from '@/lib/email';
import { getUserDetails } from '@/utils/userDetails';

export const useSessionNotification = () => {
  useEffect(() => {
    const hasNotified = sessionStorage.getItem('session_notified');

    if (!hasNotified) {
      const userDetails = getUserDetails();
      
      const sendNotification = async () => {
        try {
          await sendEmail({
            subject: 'New Portfolio Visitor (Session Start)',
            message: `A new user has started a session.\n\n${userDetails}`,
            user_details: userDetails,
            type: 'session_start'
          });
          sessionStorage.setItem('session_notified', 'true');
          console.log('Session notification sent.');
        } catch (error) {
          console.error('Failed to send session notification:', error);
        }
      };

      // Small delay to ensure everything is loaded
      const timer = setTimeout(() => {
        sendNotification();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);
};

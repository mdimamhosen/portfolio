import emailjs from '@emailjs/browser';

// These should be set in your .env file
// NEXT_PUBLIC_EMAILJS_SERVICE_ID
// NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
// NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

export const initEmail = () => {
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  if (publicKey) {
    emailjs.init(publicKey);
  }
};

export const sendEmail = async (templateParams: Record<string, unknown>) => {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  console.log('Attempting to send email...', { 
    serviceIdExists: !!serviceId, 
    templateIdExists: !!templateId, 
    publicKeyExists: !!publicKey,
    params: templateParams 
  });

  if (!serviceId || !templateId || !publicKey) {
    console.warn('EmailJS keys are missing. Email not sent.');
    return { status: 400, text: 'Missing configuration' };
  }

  try {
    const result = await emailjs.send(serviceId, templateId, templateParams, publicKey);
    console.log('EmailJS Success:', result);
    return result;
  } catch (error) {
    console.error('EmailJS Error:', error);
    throw error;
  }
};

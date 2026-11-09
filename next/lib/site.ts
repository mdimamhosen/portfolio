export const SITE_URL = (process.env.PUBLIC_SITE_URL || 'https://mdimamhosen.netlify.app').replace(/\/$/, '');
export const AUTHOR = {
  name: 'Md. Imam Hosen',
  jobTitle: 'Full Stack Engineer',
  email: 'mimam22.cse@bu.ac.bd',
  github: 'https://github.com/mdimamhosen',
  linkedin: 'https://www.linkedin.com/in/mdimam02/',
};
export const jsonLd = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, '\\u003c') });

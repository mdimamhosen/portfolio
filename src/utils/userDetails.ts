export const getUserDetails = () => {
  const { userAgent, language, platform } = window.navigator;
  const { width, height } = window.screen;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  return `
User Data:
- User Agent: ${userAgent}
- Screen Resolution: ${width}x${height}
- Language: ${language}
- Platform: ${platform}
- Timezone: ${timezone}
- Current Time: ${new Date().toLocaleString()}
`.trim();
};

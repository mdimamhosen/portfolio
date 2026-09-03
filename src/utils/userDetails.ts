export const getUserDetails = () => {
  const { userAgent, language, platform, languages, cookieEnabled, onLine, doNotTrack, maxTouchPoints, hardwareConcurrency } = window.navigator;
  const { width, height, colorDepth, availWidth, availHeight } = window.screen;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const connection = (navigator as Navigator & { connection?: { effectiveType?: string; downlink?: number } }).connection;
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;

  return `
User Data:
- User Agent: ${userAgent}
- Platform: ${platform}
- Screen Resolution: ${width}x${height}
- Available Resolution: ${availWidth}x${availHeight}
- Viewport: ${window.innerWidth}x${window.innerHeight}
- Color Depth: ${colorDepth}
- Pixel Ratio: ${window.devicePixelRatio}
- Language: ${language}
- Languages: ${(languages || []).join(', ')}
- Timezone: ${timezone}
- Timezone Offset: ${new Date().getTimezoneOffset()}
- Cookies Enabled: ${cookieEnabled}
- Online: ${onLine}
- Do Not Track: ${doNotTrack || 'n/a'}
- Touch Points: ${maxTouchPoints}
- CPU Cores: ${hardwareConcurrency ?? 'n/a'}
- Device Memory (GB): ${deviceMemory ?? 'n/a'}
- Connection: ${connection?.effectiveType || 'n/a'} (${connection?.downlink ?? 'n/a'} Mbps)
- Referrer: ${document.referrer || 'direct'}
- Page URL: ${window.location.href}
- Current Time: ${new Date().toLocaleString()}
`.trim();
};

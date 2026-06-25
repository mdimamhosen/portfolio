export const CHUNK_SIZE = 64 * 1024;
export const MAX_FILE_SIZE = 1024 * 1024 * 1024 * 2; // 2GB

export const formatBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};

export const sanitizeDeviceName = (input: string): string => input.trim().slice(0, 32) || defaultDeviceName();

export const defaultDeviceName = (): string => {
  const ua = navigator.userAgent.toLowerCase();
  if (/android/.test(ua)) return "Galaxy Phone";
  if (/iphone|ipad|ipod/.test(ua)) return "iPhone";
  if (/windows/.test(ua)) return "Windows Laptop";
  if (/mac/.test(ua)) return "MacBook";
  return "Nearby Device";
};

export const makeAvatarLabel = (name: string): string =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "U";

export const randomRoomCode = (): string =>
  Math.random().toString(36).replace(/[^a-z0-9]/g, "").slice(2, 8).toUpperCase();

export const estimateEta = (remainingBytes: number, speedBytesPerSecond: number): string => {
  if (!speedBytesPerSecond || speedBytesPerSecond <= 0) return "--";
  const sec = Math.max(1, Math.ceil(remainingBytes / speedBytesPerSecond));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

export const sha256Hex = async (buffer: ArrayBuffer): Promise<string> => {
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  const bytes = new Uint8Array(digest);
  return Array.from(bytes)
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("");
};

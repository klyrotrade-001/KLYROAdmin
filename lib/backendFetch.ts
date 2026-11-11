/**
 * Fetch wrapper for Render backend with 35s timeout.
 * Render free tier has cold start delay of 20-30s.
 */
export const BACKEND = (
  process.env.NEXT_PUBLIC_API_URL || 'https://klyroback.onrender.com'
).replace(/\/+$/, '');

export async function backendFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 35000);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

/**
 * Centralized backend API utility for the admin panel.
 * All calls go directly to the backend — no Next.js API routes needed.
 */

export const BACKEND_URL = (
  process.env.NEXT_PUBLIC_BACKEND_URL || 'https://klyroback.onrender.com'
).replace(/\/+$/, '');

/** Safe fetch — never throws, retries once on 503 (Render cold start) */
export async function safeFetch(url: string, options?: RequestInit) {
  const attempt = async () => {
    try {
      const res = await fetch(url, options);
      const text = await res.text();
      try {
        return { ok: res.ok, status: res.status, data: JSON.parse(text) };
      } catch {
        return { ok: false, status: res.status, data: null };
      }
    } catch {
      return { ok: false, status: 0, data: null };
    }
  };

  let result = await attempt();

  // Render cold start: retry once after 8 seconds on 503
  if (result.status === 503 || result.status === 0) {
    await new Promise((r) => setTimeout(r, 8000));
    result = await attempt();
  }

  return result;
}

/** Compress + convert an image File to a base64 JPEG string (max 800px) */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img') as HTMLImageElement;
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 800;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round((height * MAX) / width); width = MAX; }
        else { width = Math.round((width * MAX) / height); height = MAX; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = reject;
    img.src = objectUrl;
  });
}

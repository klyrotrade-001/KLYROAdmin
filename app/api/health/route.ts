import { NextResponse } from 'next/server';
import { BACKEND, backendFetch } from '@/lib/backendFetch';

export async function GET() {
  try {
    const res = await backendFetch(`${BACKEND}/api/health`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ status: 'offline', db: 'error', error: 'Backend unavailable' }, { status: 503 });
  }
}

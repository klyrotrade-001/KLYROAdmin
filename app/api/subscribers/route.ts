import { NextResponse } from 'next/server';
import { BACKEND, backendFetch } from '@/lib/backendFetch';

export async function GET() {
  try {
    const res = await backendFetch(`${BACKEND}/api/subscribers`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ success: false, error: 'Backend unavailable — please retry' }, { status: 503 });
  }
}

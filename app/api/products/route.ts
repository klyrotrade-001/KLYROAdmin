import { NextRequest, NextResponse } from 'next/server';
import { BACKEND, backendFetch } from '@/lib/backendFetch';

export async function GET(req: NextRequest) {
  try {
    const qs = new URL(req.url).searchParams.toString();
    const res = await backendFetch(`${BACKEND}/api/products${qs ? `?${qs}` : ''}`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ success: false, error: 'Backend unavailable — please retry' }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await backendFetch(`${BACKEND}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ success: false, error: 'Backend unavailable — please retry' }, { status: 503 });
  }
}

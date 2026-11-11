import { NextResponse } from 'next/server';

const BACKEND = (process.env.NEXT_PUBLIC_API_URL || 'https://klyroback.onrender.com').replace(/\/+$/, '');

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/api/inquiries`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ success: false, error: 'Backend unavailable' }, { status: 503 });
  }
}

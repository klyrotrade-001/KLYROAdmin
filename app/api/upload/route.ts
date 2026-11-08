import { NextResponse } from 'next/server';

// Upload is handled client-side as Base64 — this route is no longer used.
export async function POST() {
  return NextResponse.json(
    { success: false, error: 'Use Base64 upload instead.' },
    { status: 410 }
  );
}

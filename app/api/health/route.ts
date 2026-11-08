import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export async function GET() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return NextResponse.json({
      status: 'online',
      db: 'error',
      error: 'MONGODB_URI environment variable is not set in Vercel',
    });
  }
  try {
    await connectDB();
    return NextResponse.json({ status: 'online', db: 'mongodb', connected: true });
  } catch (e: any) {
    return NextResponse.json({
      status: 'online',
      db: 'error',
      error: e.message,
    });
  }
}

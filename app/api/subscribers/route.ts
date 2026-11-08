import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Subscriber from '@/models/Subscriber';

export async function GET() {
  try {
    await connectDB();
    const subscribers = await Subscriber.find().sort({ subscribedAt: -1 }).lean();
    return NextResponse.json({ success: true, subscribers });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

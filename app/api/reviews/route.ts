import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Review from '@/models/Review';

export async function GET() {
  try {
    await connectDB();
    const raw = await Review.find().sort({ createdAt: -1 }).lean() as any[];

    // Normalize: map approved:bool → status string, customerName → userName
    const reviews = raw.map((r) => ({
      ...r,
      userName: r.userName || r.customerName || 'Anonymous',
      status: r.status ?? (r.approved === true ? 'approved' : r.approved === false ? 'pending' : 'pending'),
    }));

    return NextResponse.json({ success: true, reviews });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().lean();
    return NextResponse.json({ success: true, categories });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    if (!body.name) return NextResponse.json({ success: false, error: 'name required' }, { status: 400 });
    const slug = body.slug || body.name.toLowerCase().replace(/\s+/g, '-');
    const category = await Category.create({ id: `cat-${Date.now()}`, slug, ...body });
    return NextResponse.json({ success: true, category });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

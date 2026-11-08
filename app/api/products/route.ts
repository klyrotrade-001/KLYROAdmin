import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('limit');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let query: any = {};
    if (category && category !== 'all') query.categorySlug = category;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];

    let dbQuery = Product.find(query).lean();
    if (limit) dbQuery = dbQuery.limit(parseInt(limit));
    const products = await dbQuery;
    return NextResponse.json({ success: true, total: products.length, products });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, category, price, images } = body;
    if (!name || !category || !price || !images?.length)
      return NextResponse.json({ success: false, error: 'name, category, price, image required' }, { status: 400 });

    const slug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim()
      .replace(/\s+/g, '-').replace(/-+/g, '-') + '-' + Date.now();

    const product = await Product.create({
      id: `prod-${Date.now()}`, slug, ...body,
      price: Number(price),
      originalPrice: Number(body.originalPrice || price),
      discount: Number(body.discount || 0),
    });
    return NextResponse.json({ success: true, product });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

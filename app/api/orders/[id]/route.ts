import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';

function toOrderShape(doc: any) {
  return {
    id: doc.id,
    createdAt: doc.createdAt ?? new Date().toISOString(),
    status: doc.status ?? 'placed',
    totalAmount: doc.totalAmount ?? 0,
    subtotal: doc.totalAmount ?? 0,
    shippingFee: 0,
    customer: doc.customer ?? {
      fullName: doc.customerName ?? '',
      mobileNumber: doc.phone ?? '',
      email: doc.email ?? '',
      houseBuilding: '',
      streetLocality: doc.address ?? '',
      city: '',
      state: '',
      pinCode: '',
    },
    items: (doc.items ?? []).map((i: any) => ({
      productId: i.productId ?? '',
      name: i.name ?? '',
      price: i.price ?? 0,
      quantity: i.quantity ?? 1,
      image: i.image ?? '',
      subtotal: (i.price ?? 0) * (i.quantity ?? 1),
    })),
    statusHistory: (doc.statusHistory ?? []).map((h: any) => ({
      status: h.status,
      timestamp: h.updatedAt ?? h.timestamp ?? new Date().toISOString(),
      message: h.message ?? '',
    })),
  };
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const { status, message } = await req.json();
    const doc = await Order.findOneAndUpdate(
      { id },
      { status, $push: { statusHistory: { status, message, updatedAt: new Date() } } },
      { new: true }
    ).lean();
    if (!doc) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, order: toOrderShape(doc) });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const order = await Order.findOneAndDelete({ id });
    if (!order) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Order deleted' });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

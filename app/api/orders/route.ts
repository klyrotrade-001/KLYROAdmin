import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';

// Transform flat MongoDB order → Order type with customer object
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

export async function GET() {
  try {
    await connectDB();
    const docs = await Order.find().sort({ createdAt: -1 }).lean();
    const orders = docs.map(toOrderShape);
    return NextResponse.json({ success: true, orders });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

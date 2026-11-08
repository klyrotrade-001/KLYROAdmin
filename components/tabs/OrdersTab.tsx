'use client';

import { Order, OrderStatus } from '@/src/lib/db';
import OrdersTable from '../OrdersTable';

interface Props {
  orders: Order[];
  onStatusUpdate: (id: string, status: OrderStatus, note?: string) => Promise<void>;
  onDeleteOrder: (id: string) => Promise<void>;
}

export default function OrdersTab({ orders, onStatusUpdate, onDeleteOrder }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-[#151515]">Orders</h1>
        <p className="text-sm text-[#777777] mt-1">
          {orders.length} total orders — update status and contact customers via WhatsApp.
        </p>
      </div>
      <OrdersTable orders={orders} onStatusUpdate={onStatusUpdate} onDeleteOrder={onDeleteOrder} />
    </div>
  );
}

'use client';

import { Order, OrderStatus } from '@/src/lib/db';
import { Product } from '@/src/types';
import { ArrowUpRight, MoreHorizontal, ChevronRight, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import OrdersTable from '../OrdersTable';

interface Props {
  orders: Order[];
  products: Product[];
  inquiriesCount: number;
  subscribersCount: number;
  onTabChange: (t: string) => void;
  onStatusUpdate: (id: string, status: OrderStatus, note?: string) => Promise<void>;
  onDeleteOrder: (id: string) => Promise<void>;
}

// Weekly bar chart — maps last 7 days of orders
function WeeklyChart({ orders }: { orders: Order[] }) {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = new Date();

  const data = days.map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const count = orders.filter((o) => {
      const od = new Date(o.createdAt);
      return od.toDateString() === d.toDateString();
    }).length;
    return count;
  });

  const max = Math.max(...data, 1);

  // heights in px out of 120
  const heights = data.map((v) => Math.max(Math.round((v / max) * 120), 8));

  // alternating shades like Tasko
  const colors = [
    '#a7f3d0', '#005E23', '#34d399', '#005E23', '#a7f3d0', '#34d399', '#a7f3d0',
  ];

  return (
    <div className="flex items-end justify-between gap-2 h-36 px-2">
      {days.map((day, i) => (
        <div key={i} className="flex flex-col items-center gap-2 flex-1">
          <div className="w-full flex items-end justify-center" style={{ height: '120px' }}>
            <div
              className="w-full rounded-t-lg rounded-b-sm transition-all"
              style={{ height: `${heights[i]}px`, backgroundColor: colors[i] }}
            />
          </div>
          <span className="text-[11px] font-bold text-[#AAAAAA]">{day}</span>
        </div>
      ))}
    </div>
  );
}

// Circular progress
function CircleProgress({ percent }: { percent: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;

  return (
    <svg width="88" height="88" viewBox="0 0 88 88">
      <circle cx="44" cy="44" r={r} fill="none" stroke="#E8ECE6" strokeWidth="8" />
      <circle
        cx="44" cy="44" r={r} fill="none"
        stroke="#005E23" strokeWidth="8"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        transform="rotate(-90 44 44)"
      />
      <text x="44" y="48" textAnchor="middle" fontSize="14" fontWeight="900" fill="#151515">
        {percent}%
      </text>
    </svg>
  );
}

export default function DashboardHome({ orders, products, inquiriesCount, subscribersCount, onTabChange, onStatusUpdate, onDeleteOrder }: Props) {
  const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  const totalRevenue    = orders.reduce((s, o) => s + o.totalAmount, 0);
  const totalOrders     = orders.length;
  const pendingOrders   = orders.filter((o) => o.status === 'placed').length;
  const shippedOrders   = orders.filter((o) => o.status === 'shipped').length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
  const deliveryRate    = totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0;

  // Top 4 products by price
  const topProducts = [...products].sort((a, b) => b.price - a.price).slice(0, 4);

  const statCards = [
    {
      label: 'Total Revenue',
      value: fmt(totalRevenue),
      sub: 'All time earnings',
      green: true,
    },
    {
      label: 'Total Orders',
      value: String(totalOrders),
      sub: 'All time',
      green: false,
    },
    {
      label: 'Delivered',
      value: String(deliveredOrders),
      sub: 'Completed',
      green: false,
    },
    {
      label: 'Pending',
      value: String(pendingOrders),
      sub: 'Need confirm',
      green: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#151515]">Dashboard</h1>
          <p className="text-sm text-[#777777] mt-0.5">
            Monitor orders, revenue, and store performance.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onTabChange('orders')}
            className="flex items-center gap-2 rounded-xl bg-[#005E23] px-4 py-2 text-sm font-bold text-white hover:bg-[#004719] transition-colors"
          >
            + New Order
          </button>
          <a
            href="https://wa.me/918089030066"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-[#E5E5E5] bg-white px-4 py-2 text-sm font-bold text-[#151515] hover:bg-[#F7F8F6] transition-colors"
          >
            WhatsApp Desk
          </a>
        </div>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div
            key={i}
            className={`rounded-2xl p-5 flex flex-col justify-between min-h-[130px] ${
              card.green
                ? 'bg-[#005E23] text-white'
                : 'bg-white border border-[#EBEBEB]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-sm font-semibold ${card.green ? 'text-white/80' : 'text-[#777777]'}`}>
                {card.label}
              </span>
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                card.green ? 'bg-white/20' : 'bg-[#F0F2EE]'
              }`}>
                <ArrowUpRight size={16} className={card.green ? 'text-white' : 'text-[#005E23]'} />
              </div>
            </div>
            <div>
              <p className={`text-3xl font-black mt-3 leading-none ${card.green ? 'text-white' : 'text-[#151515]'}`}>
                {card.value}
              </p>
              <p className={`text-xs font-medium mt-1.5 flex items-center gap-1 ${
                card.green ? 'text-white/70' : 'text-[#005E23]'
              }`}>
                <TrendingUp size={11} />
                {card.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Row: Chart + Right Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Weekly Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-[#EBEBEB] p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-black text-[#151515]">Order Analytics</h2>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#005E23]">
              <span className="h-2 w-2 rounded-full bg-[#005E23]" />
              Weekly Activity
            </div>
          </div>
          <p className="text-xs text-[#AAAAAA] mb-5">Orders placed in the last 7 days</p>

          {/* Y-axis labels */}
          <div className="flex gap-3">
            <div className="flex flex-col justify-between text-[10px] text-[#AAAAAA] font-semibold pb-6" style={{ height: '156px' }}>
              {[10, 7, 5, 2, 0].map((v) => (
                <span key={v}>{v}</span>
              ))}
            </div>
            <div className="flex-1">
              <WeeklyChart orders={orders} />
            </div>
          </div>

          <div className="flex justify-between mt-4 text-xs text-[#AAAAAA]">
            <span>
              Average:{' '}
              <span className="font-bold text-[#151515]">
                {Math.round((orders.length / 7) * 10) / 10}/day
              </span>
            </span>
            <span>
              Total:{' '}
              <span className="font-bold text-[#005E23]">{orders.length} orders</span>
            </span>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Mini stats */}
          <div className="rounded-2xl bg-white border border-[#EBEBEB] p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#AAAAAA]">Store Snapshot</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-[10px] text-[#AAAAAA] uppercase font-bold">Products</p>
                <p className="text-xl font-black text-[#151515] mt-1">{products.length}</p>
              </div>
              <div className="text-center border-x border-[#EBEBEB]">
                <p className="text-[10px] text-[#AAAAAA] uppercase font-bold">Subs</p>
                <p className="text-xl font-black text-[#151515] mt-1">{subscribersCount}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-[#AAAAAA] uppercase font-bold">Inquiries</p>
                <p className="text-xl font-black text-[#151515] mt-1">{inquiriesCount}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[#EBEBEB]">
              <p className="text-[10px] text-[#AAAAAA] uppercase font-bold mb-1">Shipped</p>
              <p className="text-xl font-black text-[#151515]">{shippedOrders}</p>
              <p className="text-xs text-[#777777] mt-0.5">in transit right now</p>
            </div>
          </div>

          {/* Delivery Rate */}
          <div className="rounded-2xl bg-white border border-[#EBEBEB] p-5">
            <h3 className="text-sm font-black text-[#151515]">Delivery Rate</h3>
            <p className="text-xs text-[#AAAAAA] mt-0.5 mb-4">Orders delivered successfully</p>
            <div className="flex items-center gap-4">
              <CircleProgress percent={deliveryRate} />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#005E23]" />
                  <span className="text-xs text-[#555555]">Delivered <span className="font-bold text-[#151515]">{deliveredOrders}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#a7f3d0]" />
                  <span className="text-xs text-[#555555]">Shipped <span className="font-bold text-[#151515]">{shippedOrders}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#E8ECE6]" />
                  <span className="text-xs text-[#555555]">Pending <span className="font-bold text-[#151515]">{pendingOrders}</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products + Recent Orders Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Top Products */}
        <div className="rounded-2xl bg-white border border-[#EBEBEB] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-[#151515]">Top Products</h2>
            <button type="button" className="text-[#AAAAAA] hover:text-[#555555]">
              <MoreHorizontal size={18} />
            </button>
          </div>
          <div className="space-y-3">
            {topProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="relative h-10 w-10 shrink-0 rounded-xl overflow-hidden border border-[#EBEBEB] bg-[#F7F8F6]">
                  <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#151515] truncate">{p.name}</p>
                  <p className="text-[10px] text-[#AAAAAA] truncate">{p.category}</p>
                </div>
                <span className="text-xs font-black text-[#151515] shrink-0">
                  ₹{p.price.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onTabChange('products')}
            className="mt-4 w-full flex items-center justify-center gap-1 text-xs font-bold text-[#005E23] hover:underline"
          >
            View all <ChevronRight size={12} />
          </button>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-[#EBEBEB] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#EBEBEB]">
            <h2 className="text-base font-black text-[#151515]">Recent Orders</h2>
            <button
              type="button"
              onClick={() => onTabChange('orders')}
              className="text-xs font-bold text-[#005E23] hover:underline flex items-center gap-1"
            >
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div className="p-4">
            <OrdersTable orders={orders.slice(0, 4)} onStatusUpdate={onStatusUpdate} onDeleteOrder={onDeleteOrder} />
          </div>
        </div>

      </div>
    </div>
  );
}

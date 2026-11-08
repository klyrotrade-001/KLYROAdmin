'use client';

import { DollarSign, ShoppingBag, Clock, TrendingUp, Package, MessageSquare, Mail } from 'lucide-react';
import { Order } from '@/src/lib/db';

interface StatsProps {
  orders: Order[];
  totalProductsCount: number;
  inquiriesCount: number;
  subscribersCount: number;
}

export default function StatsOverview({ orders, totalProductsCount, inquiriesCount, subscribersCount }: StatsProps) {
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.status === 'placed').length;
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  const formatPrice = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  const cards = [
    {
      title: 'Total Revenue',
      value: formatPrice(totalRevenue),
      subtitle: 'Across all registered orders',
      icon: DollarSign,
      color: 'text-[#005E23] bg-[#ecfdf5]',
    },
    {
      title: 'Total Orders',
      value: orders.length.toString(),
      subtitle: 'All customer checkouts',
      icon: ShoppingBag,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Pending Confirmation',
      value: pendingOrders.toString(),
      subtitle: 'Awaiting WhatsApp confirm',
      icon: Clock,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      title: 'Avg. Order Value',
      value: formatPrice(avgOrderValue),
      subtitle: 'Average per basket',
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      title: 'Live Catalog',
      value: totalProductsCount.toString(),
      subtitle: 'Active curated items',
      icon: Package,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      title: 'Inquiries',
      value: inquiriesCount.toString(),
      subtitle: 'Customer support tickets',
      icon: MessageSquare,
      color: 'text-orange-600 bg-orange-50',
    },
    {
      title: 'Subscribers',
      value: subscribersCount.toString(),
      subtitle: 'Newsletter signups',
      icon: Mail,
      color: 'text-pink-600 bg-pink-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="rounded-2xl border border-[#E8ECE6] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#777777] leading-tight">
                {c.title}
              </span>
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${c.color} shrink-0`}>
                <Icon size={15} />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-black text-[#151515]">{c.value}</span>
              <p className="mt-1 text-[10px] text-[#777777] leading-tight">{c.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

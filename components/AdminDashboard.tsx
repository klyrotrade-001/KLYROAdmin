'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import DashboardHome from './tabs/DashboardHome';
import OrdersTab from './tabs/OrdersTab';
import ProductsTab from './tabs/ProductsTab';
import CategoriesTab from './tabs/CategoriesTab';
import ReviewsTab from './tabs/ReviewsTab';
import InquiriesTab from './tabs/InquiriesTab';
import SubscribersTab from './tabs/SubscribersTab';
import SettingsTab from './tabs/SettingsTab';
import { Order, OrderStatus } from '@/src/lib/db';
import { Product } from '@/src/types';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  itemCount: number;
  image: string;
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  type: string;
  createdAt: string;
}

export interface Subscriber {
  email: string;
  subscribedAt: string;
}

// Safe fetch — never crashes even if backend is offline or returns non-JSON
async function safeFetch(url: string, options?: RequestInit) {
  try {
    const res = await fetch(url, options);
    const text = await res.text();
    try {
      return { ok: res.ok, data: JSON.parse(text) };
    } catch {
      return { ok: false, data: null };
    }
  } catch {
    return { ok: false, data: null };
  }
}

export default function AdminDashboard() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [backendOffline, setBackendOffline] = useState(false);

  const fetchOrders = async () => {
    const { ok, data } = await safeFetch('http://localhost:5001/api/orders');
    if (ok && data?.success) setOrders(data.orders);
  };

  const fetchProducts = async () => {
    const { ok, data } = await safeFetch('http://localhost:5001/api/products?limit=200');
    if (ok && data?.success) setProducts(data.products);
  };

  const fetchCategories = async () => {
    const { ok, data } = await safeFetch('http://localhost:5001/api/categories');
    if (ok && data?.success) setCategories(data.categories);
  };

  const fetchInquiries = async () => {
    const { ok, data } = await safeFetch('http://localhost:5001/api/inquiries');
    if (ok && data?.success) setInquiries(data.inquiries);
  };

  const fetchSubscribers = async () => {
    const { ok, data } = await safeFetch('http://localhost:5001/api/subscribers');
    if (ok && data?.success) setSubscribers(data.subscribers);
  };

  const checkBackend = async () => {
    const { ok, data } = await safeFetch('http://localhost:5001/api/health');
    setBackendOffline(!(ok && data?.status === 'online'));
  };

  const fetchAll = async () => {
    await checkBackend();
    await Promise.all([fetchOrders(), fetchProducts(), fetchCategories(), fetchInquiries(), fetchSubscribers()]);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleRefresh = () => { setRefreshing(true); fetchAll(); };

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus, note?: string) => {
    const { ok, data } = await safeFetch(`http://localhost:5001/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, message: note }),
    });
    if (ok && data?.success) {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    const { ok, data } = await safeFetch(`http://localhost:5001/api/orders/${orderId}`, { method: 'DELETE' });
    if (ok && data?.success) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    }
  };

  const pendingCount = orders.filter((o) => o.status === 'placed').length;

  return (
    <div className="flex min-h-screen bg-[#F7F8F6]">
      <AdminSidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        pendingCount={pendingCount}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader refreshing={refreshing} onRefresh={handleRefresh} />

        {/* Backend offline banner */}
        {backendOffline && (
          <div className="bg-red-50 border-b border-red-200 px-6 py-3 flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 shrink-0 animate-pulse" />
            <p className="text-sm font-bold text-red-700">
              Backend offline —{' '}
              <span className="font-normal">data may not load. Run:{' '}</span>
              <code className="bg-red-100 border border-red-200 px-1.5 py-0.5 rounded font-mono text-xs">
                cd backend &amp;&amp; node server.js
              </code>
            </p>
          </div>
        )}

        <main className="flex-1 p-6 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 rounded-full border-4 border-[#005E23] border-t-transparent animate-spin" />
                <p className="text-sm font-semibold text-[#777777]">Loading workspace...</p>
              </div>
            </div>
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <DashboardHome
                  orders={orders}
                  products={products}
                  inquiriesCount={inquiries.length}
                  subscribersCount={subscribers.length}
                  onTabChange={setCurrentTab}
                  onStatusUpdate={handleStatusUpdate}
                  onDeleteOrder={handleDeleteOrder}
                />
              )}
              {currentTab === 'orders' && (
                <OrdersTab orders={orders} onStatusUpdate={handleStatusUpdate} onDeleteOrder={handleDeleteOrder} />
              )}
              {currentTab === 'products' && (
                <ProductsTab products={products} onProductsChange={setProducts} />
              )}
              {currentTab === 'reviews' && (
                <ReviewsTab />
              )}
              {currentTab === 'categories' && (
                <CategoriesTab categories={categories} onCategoriesChange={setCategories} />
              )}
              {currentTab === 'inquiries' && (
                <InquiriesTab inquiries={inquiries} />
              )}
              {currentTab === 'subscribers' && (
                <SubscribersTab subscribers={subscribers} />
              )}
              {currentTab === 'settings' && (
                <SettingsTab />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

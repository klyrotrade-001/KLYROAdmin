'use client';

import { useRouter } from 'next/navigation';
import { RefreshCw, Bell, ChevronDown, LogOut, LayoutDashboard, ShoppingBag, Package, MessageSquare, Users, ExternalLink, Menu, X } from 'lucide-react';
import { useState } from 'react';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders',    label: 'Orders',    icon: ShoppingBag },
  { id: 'products',  label: 'Products',  icon: Package },
  { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
  { id: 'subscribers', label: 'Subscribers', icon: Users },
];

interface Props {
  currentTab: string;
  setCurrentTab: (t: string) => void;
  pendingCount: number;
  refreshing: boolean;
  onRefresh: () => void;
}

export default function AdminTopNav({ currentTab, setCurrentTab, pendingCount, refreshing, onRefresh }: Props) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUser');
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Left: Logo + Hamburger */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="lg:hidden text-gray-500 hover:text-gray-800"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-[#111827]">KLYRO</span>
              <span className="hidden sm:inline-block rounded-md bg-[#005E23] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Admin
              </span>
            </div>
          </div>

          {/* Center: Tab Nav (desktop) */}
          <nav className="hidden lg:flex items-center gap-1 rounded-full bg-gray-100 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCurrentTab(tab.id)}
                className={`relative flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                  currentTab === tab.id
                    ? 'bg-[#005E23] text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab.label}
                {tab.id === 'orders' && pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[9px] font-black text-black">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Storefront link */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              title="Open Storefront"
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <ExternalLink size={15} />
            </a>

            {/* Refresh */}
            <button
              type="button"
              onClick={onRefresh}
              title="Refresh"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={15} className={refreshing ? 'animate-spin text-[#005E23]' : ''} />
            </button>

            {/* Notifications */}
            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <Bell size={15} />
              {pendingCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-full border border-gray-200 pl-1 pr-3 py-1 hover:bg-gray-50 transition-colors"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#005E23] text-white text-xs font-black">
                  K
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-gray-800 leading-none">Admin</p>
                  <p className="text-[10px] text-gray-400 leading-none mt-0.5">KLYRO</p>
                </div>
                <ChevronDown size={13} className="text-gray-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-12 w-44 rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-800">Admin Desk</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">klyrotrade@gmail.com</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-3 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={13} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 pb-3 pt-2 flex flex-col gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => { setCurrentTab(tab.id); setMobileOpen(false); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  currentTab === tab.id
                    ? 'bg-[#ecfdf5] text-[#005E23]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
                {tab.id === 'orders' && pendingCount > 0 && (
                  <span className="ml-auto rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-black text-black">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

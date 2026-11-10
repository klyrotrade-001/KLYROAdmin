'use client';

import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, ShoppingBag, Package, Folder,
  MessageSquareDiff, MessageSquare, Users,
  Settings, HelpCircle, LogOut, ExternalLink,
} from 'lucide-react';

interface Props {
  currentTab: string;
  setCurrentTab: (t: string) => void;
  pendingCount: number;
}

const menuItems = [
  { id: 'dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
  { id: 'orders',      label: 'Orders',      icon: ShoppingBag,    badge: true },
  { id: 'products',    label: 'Products',    icon: Package },
  { id: 'categories',  label: 'Categories',  icon: Folder },
  { id: 'reviews',     label: 'Reviews',     icon: MessageSquareDiff },
  { id: 'inquiries',   label: 'Inquiries',   icon: MessageSquare },
  { id: 'subscribers', label: 'Subscribers', icon: Users },
];

export default function AdminSidebar({ currentTab, setCurrentTab, pendingCount }: Props) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUser');
    router.push('/login');
  };

  const NavItem = ({ id, label, icon: Icon, badge }: {
    id: string; label: string; icon: React.ElementType; badge?: boolean;
  }) => {
    const active = currentTab === id;
    return (
      <button
        type="button"
        onClick={() => setCurrentTab(id)}
        className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
          active
            ? 'bg-[#005E23] text-white font-medium'
            : 'text-gray-300 hover:bg-[#1a4d2e] hover:text-white'
        }`}
      >
        <Icon size={18} className="shrink-0" />
        <span className="truncate">{label}</span>
        {badge && pendingCount > 0 && (
          <span className="ml-auto shrink-0 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
            {pendingCount}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className="w-60 shrink-0 min-h-screen bg-[#2d3748] flex flex-col select-none shadow-lg">
      {/* Brand */}
      <div className="px-4 py-6 border-b border-gray-700 bg-[#1a252f]">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-8 w-8 rounded bg-[#005E23] flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">KLYRO</h1>
        </div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Admin Panel</p>
      </div>

      {/* Main nav */}
      <div className="flex-1 overflow-y-auto py-2">
        {menuItems.map((item) => <NavItem key={item.id} {...item} />)}

        {/* Divider */}
        <div className="my-4 border-t border-gray-700" />

        {/* Settings group */}
        <div className="px-4 py-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">System</p>
        </div>

        <button
          type="button"
          onClick={() => setCurrentTab('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
            currentTab === 'settings'
              ? 'bg-[#005E23] text-white font-medium'
              : 'text-gray-300 hover:bg-[#1a4d2e] hover:text-white'
          }`}
        >
          <Settings size={18} className="shrink-0" />
          <span>Settings</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentTab('help')}
          className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
            currentTab === 'help'
              ? 'bg-[#005E23] text-white font-medium'
              : 'text-gray-300 hover:bg-[#1a4d2e] hover:text-white'
          }`}
        >
          <HelpCircle size={18} className="shrink-0" />
          <span>Help</span>
        </button>
      </div>

      {/* Bottom actions */}
      <div className="border-t border-gray-700">
        <a
          href="https://klyro-frontend-tau.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-[#1a4d2e] hover:text-white transition-colors"
        >
          <ExternalLink size={18} className="shrink-0" />
          <span>View Storefront</span>
        </a>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
        >
          <LogOut size={18} className="shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

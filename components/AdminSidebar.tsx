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
  { id: 'orders',      label: 'Orders',      icon: ShoppingBag,   badge: true },
  { id: 'products',    label: 'Products',    icon: Package },
  { id: 'categories',  label: 'Categories',  icon: Folder },
  { id: 'reviews',     label: 'Reviews',     icon: MessageSquareDiff },
  { id: 'inquiries',   label: 'Inquiries',   icon: MessageSquare },
  { id: 'subscribers', label: 'Subscribers', icon: Users },
];

const settingsItems = [
  { id: 'settings', label: 'Settings',   sub: 'Configure store',    icon: Settings },
  { id: 'help',     label: 'Help',       sub: 'Get support',         icon: HelpCircle },
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
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
          active
            ? 'bg-[#F0F0F0] font-bold text-[#111111]'
            : 'font-medium text-[#555555] hover:bg-[#F7F7F7] hover:text-[#111111]'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon size={16} strokeWidth={active ? 2.5 : 1.8} className={active ? 'text-[#111111]' : 'text-[#888888]'} />
          <span>{label}</span>
        </div>
        {badge && pendingCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#111111] text-[10px] font-black text-white">
            {pendingCount}
          </span>
        )}
      </button>
    );
  };

  const SettingsItem = ({ id, label, sub, icon: Icon }: {
    id: string; label: string; sub: string; icon: React.ElementType;
  }) => {
    const active = currentTab === id;
    return (
      <button
        type="button"
        onClick={() => setCurrentTab(id)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#F7F7F7] transition-colors group"
      >
        <div className="flex items-start gap-3">
          <Icon size={15} strokeWidth={1.8} className="text-[#888888] mt-0.5 shrink-0" />
          <div className="text-left">
            <p className={`text-sm font-medium leading-none ${active ? 'text-[#111111] font-semibold' : 'text-[#333333]'}`}>
              {label}
            </p>
            <p className="text-[11px] text-[#AAAAAA] mt-0.5">{sub}</p>
          </div>
        </div>
      </button>
    );
  };

  return (
    <aside className="w-[200px] shrink-0 min-h-screen bg-white border-r border-[#E8E8E8] flex flex-col">
      {/* Brand */}
      <div className="px-4 pt-5 pb-4">
        <p className="text-base font-black text-[#111111] tracking-tight">KLYRO Admin</p>
      </div>

      {/* Nav */}
      <div className="flex-1 px-2 overflow-y-auto space-y-5 pb-4">
        {/* Main nav */}
        <div className="space-y-0.5">
          {menuItems.map((item) => <NavItem key={item.id} {...item} />)}
        </div>

        {/* Divider */}
        <div className="border-t border-[#F0F0F0]" />

        {/* Settings section */}
        <div>
          <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-widest text-[#BBBBBB]">Settings</p>
          <div className="space-y-0.5">
            {settingsItems.map((item) => (
              <SettingsItem key={item.id} {...item} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#F0F0F0]" />

        {/* Bottom actions */}
        <div className="space-y-0.5">
          <a
            href="https://klyro-frontend-tau.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-[#555555] hover:bg-[#F7F7F7] hover:text-[#111111] transition-colors"
          >
            <div className="flex items-center gap-3">
              <ExternalLink size={15} strokeWidth={1.8} className="text-[#888888]" />
              <span>Storefront</span>
            </div>
            <span className="text-[10px] text-[#BBBBBB]">↗</span>
          </a>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[#555555] hover:bg-[#FFF0F0] hover:text-red-600 transition-colors"
          >
            <LogOut size={15} strokeWidth={1.8} className="text-[#888888]" />
            <span>Logout</span>
            <span className="ml-auto text-[10px] text-[#BBBBBB]">Exit the app</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

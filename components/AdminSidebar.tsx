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
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] transition-colors ${
          active
            ? 'bg-[#EFEFEF] font-semibold text-[#111111]'
            : 'font-normal text-[#666666] hover:bg-[#F5F5F5] hover:text-[#111111]'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Icon
            size={15}
            strokeWidth={active ? 2.2 : 1.7}
            className={`shrink-0 ${active ? 'text-[#111111]' : 'text-[#999999]'}`}
          />
          <span className="truncate">{label}</span>
        </div>
        {badge && pendingCount > 0 && (
          <span className="ml-2 shrink-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#111111] px-1 text-[10px] font-black text-white">
            {pendingCount}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className="w-56 shrink-0 min-h-screen bg-white border-r border-[#E8E8E8] flex flex-col select-none">

      {/* Brand */}
      <div className="px-4 py-4 border-b border-[#F0F0F0]">
        <p className="text-[15px] font-black text-[#111111] tracking-tight">Admin</p>
      </div>

      {/* Main nav */}
      <div className="flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-0.5">
        {menuItems.map((item) => <NavItem key={item.id} {...item} />)}

        {/* Divider */}
        <div className="my-3 border-t border-[#F0F0F0]" />

        {/* Settings group */}
        <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-widest text-[#CCCCCC]">Settings</p>

        <button
          type="button"
          onClick={() => setCurrentTab('settings')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] transition-colors ${
            currentTab === 'settings'
              ? 'bg-[#EFEFEF] font-semibold text-[#111111]'
              : 'font-normal text-[#666666] hover:bg-[#F5F5F5] hover:text-[#111111]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Settings size={15} strokeWidth={currentTab === 'settings' ? 2.2 : 1.7}
              className={currentTab === 'settings' ? 'text-[#111111]' : 'text-[#999999]'} />
            <span>Settings</span>
          </div>
          <span className="text-[11px] text-[#CCCCCC] ml-2 truncate">Configure store</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentTab('help')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] transition-colors ${
            currentTab === 'help'
              ? 'bg-[#EFEFEF] font-semibold text-[#111111]'
              : 'font-normal text-[#666666] hover:bg-[#F5F5F5] hover:text-[#111111]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <HelpCircle size={15} strokeWidth={currentTab === 'help' ? 2.2 : 1.7}
              className={currentTab === 'help' ? 'text-[#111111]' : 'text-[#999999]'} />
            <span>Help</span>
          </div>
          <span className="text-[11px] text-[#CCCCCC] ml-2 truncate">Get support</span>
        </button>

        {/* Divider */}
        <div className="my-3 border-t border-[#F0F0F0]" />

        {/* Storefront */}
        <a
          href="https://klyro-frontend-tau.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-normal text-[#666666] hover:bg-[#F5F5F5] hover:text-[#111111] transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <ExternalLink size={15} strokeWidth={1.7} className="text-[#999999] shrink-0" />
            <span>Storefront</span>
          </div>
          <span className="text-[11px] text-[#CCCCCC]">↗</span>
        </a>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-normal text-[#666666] hover:bg-[#FEF2F2] hover:text-red-600 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <LogOut size={15} strokeWidth={1.7} className="text-[#999999] shrink-0" />
            <span>Logout</span>
          </div>
          <span className="text-[11px] text-[#CCCCCC]">Exit</span>
        </button>
      </div>
    </aside>
  );
}

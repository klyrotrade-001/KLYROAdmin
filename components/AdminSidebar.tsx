'use client';

import { useRouter } from 'next/navigation';
import {
  MessageSquareDiff, LayoutDashboard, ShoppingBag, Package,
  Folder, MessageSquare, Users, Settings, HelpCircle, LogOut, ExternalLink,
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

const generalItems = [
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help',     label: 'Help',     icon: HelpCircle },
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
        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
          active
            ? 'bg-[#005E23] text-white shadow-sm'
            : 'text-[#555555] hover:bg-[#F0F2EE] hover:text-[#151515]'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <Icon size={16} strokeWidth={2} />
          <span>{label}</span>
        </div>
        {badge && pendingCount > 0 && (
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
            active ? 'bg-white/25 text-white' : 'bg-[#005E23] text-white'
          }`}>
            {pendingCount}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className="w-52 shrink-0 min-h-screen bg-white border-r border-[#EBEBEB] flex flex-col">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-[#EBEBEB]">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#005E23]">
            <span className="text-xs font-black text-white">K</span>
          </div>
          <div>
            <span className="text-base font-black text-[#151515] tracking-tight leading-none">KLYRO</span>
            <p className="text-[9px] font-semibold text-[#AAAAAA] leading-none mt-0.5">Admin Panel</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {/* MENU */}
        <div>
          <p className="px-2 mb-1.5 text-[9px] font-black uppercase tracking-widest text-[#BBBBBB]">Menu</p>
          <div className="space-y-0.5">
            {menuItems.map((item) => <NavItem key={item.id} {...item} />)}
          </div>
        </div>

        {/* GENERAL */}
        <div>
          <p className="px-2 mb-1.5 text-[9px] font-black uppercase tracking-widest text-[#BBBBBB]">General</p>
          <div className="space-y-0.5">
            {generalItems.map((item) => <NavItem key={item.id} {...item} />)}

            <a
              href="https://klyro-frontend-tau.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-[#555555] hover:bg-[#F0F2EE] hover:text-[#151515] transition-all"
            >
              <ExternalLink size={16} strokeWidth={2} />
              <span>Storefront</span>
            </a>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-[#555555] hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <LogOut size={16} strokeWidth={2} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom status */}
      <div className="px-3 py-3 border-t border-[#EBEBEB]">
        <div className="flex items-center gap-2 rounded-xl bg-[#F7F8F6] px-3 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#005E23] shrink-0" />
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-wider text-[#AAAAAA]">Live Store</p>
            <p className="text-[10px] font-bold text-[#151515] truncate">klyro.in</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

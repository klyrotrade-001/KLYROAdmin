'use client';

import { Search, Bell, RefreshCw, ChevronDown, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  refreshing: boolean;
  onRefresh: () => void;
}

export default function AdminHeader({ refreshing, onRefresh }: Props) {
  const [userOpen, setUserOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUser');
    router.push('/login');
  };

  return (
    <header className="h-12 flex items-center justify-between px-5 bg-white border-b border-[#EBEBEB] gap-4 shrink-0">
      {/* Search */}
      <div className="flex-1 max-w-xs relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAAAAA]" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-lg border border-[#EBEBEB] bg-[#F7F8F6] pl-8 pr-3 py-1.5 text-xs text-[#151515] placeholder-[#AAAAAA] focus:border-[#005E23] focus:outline-none"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onRefresh}
          title="Refresh"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#777777] hover:bg-[#F0F2EE] hover:text-[#005E23] transition-colors"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin text-[#005E23]' : ''} />
        </button>

        <button
          type="button"
          className="relative flex h-8 w-8 items-center justify-center rounded-lg text-[#777777] hover:bg-[#F0F2EE] transition-colors"
        >
          <Bell size={14} />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#005E23]" />
        </button>

        {/* User */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setUserOpen(!userOpen)}
            className="flex items-center gap-2 rounded-lg border border-[#EBEBEB] bg-[#F7F8F6] px-2.5 py-1.5 hover:border-[#005E23] transition-colors"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#005E23] text-white text-[10px] font-black">
              A
            </div>
            <span className="hidden sm:block text-xs font-bold text-[#151515]">Admin</span>
            <ChevronDown size={12} className="text-[#AAAAAA]" />
          </button>

          {userOpen && (
            <div className="absolute right-0 top-10 z-50 w-40 rounded-xl border border-[#EBEBEB] bg-white shadow-lg overflow-hidden">
              <div className="px-3 py-2.5 border-b border-[#EBEBEB]">
                <p className="text-xs font-bold text-[#151515]">Admin</p>
                <p className="text-[10px] text-[#AAAAAA] mt-0.5 truncate">klyrotrade@gmail.com</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={13} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

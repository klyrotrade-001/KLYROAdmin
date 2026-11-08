'use client';

import { Search, Bell, Mail, ChevronDown, RefreshCw } from 'lucide-react';
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
    <header className="h-14 flex items-center justify-between px-6 bg-[#F7F8F6] border-b border-[#EBEBEB] gap-4">
      {/* Search */}
      <div className="flex-1 max-w-xs relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAAAAA]" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-xl border border-[#E5E5E5] bg-white pl-9 pr-4 py-2 text-sm text-[#151515] placeholder-[#AAAAAA] focus:border-[#005E23] focus:outline-none"
        />
      </div>

      {/* Right icons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRefresh}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white text-[#777777] hover:text-[#005E23] transition-colors"
        >
          <RefreshCw size={15} className={refreshing ? 'animate-spin text-[#005E23]' : ''} />
        </button>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white text-[#777777] hover:text-[#005E23] transition-colors"
        >
          <Mail size={15} />
        </button>

        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white text-[#777777] hover:text-[#005E23] transition-colors"
        >
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#005E23]" />
        </button>

        {/* User profile */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setUserOpen(!userOpen)}
            className="flex items-center gap-2.5 rounded-xl border border-[#E5E5E5] bg-white px-3 py-1.5 hover:border-[#005E23] transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#005E23] text-white text-xs font-black">
              A
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-[#151515] leading-none">Admin</p>
              <p className="text-[10px] text-[#AAAAAA] leading-none mt-0.5">klyrotrade@gmail.com</p>
            </div>
            <ChevronDown size={13} className="text-[#AAAAAA]" />
          </button>

          {userOpen && (
            <div className="absolute right-0 top-12 z-50 w-44 rounded-2xl border border-[#EBEBEB] bg-white shadow-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[#EBEBEB]">
                <p className="text-xs font-bold text-[#151515]">Admin Desk</p>
                <p className="text-[10px] text-[#AAAAAA] mt-0.5">klyrotrade@gmail.com</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

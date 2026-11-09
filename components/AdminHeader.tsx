'use client';

import { Search, Bell, User, RefreshCw } from 'lucide-react';
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
    <header className="h-11 flex items-center justify-between px-5 bg-white border-b border-[#EEEEEE] gap-4 shrink-0">
      {/* Search */}
      <div className="flex-1 max-w-xs relative">
        <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#BBBBBB]" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-md border border-[#EEEEEE] bg-[#FAFAFA] pl-8 pr-3 py-1.5 text-xs text-[#111111] placeholder-[#BBBBBB] focus:border-[#CCCCCC] focus:outline-none"
        />
      </div>

      {/* Right icons */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onRefresh}
          className="flex h-8 w-8 items-center justify-center rounded-md text-[#999999] hover:bg-[#F5F5F5] hover:text-[#333333] transition-colors"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
        </button>

        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md text-[#999999] hover:bg-[#F5F5F5] hover:text-[#333333] transition-colors"
        >
          <Bell size={14} />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setUserOpen(!userOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#999999] hover:bg-[#F5F5F5] hover:text-[#333333] transition-colors"
          >
            <User size={14} />
          </button>

          {userOpen && (
            <div className="absolute right-0 top-9 z-50 w-44 rounded-xl border border-[#EEEEEE] bg-white shadow-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-[#F5F5F5]">
                <p className="text-xs font-semibold text-[#111111]">Admin</p>
                <p className="text-[10px] text-[#AAAAAA] mt-0.5">klyrotrade@gmail.com</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full px-4 py-2.5 text-left text-xs text-red-500 hover:bg-red-50 transition-colors"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

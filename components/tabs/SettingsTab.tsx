'use client';

import { useState, useEffect } from 'react';

function BackendPing() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    fetch('http://localhost:5001/api/health')
      .then((r) => r.json())
      .then((d) => setStatus(d.status === 'online' ? 'online' : 'offline'))
      .catch(() => setStatus('offline'));
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${
        status === 'online' ? 'bg-[#005E23]' : status === 'offline' ? 'bg-red-500' : 'bg-amber-400'
      }`} />
      <span className="text-sm font-semibold text-[#151515]">
        {status === 'checking'
          ? 'Checking...'
          : status === 'online'
          ? 'Backend Online (port 5001)'
          : 'Backend Offline — run: node backend/server.js'}
      </span>
    </div>
  );
}

export default function SettingsTab() {
  const rows = [
    { label: 'Store Name',      value: 'KLYRO' },
    { label: 'Tagline',         value: 'Quality Products, Trusted Delivery' },
    { label: 'WhatsApp',        value: '+91 80890 30066' },
    { label: 'Support Email',   value: 'support@klyro.in' },
    { label: 'Free Shipping ≥', value: '₹499' },
    { label: 'Shipping Fee',    value: '₹49' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-[#151515]">Settings</h1>
        <p className="text-sm text-[#777777] mt-1">Store configuration and backend status.</p>
      </div>

      <div className="rounded-2xl bg-white border border-[#EBEBEB] p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rows.map((item) => (
            <div key={item.label} className="rounded-xl bg-[#F7F8F6] border border-[#EBEBEB] px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-wider text-[#AAAAAA]">{item.label}</p>
              <p className="text-sm font-bold text-[#151515] mt-1">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-[#EBEBEB] pt-5">
          <p className="text-[10px] font-black uppercase tracking-wider text-[#AAAAAA] mb-3">Backend Status</p>
          <BackendPing />
        </div>
      </div>
    </div>
  );
}

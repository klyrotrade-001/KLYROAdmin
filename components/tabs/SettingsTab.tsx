'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, CheckCircle2, AlertTriangle, Shield } from 'lucide-react';

function BackendPing() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    fetch('/api/health')
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
          ? 'Connected — MongoDB + Vercel'
          : 'Database Offline — check MONGODB_URI in Vercel env'}
      </span>
    </div>
  );
}

function ChangePasswordSection() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const getStoredPassword = () =>
    localStorage.getItem('adminPassword') || 'admin123';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('idle');
    setMessage('');

    const stored = getStoredPassword();

    if (currentPassword !== stored) {
      setStatus('error');
      setMessage('Current password is incorrect.');
      return;
    }

    if (newPassword.length < 6) {
      setStatus('error');
      setMessage('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus('error');
      setMessage('New passwords do not match.');
      return;
    }

    if (newPassword === stored) {
      setStatus('error');
      setMessage('New password must be different from current password.');
      return;
    }

    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));

    localStorage.setItem('adminPassword', newPassword);
    setStatus('success');
    setMessage('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setSaving(false);
  };

  return (
    <div className="rounded-2xl bg-white border border-[#EBEBEB] p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#005E23]">
          <Lock size={16} className="text-white" />
        </div>
        <div>
          <h2 className="text-sm font-black text-[#151515]">Change Password</h2>
          <p className="text-xs text-[#777777]">Update your admin login password</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
        {/* Current Password */}
        <div>
          <label className="block text-xs font-bold text-[#151515] mb-1.5 uppercase tracking-wider">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              required
              className="w-full rounded-xl border border-[#E8ECE6] bg-[#F7F8F6] px-4 py-2.5 pr-10 text-sm text-[#151515] placeholder-[#AAAAAA] focus:border-[#005E23] focus:bg-white focus:outline-none"
            />
            <button type="button" onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AAAAAA] hover:text-[#555555]">
              {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-xs font-bold text-[#151515] mb-1.5 uppercase tracking-wider">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 6 characters"
              required
              className="w-full rounded-xl border border-[#E8ECE6] bg-[#F7F8F6] px-4 py-2.5 pr-10 text-sm text-[#151515] placeholder-[#AAAAAA] focus:border-[#005E23] focus:bg-white focus:outline-none"
            />
            <button type="button" onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AAAAAA] hover:text-[#555555]">
              {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {/* Strength indicator */}
          {newPassword && (
            <div className="mt-2 flex gap-1">
              {[1, 2, 3].map((level) => (
                <div key={level} className={`h-1 flex-1 rounded-full transition-colors ${
                  newPassword.length >= level * 4
                    ? level === 1 ? 'bg-red-400' : level === 2 ? 'bg-amber-400' : 'bg-[#005E23]'
                    : 'bg-[#E8ECE6]'
                }`} />
              ))}
              <span className="text-[10px] text-[#777777] ml-1">
                {newPassword.length < 4 ? 'Weak' : newPassword.length < 8 ? 'Fair' : 'Strong'}
              </span>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-bold text-[#151515] mb-1.5 uppercase tracking-wider">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              required
              className={`w-full rounded-xl border bg-[#F7F8F6] px-4 py-2.5 pr-10 text-sm text-[#151515] placeholder-[#AAAAAA] focus:outline-none ${
                confirmPassword && confirmPassword !== newPassword
                  ? 'border-red-300 focus:border-red-400'
                  : confirmPassword && confirmPassword === newPassword
                  ? 'border-[#005E23] focus:border-[#005E23]'
                  : 'border-[#E8ECE6] focus:border-[#005E23]'
              }`}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AAAAAA] hover:text-[#555555]">
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {confirmPassword && confirmPassword !== newPassword && (
            <p className="mt-1 text-[11px] text-red-500 font-semibold">Passwords do not match</p>
          )}
          {confirmPassword && confirmPassword === newPassword && (
            <p className="mt-1 text-[11px] text-[#005E23] font-semibold flex items-center gap-1">
              <CheckCircle2 size={11} /> Passwords match
            </p>
          )}
        </div>

        {/* Status message */}
        {status !== 'idle' && (
          <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold ${
            status === 'success'
              ? 'bg-[#ecfdf5] border border-[#a7f3d0] text-[#005E23]'
              : 'bg-red-50 border border-red-100 text-red-600'
          }`}>
            {status === 'success'
              ? <CheckCircle2 size={14} />
              : <AlertTriangle size={14} />}
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-[#005E23] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#004719] disabled:opacity-60 transition-colors"
        >
          {saving ? 'Saving...' : 'Update Password'}
        </button>
      </form>

      <div className="mt-5 flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
        <Shield size={14} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">
          Password is stored securely in your browser. If you clear browser data, the default password <strong>admin123</strong> will be restored.
        </p>
      </div>
    </div>
  );
}

export default function SettingsTab() {
  const rows = [
    { label: 'Store Name',      value: 'KLYRO' },
    { label: 'Tagline',         value: 'Quality Products, Trusted Delivery' },
    { label: 'WhatsApp',        value: '+91 92926 74447' },
    { label: 'Support Email',   value: 'klyrotrade@gmail.com' },
    { label: 'Free Shipping ≥', value: '₹499' },
    { label: 'Shipping Fee',    value: '₹49' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-[#151515]">Settings</h1>
        <p className="text-sm text-[#777777] mt-1">Store configuration and admin security.</p>
      </div>

      {/* Store Config */}
      <div className="rounded-2xl bg-white border border-[#EBEBEB] p-6 space-y-5">
        <p className="text-xs font-black uppercase tracking-wider text-[#AAAAAA]">Store Configuration</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rows.map((item) => (
            <div key={item.label} className="rounded-xl bg-[#F7F8F6] border border-[#EBEBEB] px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-wider text-[#AAAAAA]">{item.label}</p>
              <p className="text-sm font-bold text-[#151515] mt-1">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-[#EBEBEB] pt-5">
          <p className="text-[10px] font-black uppercase tracking-wider text-[#AAAAAA] mb-3">Database Status</p>
          <BackendPing />
        </div>
      </div>

      {/* Password Change */}
      <ChangePasswordSection />
    </div>
  );
}

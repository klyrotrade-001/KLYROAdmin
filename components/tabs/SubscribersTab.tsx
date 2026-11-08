'use client';

import { Mail, Users } from 'lucide-react';
import { Subscriber } from '../AdminDashboard';

interface Props { subscribers: Subscriber[]; }

export default function SubscribersTab({ subscribers }: Props) {
  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#005E23]">
          <Users size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-black text-[#151515]">Subscribers</h1>
          <p className="text-xs text-[#777777] font-medium">
            {subscribers.length} email{subscribers.length !== 1 ? 's' : ''} signed up for KLYRO updates
          </p>
        </div>
      </div>

      {subscribers.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#EBEBEB] p-16 text-center shadow-sm">
          <Mail size={36} className="mx-auto mb-3 text-[#CCCCCC]" />
          <p className="text-sm font-semibold text-[#AAAAAA]">No subscribers yet.</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-[#EBEBEB] shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#EBEBEB] bg-[#F7F8F6] text-xs font-bold uppercase tracking-wider text-[#AAAAAA]">
                <th className="py-3 px-5">#</th>
                <th className="py-3 px-5">Email Address</th>
                <th className="py-3 px-5">Subscribed On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEBEB]">
              {subscribers.map((sub, i) => (
                <tr key={sub.email} className="hover:bg-[#F7F8F6] transition-colors">
                  <td className="py-3 px-5 text-[#CCCCCC] font-bold text-xs">{i + 1}</td>
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ecfdf5] text-[#005E23]">
                        <Mail size={14} />
                      </div>
                      <span className="font-semibold text-[#151515]">{sub.email}</span>
                    </div>
                  </td>
                  <td className="py-3 px-5 text-[#AAAAAA] text-xs">
                    {new Date(sub.subscribedAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

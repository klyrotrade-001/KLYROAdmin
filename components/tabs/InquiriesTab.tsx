'use client';

import { MessageSquare, Phone, Mail, Clock } from 'lucide-react';
import { Inquiry } from '../AdminDashboard';

interface Props { inquiries: Inquiry[]; }

export default function InquiriesTab({ inquiries }: Props) {
  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#005E23]">
          <MessageSquare size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-black text-[#151515]">Customer Inquiries</h1>
          <p className="text-xs text-[#777777] font-medium">
            {inquiries.length} message{inquiries.length !== 1 ? 's' : ''} from customers
          </p>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#EBEBEB] p-16 text-center shadow-sm">
          <MessageSquare size={36} className="mx-auto mb-3 text-[#CCCCCC]" />
          <p className="text-sm font-semibold text-[#AAAAAA]">No inquiries yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <div key={inq.id} className="rounded-2xl bg-white border border-[#EBEBEB] p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3 flex-1 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F7F8F6] text-[#005E23] text-sm font-bold uppercase border border-[#EBEBEB]">
                    {inq.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-[#151515]">{inq.name}</span>
                      <span className="rounded-full border border-[#EBEBEB] bg-[#F7F8F6] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#777777]">
                        {inq.type}
                      </span>
                      <span className="text-[10px] text-[#AAAAAA]">#{inq.id}</span>
                    </div>
                    <p className="text-sm text-[#555555] leading-relaxed">{inq.message}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#AAAAAA]">
                      <span className="flex items-center gap-1"><Phone size={11} />{inq.phone}</span>
                      {inq.email && <span className="flex items-center gap-1"><Mail size={11} />{inq.email}</span>}
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {new Date(inq.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
                <a
                  href={`https://wa.me/91${inq.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${inq.name}, KLYRO Support here. Regarding: "${inq.message.slice(0, 60)}..."`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 flex items-center gap-1.5 rounded-xl bg-[#ecfdf5] px-3 py-2 text-xs font-bold text-[#005E23] hover:bg-[#25D366] hover:text-white transition-colors"
                >
                  <MessageSquare size={13} />
                  Reply
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

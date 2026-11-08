'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, MessageCircle, Clock } from 'lucide-react';
import { Order, OrderStatus } from '@/src/lib/db';

interface ModalProps {
  order: Order | null;
  onClose: () => void;
  onStatusUpdate: (orderId: string, newStatus: OrderStatus, note?: string) => Promise<void>;
}

export default function OrderDetailModal({ order, onClose, onStatusUpdate }: ModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order?.status || 'placed');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  if (!order) return null;

  const formatPrice = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    await onStatusUpdate(order.id, selectedStatus, statusNote);
    setStatusNote('');
    setUpdating(false);
  };

  const whatsappCustomerUrl = `https://wa.me/91${order.customer.mobileNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Hello ${order.customer.fullName}, this is KLYRO Support regarding your Order #${order.id}. Current Status: ${order.status.toUpperCase()}.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8ECE6] px-6 py-4 bg-[#F7F8F6]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#777777]">
                Order Details
              </span>
              <span className="text-base font-black text-[#151515]">#{order.id}</span>
            </div>
            <span className="text-[11px] text-[#777777]">
              Placed on {new Date(order.createdAt).toLocaleString('en-IN')}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#777777] hover:bg-white hover:text-[#151515]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Quick WhatsApp Action Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#ecfdf5] border border-[#a7f3d0] p-4">
            <div>
              <span className="text-xs font-bold text-[#005E23] block">
                Direct WhatsApp Contact
              </span>
              <span className="text-[11px] text-[#004719]">
                Message customer directly with order status updates or courier tracking links.
              </span>
            </div>
            <a
              href={whatsappCustomerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#20ba5a]"
            >
              <MessageCircle size={15} />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Status Update Control */}
          <form onSubmit={handleUpdate} className="rounded-2xl border border-[#E8ECE6] bg-[#FAFAFA] p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#151515] mb-3">
              Update Order Status & Activity Log
            </h4>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                className="rounded-xl border border-[#E8ECE6] bg-white px-3 py-2 text-xs font-semibold text-[#151515] focus:border-[#005E23] focus:outline-none"
              >
                <option value="placed">Placed (Pending Confirmation)</option>
                <option value="confirmed">Confirmed by WhatsApp</option>
                <option value="processing">Processing & Quality Checked</option>
                <option value="shipped">Shipped / Dispatched</option>
                <option value="delivered">Delivered to Customer</option>
              </select>

              <input
                type="text"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="Log note (e.g. BlueDart AWB #12345678)"
                className="flex-1 rounded-xl border border-[#E8ECE6] bg-white px-3 py-2 text-xs text-[#151515] focus:border-[#005E23] focus:outline-none"
              />

              <button
                type="submit"
                disabled={updating}
                className="rounded-xl bg-[#005E23] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#004719] disabled:opacity-60"
              >
                {updating ? 'Updating...' : 'Save Status'}
              </button>
            </div>
          </form>

          {/* Items Breakdown */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#777777] mb-3">
              Ordered Products ({order.items.length})
            </h4>
            <div className="divide-y divide-[#E8ECE6] rounded-2xl border border-[#E8ECE6] bg-white p-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3.5 py-2.5">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#E8ECE6] bg-[#F7F8F6]">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-xs font-bold text-[#151515]">{item.name}</h5>
                    {item.variant && (
                      <span className="text-[10px] text-[#777777] block">
                        Variant: {item.variant}
                      </span>
                    )}
                    <span className="text-[11px] text-[#555555]">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </span>
                  </div>
                  <span className="text-xs font-black text-[#151515]">
                    {formatPrice(item.subtotal)}
                  </span>
                </div>
              ))}

              <div className="pt-3 mt-2 space-y-1 text-xs text-[#555555]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#151515]">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold text-[#151515]">
                    {order.shippingFee === 0 ? <span className="text-[#005E23]">FREE</span> : formatPrice(order.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#F0F2EE] font-black text-sm text-[#151515]">
                  <span>Total Amount</span>
                  <span className="text-base text-[#005E23]">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#777777] mb-3">
              Shipping Information
            </h4>
            <div className="rounded-2xl border border-[#E8ECE6] bg-white p-4 text-xs space-y-1">
              <p className="font-bold text-[#151515] text-sm">{order.customer.fullName}</p>
              <p className="text-[#555555]">
                {order.customer.houseBuilding}, {order.customer.streetLocality}
              </p>
              <p className="text-[#555555]">
                {order.customer.city}, {order.customer.state} - {order.customer.pinCode}
              </p>
              {order.customer.landmark && (
                <p className="text-[#777777]">Landmark: {order.customer.landmark}</p>
              )}
              {order.customer.orderNotes && (
                <p className="text-[#777777] italic mt-1">Notes: &ldquo;{order.customer.orderNotes}&rdquo;</p>
              )}
              <div className="pt-2 flex gap-4 text-[#151515] font-semibold">
                <span>Phone: {order.customer.mobileNumber}</span>
                {order.customer.email && <span>Email: {order.customer.email}</span>}
              </div>
            </div>
          </div>

          {/* Activity Log */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#777777] mb-3">
                Tracking History Log
              </h4>
              <div className="rounded-2xl border border-[#E8ECE6] bg-[#FAFAFA] p-4 space-y-2.5">
                {order.statusHistory.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-[#555555]">
                    <Clock size={13} className="text-[#005E23] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-semibold text-[#151515]">{h.message}</span>
                      <span className="ml-2 text-[10px] text-[#888888]">
                        ({new Date(h.timestamp).toLocaleString('en-IN')})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

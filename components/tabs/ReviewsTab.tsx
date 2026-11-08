'use client';

import { useState, useEffect } from 'react';
import { Star, Trash2, CheckCircle, XCircle, Clock, Search, MessageSquareDiff } from 'lucide-react';

interface Review {
  id: string;
  productId: string;
  productName: string;
  userName: string;
  rating: number;
  comment: string;
  variant: string;
  verified: boolean;
  helpful: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function ReviewsTab() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/reviews');
      const data = await res.json();
      if (data.success) setReviews(data.reviews);
    } catch {
      console.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`http://localhost:5001/api/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      }
    } catch {
      alert('Failed to update review');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    try {
      const res = await fetch(`http://localhost:5001/api/reviews/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setReviews(prev => prev.filter(r => r.id !== id));
      }
    } catch {
      alert('Failed to delete review');
    }
  };

  const handleVerify = async (id: string, verified: boolean) => {
    try {
      const res = await fetch(`http://localhost:5001/api/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews(prev => prev.map(r => r.id === id ? { ...r, verified } : r));
      }
    } catch {
      alert('Failed to update review');
    }
  };

  const filtered = reviews.filter(r => {
    if (filter !== 'all' && r.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return r.userName.toLowerCase().includes(q) ||
        r.productName.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q);
    }
    return true;
  });

  const counts = {
    all: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    rejected: reviews.filter(r => r.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#005E23]">
          <MessageSquareDiff size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-black text-[#151515]">Reviews</h1>
          <p className="text-xs text-[#777777] font-medium">
            Manage customer reviews • {counts.pending} pending approval
          </p>
        </div>
      </div>

      {/* Filter Tabs + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all capitalize ${
                filter === s
                  ? 'bg-[#005E23] text-white shadow-sm'
                  : 'bg-white border border-[#E8ECE6] text-[#555555] hover:border-[#005E23]'
              }`}
            >
              {s} ({counts[s]})
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search reviews..."
            className="w-full rounded-xl border border-[#E8ECE6] bg-white pl-8 pr-3 py-2 text-xs font-medium text-[#151515] placeholder-[#888888] focus:border-[#005E23] focus:outline-none"
          />
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 rounded-full border-4 border-[#005E23] border-t-transparent animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-[#E8ECE6] bg-white p-12 text-center">
          <MessageSquareDiff size={40} className="mx-auto text-[#CCCCCC] mb-3" />
          <p className="text-sm font-semibold text-[#777777]">No reviews found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((review) => (
            <div key={review.id} className="rounded-2xl border border-[#E8ECE6] bg-white p-5 hover:shadow-sm transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Review Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-sm font-black text-[#151515]">{review.userName}</span>

                    {/* Status Badge */}
                    {review.status === 'pending' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                        <Clock size={9} /> Pending
                      </span>
                    )}
                    {review.status === 'approved' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] px-2 py-0.5 text-[10px] font-bold text-[#005E23]">
                        <CheckCircle size={9} /> Approved
                      </span>
                    )}
                    {review.status === 'rejected' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-2 py-0.5 text-[10px] font-bold text-red-600">
                        <XCircle size={9} /> Rejected
                      </span>
                    )}

                    {review.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  {/* Stars */}
                  <div className="flex gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={13} className={s <= review.rating ? 'fill-[#005E23] text-[#005E23]' : 'fill-[#E8ECE6] text-[#E8ECE6]'} />
                    ))}
                  </div>

                  {/* Product & Date */}
                  <div className="flex flex-wrap gap-2 text-[10px] text-[#777777] mb-2">
                    <span className="font-semibold text-[#151515]">📦 {review.productName || review.productId}</span>
                    {review.variant && <span>• {review.variant}</span>}
                    <span>• {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>

                  <p className="text-sm text-[#444444] leading-relaxed">{review.comment}</p>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-2 shrink-0">
                  {review.status !== 'approved' && (
                    <button
                      onClick={() => handleStatusUpdate(review.id, 'approved')}
                      className="flex items-center gap-1.5 rounded-lg bg-[#ecfdf5] px-3 py-1.5 text-xs font-bold text-[#005E23] hover:bg-[#d1fae5] transition-colors"
                    >
                      <CheckCircle size={13} /> Approve
                    </button>
                  )}
                  {review.status !== 'rejected' && (
                    <button
                      onClick={() => handleStatusUpdate(review.id, 'rejected')}
                      className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors"
                    >
                      <XCircle size={13} /> Reject
                    </button>
                  )}
                  <button
                    onClick={() => handleVerify(review.id, !review.verified)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                      review.verified
                        ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                        : 'bg-[#F7F8F6] text-[#555555] hover:bg-[#E8ECE6]'
                    }`}
                  >
                    ✓ {review.verified ? 'Verified' : 'Mark Verified'}
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="flex items-center justify-center h-8 w-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

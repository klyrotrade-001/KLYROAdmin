'use client';

import { useState, useEffect } from 'react';
import ProductImage from '@/components/ProductImage';
import {
  Search, Star, CheckCircle2, XCircle, Tag,
  Plus, Trash2, X, Upload, AlertTriangle,
} from 'lucide-react';
import { Product } from '@/src/types';
import { BACKEND_URL, fileToBase64 } from '@/src/lib/api';

const EMPTY_FORM = {
  name: '',
  category: 'Kitchen Items',
  categorySlug: 'kitchen-items',
  price: '',
  originalPrice: '',
  discount: '',
  description: '',
  image: '',
  imageFile: null as File | null,
  inStock: true,
  isNewArrival: false,
  isBestSeller: false,
};

export default function ProductsManager({
  initialProducts,
  onProductsChange,
}: {
  initialProducts: Product[];
  onProductsChange?: (products: Product[]) => void;
}) {
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);

  // Sync when parent passes fresh data (after refresh)
  useEffect(() => {
    setProductList(initialProducts);
  }, [initialProducts]);

  // Fetch categories from backend
  useEffect(() => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://klyroback.onrender.com';
    fetch(`${BACKEND_URL}/api/categories`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.categories?.length) {
          setCategories(d.categories);
          // Set form default to first loaded category
          setForm((f) => ({
            ...f,
            category: d.categories[0].name,
            categorySlug: d.categories[0].slug,
          }));
        }
      })
      .catch(() => {/* backend offline */});
  }, []);

  const updateList = (next: Product[]) => {
    setProductList(next);
    onProductsChange?.(next);
  };
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Add modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const formatPrice = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  const toggleStock = async (id: string) => {
    const product = productList.find((p) => p.id === id);
    if (!product) return;
    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://klyroback.onrender.com';
      const res = await fetch(`${BACKEND_URL}/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: !product.inStock }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        updateList(productList.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p)));
      } else {
        alert(data.error || 'Failed to update stock.');
      }
    } catch {
      alert('Network error. Is the backend running?');
    }
  };

  const filtered = productList.filter((p) => {
    if (selectedCategory !== 'all' && p.categorySlug !== selectedCategory) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // ── ADD PRODUCT ──────────────────────────────────────────────
  const handleFormChange = (key: string, value: string | boolean | File | null) => {
    if (key === 'category') {
      const cat = categories.find((c) => c.name === value || c.slug === value);
      setForm((f) => ({
        ...f,
        category: cat?.name || (value as string),
        categorySlug: cat?.slug || '',
      }));
    } else if (key === 'imageFile') {
      setForm((f) => ({ ...f, imageFile: value as File | null }));
    } else {
      setForm((f) => ({ ...f, [key]: value }));
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!form.name.trim() || !form.price || !form.imageFile) {
      setFormError('Name, price, and product image are required.');
      return;
    }

    setSaving(true);
    try {
      // Convert image to Base64 and save directly to MongoDB
      const base64Image = await fileToBase64(form.imageFile);

      const res = await fetch(`${BACKEND_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          category: form.category,
          categorySlug: form.categorySlug,
          price: Number(form.price),
          originalPrice: form.originalPrice ? Number(form.originalPrice) : Number(form.price),
          discount: form.discount ? Number(form.discount) : 0,
          description: form.description.trim(),
          images: [base64Image],
          inStock: form.inStock,
          isNewArrival: form.isNewArrival,
          isBestSeller: form.isBestSeller,
          rating: 4.0,
          reviewsCount: 0,
          features: [],
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        updateList([data.product, ...productList]);
        setForm({
          ...EMPTY_FORM,
          category: categories[0]?.name || '',
          categorySlug: categories[0]?.slug || '',
        });
        setShowAddModal(false);
      } else {
        setFormError(data.error || 'Failed to add product.');
      }
    } catch (err) {
      console.error('Add product error:', err);
      setFormError('Network error. Is the backend running?');
    } finally {
      setSaving(false);
    }
  };

  // ── DELETE PRODUCT ────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://klyroback.onrender.com';
      const res = await fetch(`${BACKEND_URL}/api/products/${deleteTarget.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        updateList(productList.filter((p) => p.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        alert(`Delete failed (${res.status}): ${data.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      alert(`Network error: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#005E23] text-white shadow-sm'
                : 'bg-white border border-[#E8ECE6] text-[#555555] hover:border-[#005E23]'
            }`}
          >
            All ({productList.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.slug)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === c.slug
                  ? 'bg-[#005E23] text-white shadow-sm'
                  : 'bg-white border border-[#E8ECE6] text-[#555555] hover:border-[#005E23]'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative w-full sm:w-56">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-xl border border-[#E8ECE6] bg-white pl-8 pr-3 py-2 text-xs font-medium text-[#151515] placeholder-[#888888] focus:border-[#005E23] focus:outline-none"
            />
          </div>

          {/* Add button */}
          <button
            type="button"
            onClick={() => {
              setShowAddModal(true);
              setFormError('');
              // Reset form with current first category as default
              setForm({
                ...EMPTY_FORM,
                category: categories[0]?.name || '',
                categorySlug: categories[0]?.slug || '',
              });
            }}
            className="flex items-center gap-1.5 rounded-xl bg-[#005E23] px-4 py-2 text-xs font-bold text-white hover:bg-[#004719] transition-colors shrink-0"
          >
            <Plus size={14} />
            Add Product
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-2xl border border-[#E8ECE6] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E8ECE6] bg-[#F7F8F6] text-[#777777] uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Original</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4 text-center">Stock</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8ECE6]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-sm font-semibold text-[#777777]">
                    No products found.
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-[#F7F8F6]/60 transition-colors">
                    {/* Product */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-[#E8ECE6] bg-[#F7F8F6]">
                          <ProductImage src={product.images[0]} alt={product.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-[#151515] leading-snug line-clamp-1">{product.name}</p>
                          <span className="text-[10px] text-[#AAAAAA]">{product.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#555555]">{product.category}</td>
                    <td className="py-3 px-4 font-black text-[#151515]">{formatPrice(product.price)}</td>
                    <td className="py-3 px-4 text-[#AAAAAA] line-through">{formatPrice(product.originalPrice)}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] px-2.5 py-0.5 text-[10px] font-bold text-[#005E23]">
                        <Tag size={9} />{product.discount}% OFF
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 font-bold text-[#151515]">
                        <Star size={11} className="fill-[#005E23] text-[#005E23]" />
                        {product.rating}
                        <span className="text-[10px] text-[#AAAAAA] font-normal">({product.reviewsCount})</span>
                      </div>
                    </td>
                    {/* Stock toggle */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleStock(product.id)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold transition-all ${
                          product.inStock
                            ? 'bg-[#ecfdf5] text-[#005E23] hover:bg-[#d1fae5]'
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                      >
                        {product.inStock ? <><CheckCircle2 size={11} />In Stock</> : <><XCircle size={11} />Out</>}
                      </button>
                    </td>
                    {/* Delete */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(product)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors mx-auto"
                        title="Delete product"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── ADD PRODUCT MODAL ─────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8ECE6] bg-[#F7F8F6]">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#005E23]">
                  <Plus size={15} className="text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-[#151515]">Add New Product</h2>
                  <p className="text-[10px] text-[#777777]">Fill in the details below</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#777777] hover:bg-[#E8ECE6]"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddProduct} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-[#151515] mb-1.5">Product Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  placeholder="e.g. Portable Mini Blender"
                  required
                  className="w-full rounded-xl border border-[#E8ECE6] bg-[#F7F8F6] px-4 py-2.5 text-sm text-[#151515] placeholder-[#AAAAAA] focus:border-[#005E23] focus:bg-white focus:outline-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-[#151515] mb-1.5">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => handleFormChange('category', e.target.value)}
                  className="w-full rounded-xl border border-[#E8ECE6] bg-[#F7F8F6] px-4 py-2.5 text-sm text-[#151515] focus:border-[#005E23] focus:bg-white focus:outline-none"
                >
                  {categories.length === 0 ? (
                    <option value="" disabled>Loading categories...</option>   
                  ) : (
                    categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))
                  )}
                </select>
              </div>

              {/* Price row */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#151515] mb-1.5">Selling Price (₹) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => handleFormChange('price', e.target.value)}
                    placeholder="899"
                    required
                    min="1"
                    className="w-full rounded-xl border border-[#E8ECE6] bg-[#F7F8F6] px-3 py-2.5 text-sm text-[#151515] focus:border-[#005E23] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#151515] mb-1.5">Original Price (₹)</label>
                  <input
                    type="number"
                    value={form.originalPrice}
                    onChange={(e) => handleFormChange('originalPrice', e.target.value)}
                    placeholder="1499"
                    min="0"
                    className="w-full rounded-xl border border-[#E8ECE6] bg-[#F7F8F6] px-3 py-2.5 text-sm text-[#151515] focus:border-[#005E23] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#151515] mb-1.5">Discount (%)</label>
                  <input
                    type="number"
                    value={form.discount}
                    onChange={(e) => handleFormChange('discount', e.target.value)}
                    placeholder="40"
                    min="0"
                    max="99"
                    className="w-full rounded-xl border border-[#E8ECE6] bg-[#F7F8F6] px-3 py-2.5 text-sm text-[#151515] focus:border-[#005E23] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-bold text-[#151515] mb-1.5">Product Image *</label>
                <div className="space-y-3">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#E8ECE6] rounded-xl bg-[#F7F8F6] hover:bg-white hover:border-[#005E23] transition-all cursor-pointer">
                    <div className="flex flex-col items-center justify-center py-4">
                      <Upload size={24} className="text-[#005E23] mb-2" />
                      <p className="text-xs font-bold text-[#151515]">Click to upload image</p>
                      <p className="text-[10px] text-[#777777] mt-1">PNG, JPG, WEBP up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFormChange('imageFile', file);
                          // Create preview URL
                          const previewUrl = URL.createObjectURL(file);
                          handleFormChange('image', previewUrl);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  
                  {form.imageFile && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0]">
                      <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-[#E8ECE6] shrink-0">
                        <ProductImage src={form.image} alt="preview" fill className="object-cover" unoptimized />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#151515] truncate">{form.imageFile.name}</p>
                        <p className="text-[10px] text-[#777777]">{(form.imageFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          handleFormChange('imageFile', null);
                          handleFormChange('image', '');
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-[#151515] mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="Short product description..."
                  rows={3}
                  className="w-full rounded-xl border border-[#E8ECE6] bg-[#F7F8F6] px-4 py-2.5 text-sm text-[#151515] placeholder-[#AAAAAA] focus:border-[#005E23] focus:bg-white focus:outline-none resize-none"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4">
                {[
                  { key: 'inStock', label: 'In Stock' },
                  { key: 'isNewArrival', label: 'New Arrival' },
                  { key: 'isBestSeller', label: 'Best Seller' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <div
                      className={`relative h-5 w-9 rounded-full transition-colors ${
                        form[key as keyof typeof form] ? 'bg-[#005E23]' : 'bg-[#CCCCCC]'
                      }`}
                      onClick={() => handleFormChange(key, !form[key as keyof typeof form])}
                    >
                      <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                        form[key as keyof typeof form] ? 'translate-x-4' : 'translate-x-0.5'
                      }`} />
                    </div>
                    <span className="text-xs font-semibold text-[#555555]">{label}</span>
                  </label>
                ))}
              </div>

              {/* Error */}
              {formError && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                  <AlertTriangle size={14} className="text-red-500 shrink-0" />
                  <p className="text-xs font-semibold text-red-600">{formError}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-xl border border-[#E8ECE6] bg-white py-2.5 text-sm font-bold text-[#555555] hover:bg-[#F7F8F6] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-[#005E23] py-2.5 text-sm font-bold text-white hover:bg-[#004719] disabled:opacity-60 transition-colors"
                >
                  {saving ? 'Adding...' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ──────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white shadow-2xl p-6">
            <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-red-50 mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h2 className="text-base font-black text-[#151515] text-center">Delete Product?</h2>
            <p className="text-sm text-[#777777] text-center mt-2 leading-relaxed">
              <span className="font-bold text-[#151515]">{deleteTarget.name}</span> will be permanently removed from the catalog.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-xl border border-[#E8ECE6] py-2.5 text-sm font-bold text-[#555555] hover:bg-[#F7F8F6] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-60 transition-colors"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

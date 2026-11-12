'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Search, Plus, Trash2, X, Upload, AlertTriangle, Edit2, Save, Folder,
} from 'lucide-react';
import { BACKEND_URL, fileToBase64 } from '@/src/lib/api';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  itemCount: number;
  image: string;
}

const EMPTY_FORM = {
  name: '',
  description: '',
  image: '',
  imageFile: null as File | null,
};

export default function CategoriesManager({
  initialCategories,
  onCategoriesChange,
}: {
  initialCategories: Category[];
  onCategoriesChange?: (categories: Category[]) => void;
}) {
  const [categoryList, setCategoryList] = useState<Category[]>(initialCategories);

  // Sync when parent passes fresh data
  useEffect(() => {
    setCategoryList(initialCategories);
  }, [initialCategories]);

  const updateList = (next: Category[]) => {
    setCategoryList(next);
    onCategoriesChange?.(next);
  };

  const [searchTerm, setSearchTerm] = useState('');

  // Add modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Edit modal
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [editForm, setEditForm] = useState({ ...EMPTY_FORM });
  const [editing, setEditing] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = categoryList.filter((c) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      return (
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // ── ADD CATEGORY ─────────────────────────────────────────────
  const handleFormChange = (key: string, value: string | File | null) => {
    if (key === 'imageFile') {
      setForm((f) => ({ ...f, imageFile: value as File | null }));
    } else {
      setForm((f) => ({ ...f, [key]: value }));
    }
  };

  // Compress + convert image to Base64
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const img = document.createElement('img') as HTMLImageElement;
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        const MAX = 800;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round((height * MAX) / width); width = MAX; }
          else { width = Math.round((width * MAX) / height); height = MAX; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(objectUrl);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = reject;
      img.src = objectUrl;
    });

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!form.name.trim()) {
      setFormError('Category name is required.');
      return;
    }

    setSaving(true);
    try {
      // Convert image to Base64 if provided
      let imageUrl = '/categories/default.jpg';
      if (form.imageFile) {
        imageUrl = await fileToBase64(form.imageFile);
      }

      // Create category
      const res = await fetch(`${BACKEND_URL}/api/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          image: imageUrl,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        updateList([...categoryList, data.category]);
        setForm({ ...EMPTY_FORM });
        setShowAddModal(false);
      } else {
        setFormError(data.error || 'Failed to add category.');
      }
    } catch {
      setFormError('Network error. Is the backend running?');
    } finally {
      setSaving(false);
    }
  };

  // ── EDIT CATEGORY ────────────────────────────────────────────
  const openEditModal = (category: Category) => {
    setEditTarget(category);
    setEditForm({
      name: category.name,
      description: category.description,
      image: category.image,
      imageFile: null,
    });
    setFormError('');
  };

  const handleEditFormChange = (key: string, value: string | File | null) => {
    if (key === 'imageFile') {
      setEditForm((f) => ({ ...f, imageFile: value as File | null }));
    } else {
      setEditForm((f) => ({ ...f, [key]: value }));
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    setFormError('');

    if (!editForm.name.trim()) {
      setFormError('Category name is required.');
      return;
    }

    setEditing(true);
    try {
      // Convert new image to Base64 if provided
      let imageUrl = editForm.image;
      if (editForm.imageFile) {
        imageUrl = await fileToBase64(editForm.imageFile);
      }

      // Update category
      const res = await fetch(`${BACKEND_URL}/api/categories/${editTarget.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name.trim(),
          description: editForm.description.trim(),
          image: imageUrl,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        updateList(
          categoryList.map((c) => (c.id === editTarget.id ? data.category : c))
        );
        setEditTarget(null);
      } else {
        setFormError(data.error || 'Failed to update category.');
      }
    } catch {
      setFormError('Network error. Is the backend running?');
    } finally {
      setEditing(false);
    }
  };

  // ── DELETE CATEGORY ──────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/categories/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        updateList(categoryList.filter((c) => c.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        alert(data.error || 'Failed to delete category.');
      }
    } catch {
      alert('Network error. Is the backend running?');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search categories..."
              className="w-full rounded-xl border border-[#E8ECE6] bg-white pl-8 pr-3 py-2 text-xs font-medium text-[#151515] placeholder-[#888888] focus:border-[#005E23] focus:outline-none"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowAddModal(true);
            setFormError('');
          }}
          className="flex items-center gap-1.5 rounded-xl bg-[#005E23] px-4 py-2 text-xs font-bold text-white hover:bg-[#004719] transition-colors shrink-0"
        >
          <Plus size={14} />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Folder size={48} className="mx-auto text-[#CCCCCC] mb-3" />
            <p className="text-sm font-semibold text-[#777777]">No categories found.</p>
          </div>
        ) : (
          filtered.map((category) => (
            <div
              key={category.id}
              className="relative overflow-hidden rounded-2xl border border-[#E8ECE6] bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Category Image */}
              <div className="relative h-32 w-full bg-[#F7F8F6]">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-sm text-[#151515] truncate">
                      {category.name}
                    </h3>
                    <p className="text-[10px] text-[#AAAAAA] font-mono">{category.slug}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#F7F8F6] px-2.5 py-1 text-[10px] font-bold text-[#555555] ml-2">
                    {category.itemCount} items
                  </span>
                </div>

                <p className="text-xs text-[#777777] leading-relaxed line-clamp-2 mb-3">
                  {category.description || 'No description'}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(category)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#F7F8F6] px-3 py-2 text-xs font-bold text-[#555555] hover:bg-[#E8ECE6] transition-colors"
                  >
                    <Edit2 size={12} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(category)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                    title="Delete category"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── ADD CATEGORY MODAL ───────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8ECE6] bg-[#F7F8F6]">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#005E23]">
                  <Plus size={15} className="text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-[#151515]">Add New Category</h2>
                  <p className="text-[10px] text-[#777777]">Create a product category</p>
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

            <form onSubmit={handleAddCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#151515] mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  placeholder="e.g. Home Appliances"
                  required
                  className="w-full rounded-xl border border-[#E8ECE6] bg-[#F7F8F6] px-4 py-2.5 text-sm text-[#151515] placeholder-[#AAAAAA] focus:border-[#005E23] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#151515] mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="Brief category description..."
                  rows={3}
                  className="w-full rounded-xl border border-[#E8ECE6] bg-[#F7F8F6] px-4 py-2.5 text-sm text-[#151515] placeholder-[#AAAAAA] focus:border-[#005E23] focus:bg-white focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#151515] mb-1.5">
                  Category Image
                </label>
                <div className="space-y-3">
                  <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-[#E8ECE6] rounded-xl bg-[#F7F8F6] hover:bg-white hover:border-[#005E23] transition-all cursor-pointer">
                    <div className="flex flex-col items-center justify-center py-3">
                      <Upload size={20} className="text-[#005E23] mb-1.5" />
                      <p className="text-xs font-bold text-[#151515]">
                        Click to upload image
                      </p>
                      <p className="text-[10px] text-[#777777] mt-0.5">
                        PNG, JPG, WEBP up to 5MB
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFormChange('imageFile', file);
                          const previewUrl = URL.createObjectURL(file);
                          handleFormChange('image', previewUrl);
                        }
                      }}
                      className="hidden"
                    />
                  </label>

                  {form.imageFile && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0]">
                      <div className="relative h-14 w-14 rounded-lg overflow-hidden border border-[#E8ECE6] shrink-0">
                        <Image
                          src={form.image}
                          alt="preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#151515] truncate">
                          {form.imageFile.name}
                        </p>
                        <p className="text-[10px] text-[#777777]">
                          {(form.imageFile.size / 1024).toFixed(1)} KB
                        </p>
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

              {formError && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                  <AlertTriangle size={14} className="text-red-500 shrink-0" />
                  <p className="text-xs font-semibold text-red-600">{formError}</p>
                </div>
              )}

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
                  {saving ? 'Adding...' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT CATEGORY MODAL ──────────────────────────────── */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8ECE6] bg-[#F7F8F6]">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#005E23]">
                  <Edit2 size={15} className="text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-[#151515]">Edit Category</h2>
                  <p className="text-[10px] text-[#777777]">Update category details</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditTarget(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#777777] hover:bg-[#E8ECE6]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdateCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#151515] mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => handleEditFormChange('name', e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#E8ECE6] bg-[#F7F8F6] px-4 py-2.5 text-sm text-[#151515] focus:border-[#005E23] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#151515] mb-1.5">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => handleEditFormChange('description', e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-[#E8ECE6] bg-[#F7F8F6] px-4 py-2.5 text-sm text-[#151515] focus:border-[#005E23] focus:bg-white focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#151515] mb-1.5">
                  Category Image
                </label>
                <div className="space-y-3">
                  {/* Current image preview */}
                  {editForm.image && !editForm.imageFile && (
                    <div className="relative h-24 w-full rounded-xl overflow-hidden border border-[#E8ECE6]">
                      <Image
                        src={editForm.image}
                        alt="current"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}

                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-[#E8ECE6] rounded-xl bg-[#F7F8F6] hover:bg-white hover:border-[#005E23] transition-all cursor-pointer">
                    <div className="flex flex-col items-center justify-center py-2">
                      <Upload size={18} className="text-[#005E23] mb-1" />
                      <p className="text-xs font-bold text-[#151515]">
                        Change image
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleEditFormChange('imageFile', file);
                          const previewUrl = URL.createObjectURL(file);
                          handleEditFormChange('image', previewUrl);
                        }
                      }}
                      className="hidden"
                    />
                  </label>

                  {editForm.imageFile && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0]">
                      <div className="relative h-14 w-14 rounded-lg overflow-hidden border border-[#E8ECE6] shrink-0">
                        <Image
                          src={editForm.image}
                          alt="new preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#151515] truncate">
                          {editForm.imageFile.name}
                        </p>
                        <p className="text-[10px] text-[#777777]">
                          {(editForm.imageFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {formError && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                  <AlertTriangle size={14} className="text-red-500 shrink-0" />
                  <p className="text-xs font-semibold text-red-600">{formError}</p>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  className="flex-1 rounded-xl border border-[#E8ECE6] bg-white py-2.5 text-sm font-bold text-[#555555] hover:bg-[#F7F8F6] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editing}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#005E23] py-2.5 text-sm font-bold text-white hover:bg-[#004719] disabled:opacity-60 transition-colors"
                >
                  <Save size={14} />
                  {editing ? 'Updating...' : 'Update Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ──────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white shadow-2xl p-6">
            <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-red-50 mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h2 className="text-base font-black text-[#151515] text-center">
              Delete Category?
            </h2>
            <p className="text-sm text-[#777777] text-center mt-2 leading-relaxed">
              <span className="font-bold text-[#151515]">{deleteTarget.name}</span>{' '}
              will be permanently removed.
              {deleteTarget.itemCount > 0 && (
                <span className="block mt-2 text-red-600 font-semibold">
                  Warning: This category has {deleteTarget.itemCount} products!
                </span>
              )}
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

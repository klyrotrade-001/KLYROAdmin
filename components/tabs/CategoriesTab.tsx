'use client';

import { Folder } from 'lucide-react';
import CategoriesManager from '../CategoriesManager';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  itemCount: number;
  image: string;
}

export default function CategoriesTab({
  categories,
  onCategoriesChange,
}: {
  categories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#005E23]">
            <Folder size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#151515]">Categories</h1>
            <p className="text-xs text-[#777777] font-medium">
              Manage product categories • {categories.length} total
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <CategoriesManager
        initialCategories={categories}
        onCategoriesChange={onCategoriesChange}
      />
    </div>
  );
}

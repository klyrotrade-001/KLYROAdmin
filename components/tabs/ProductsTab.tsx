'use client';

import { Product } from '@/src/types';
import ProductsManager from '../ProductsManager';

interface Props {
  products: Product[];
  onProductsChange: (products: Product[]) => void;
}

export default function ProductsTab({ products, onProductsChange }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-[#151515]">Products</h1>
        <p className="text-sm text-[#777777] mt-1">
          {products.length} items in catalog — add, manage stock and pricing.
        </p>
      </div>
      <div className="rounded-2xl bg-white border border-[#EBEBEB] shadow-sm p-4">
        <ProductsManager
          initialProducts={products}
          onProductsChange={onProductsChange}
        />
      </div>
    </div>
  );
}

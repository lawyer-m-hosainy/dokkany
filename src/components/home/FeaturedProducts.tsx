'use client';

import React, { useState } from 'react';
import { Sparkles, TrendingUp, Tag } from 'lucide-react';
import { ProductCard, ProductCardData } from '../product/ProductCard';
import { ProductCardSkeleton } from '../common/Skeleton';
import { NumeralSystem } from '@/lib/formatters';

interface FeaturedProductsProps {
  products: ProductCardData[];
  isLoading?: boolean;
  onAddToCart?: (product: ProductCardData) => void;
  onSelectProduct?: (product: ProductCardData) => void;
  numeralSystem?: NumeralSystem;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  isLoading = false,
  onAddToCart,
  onSelectProduct,
  numeralSystem = 'western',
}) => {
  const [activeTab, setActiveTab] = useState<'bestsellers' | 'deals' | 'all'>('bestsellers');

  // Filter products based on real data (not hardcoded IDs or fabricated badges)
  const displayedProducts = products.filter((p) => {
    if (activeTab === 'deals') {
      return Boolean(p.compareAtPrice && p.compareAtPrice > p.price);
    }
    if (activeTab === 'bestsellers') {
      return Boolean(p.badgeText || (p.compareAtPrice && p.compareAtPrice > p.price));
    }
    return true;
  });

  return (
    <section id="featured-products" className="py-12 sm:py-16 bg-slate-50/70 border-b border-slate-200" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 text-start">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 mb-1">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>مختارات دكاني الحصرية</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              الأكثر طلباً وتخفيضات اليوم
            </h2>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('bestsellers')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'bestsellers'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>الأكثر طلباً</span>
            </button>

            <button
              onClick={() => setActiveTab('deals')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'deals'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-rose-600" />
              <span>أقوى التخفيضات</span>
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>جميع المنتجات ({products.length})</span>
            </button>
          </div>
        </div>

        {/* Loading State with Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : displayedProducts.length > 0 ? (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onSelectProduct={onSelectProduct}
                numeralSystem={numeralSystem}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 my-4">
            <h3 className="text-base font-bold text-slate-800">لا توجد منتجات متطابقة حالياً</h3>
            <p className="text-xs text-slate-500 mt-1">يرجى اختيار تبويب آخر لعرض المنتجات المتاحة.</p>
            <button
              onClick={() => setActiveTab('all')}
              className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              عرض كافة المنتجات
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

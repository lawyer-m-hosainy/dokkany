'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Search,
  Check,
  ChevronDown,
  Layers,
  Sparkles,
  ArrowUpDown,
  ShoppingBag,
  X,
} from 'lucide-react';
import { Product, FilterState } from '../../types/store';
import { ProductCard, ProductCardData } from '../product/ProductCard';
import { arabicSearchMatch } from '../../lib/arabicNormalize';
import { useDebounce } from '../../hooks/useDebounce';
import { NumeralSystem, formatPrice } from '../../lib/formatters';

interface CatalogSectionProps {
  products: Product[];
  onAddToCart: (productData: ProductCardData) => void;
  onOpenDetails: (productData: ProductCardData) => void;
  initialCategory?: string;
  initialSearchQuery?: string;
  numeralSystem?: NumeralSystem;
}

const PRICE_PRESETS = [
  { label: 'الكل', min: 0, max: 1000 },
  { label: 'أقل من 50 ج.م', min: 0, max: 50 },
  { label: '50 إلى 100 ج.م', min: 50, max: 100 },
  { label: '100 إلى 200 ج.م', min: 100, max: 200 },
  { label: 'أكثر من 200 ج.م', min: 200, max: 1000 },
];

const CATEGORY_TABS = [
  { id: 'all', label: 'جميع المنتجات' },
  { id: 'stationery', label: 'أدوات مكتبية ومدرسية' },
  { id: 'computer', label: 'إكسسوارات كمبيوتر ولابتوب' },
  { id: 'mobile', label: 'إكسسوارات موبايل' },
];

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  products,
  onAddToCart,
  onOpenDetails,
  initialCategory = 'all',
  initialSearchQuery = '',
  numeralSystem = 'western',
}) => {
  // Mobile filter drawer state
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Pagination / Load More state
  const [visibleCount, setVisibleCount] = useState(8);

  // Filters state
  const [category, setCategory] = useState<'all' | 'stationery' | 'computer' | 'mobile'>(
    (initialCategory as any) || 'all'
  );
  const [searchInput, setSearchInput] = useState(initialSearchQuery);
  const debouncedSearch = useDebounce(searchInput, 250);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<FilterState['sortBy']>('featured');

  // Sync with prop changes if external nav triggers category change
  useEffect(() => {
    if (initialCategory) {
      setCategory((initialCategory as any) || 'all');
    }
  }, [initialCategory]);

  useEffect(() => {
    if (initialSearchQuery !== undefined) {
      setSearchInput(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  // Extract available brands
  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    products.forEach((p) => {
      if (p.brand) brandsSet.add(p.brand);
    });
    return Array.from(brandsSet);
  }, [products]);

  // Reset filters helper
  const handleResetFilters = () => {
    setCategory('all');
    setSearchInput('');
    setMinPrice(0);
    setMaxPrice(1000);
    setSelectedBrand('');
    setInStockOnly(false);
    setSortBy('featured');
    setVisibleCount(8);
  };

  // Check if any non-default filter is active
  const hasActiveFilters =
    category !== 'all' ||
    Boolean(searchInput.trim()) ||
    minPrice > 0 ||
    maxPrice < 1000 ||
    Boolean(selectedBrand) ||
    inStockOnly;

  // Filter products using Arabic text normalization
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Category
      if (category !== 'all' && p.categoryId !== category) {
        return false;
      }

      // 2. Arabic Smart Search
      if (debouncedSearch.trim()) {
        const textToSearch = `${p.nameAr} ${p.name} ${p.brand} ${p.description || ''} ${p.tags?.join(' ') || ''}`;
        if (!arabicSearchMatch(textToSearch, debouncedSearch)) {
          return false;
        }
      }

      // 3. Price Range
      if (p.price < minPrice || p.price > maxPrice) {
        return false;
      }

      // 4. Brand
      if (selectedBrand && p.brand !== selectedBrand) {
        return false;
      }

      // 5. In Stock Only
      if (inStockOnly && (!p.inStock || p.stockCount <= 0)) {
        return false;
      }

      return true;
    });
  }, [products, category, debouncedSearch, minPrice, maxPrice, selectedBrand, inStockOnly]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'bestsellers':
        return list.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
      case 'newest':
        return list.sort((a, b) => b.id.localeCompare(a.id));
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'featured':
      default:
        return list;
    }
  }, [filteredProducts, sortBy]);

  // Visible page items
  const displayedProducts = sortedProducts.slice(0, visibleCount);
  const hasMore = visibleCount < sortedProducts.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  // Convert Product to ProductCardData format
  const toCardData = (p: Product): ProductCardData => ({
    id: p.id,
    slug: p.slug || p.id,
    nameAr: p.nameAr,
    brandName: p.brand,
    categoryNameAr: p.categoryNameAr,
    price: p.price,
    compareAtPrice: p.originalPrice,
    stock: p.stockCount,
    badgeText: p.badge,
    images: p.images || [p.image],
  });

  return (
    <section id="catalog-section" className="py-12 bg-slate-50/70 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-3">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>كتالوج متجر دكاني الشامل</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              تصفح جميع الأدوات المكتبية والإكسسوارات
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              جميع الأسعار بالجنيه المصري (ج.م) مع خدمة الدفع عند الاستلام والمعاينة قبل الدفع
            </p>
          </div>

          {/* Quick Counter */}
          <div className="text-sm font-semibold text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm shrink-0">
            تم العثور على{' '}
            <span className="text-emerald-700 font-bold text-base">{sortedProducts.length}</span>{' '}
            منتج
          </div>
        </div>

        {/* Categories Tab Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
          {CATEGORY_TABS.map((tab) => {
            const isActive = category === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setCategory(tab.id as any);
                  setVisibleCount(8);
                }}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Toolbar Bar: Search + Sort + Mobile Filter Button */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-8 flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Smart Search with Arabic Normalization */}
          <div className="relative w-full lg:w-96">
            <Search className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="ابحث باسم المنتج، البراند، أو الموديل (مثل: كابل، ماوس باد، سماعة)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 ps-10 pe-10 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="مسح البحث"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Controls: Sort & Mobile Filter Toggle */}
          <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto">
            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-bold transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              <span>الفلاتر والتصفية</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              )}
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap hidden sm:inline">
                الترتيب حسب:
              </span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-slate-50 border border-slate-200 rounded-xl py-2 ps-8 pe-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                >
                  <option value="featured">المميز والأحدث 🔥</option>
                  <option value="bestsellers">الأكثر مبيعاً 🏆</option>
                  <option value="price-asc">السعر: من الأقل للأعلى ⬆️</option>
                  <option value="price-desc">السعر: من الأعلى للأقل ⬇️</option>
                  <option value="rating">الأعلى تقييماً ⭐</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Reset Filters button */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                title="إلغاء جميع الفلاتر"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة ضبط</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Grid: Desktop Sidebar + Products List */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="font-extrabold text-slate-900 flex items-center gap-2 text-base">
                  <Filter className="w-4 h-4 text-emerald-600" />
                  <span>تصفية المنتجات</span>
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>تفريغ الفلاتر</span>
                  </button>
                )}
              </div>

              {/* Price Preset Chips */}
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-2.5">
                  نطاق السعر (ج.م)
                </label>
                <div className="space-y-1.5">
                  {PRICE_PRESETS.map((preset, idx) => {
                    const isSelected = minPrice === preset.min && maxPrice === preset.max;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setMinPrice(preset.min);
                          setMaxPrice(preset.max);
                        }}
                        className={`w-full text-start px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                            : 'hover:bg-slate-50 text-slate-600 border border-transparent'
                        }`}
                      >
                        <span>{preset.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brands Filter */}
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-2.5">
                  العلامة التجارية
                </label>
                <div className="space-y-1 max-h-48 overflow-y-auto pe-1">
                  <button
                    onClick={() => setSelectedBrand('')}
                    className={`w-full text-start px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                      !selectedBrand
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : 'hover:bg-slate-50 text-slate-600 border border-transparent'
                    }`}
                  >
                    <span>كافة العلامات التجارية</span>
                    {!selectedBrand && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                  {availableBrands.map((brand) => {
                    const isSelected = selectedBrand === brand;
                    return (
                      <button
                        key={brand}
                        onClick={() => setSelectedBrand(brand)}
                        className={`w-full text-start px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                            : 'hover:bg-slate-50 text-slate-600 border border-transparent'
                        }`}
                      >
                        <span>{brand}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* In Stock Toggle */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center justify-between cursor-pointer py-1">
                  <span className="text-xs font-bold text-slate-700">
                    المنتجات المتوفرة بالمخزن فقط
                  </span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded-sm border-slate-300 focus:ring-emerald-500 cursor-pointer"
                  />
                </label>
              </div>

            </div>

            {/* Cash on Delivery Trust Box */}
            <div className="bg-emerald-950 text-white p-4 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-emerald-300 text-xs font-extrabold">
                <Sparkles className="w-4 h-4" />
                <span>تسوق بدون قلق</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                جميع المنتجات متاحة للمعاينة والتأكد منها عند وصول المندوب قبل دفع ثمن الطلب، مع ضمان استبدال مجاني 14 يوم.
              </p>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {displayedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-800 mb-2">
                  لم نتمكن من العثور على أي منتج يطابق بحثك!
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                  جرّب إزالة بعض الفلاتر المحددة أو تغيير كلمات البحث للعثور على ما تبحث عنه.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-sm hover:bg-emerald-800 transition-colors shadow-md shadow-emerald-700/20"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة ضبط الفلاتر</span>
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {displayedProducts.map((p) => {
                    const cardData = toCardData(p);
                    return (
                      <div key={p.id} onClick={() => onOpenDetails(cardData)} className="cursor-pointer">
                        <ProductCard
                          product={cardData}
                          onAddToCart={onAddToCart}
                          numeralSystem={numeralSystem}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="text-center mt-10">
                    <button
                      onClick={handleLoadMore}
                      className="px-8 py-3.5 rounded-2xl bg-white border-2 border-slate-300 hover:border-emerald-600 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 font-extrabold text-sm transition-all shadow-sm"
                    >
                      تحميل المزيد من المنتجات ({sortedProducts.length - visibleCount} متبقية)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 end-0 max-w-full flex">
            <div className="w-screen max-w-sm bg-white shadow-2xl flex flex-col justify-between">
              
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 flex items-center gap-2 text-base">
                  <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
                  <span>تصفية المنتجات</span>
                </h3>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
                  aria-label="إغلاق التصفية"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-4 overflow-y-auto space-y-6 flex-1">
                {/* Categories */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-2">
                    الفئة
                  </label>
                  <div className="space-y-1">
                    {CATEGORY_TABS.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setCategory(tab.id as any)}
                        className={`w-full text-start px-3 py-2 rounded-xl text-xs font-bold ${
                          category === tab.id
                            ? 'bg-emerald-100 text-emerald-900 font-black'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-2">
                    السعر
                  </label>
                  <div className="space-y-1">
                    {PRICE_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setMinPrice(preset.min);
                          setMaxPrice(preset.max);
                        }}
                        className={`w-full text-start px-3 py-2 rounded-xl text-xs font-bold ${
                          minPrice === preset.min && maxPrice === preset.max
                            ? 'bg-emerald-100 text-emerald-900 font-black'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-2">
                    العلامة التجارية
                  </label>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedBrand('')}
                      className={`w-full text-start px-3 py-2 rounded-xl text-xs font-bold ${
                        !selectedBrand
                          ? 'bg-emerald-100 text-emerald-900 font-black'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      كافة العلامات التجارية
                    </button>
                    {availableBrands.map((b) => (
                      <button
                        key={b}
                        onClick={() => setSelectedBrand(b)}
                        className={`w-full text-start px-3 py-2 rounded-xl text-xs font-bold ${
                          selectedBrand === b
                            ? 'bg-emerald-100 text-emerald-900 font-black'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-3">
                <button
                  onClick={handleResetFilters}
                  className="flex-1 py-3 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  إعادة ضبط
                </button>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="flex-2 py-3 bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  تطبيق ({sortedProducts.length} منتج)
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Search, Menu, X, PhoneCall, Sparkles } from 'lucide-react';
import { Logo } from '../common/Logo';
import { useCartStore } from '@/stores/cart';
import { siteConfig } from '@/config/site';
import { formatPrice } from '@/lib/formatters';

interface HeaderProps {
  cartCount?: number;
  cartTotalFormatted?: string;
  onOpenCart?: () => void;
  onSearchChange?: (query: string) => void;
  activeCategory?: string;
  onSelectCategory?: (categorySlug: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount: propCartCount,
  cartTotalFormatted: propCartTotalFormatted,
  onOpenCart: propOnOpenCart,
  onSearchChange,
  activeCategory = 'all',
  onSelectCategory,
}) => {
  const router = useRouter();
  const cartStore = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = propCartCount !== undefined ? propCartCount : (mounted ? cartStore.getItemsCount() : 0);
  const cartSubtotal = mounted ? cartStore.getSubtotal() : 0;
  const cartTotalFormatted = propCartTotalFormatted !== undefined ? propCartTotalFormatted : (cartSubtotal > 0 ? formatPrice(cartSubtotal) : '');
  const handleOpenCart = propOnOpenCart || cartStore.openCart;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchChange) {
      onSearchChange(query);
    } else {
      router.push(`/catalog?q=${encodeURIComponent(query)}`);
    }
    setSearchOpen(false);
  };

  const handleCategoryClick = (slug: string) => {
    if (onSelectCategory) {
      onSelectCategory(slug);
    } else {
      router.push(slug === 'all' ? '/catalog' : `/catalog?category=${slug}`);
    }
    setMobileDrawerOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 transition-shadow">
      {/* Top Banner (Micro Announcement Bar - Logical Properties) */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-start">
          <div className="flex items-center gap-3 font-medium">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>شحن مجاني</span>
            </span>
            <span>للطلبات فوق {siteConfig.freeShippingThreshold} {siteConfig.currency} في كافة أنحاء مصر</span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-300">الدفع عند الاستلام (COD) فقط</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-slate-400 text-xs">
            <a
              href={`https://wa.me/${siteConfig.whatsappPhone}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
              <span>واتساب المبيعات: {siteConfig.whatsappDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Bar (3 Zones: Brand - Nav - Actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 lg:gap-8">
          {/* Zone 1: Mobile Hamburger + Logo Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="فتح القائمة الرئيسية"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link href="/" className="inline-block" aria-label="الصفحة الرئيسية لمتجر دكاني">
              <Logo />
            </Link>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-bold text-slate-700">
            <button
              onClick={() => handleCategoryClick('all')}
              className={`pb-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === 'all'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent hover:text-emerald-600'
              }`}
            >
              جميع المنتجات
            </button>
            <button
              onClick={() => handleCategoryClick('stationery')}
              className={`pb-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === 'stationery'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent hover:text-emerald-600'
              }`}
            >
              أدوات مكتبية ومدرسية
            </button>
            <button
              onClick={() => handleCategoryClick('computer')}
              className={`pb-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === 'computer'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent hover:text-emerald-600'
              }`}
            >
              إكسسوارات كمبيوتر ولابتوب
            </button>
            <button
              onClick={() => handleCategoryClick('mobile')}
              className={`pb-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === 'mobile'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent hover:text-emerald-600'
              }`}
            >
              إكسسوارات موبايل
            </button>
          </nav>

          {/* Zone 3: Search Bar + Cart Action */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Desktop Search Input */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex relative items-center w-64 xl:w-72"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (onSearchChange) onSearchChange(e.target.value);
                }}
                placeholder="ابحث عن قلم، دفتر، كيبورد..."
                className="w-full ps-9 pe-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              />
              <Search className="w-4 h-4 text-slate-400 absolute start-3 pointer-events-none" />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    if (onSearchChange) onSearchChange('');
                  }}
                  className="absolute end-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2.5 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="البحث"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Shopping Cart Button with Dynamic Badge */}
            <button
              onClick={handleOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 active:scale-95 transition-all shadow-sm font-medium text-xs sm:text-sm whitespace-nowrap shrink-0"
              aria-label={`سلة المشتريات بها ${cartCount} عناصر`}
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -end-2 bg-emerald-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center tabular-nums ring-2 ring-slate-900">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-bold">السلة</span>
              {cartTotalFormatted && (
                <span className="hidden sm:inline tabular-nums text-emerald-300 font-bold border-s border-slate-700 ps-2 ms-1">
                  {cartTotalFormatted}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Dropdown Bar */}
        {searchOpen && (
          <div className="md:hidden pb-3 pt-1 border-t border-slate-100">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (onSearchChange) onSearchChange(e.target.value);
                }}
                placeholder="ابحث عن منتج بالاسم أو القسم..."
                className="w-full ps-9 pe-8 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                autoFocus
              />
              <Search className="w-4 h-4 text-slate-400 absolute start-3 top-3 pointer-events-none" />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    if (onSearchChange) onSearchChange('');
                  }}
                  className="absolute end-3 top-3 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Navigation (Side Drawer) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-start">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between text-start p-6 animate-in slide-in-from-start duration-200">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <Logo />
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                  aria-label="إغلاق القائمة"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="py-6 space-y-1">
                <p className="text-[11px] font-bold text-slate-400 px-3 pb-2 uppercase tracking-wider">
                  أقسام المتجر الرئيسية
                </p>
                <button
                  onClick={() => handleCategoryClick('all')}
                  className="w-full text-start px-3 py-3 text-sm font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors"
                >
                  جميع المنتجات
                </button>
                <button
                  onClick={() => handleCategoryClick('stationery')}
                  className="w-full text-start px-3 py-3 text-sm font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors"
                >
                  أدوات مكتبية ومدرسية
                </button>
                <button
                  onClick={() => handleCategoryClick('computer')}
                  className="w-full text-start px-3 py-3 text-sm font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors"
                >
                  إكسسوارات كمبيوتر ولابتوب
                </button>
                <button
                  onClick={() => handleCategoryClick('mobile')}
                  className="w-full text-start px-3 py-3 text-sm font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors"
                >
                  إكسسوارات موبايل
                </button>
              </div>
            </div>

            {/* Drawer Bottom Support Link */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <a
                href={`https://wa.me/${siteConfig.whatsappPhone}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                <span>تواصل مع مبيعات واتساب</span>
              </a>
              <p className="text-[11px] text-slate-400 text-center">
                dokkany.shop · الدفع عند الاستلام
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

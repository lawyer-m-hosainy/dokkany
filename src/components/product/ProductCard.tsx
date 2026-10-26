'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, MessageCircle, Check } from 'lucide-react';
import { formatPrice, NumeralSystem } from '@/lib/formatters';
import { siteConfig } from '@/config/site';

export interface ProductCardData {
  id: string;
  slug: string;
  nameAr: string;
  brandName?: string;
  categoryNameAr?: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  badgeText?: string | null;
  images: string[];
}

interface ProductCardProps {
  product: ProductCardData;
  onAddToCart?: (product: ProductCardData) => void;
  onSelectProduct?: (product: ProductCardData) => void;
  numeralSystem?: NumeralSystem;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onSelectProduct,
  numeralSystem = 'western',
}) => {
  const router = useRouter();
  const [addedAnimation, setAddedAnimation] = useState(false);

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

  const handleCardClick = () => {
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      router.push(`/product/${product.slug || product.id}`);
    }
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `مرحباً دكاني 👋
أرغب في الاستفسار والطلب المباشر للمنتج:
📦 *${product.nameAr}*
💰 السعر: ${formatPrice(product.price, numeralSystem)}
🔗 رابط المنتج: ${siteConfig.url}/product/${product.slug || product.id}

هل المنتج متوفر لتأكيد عنوان الشحن والدفع عند الاستلام؟`;

    window.open(
      `https://wa.me/${siteConfig.whatsappPhone}?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:shadow-xl hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col h-full text-start"
      dir="rtl"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
        <Image
          src={product.images[0] || '/images/hero_dokkany_workspace.jpg'}
          alt={product.nameAr}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Badges on End Corner */}
        <div className="absolute top-3 end-3 flex flex-col gap-1.5 items-end z-10">
          {product.badgeText && (
            <span className="bg-slate-900/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm">
              {product.badgeText}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md tabular-nums">
              -{discountPercent}%
            </span>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Metadata Line */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
            {product.brandName && (
              <>
                <span className="font-bold text-slate-700">{product.brandName}</span>
                <span aria-hidden="true">·</span>
              </>
            )}
            <span>{product.categoryNameAr || 'منتج أصلي'}</span>
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 group-hover:text-emerald-700 transition-colors leading-snug">
            {product.nameAr}
          </h3>

          {/* Stock Indicator */}
          <div className="mt-2 text-xs text-slate-500">
            {product.stock > 0 ? (
              <span className="text-emerald-700 font-medium">متوفر في المخزن</span>
            ) : (
              <span className="text-rose-600 font-medium">نفد من المخزن</span>
            )}
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex flex-col gap-3">
          {/* Price Before & After */}
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-1 text-slate-900 font-black text-lg sm:text-xl tabular-nums">
              {formatPrice(product.price, numeralSystem)}
            </div>

            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-slate-400 line-through tabular-nums">
                {formatPrice(product.compareAtPrice, numeralSystem)}
              </span>
            )}
          </div>

          {/* Dual Action Controls: Add to Cart + WhatsApp */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAdd}
              disabled={product.stock <= 0}
              className={`w-full py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm whitespace-nowrap shrink-0 ${
                product.stock <= 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : addedAnimation
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
              title="أضف إلى سلة المشتريات"
            >
              {addedAnimation ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>تمت الإضافة!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                  <span>أضف للسلة</span>
                </>
              )}
            </button>

            <button
              onClick={handleWhatsApp}
              className="w-full py-2.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all whitespace-nowrap shrink-0"
              title="اطلب المنتج فوراً عبر محادثة واتساب"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>طلب واتساب</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

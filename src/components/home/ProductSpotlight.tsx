'use client';

import React from 'react';
import Image from 'next/image';
import { ShoppingBag, MessageCircle, Sparkles, CheckCircle2, ShieldCheck, Truck, Headphones } from 'lucide-react';
import { ProductCardData } from '../product/ProductCard';
import { formatPrice } from '@/lib/formatters';
import { siteConfig } from '@/config/site';

interface ProductSpotlightProps {
  product: ProductCardData;
  onAddToCart?: (product: ProductCardData) => void;
  onSelectProduct?: (product: ProductCardData) => void;
}

export const ProductSpotlight: React.FC<ProductSpotlightProps> = ({
  product,
  onAddToCart,
  onSelectProduct,
}) => {
  const discountAmount = product.compareAtPrice && product.compareAtPrice > product.price
    ? product.compareAtPrice - product.price
    : 0;

  const handleWhatsApp = () => {
    const text = `مرحباً دكاني 👋
أرغب في الاستفسار والطلب المباشر لسماعة:
🎧 *${product.nameAr}*
💰 السعر: ${formatPrice(product.price)}
🔗 ${siteConfig.url}/product/${product.slug || product.id}

هل المنتج متوفر لتأكيد عنوان الشحن والتوصيل (الدفع عند الاستلام)؟`;

    window.open(
      `https://wa.me/${siteConfig.whatsappPhone}?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <section className="py-10 sm:py-14 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white border-y border-slate-800 relative overflow-hidden" dir="rtl">
      {/* Background Glow */}
      <div className="absolute top-0 end-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 start-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Image Showcase Stage */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center">
            <div
              onClick={() => onSelectProduct?.(product)}
              className="relative w-full max-w-md bg-slate-800/80 rounded-3xl p-4 border border-slate-700/80 shadow-2xl hover:border-emerald-500/50 transition-all cursor-pointer group"
            >
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-900">
                <Image
                  src={product.images[0] || '/images/hero_dokkany_workspace.jpg'}
                  alt={product.nameAr}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />

                {/* Floating Discount Tag */}
                {discountAmount > 0 && (
                  <div className="absolute top-4 start-4 bg-rose-600 text-white text-xs tabular-nums font-black px-3 py-1.5 rounded-xl shadow-lg z-10">
                    وفر {formatPrice(discountAmount)}
                  </div>
                )}

                {/* Brand Badge */}
                <div className="absolute bottom-4 end-4 bg-slate-900/90 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md z-10">
                  <Headphones className="w-4 h-4" />
                  <span>{product.brandName || 'Samsung AKG'}</span>
                </div>
              </div>

              <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">
                <span>اضغط لمعاينة المواصفات والصور بدقة عالية</span>
              </p>
            </div>
          </div>

          {/* Details & Direct Purchase */}
          <div className="lg:col-span-7 order-1 lg:order-2 text-start space-y-5">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3.5 py-1.5 rounded-xl text-xs font-bold">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>صفقة الأسبوع المميزة في دكاني 🔥</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
              {product.nameAr}
            </h2>

            {/* Feature Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-200 pt-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>صوت نقي بتوقيع صوتي احترافي Tuned by AKG</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>هيكل معدني ألومنيوم فائق المتانة</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>عزل ضوضاء ANC لمكالمات واستماع نقي</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>سدادات سيليكونية مريحة للاستخدام الطويل</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-slate-800/90 border border-slate-700 rounded-2xl flex items-baseline justify-between max-w-md">
              <div>
                <span className="text-3xl font-black text-white tabular-nums">
                  {formatPrice(product.price)}
                </span>
              </div>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <div className="text-end">
                  <span className="text-xs text-slate-400 line-through tabular-nums block">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-400">
                    الدفع عند الاستلام (COD)
                  </span>
                </div>
              )}
            </div>

            {/* Purchase CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onAddToCart?.(product)}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>أضف إلى السلة الآن</span>
              </button>

              <button
                onClick={handleWhatsApp}
                className="px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 active:scale-95 transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>اطلب عبر واتساب مباشرة</span>
              </button>
            </div>

            {/* Trust guarantees */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>شحن وتوصيل فوري لجميع المحافظات</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>معاينة وتجربة قبل دفع أي جنيه</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

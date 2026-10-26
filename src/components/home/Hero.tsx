'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { siteConfig } from '@/config/site';

interface HeroProps {
  onExploreClick?: () => void;
  onWhatsAppClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onWhatsAppClick }) => {
  const handleWhatsApp = () => {
    if (onWhatsAppClick) {
      onWhatsAppClick();
    } else {
      window.open(
        `https://wa.me/${siteConfig.whatsappPhone}?text=${encodeURIComponent(
          'مرحباً دكاني 👋\nأرغب في الاستفسار والطلب المباشر'
        )}`,
        '_blank',
        'noopener,noreferrer'
      );
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/60 to-slate-100/70 border-b border-slate-200" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left / Start Content Column */}
          <div className="lg:col-span-7 space-y-6 text-start">
            {/* Quiet Kick-off Metadata */}
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100/90 px-3 py-1.5 rounded-lg">
              <span>موسم التجهيز المكتبي والدراسي 2026</span>
              <span className="text-emerald-400">·</span>
              <span>أجهزة وإلكترونيات أصلية</span>
            </div>

            {/* Headline with text-wrap: balance */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.25] tracking-tight [text-wrap:balance]">
              كل ما تحتاجه لمكتبك، دراستك، وأجهزتك في{' '}
              <span className="text-emerald-700 underline decoration-emerald-300 decoration-wavy decoration-2 underline-offset-8">
                مكان واحد
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              متجر <strong className="text-slate-900 font-bold">{siteConfig.name} ({siteConfig.nameEn})</strong> يوفر لك تشكيلة منتقاة بعناية من الأدوات المكتبية والمدرسية الراقية، أحدث إكسسوارات الكمبيوتر واللابتوب، ومستلزمات الهواتف الذكية مع ميزة <span className="text-emerald-700 font-bold">الدفع عند الاستلام (COD)</span> وتوصيل سريع لكافة المحافظات المصرية.
            </p>

            {/* Call To Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
              {onExploreClick ? (
                <button
                  onClick={onExploreClick}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 active:scale-95 transition-all shadow-md shadow-emerald-700/20 text-xs sm:text-sm whitespace-nowrap shrink-0"
                >
                  <span>تصفح العروض والمنتجات</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  href="/catalog"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 active:scale-95 transition-all shadow-md shadow-emerald-700/20 text-xs sm:text-sm whitespace-nowrap shrink-0"
                >
                  <span>تصفح العروض والمنتجات</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              )}

              <button
                onClick={handleWhatsApp}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white text-slate-800 font-bold rounded-xl hover:bg-slate-50 border border-slate-300 active:scale-95 transition-all text-xs sm:text-sm whitespace-nowrap shrink-0 group shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span>اطلب سريعاً عبر واتساب</span>
              </button>
            </div>

            {/* Value Highlights Adjacent to CTA */}
            <div className="pt-6 border-t border-slate-200/90 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">الدفع عند الاستلام</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">توصيل سريع لـ 27 محافظة</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">معاينة قبل الدفع واستبدال 14 يوم</span>
              </div>
            </div>
          </div>

          {/* Right / End Showcase Column */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900 group h-72 sm:h-88 lg:h-[420px]">
              <Image
                src="/images/hero_dokkany_workspace.jpg"
                alt="دكاني - بيئة عمل عصرية وإكسسوارات كمبيوتر ومكتب فاخرة"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white text-start">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-400 tracking-wider block">
                      DOKKANY EXCLUSIVES
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                      أناقة على مكتبك وإنتاجية بلا حدود
                    </h2>
                  </div>
                  <div className="bg-emerald-600/90 text-white px-3 py-1.5 rounded-xl text-xs tabular-nums font-bold shadow-sm shrink-0">
                    خصومات حتى 35%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

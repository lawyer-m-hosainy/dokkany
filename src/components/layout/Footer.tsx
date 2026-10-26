import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { Logo } from '../common/Logo';
import { siteConfig } from '@/config/site';

interface FooterProps {
  onSelectCategory?: (slug: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-start" dir="rtl">
      {/* Upper Features Strip */}
      <div className="border-b border-slate-800 py-6 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">توصيل سريع للجمهورية</p>
              <p className="text-[11px] text-slate-400">تغطية لكافة المحافظات الـ 27</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">الدفع عند الاستلام</p>
              <p className="text-[11px] text-slate-400">فحص ومعاينة قبل سداد المبلغ</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">ضمان استبدال حقيقي</p>
              <p className="text-[11px] text-slate-400">استرجاع سهل خلال 14 يوماً</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Logo variant="dark" />

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              المتجر الإلكتروني الأول المتخصص في تقديم الأدوات المدرسية والمكتبية الراقية، وأحدث إكسسوارات الكمبيوتر، ومستلزمات الهواتف الذكية مع خدمة الدفع عند الاستلام والتوصيل السريع لجميع أنحاء مصر.
            </p>

            <div className="space-y-2.5 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-white transition-colors">
                  {siteConfig.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${siteConfig.whatsappPhone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  واتساب المبيعات: {siteConfig.whatsappDisplay}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>الشحن متوفر لجميع أنحاء مصر (Cairo, Alex, Delta, Upper Egypt)</span>
              </div>
            </div>
          </div>

          {/* Categories Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white">أقسام المتجر</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/catalog?category=stationery" className="hover:text-emerald-400 transition-colors">
                  أدوات مكتبية ومدرسية
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=computer" className="hover:text-emerald-400 transition-colors">
                  إكسسوارات كمبيوتر ولابتوب
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=mobile" className="hover:text-emerald-400 transition-colors">
                  إكسسوارات موبايل وأجهزة ذكية
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="hover:text-emerald-400 transition-colors">
                  جميع المنتجات والعروض
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service & Policies (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-white">خدمة العملاء والسياسات</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/policies/returns" className="hover:text-emerald-400 transition-colors">
                  سياسة الاستبدال والاسترجاع (14 يوماً)
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="hover:text-emerald-400 transition-colors">
                  شروط الشحن ومواعيد التوصيل للمحافظات
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="hover:text-emerald-400 transition-colors">
                  سياسة الخصوصية وحماية بيانات المتسوقين
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="hover:text-emerald-400 transition-colors">
                  الشروط والأحكام
                </Link>
              </li>
              <li className="pt-2 text-[11px] text-slate-500">
                طريقة الدفع: الدفع عند الاستلام نقداً (COD)
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Dynamic Copyright & Domain */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            جميع الحقوق محفوظة © {currentYear} متجر {siteConfig.name} - {siteConfig.nameEn} ({siteConfig.domain}).
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>دفع آمن عند الاستلام</span>
            <span>·</span>
            <span>شحن لـ 27 محافظة</span>
            <span>·</span>
            <span>ضمان الجودة 100%</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

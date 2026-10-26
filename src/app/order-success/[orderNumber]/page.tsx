import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, MessageCircle, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { siteConfig } from '@/config/site';

interface OrderSuccessProps {
  params: {
    orderNumber: string;
  };
}

export const metadata: Metadata = {
  title: 'تم تأكيد طلبك بنجاح',
  description: 'شكراً لطلبك من متجر دكاني. تم تسجيل طلبك بنجاح وسيتواصل معك فريقنا لتأكيد الشحن.',
};

export default function OrderSuccessPage({ params }: OrderSuccessProps) {
  const { orderNumber } = params;

  const whatsappMessage = `مرحباً دكاني 👋\nأرغب في تأكيد طلبي المسجل برقم: #${orderNumber}\nشكراً لكم!`;
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappPhone}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-20" dir="rtl">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6">
          {/* Animated Success Icon */}
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              تم تسجيل الطلب بنجاح في النظام
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
              شكراً لثقتك في متجر {siteConfig.name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
              تم استلام طلبك وجاري مراجعته الآن وتجهيز الشحنة للتسليم لمندوب التوصيل.
            </p>
          </div>

          {/* Order Number Box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-md mx-auto">
            <span className="text-xs text-slate-500 block mb-1">رقم الطلب الخاص بك (احتفظ به للمتابعة):</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-800 tabular-nums tracking-wider font-mono">
              #{orderNumber}
            </span>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-start text-xs text-slate-600 max-w-md mx-auto pt-2">
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>الدفع نقداً عند استلام الشحنة</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>معاينة المنتجات مع المندوب قبل الدفع</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 border-t border-slate-100">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>أكّد طلبك عبر واتساب الآن</span>
            </a>

            <Link
              href="/catalog"
              className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>متابعة التسوق</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

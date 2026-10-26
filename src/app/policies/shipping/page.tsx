import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Truck } from 'lucide-react';
import { siteConfig, EGYPTIAN_GOVERNORATES } from '@/config/site';
import { formatPrice } from '@/lib/formatters';

export const metadata: Metadata = {
  title: 'شروط الشحن ومواعيد التوصيل',
  description: 'تفاصيل شحن الطلبات لكافة محافظات مصر الـ 27 ورسوم التوصيل ومواعيد الاستلام.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-16" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">شروط الشحن ومواعيد التوصيل</h1>
              <p className="text-xs text-slate-500">تغطية شاملة لـ 27 محافظة مصرية</p>
            </div>
          </div>

          <div className="space-y-6 text-sm text-slate-700 leading-relaxed text-start">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">1. مواعيد التوصيل المتوقعة</h2>
              <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-600">
                <li><strong>القاهرة الكبرى والجيزة:</strong> من 24 إلى 48 ساعة عمل.</li>
                <li><strong>الإسكندرية ومحافظات الدلتا والقناة:</strong> من يومين إلى 3 أيام عمل.</li>
                <li><strong>محافظات الصعيد ومحافظات الحدود:</strong> من 3 إلى 5 أيام عمل.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">2. الشحن المجاني</h2>
              <p className="text-xs sm:text-sm text-slate-600">
                يقدم متجر دكاني شحناً مجانياً لكافة الطلبات التي يتجاوز مجموعها <strong>{formatPrice(siteConfig.freeShippingThreshold)}</strong> لأي محافظة داخل جمهورية مصر العربية.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900">3. جدول أسعار الشحن حسب المحافظة</h2>
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-xs text-start">
                  <thead className="bg-slate-100 text-slate-800 font-bold">
                    <tr>
                      <th className="py-2.5 px-4">المحافظة</th>
                      <th className="py-2.5 px-4">تكلفة الشحن (ج.م)</th>
                      <th className="py-2.5 px-4">طريقة السداد</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {EGYPTIAN_GOVERNORATES.map((gov) => (
                      <tr key={gov.id} className="hover:bg-slate-50">
                        <td className="py-2 px-4 font-bold text-slate-900">{gov.nameAr}</td>
                        <td className="py-2 px-4 tabular-nums font-bold text-emerald-700">
                          {formatPrice(gov.shippingFee)}
                        </td>
                        <td className="py-2 px-4 text-slate-500">الدفع عند الاستلام</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-2 p-4 bg-amber-50 rounded-2xl border border-amber-200">
              <h3 className="text-xs font-bold text-amber-900">ملاحظة لمالك المتجر - TODO(owner):</h3>
              <p className="text-xs text-amber-800">
                قم بمراجعة أسعار الشحن وتحديثها حسب تعاقد شركة الشحن المعتمدة لديك (مثل بوسطة / أوتو / ارامكس).
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
            <Link
              href="/"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة لمتجر دكاني</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, RefreshCw, ShieldCheck } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'سياسة الاستبدال والاسترجاع',
  description: 'سياسة الاستبدال والاسترجاع في متجر دكاني خلال 14 يوماً وفق قانون حماية المستهلك المصري.',
};

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-16" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">سياسة الاستبدال والاسترجاع</h1>
              <p className="text-xs text-slate-500">متجر {siteConfig.name} - حقوق المستهلك مضمونة 100%</p>
            </div>
          </div>

          <div className="space-y-6 text-sm text-slate-700 leading-relaxed text-start">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">1. مدة الاسترجاع والاستبدال</h2>
              <p>
                يحق لعملاء متجر <strong>{siteConfig.name}</strong> استبدال أو استرجاع المنتجات خلال <strong>14 يوماً</strong> من تاريخ الاستلام، وفقاً للمادة 17 من قانون حماية المستهلك المصري رقم 181 لسنة 2018.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">2. شروط قبول الاسترجاع</h2>
              <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-600">
                <li>أن يكون المنتج في حالته الأصلية وبغلافه الأصلي دون أي تلف أو نزع للملصقات.</li>
                <li>تضمين كافة الإكسسوارات، الكابلات، والكتيبات المرفقة مع المنتج.</li>
                <li>وجود فاتورة الشراء أو بوليصة الشحن مع رقم الطلب المسجل (DK-XXXX).</li>
                <li>معاينة العميل للمنتج قبل الاستلام حق أصيل مع مندوب الشحن للتأكد من سلامة الشحنة.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">3. المنتجات المستثناة من الاسترجاع</h2>
              <p className="text-xs sm:text-sm text-slate-600">
                لا يجوز استرجاع أو استبدال المنتجات ذات الاستخدام الشخصي المباشر (مثل سدادات الأذن السيليكونية بعد فتحها) لأسباب صحية ووقائية، إلا في حالة وجود عيب صناعة مثبت.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">4. مصاريف الشحن عند الاسترجاع</h2>
              <p className="text-xs sm:text-sm text-slate-600">
                - في حالة وجود عيب مصنعي أو خطأ في إرسال المنتج: يتحمل المتجر كافة مصاريف الشحن كاملة.
                <br />
                - في حالة رغبة العميل في الاستبدال بدون عيب بالمنتج: يتحمل العميل مصاريف الشحن ذهاباً وإياباً.
              </p>
            </section>

            <section className="space-y-2 p-4 bg-amber-50 rounded-2xl border border-amber-200">
              <h3 className="text-xs font-bold text-amber-900">ملاحظة لمالك المتجر - TODO(owner):</h3>
              <p className="text-xs text-amber-800">
                يرجى مراجعة وتأكيد السياسة القانونية وخطوات استرداد الأموال النقدية أو التحويل عبر المحافظ الإلكترونية (فودافون كاش / إنستاباي) وفق الإجراء الفعلي المتبع في متجرك.
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

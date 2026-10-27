import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'الشروط والأحكام',
  description: 'شروط وأحكام استخدام متجر دكاني والشراء عبر الدفع عند الاستلام.',
};

export default function TermsPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-16" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">الشروط والأحكام</h1>
              <p className="text-xs text-slate-500">متجر {siteConfig.name} ({siteConfig.domain})</p>
            </div>
          </div>

          <div className="space-y-6 text-sm text-slate-700 leading-relaxed text-start">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">1. قبول الشروط</h2>
              <p className="text-xs sm:text-sm text-slate-600">
                باستخدامك لموقع <strong>{siteConfig.domain}</strong> أو قيامك بطلب أي من المنتجات، فإنك تقر بموافقتك الكاملة على هذه الشروط والأحكام والقوانين المعمول بها في جمهورية مصر العربية.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">2. الأسعار وتوافر المنتجات</h2>
              <p className="text-xs sm:text-sm text-slate-600">
                جميع الأسعار المعروضة بالجنيه المصري (ج.م). يحتفظ المتجر بالحق في تعديل الأسعار والعروض الترويجية في أي وقت وفق حالة المخزون وسعر التكلفة دون إشعار مسبق، مع تثبيت السعر المسجل في بوليصة الطلب للعميل عند إتمام الطلب بنجاح.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">3. جدية الطلب والدفع عند الاستلام</h2>
              <p className="text-xs sm:text-sm text-slate-600">
                طريقة الدفع الأساسية هي <strong>الدفع عند الاستلام (COD)</strong>. يلتزم العميل بتقديم رقم هاتف صحيح وعنوان دقيق لاستلام الشحنة وسداد قيمتها عند وصول المندوب. يحتفظ المتجر بحق إلغاء أي طلب تظهر فيه علامات عدم الجدية أو تكرار الطلبات الوهمية.
              </p>
            </section>

            {/* TODO(owner): راجع الصيغة القانونية للشروط والأحكام لتناسب الهيكل التجاري الخاص بمؤسستك */}
            <section className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h3 className="text-xs font-bold text-slate-800">تحديث الشروط والأحكام:</h3>
              <p className="text-xs text-slate-600">
                يحتفظ متجر دكاني بحق تعديل أو تحديث هذه الشروط بما يتماشى مع اللوائح والأنظمة التجارية المعمول بها في جمهورية مصر العربية، وتسري أي تعديلات من تاريخ نشرها على الموقع.
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

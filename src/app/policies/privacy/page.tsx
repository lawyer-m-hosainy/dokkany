import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Lock } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية وحماية البيانات',
  description: 'كيفية جمع واستخدام وحماية البيانات الشخصية لعملاء متجر دكاني.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-16" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">سياسة الخصوصية وحماية البيانات</h1>
              <p className="text-xs text-slate-500">متجر {siteConfig.name} - أمانك وخصوصيتك أولويتنا</p>
            </div>
          </div>

          <div className="space-y-6 text-sm text-slate-700 leading-relaxed text-start">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">1. البيانات التي نجمعها</h2>
              <p className="text-xs sm:text-sm text-slate-600">
                عند إتمام طلبك في المتجر، نجمع فقط البيانات الأساسية اللازمة لتوصيل الشحنة بنجاح:
                الاسم بالكامل، رقم الهاتف (للتواصل وتأكيد الشحن)، المحافظة والعنوان التفصيلي، وأي ملاحظات خاصة بالتوصيل.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">2. كيفية استخدام بياناتك</h2>
              <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-600">
                <li>معالجة الطلب وإرسال بيانات الشحن لمندوب شركة الشحن التابع لمنطقتك.</li>
                <li>إرسال رسائل تحديث الشحن عبر واتساب أو الاتصال الهاتفي قبل وصول المندوب.</li>
                <li>منع الطلبات الوهمية وحماية المتجر من الاحتيال.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">3. عدم مشاركة البيانات مع أطراف ثالثة</h2>
              <p className="text-xs sm:text-sm text-slate-600">
                يلتزم متجر <strong>{siteConfig.name}</strong> بعدم بيع، تأجير، أو مشاركة بيانات عملائنا مع أي جهة إعلانية أو طرف ثالث غير معني بعملية الشحن والتوصيل.
              </p>
            </section>

            <section className="space-y-2 p-4 bg-amber-50 rounded-2xl border border-amber-200">
              <h3 className="text-xs font-bold text-amber-900">ملاحظة لمالك المتجر - TODO(owner):</h3>
              <p className="text-xs text-amber-800">
                أدخل التفاصيل الرسمية للسجل التجاري أو البطاقة الضريبية ومسؤول حماية البيانات إن وجدت.
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

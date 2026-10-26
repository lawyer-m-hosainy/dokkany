import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[65vh] flex items-center justify-center py-16 px-4 bg-slate-50" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">الصفحة غير موجودة (404)</h1>
        <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
          عذراً، لم نتمكن من العثور على الصفحة أو المنتج الذي تبحث عنه. ربما تم تغيير الرابط أو نقل المنتج.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
          >
            <span>العودة للرئيسية</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/catalog"
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors"
          >
            تصفح الكتالوج
          </Link>
        </div>
      </div>
    </div>
  );
}

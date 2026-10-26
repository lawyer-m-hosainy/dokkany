'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="min-h-[65vh] flex items-center justify-center py-16 px-4 bg-slate-50" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-black text-slate-900 mb-2">حدث خطأ غير متوقع</h1>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          نعتذر عن هذا الخطأ الفني. فريق دكاني يعمل على مدار الساعة لضمان استقرار الخدمة.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>إعادة المحاولة</span>
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors"
          >
            الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ProductForm } from '@/components/admin/ProductForm';

export const metadata = {
  title: 'إضافة منتج جديد | لوحة إدارة دكاني',
};

export default function NewProductPage() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16" dir="rtl">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">إضافة منتج جديد إلى المتجر</h1>
          <p className="text-xs text-slate-500 mt-1">
            أدخل تفاصيل وصور المنتج وسيتم حفظه ونشره مباشرة في قاعدة بيانات المتجر ليظهر للعملاء
          </p>
        </div>

        <ProductForm isEdit={false} />
      </div>
    </div>
  );
}

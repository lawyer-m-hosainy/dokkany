'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  PlusCircle,
  Search,
  Layers,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { formatPrice } from '@/lib/formatters';

interface AdminProduct {
  id: string;
  slug: string;
  nameAr: string;
  nameEn?: string | null;
  descriptionAr: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  images: string[];
  badgeText?: string | null;
  isActive: boolean;
  isFeatured: boolean;
  soldCount: number;
  category: { id: string; nameAr: string; slug: string };
  brand?: { id: string; nameAr: string; nameEn?: string | null } | null;
  createdAt: string;
}

interface CategoryOption {
  id: string;
  nameAr: string;
  slug: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'lowStock'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let url = '/api/admin/products?';
      if (searchQuery.trim()) url += `q=${encodeURIComponent(searchQuery.trim())}&`;
      if (selectedCategory !== 'all') url += `categoryId=${selectedCategory}&`;

      const [prodRes, catRes] = await Promise.all([
        fetch(url),
        fetch('/api/admin/categories-brands'),
      ]);

      const prodData = await prodRes.json();
      const catData = await catRes.json();

      if (prodData.success) {
        setProducts(prodData.products || []);
      }
      if (catData.success) {
        setCategories(catData.categories || []);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleToggleStatus = async (product: AdminProduct) => {
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...product,
          isActive: !product.isActive,
          categoryId: product.category.id,
          brandId: product.brand?.id || null,
        }),
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, isActive: !p.isActive } : p))
        );
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleDeleteProduct = async (id: string, nameAr: string) => {
    if (!confirm(`هل أنت متأكد من حذف المنتج: "${nameAr}"؟`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'تم حذف المنتج بنجاح');
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(data.message || 'تعذر حذف المنتج');
      }
    } catch {
      alert('حدث خطأ أثناء محاولة الحذف');
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered in-memory list
  const filteredProducts = products.filter((p) => {
    if (statusFilter === 'active') return p.isActive;
    if (statusFilter === 'inactive') return !p.isActive;
    if (statusFilter === 'lowStock') return p.stock <= 5;
    return true;
  });

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const totalUnits = products.reduce((acc, p) => acc + p.stock, 0);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16" dir="rtl">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Header & New Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">إدارة كتالوج المنتجات</h1>
            <p className="text-xs text-slate-500 mt-1">
              عرض، إضافة، تعديل وحذف منتجات المتجر مباشرة في قاعدة البيانات
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-emerald-700/20"
          >
            <PlusCircle className="w-5 h-5" />
            <span>إضافة منتج جديد +</span>
          </Link>
        </div>

        {/* KPI Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-start">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-bold mb-1">إجمالي المنتجات</p>
              <p className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">{totalProducts}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-bold mb-1">منتجات معروضة للبيع</p>
              <p className="text-xl sm:text-2xl font-black text-emerald-600 tabular-nums">{activeProducts}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-bold mb-1">منتجات نفدت (0 قطع)</p>
              <p className="text-xl sm:text-2xl font-black text-rose-600 tabular-nums">{outOfStockCount}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-bold mb-1">إجمالي قطع المخزون</p>
              <p className="text-xl sm:text-2xl font-black text-indigo-600 tabular-nums">{totalUnits}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم المنتج أو الموديل..."
              className="w-full text-xs pe-8 ps-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute end-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="all">كل الأقسام</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameAr}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="all">كل الحالات</option>
              <option value="active">المعروضة فقط</option>
              <option value="inactive">المعطلة / المخفية</option>
              <option value="lowStock">مخزون منخفض (أقل من 5)</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-slate-500 font-bold">جاري تحميل المنتجات من قاعدة البيانات...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Layers className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-700">لم يتم العثور على أي منتجات</p>
              <p className="text-xs text-slate-400">جرب تغيير كلمات البحث أو أضف أول منتج جديد الآن</p>
              <Link
                href="/admin/products/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
              >
                <PlusCircle className="w-4 h-4" />
                <span>إضافة منتج الآن</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="py-3.5 px-4 text-start">المنتج</th>
                    <th className="py-3.5 px-4 text-start">القسم والماركة</th>
                    <th className="py-3.5 px-4 text-start">السعر الحالي</th>
                    <th className="py-3.5 px-4 text-start">المخزون</th>
                    <th className="py-3.5 px-4 text-start">المبيعات</th>
                    <th className="py-3.5 px-4 text-start">الحالة</th>
                    <th className="py-3.5 px-4 text-end">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => {
                    const isOutOfStock = p.stock === 0;
                    const isLowStock = p.stock > 0 && p.stock <= 5;

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Image & Title */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                              <Image
                                src={p.images[0] || '/images/hero_dokkany_workspace.jpg'}
                                alt={p.nameAr}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                            <div className="min-w-0 max-w-xs">
                              <h3 className="font-bold text-slate-900 truncate" title={p.nameAr}>
                                {p.nameAr}
                              </h3>
                              {p.badgeText && (
                                <span className="inline-block mt-0.5 text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded-md">
                                  {p.badgeText}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category & Brand */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-bold">
                              {p.category.nameAr}
                            </span>
                            {p.brand && (
                              <p className="text-[11px] text-slate-400">
                                {p.brand.nameAr}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-4">
                          <div>
                            <span className="font-black text-slate-900 tabular-nums">
                              {formatPrice(p.price)}
                            </span>
                            {p.compareAtPrice && p.compareAtPrice > p.price && (
                              <span className="block text-[11px] text-slate-400 line-through tabular-nums">
                                {formatPrice(p.compareAtPrice)}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Stock */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold tabular-nums ${
                              isOutOfStock
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : isLowStock
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {isOutOfStock ? 'نفد (0)' : `${p.stock} قطعة`}
                          </span>
                        </td>

                        {/* Sales */}
                        <td className="py-3.5 px-4 font-bold text-slate-600 tabular-nums">
                          {p.soldCount} تم بيعها
                        </td>

                        {/* Status Toggle */}
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleStatus(p)}
                            title="اضغط للتفعيل أو الإخفاء من المتجر"
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border ${
                              p.isActive
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            {p.isActive ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>معروض</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5 text-slate-400" />
                                <span>مخفي</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-end">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/product/${p.slug}`}
                              target="_blank"
                              title="معاينة المنتج في المتجر"
                              className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/admin/products/${p.id}/edit`}
                              title="تعديل المنتج"
                              className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.nameAr)}
                              disabled={deletingId === p.id}
                              title="حذف المنتج"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

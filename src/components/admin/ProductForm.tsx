'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Save,
  ArrowRight,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface CategoryOption {
  id: string;
  nameAr: string;
  slug: string;
}

interface BrandOption {
  id: string;
  nameAr: string;
  nameEn?: string | null;
}

export interface ProductFormData {
  id?: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  descriptionAr: string;
  price: number | '';
  compareAtPrice: number | '' | null;
  costPrice: number | '' | null;
  stock: number | '';
  categoryId: string;
  brandId: string;
  images: string[];
  badgeText: string;
  features: string[];
  isActive: boolean;
  isFeatured: boolean;
}

interface ProductFormProps {
  initialData?: ProductFormData;
  isEdit?: boolean;
}

export function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
  const router = useRouter();

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [nameAr, setNameAr] = useState(initialData?.nameAr || '');
  const [nameEn, setNameEn] = useState(initialData?.nameEn || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [descriptionAr, setDescriptionAr] = useState(initialData?.descriptionAr || '');
  const [price, setPrice] = useState<number | ''>(initialData?.price ?? '');
  const [compareAtPrice, setCompareAtPrice] = useState<number | '' | null>(initialData?.compareAtPrice ?? '');
  const [costPrice, setCostPrice] = useState<number | '' | null>(initialData?.costPrice ?? '');
  const [stock, setStock] = useState<number | ''>(initialData?.stock ?? 10);
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
  const [brandId, setBrandId] = useState(initialData?.brandId || '');
  const [images, setImages] = useState<string[]>(
    initialData?.images && initialData.images.length > 0
      ? initialData.images
      : ['/images/hero_dokkany_workspace.jpg']
  );
  const [newImageUrl, setNewImageUrl] = useState('');
  const [badgeText, setBadgeText] = useState(initialData?.badgeText || '');
  const [featuresText, setFeaturesText] = useState(
    initialData?.features ? initialData.features.join('\n') : ''
  );
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch categories and brands from DB
  useEffect(() => {
    async function loadOptions() {
      try {
        const res = await fetch('/api/admin/categories-brands');
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories || []);
          setBrands(data.brands || []);
          if (!categoryId && data.categories?.length > 0 && !isEdit) {
            setCategoryId(data.categories[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load categories/brands:', err);
      } finally {
        setLoadingOptions(false);
      }
    }
    loadOptions();
  }, [categoryId, isEdit]);

  // Auto-generate slug when Arabic name changes if creating new
  const handleNameArChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNameAr(val);
    if (!isEdit && !slug) {
      const autoSlug = val
        .trim()
        .toLowerCase()
        .replace(/[^\w\s\u0621-\u064A-]/g, '')
        .replace(/[\s_]+/g, '-');
      setSlug(autoSlug);
    }
  };

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newImageUrl.trim()) {
      setImages((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!nameAr.trim()) {
      setErrorMsg('يرجى إدخال اسم المنتج بالعربية');
      return;
    }

    if (!descriptionAr.trim()) {
      setErrorMsg('يرجى إدخال وصف تفصيلي للمنتج');
      return;
    }

    if (!price || Number(price) <= 0) {
      setErrorMsg('يرجى إدخال سعر صحيح أكبر من صفر');
      return;
    }

    if (!categoryId) {
      setErrorMsg('يرجى اختيار القسم المناسب للمنتج');
      return;
    }

    if (images.length === 0) {
      setErrorMsg('يرجى إضافة صورة واحدة على الأقل للمنتج');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      nameAr: nameAr.trim(),
      nameEn: nameEn.trim() || undefined,
      slug: slug.trim() || undefined,
      descriptionAr: descriptionAr.trim(),
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
      costPrice: costPrice ? Number(costPrice) : null,
      stock: Number(stock) || 0,
      categoryId,
      brandId: brandId || null,
      images,
      badgeText: badgeText.trim() || null,
      features: featuresText
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean),
      isActive,
      isFeatured,
    };

    try {
      const url = isEdit && initialData?.id
        ? `/api/admin/products/${initialData.id}`
        : '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'حدث خطأ أثناء حفظ المنتج');
      }

      setSuccessMsg(isEdit ? 'تم تحديث بيانات المنتج بنجاح!' : 'تم نشر المنتج الجديد بنجاح!');
      setTimeout(() => {
        router.push('/admin/products');
        router.refresh();
      }, 1000);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingOptions) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-xs text-slate-500 font-bold">جاري تحميل إعدادات النموذج...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      {/* Messages */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-xs text-rose-700 font-bold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-700 font-bold">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Info (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Names & Category */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-start">
            <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
              1. المعلومات الأساسية
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                اسم المنتج باللغة العربية <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={nameAr}
                onChange={handleNameArChange}
                placeholder="مثال: حامل لابتوب ألومنيوم مريح قابل للطي"
                className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  اسم المنتج بالإنجليزية (اختياري)
                </label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. Ergonomic Aluminum Laptop Stand"
                  className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  رابط المنتج المخصص (Slug)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. ergonomic-aluminum-laptop-stand"
                  className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  القسم <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="">-- اختر القسم --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameAr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  العلامة التجارية (الماركة)
                </label>
                <select
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
                  className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="">بدون ماركة محددة (دكاني)</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nameAr} {b.nameEn ? `(${b.nameEn})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                شارة مميزة على كارت المنتج (Badge)
              </label>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="مثال: الأكثر مبيعاً 🔥 أو خصم 20% أو وصل حديثاً ✨"
                className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
          </div>

          {/* Card 2: Description & Features */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-start">
            <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
              2. الوصف والمميزات
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                الوصف الكامل للمنتج <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={descriptionAr}
                onChange={(e) => setDescriptionAr(e.target.value)}
                placeholder="اشرح مواصفات وفائدة هذا المنتج للعميل بالتفصيل وبأسلوب بيعي جذاب..."
                className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                أهم مميزات المنتج (اكتب كل ميزة في سطر منفصل)
              </label>
              <textarea
                rows={4}
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                placeholder="مثال:&#10;مصنوع من الألومنيوم الخالص خفيف الوزن&#10;زوايا قابلة للتعديل حتى 6 مستويات مختلفة&#10;فتحات تهوية تمنع سخونة اللابتوب أثناء العمل"
                className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white leading-relaxed"
              />
            </div>
          </div>

          {/* Card 3: Images */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-start">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-black text-slate-900">
                3. صور المنتج (الصورة الأولى هي صورة الغلاف)
              </h2>
              <span className="text-xs text-slate-500 font-bold">
                {images.length} صور مضافة
              </span>
            </div>

            {/* Existing Images Gallery */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-square"
                >
                  <Image
                    src={imgUrl}
                    alt={`Product preview ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="150px"
                  />
                  {idx === 0 && (
                    <span className="absolute top-1.5 end-1.5 bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                      الغلاف
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute bottom-1.5 start-1.5 bg-rose-600 text-white p-1 rounded-md opacity-90 hover:opacity-100 transition-opacity"
                    title="حذف هذه الصورة"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Image Input */}
            <div className="flex items-center gap-2 pt-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="ضع رابط صورة المنتج هنا (مثال: /images/product.jpg أو رابط مباشر)"
                  className="w-full text-xs pe-8 ps-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
                <ImageIcon className="w-4 h-4 text-slate-400 absolute end-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-colors shrink-0 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة الصورة</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              يمكنك استخدام صور محلية مثل <code className="bg-slate-100 px-1 py-0.5 rounded">/images/cat_computer_gear.jpg</code> أو روابط صور سحابية مباشرة.
            </p>
          </div>
        </div>

        {/* Sidebar Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card: Price & Stock */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-start">
            <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
              السعر والمخزون
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                سعر البيع الفعلي (ج.م) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                step="0.5"
                value={price}
                onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                placeholder="150"
                className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-bold text-emerald-800 tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                السعر الأصلي قبل الخصم (ج.م)
              </label>
              <input
                type="number"
                min="1"
                step="0.5"
                value={compareAtPrice ?? ''}
                onChange={(e) => setCompareAtPrice(e.target.value ? Number(e.target.value) : null)}
                placeholder="200 (للشطب عليه وعرض نسبة الخصم)"
                className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                الكمية المتوفرة في المخزن <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value !== '' ? Number(e.target.value) : '')}
                placeholder="50"
                className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                سعر التكلفة الداخلي (ج.م) (اختياري)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={costPrice ?? ''}
                onChange={(e) => setCostPrice(e.target.value ? Number(e.target.value) : null)}
                placeholder="لحساب الأرباح فقط ولا يظهر للعميل"
                className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white tabular-nums"
              />
            </div>
          </div>

          {/* Card: Status & Visibility */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-start">
            <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
              حالة الظهور في المتجر
            </h2>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500"
              />
              <div>
                <span className="block text-xs font-bold text-slate-900">معروض للبيع</span>
                <span className="block text-[11px] text-slate-500">
                  إذا أزلت التحديد، سيتم إخفاء المنتج مؤقتاً من المتجر
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500"
              />
              <div>
                <span className="block text-xs font-bold text-slate-900 flex items-center gap-1">
                  <span>منتج مميز (Featured)</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                </span>
                <span className="block text-[11px] text-slate-500">
                  إبراز المنتج في قسم العروض الخاصة بالصفحة الرئيسية
                </span>
              </div>
            </label>
          </div>

          {/* Submit Action Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:opacity-50 text-white font-black text-sm rounded-xl transition-all shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري الحفظ في قاعدة البيانات...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>{isEdit ? 'تحديث ونشر التعديلات 🚀' : 'حفظ ونشر المنتج 🚀'}</span>
                </>
              )}
            </button>

            <Link
              href="/admin/products"
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
            >
              <ArrowRight className="w-4 h-4" />
              <span>إلغاء والعودة لقائمة المنتجات</span>
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}

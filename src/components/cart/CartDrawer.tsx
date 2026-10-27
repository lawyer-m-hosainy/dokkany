'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ShieldCheck, Tag } from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import { formatPrice } from '@/lib/formatters';
import { siteConfig } from '@/config/site';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getItemsCount,
    getSubtotal,
    couponCode,
    discountAmount,
    applyCoupon,
    clearCoupon,
  } = useCartStore();

  const [inputCoupon, setInputCoupon] = React.useState('');
  const [couponError, setCouponError] = React.useState('');
  const [couponSuccess, setCouponSuccess] = React.useState('');

  const subtotal = getSubtotal();
  const totalItems = getItemsCount();
  const total = Math.max(0, subtotal - discountAmount);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeCart]);

  const [isValidating, setIsValidating] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const code = inputCoupon.trim().toUpperCase();

    if (!code) return;

    setIsValidating(true);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();

      if (data.valid || data.success) {
        applyCoupon(data.code || code, data.discountAmount || 0);
        setCouponSuccess(data.message || 'تم تفعيل كود الخصم بنجاح!');
        setInputCoupon('');
      } else {
        setCouponError(data.message || 'كود الخصم غير صحيح أو منتهي الصلاحية');
      }
    } catch {
      setCouponError('حدث خطأ أثناء التحقق من الكود، حاول مرة أخرى');
    } finally {
      setIsValidating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" dir="rtl">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 start-0 max-w-full flex">
        <aside className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between z-10">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-black text-slate-900">سلة المشتريات</h2>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-full transition-colors"
              aria-label="إغلاق السلة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">سلتك فارغة حالياً</h3>
                <p className="text-sm text-slate-500 mb-6">
                  استكشف أفضل الأدوات المكتبية وإكسسوارات التكنولوجيا وأضفها لسلتك.
                </p>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
                >
                  تصفح المنتجات
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedColor || ''}`}
                  className="flex gap-4 p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-2xl relative group"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
                    <Image
                      src={item.product.image || '/images/hero_dokkany_workspace.jpg'}
                      alt={item.product.nameAr}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-bold text-slate-900 line-clamp-2">
                          {item.product.nameAr}
                        </h4>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                          title="حذف المنتج"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {item.selectedColor && (
                        <p className="text-xs text-slate-500 mt-0.5">اللون: {item.selectedColor}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-s-lg transition-colors"
                          aria-label="تقليل الكمية"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-slate-800 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-e-lg transition-colors"
                          aria-label="زيادة الكمية"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-end">
                        <span className="text-sm font-black text-slate-900 tabular-nums">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-4">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    placeholder="أدخل كود الخصم"
                    className="w-full text-xs pe-8 ps-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 bg-white"
                  />
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute start-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  تطبيق
                </button>
              </form>

              {couponSuccess && <p className="text-xs text-emerald-600 font-bold">{couponSuccess}</p>}
              {couponError && <p className="text-xs text-rose-600 font-bold">{couponError}</p>}

              {couponCode && (
                <div className="flex justify-between items-center text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <span>كود مفعل: <strong>{couponCode}</strong></span>
                  <button onClick={clearCoupon} className="text-rose-600 hover:underline">
                    إلغاء
                  </button>
                </div>
              )}

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span className="font-bold tabular-nums text-slate-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>قيمة الخصم:</span>
                    <span className="tabular-nums">-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>الشحن:</span>
                  <span className="text-slate-500">يحسب في صفحة الدفع حسب المحافظة</span>
                </div>

                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>الإجمالي:</span>
                  <span className="tabular-nums text-emerald-700">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black rounded-xl text-sm transition-all shadow-md hover:shadow-lg"
              >
                <span>متابعة إتمام الطلب</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>الدفع عند الاستلام بعد معاينة المنتجات</span>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

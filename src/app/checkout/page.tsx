'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Tag,
  PhoneCall,
} from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import { siteConfig, EGYPTIAN_GOVERNORATES } from '@/config/site';
import { formatPrice, isValidEgyptianPhone } from '@/lib/formatters';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    getSubtotal,
    discountAmount,
    couponCode,
    clearCart,
  } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [governorates, setGovernorates] = useState(EGYPTIAN_GOVERNORATES);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [selectedGovernorate, setSelectedGovernorate] = useState(EGYPTIAN_GOVERNORATES[0].id);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-bot field

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setMounted(true);
    fetch('/api/governorates')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.governorates) && data.governorates.length > 0) {
          setGovernorates(data.governorates);
        }
      })
      .catch(() => {});
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const gov = governorates.find((g) => g.id === selectedGovernorate) || governorates[0];
  const isFreeShipping = subtotal >= siteConfig.freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : gov.shippingFee;
  const total = Math.max(0, subtotal - discountAmount) + shippingFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (honeypot) {
      // Bot detected, silently reject
      return;
    }

    if (!fullName.trim()) {
      setErrorMsg('يرجى إدخال اسم العميل بالكامل');
      return;
    }

    if (!isValidEgyptianPhone(phone)) {
      setErrorMsg('يرجى إدخال رقم هاتف مصري صحيح (مثال: 01012345678 أو 011 أو 012 أو 015)');
      return;
    }

    if (altPhone && !isValidEgyptianPhone(altPhone)) {
      setErrorMsg('رقم الهاتف البديل غير صحيح، يرجى التأكد من الرقم');
      return;
    }

    if (!address.trim() || address.trim().length < 5) {
      setErrorMsg('يرجى كتابة العنوان التفصيلي (المنطقة، الشارع، رقم العمارة)');
      return;
    }

    if (items.length === 0) {
      setErrorMsg('سلة مشترياتك فارغة!');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName: fullName.trim(),
        customerPhone: phone.trim(),
        customerAltPhone: altPhone.trim() || undefined,
        governorateId: gov.id,
        governorateName: gov.nameAr,
        address: address.trim(),
        notes: notes.trim() || undefined,
        couponCode: couponCode || undefined,
        honeypot: honeypot || undefined,
        items: items.map((item) => ({
          productId: item.product.id,
          productSlug: item.product.slug,
          quantity: item.quantity,
          selectedColor: item.selectedColor,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'حدث خطأ أثناء تسجيل الطلب. يرجى المحاولة مرة أخرى.');
      }

      // Success! Clear cart & redirect
      clearCart();
      router.push(`/order-success/${data.orderNumber}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'حدث خطأ غير متوقع';
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 bg-slate-50" dir="rtl">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">سلتك فارغة</h2>
          <p className="text-xs text-slate-500 mb-6">
            أضف بعض المنتجات إلى سلتك أولاً قبل الانتقال لصفحة إتمام الطلب.
          </p>
          <Link
            href="/catalog"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm inline-flex items-center gap-2"
          >
            <span>تصفح الكتالوج</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8">
          <Link href="/" className="hover:text-emerald-700">الرئيسية</Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-emerald-700">الكتالوج</Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">إتمام الطلب (الدفع عند الاستلام)</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Column (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs text-start">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h1 className="text-lg font-black text-slate-900">بيانات الاستلام والشحن</h1>
                <p className="text-xs text-slate-500">ادخل عنوانك بدقة ليصلك المندوب في أسرع وقت</p>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-xs text-rose-700 font-bold">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              {/* Anti-bot Honeypot field (hidden from humans) */}
              <input
                type="text"
                name="website_url"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: 'none', position: 'absolute', opacity: 0 }}
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  الاسم بالكامل <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثال: محمد أحمد علي"
                  className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              {/* Phone Numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    رقم الهاتف (واتساب) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="010xxxxxxxx أو 011 أو 012 أو 015"
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    رقم هاتف بديل (اختياري)
                  </label>
                  <input
                    type="tel"
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    placeholder="رقم آخر للتأكيد إن وجد"
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white tabular-nums"
                  />
                </div>
              </div>

              {/* Governorate Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  المحافظة <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedGovernorate}
                  onChange={(e) => setSelectedGovernorate(e.target.value)}
                  className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {governorates.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.nameAr} - مصاريف الشحن: {isFreeShipping ? 'مجاناً 🎁' : `${g.shippingFee} ج.م`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Detailed Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  العنوان بالتفصيل <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="المدينة / المركز، الحي، اسم الشارع، رقم العمارة، رقم الشقة أو علامة مميزة"
                  className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              {/* Delivery Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  ملاحظات إضافية للتوصيل (اختياري)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثال: يرجى الاتصال قبل الوصول بساعة، التسليم بعد الساعة 4 مساءً"
                  className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              {/* Payment Method Notice */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 pt-4">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900">
                  <strong className="block font-bold mb-0.5">طريقة الدفع: الدفع عند الاستلام نقداً (COD)</strong>
                  <span>عاين وافحص المنتجات بنفسك مع المندوب قبل دفع أي جنيه.</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:opacity-50 text-white font-black text-sm rounded-2xl transition-all shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>جاري تسجيل طلبك بأمان...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>تأكيد الطلب الآن ({formatPrice(total)})</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary Column (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 text-start">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-base font-black text-slate-900">ملخص الطلب</h2>
              <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-full tabular-nums">
                {items.length} منتجات
              </span>
            </div>

            {/* Items Mini List */}
            <div className="space-y-3 max-h-64 overflow-y-auto pe-1">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedColor || ''}`}
                  className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white shrink-0 border border-slate-200">
                    <Image
                      src={item.product.image || '/images/hero_dokkany_workspace.jpg'}
                      alt={item.product.nameAr}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {item.product.nameAr}
                    </h4>
                    <p className="text-[11px] text-slate-500 tabular-nums">
                      الكمية: {item.quantity} × {formatPrice(item.product.price)}
                    </p>
                  </div>
                  <span className="text-xs font-black text-slate-900 tabular-nums">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span className="font-bold tabular-nums text-slate-900">{formatPrice(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>الخصم ({couponCode}):</span>
                  <span className="tabular-nums">-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>الشحن ({gov.nameAr}):</span>
                <span className={`font-bold tabular-nums ${shippingFee === 0 ? 'text-emerald-700' : 'text-slate-900'}`}>
                  {shippingFee === 0 ? 'شحن مجاني 🎁' : formatPrice(shippingFee)}
                </span>
              </div>

              {isFreeShipping && (
                <p className="text-[11px] text-emerald-600 font-bold bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                  🎉 حصلت على شحن مجاني لتجاوز طلبك {formatPrice(siteConfig.freeShippingThreshold)}
                </p>
              )}

              <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                <span>المبلغ الإجمالي عند الاستلام:</span>
                <span className="tabular-nums text-emerald-800 text-lg">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Assistance Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                <span>تحتاج مساعدة في تسجيل طلبك؟</span>
              </div>
              <p className="text-[11px] text-slate-500">
                تواصل مع فريق مبيعات دكاني مباشرة عبر واتساب:
              </p>
              <a
                href={`https://wa.me/${siteConfig.whatsappPhone}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block text-xs font-bold text-emerald-700 hover:underline"
              >
                اضغط هنا لمراسلتنا على {siteConfig.whatsappDisplay}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

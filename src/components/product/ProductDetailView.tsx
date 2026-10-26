'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  RotateCcw,
  Share2,
  Check,
  CheckCircle2,
  Sparkles,
  Layers,
  ZoomIn,
  Copy,
} from 'lucide-react';
import { Product } from '@/types/store';
import { ProductCardData, ProductCard } from './ProductCard';
import { NumeralSystem, formatPrice } from '@/lib/formatters';
import { useCartStore } from '@/stores/cart';
import { siteConfig } from '@/config/site';

interface ProductDetailViewProps {
  product: Product;
  allProducts?: Product[];
  onBack?: () => void;
  onAddToCart?: (product: Product, quantity: number) => void;
  onBuyNow?: (product: Product, quantity: number) => void;
  onSelectProduct?: (productData: ProductCardData) => void;
  numeralSystem?: NumeralSystem;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  allProducts = [],
  onBack,
  onAddToCart,
  onBuyNow,
  onSelectProduct,
  numeralSystem = 'western',
}) => {
  const router = useRouter();
  const cartStore = useCartStore();

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveImageIndex(0);
  }, [product.id]);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const savedAmount =
    product.originalPrice && product.originalPrice > product.price
      ? product.originalPrice - product.price
      : 0;

  const relatedProducts = allProducts
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 3);

  const handleQuantityMinus = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleQuantityPlus = () => {
    if (quantity < (product.stockCount || 99)) setQuantity(quantity + 1);
  };

  const handleAddToCartClick = () => {
    if (onAddToCart) {
      onAddToCart(product, quantity);
    } else {
      cartStore.addItem(product, quantity);
    }
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNowClick = () => {
    if (onBuyNow) {
      onBuyNow(product, quantity);
    } else {
      cartStore.addItem(product, quantity);
      router.push('/checkout');
    }
  };

  const handleWhatsAppOrder = () => {
    const text = `مرحباً دكاني 👋
أرغب في الاستفسار والطلب المباشر للمنتج:
📦 *${product.nameAr}*
🔹 *الكمية:* ${quantity}
💰 *السعر:* ${formatPrice(product.price * quantity, numeralSystem)}
🔗 ${siteConfig.url}/product/${product.slug || product.id}

هل المنتج متوفر لتأكيد عنوان الشحن والدفع عند الاستلام؟`;

    window.open(
      `https://wa.me/${siteConfig.whatsappPhone}?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = `https://wa.me/?text=${encodeURIComponent(
        `شوف هذا العرض المميز من دكاني: ${product.nameAr} - ${window.location.href}`
      )}`;
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleFacebookShare = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        window.location.href
      )}`;
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-emerald-700 transition-colors">
            الرئيسية
          </Link>
          <span>/</span>
          {onBack ? (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1 text-slate-700 hover:text-emerald-700 font-bold transition-colors"
            >
              <span>الكتالوج</span>
            </button>
          ) : (
            <Link href="/catalog" className="text-slate-700 hover:text-emerald-700 font-bold transition-colors">
              الكتالوج
            </Link>
          )}
          <span>/</span>
          <span className="text-slate-600">{product.categoryNameAr}</span>
          <span>/</span>
          <span className="text-emerald-800 font-bold truncate max-w-xs">{product.nameAr}</span>
        </nav>

        {/* Product Main Showcase Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 lg:p-10">
            {/* Gallery Column (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Main Image with Zoom preview */}
              <div
                className="relative bg-slate-100 rounded-2xl overflow-hidden aspect-square border border-slate-200/80 group cursor-zoom-in"
                onClick={() => setIsZoomed(true)}
              >
                <Image
                  src={images[activeImageIndex] || '/images/hero_dokkany_workspace.jpg'}
                  alt={product.nameAr}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />

                {/* Badge Overlay */}
                {product.badge && (
                  <span className="absolute top-3 end-3 px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-slate-950 shadow-md z-10">
                    {product.badge}
                  </span>
                )}

                {/* Discount Badge */}
                {discountPercent > 0 && (
                  <span className="absolute top-3 start-3 px-2.5 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-md z-10">
                    خصم {discountPercent}%
                  </span>
                )}

                {/* Zoom Hint */}
                <div className="absolute bottom-3 end-3 bg-white/90 backdrop-blur-sm text-slate-700 p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm opacity-90 group-hover:opacity-100 transition-opacity z-10">
                  <ZoomIn className="w-4 h-4 text-emerald-700" />
                  <span>انقر للتكبير</span>
                </div>
              </div>

              {/* Thumbnails list if multiple */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden bg-slate-50 shrink-0 transition-all ${
                        activeImageIndex === idx
                          ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <Image src={img} alt={`صورة ${idx + 1}`} fill className="object-contain p-1" sizes="64px" />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust Value Strip Under Gallery */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">دفع عند الاستلام</h4>
                    <p className="text-[11px] text-slate-500">معاينة كاملة قبل الدفع</p>
                  </div>
                </div>
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center gap-2.5">
                  <RotateCcw className="w-5 h-5 text-emerald-700 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">ضمان 14 يوم</h4>
                    <p className="text-[11px] text-slate-500">استبدال واسترجاع سهل</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Information & Action Column (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                {/* Brand & Stock Status */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-md">
                    {product.brand}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span>متوفر في المخزن (جاهز للشحن الفوري)</span>
                  </div>
                </div>

                {/* Product Title */}
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug mb-3">
                  {product.nameAr}
                </h1>

                {/* Pricing Box */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 mb-6 flex flex-wrap items-baseline justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-slate-500 block mb-1">
                      السعر الحالي
                    </span>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl sm:text-4xl font-black text-emerald-800 tracking-tight tabular-nums">
                        {formatPrice(product.price * quantity, numeralSystem)}
                      </span>
                      {product.originalPrice && (
                        <del className="text-lg text-slate-400 font-bold tabular-nums">
                          {formatPrice(product.originalPrice * quantity, numeralSystem)}
                        </del>
                      )}
                    </div>
                  </div>

                  {savedAmount > 0 && (
                    <div className="text-end">
                      <span className="inline-block px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-extrabold border border-emerald-200 tabular-nums">
                        وفرت {formatPrice(savedAmount * quantity, numeralSystem)} 🎉
                      </span>
                    </div>
                  )}
                </div>

                {/* Brief Description */}
                <p className="text-sm text-slate-600 leading-relaxed mb-6 font-medium">
                  {product.description}
                </p>

                {/* Key Features List */}
                {product.features && product.features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xs font-extrabold text-slate-900 mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>أهم المميزات:</span>
                    </h3>
                    <ul className="space-y-2">
                      {product.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Purchase Action Box */}
              <div className="pt-6 border-t border-slate-200 space-y-4">
                {/* Quantity Stepper */}
                <div className="flex items-center gap-4">
                  <span className="text-xs font-extrabold text-slate-700">الكمية المطلوبة:</span>
                  <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      onClick={handleQuantityMinus}
                      disabled={quantity <= 1}
                      className="px-3.5 py-2 text-slate-700 hover:bg-slate-200 font-black disabled:opacity-40 transition-colors"
                      aria-label="إنقاص الكمية"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-black text-sm text-slate-900 bg-white tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={handleQuantityPlus}
                      disabled={quantity >= (product.stockCount || 99)}
                      className="px-3.5 py-2 text-slate-700 hover:bg-slate-200 font-black disabled:opacity-40 transition-colors"
                      aria-label="زيادة الكمية"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-slate-400">
                    (متبقي {product.stockCount} قطع في المخزن)
                  </span>
                </div>

                {/* Dual Purchase Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Buy Now (Direct Checkout) */}
                  <button
                    onClick={handleBuyNowClick}
                    className="w-full py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm transition-all shadow-md shadow-emerald-700/25 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>شراء الآن (دفع عند الاستلام)</span>
                  </button>

                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCartClick}
                    className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4 text-emerald-400" />
                    <span>إضافة إلى سلة الشراء</span>
                  </button>
                </div>

                {/* WhatsApp Order Direct Button */}
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>اطلب فوراً عبر واتساب ({siteConfig.whatsappDisplay})</span>
                </button>

                {/* Social Share Bar */}
                <div className="pt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                  <span className="font-bold">مشاركة هذا المنتج:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleWhatsAppShare}
                      className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                      title="مشاركة عبر واتساب"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleFacebookShare}
                      className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                      title="مشاركة على فيسبوك"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1 font-bold text-[11px]"
                      title="نسخ رابط المنتج"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'تم النسخ!' : 'نسخ الرابط'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Table Section */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 mb-12 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Layers className="w-5 h-5 text-emerald-600" />
              <span>جدول المواصفات الفنية التفصيلية</span>
            </h3>

            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-start text-xs sm:text-sm">
                <tbody>
                  {Object.entries(product.specs).map(([key, value], idx) => (
                    <tr
                      key={key}
                      className={`border-b border-slate-200 last:border-0 ${
                        idx % 2 === 0 ? 'bg-slate-50/60' : 'bg-white'
                      }`}
                    >
                      <td className="py-3.5 px-4 sm:px-6 font-extrabold text-slate-700 w-1/3 sm:w-1/4">
                        {key}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 font-medium text-slate-900">
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black text-slate-900">منتجات مشابهة قد تناسبك</h3>
                <p className="text-xs text-slate-500 mt-0.5">من نفس قسم {product.categoryNameAr}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => {
                const cardData: ProductCardData = {
                  id: rel.id,
                  slug: rel.slug || rel.id,
                  nameAr: rel.nameAr,
                  brandName: rel.brand,
                  categoryNameAr: rel.categoryNameAr,
                  price: rel.price,
                  compareAtPrice: rel.originalPrice,
                  stock: rel.stockCount,
                  badgeText: rel.badge,
                  images: rel.images || [rel.image],
                };
                return (
                  <div
                    key={rel.id}
                    onClick={() => onSelectProduct?.(cardData)}
                    className="cursor-pointer"
                  >
                    <ProductCard
                      product={cardData}
                      onAddToCart={() => cartStore.addItem(rel, 1)}
                      numeralSystem={numeralSystem}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center aspect-square">
            <Image
              src={images[activeImageIndex] || '/images/hero_dokkany_workspace.jpg'}
              alt={product.nameAr}
              fill
              className="object-contain rounded-2xl"
              sizes="90vw"
            />
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 end-4 p-2.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 transition-colors z-10"
              aria-label="إغلاق التكبير"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Floating Add to Cart Success Toast */}
      {addedToast && (
        <div className="fixed bottom-6 start-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-extrabold animate-in fade-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>تمت إضافة المنتج إلى سلة مشترياتك بنجاح!</span>
        </div>
      )}
    </div>
  );
};

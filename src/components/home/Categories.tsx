'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Laptop, Smartphone } from 'lucide-react';

interface CategoryItem {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  imageUrl: string;
}

const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-stationery',
    slug: 'stationery',
    nameAr: 'أدوات مكتبية ومدرسية',
    nameEn: 'Stationery & School',
    descriptionAr: 'دفاتر جلدية فاخرة، أقلام راقية، منظمات مكتبية ومستلزمات دراسية متينة للطلاب والمحترفين.',
    imageUrl: '/images/cat_stationery_supplies.jpg',
  },
  {
    id: 'cat-computer',
    slug: 'computer',
    nameAr: 'إكسسوارات كمبيوتر ولابتوب',
    nameEn: 'Computer Accessories',
    descriptionAr: 'كيبوردات ميكانيكية، ماوسات مريحة، منصات لابتوب ألومنيوم، وموزعات USB-C للعمل والإنتاجية.',
    imageUrl: '/images/cat_computer_gear.jpg',
  },
  {
    id: 'cat-mobile',
    slug: 'mobile',
    nameAr: 'إكسسوارات موبايل',
    nameEn: 'Mobile Accessories',
    descriptionAr: 'شواحن سريعة وMagSafe، كابلات شحن مدرعة، بنوك طاقة فائقة، وحافظات هواتف مقاومة للصدمات.',
    imageUrl: '/images/cat_mobile_accessories.jpg',
  },
];

interface CategoriesProps {
  categories?: CategoryItem[];
  onSelectCategory?: (categorySlug: string) => void;
}

export const Categories: React.FC<CategoriesProps> = ({
  categories = DEFAULT_CATEGORIES,
  onSelectCategory,
}) => {
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'stationery':
        return <BookOpen className="w-5 h-5 text-amber-600" />;
      case 'computer':
        return <Laptop className="w-5 h-5 text-indigo-600" />;
      case 'mobile':
        return <Smartphone className="w-5 h-5 text-emerald-600" />;
      default:
        return null;
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-200" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 text-start">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 mb-1">
              <span>الأقسام المتخصصة</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-500 font-normal">تسوق حسب فئتك المفضلة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              أقسام متجر دكاني
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            منتجات منتقاة بعناية للطلاب، الموظفين، وأصحاب الأعمال في مصر.
          </p>
        </div>

        {/* 3 Large Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((cat) => {
            const cardContent = (
              <>
                {/* Category Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-200">
                  <Image
                    src={cat.imageUrl}
                    alt={cat.nameAr}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  {/* Category Icon Badge */}
                  <div className="absolute bottom-4 end-4 bg-white rounded-xl p-2.5 shadow-md">
                    {getCategoryIcon(cat.slug)}
                  </div>
                </div>

                {/* Category Info */}
                <div className="p-5 flex-1 flex flex-col justify-between text-start">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {cat.nameAr}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {cat.descriptionAr}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-emerald-700">
                    <span className="flex items-center gap-1 group-hover:-translate-x-1 transition-transform">
                      <span>استكشف القسم</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      {cat.nameEn}
                    </span>
                  </div>
                </div>
              </>
            );

            if (onSelectCategory) {
              return (
                <div
                  key={cat.id || cat.slug}
                  onClick={() => onSelectCategory(cat.slug)}
                  className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 hover:shadow-xl hover:border-emerald-400 transition-all duration-300 cursor-pointer flex flex-col"
                >
                  {cardContent}
                </div>
              );
            }

            return (
              <Link
                key={cat.id || cat.slug}
                href={`/catalog?category=${cat.slug}`}
                className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 hover:shadow-xl hover:border-emerald-400 transition-all duration-300 cursor-pointer flex flex-col"
              >
                {cardContent}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

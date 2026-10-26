import { Suspense } from 'react';
import type { Metadata } from 'next';
import { CatalogClient } from './CatalogClient';
import { SEED_PRODUCTS, SEED_CATEGORIES } from '../../../prisma/seedData';
import { Product } from '@/types/store';
import { ProductCardSkeleton } from '@/components/common/Skeleton';

export const metadata: Metadata = {
  title: 'كتالوج المنتجات والعروض',
  description: 'تصفح كافة الأدوات المكتبية والمدرسية وإكسسوارات الكمبيوتر والموبايل بأفضل الأسعار في مصر.',
};

export default function CatalogPage() {
  // Map SEED_PRODUCTS to Product type
  const products: Product[] = SEED_PRODUCTS.map((p) => {
    const cat = SEED_CATEGORIES.find((c) => c.id === p.categoryId);
    const categoryKey: 'stationery' | 'computer' | 'mobile' =
      cat?.slug === 'stationery' ? 'stationery' : cat?.slug === 'computer' ? 'computer' : 'mobile';

    return {
      id: p.id,
      name: p.nameEn || p.nameAr,
      nameAr: p.nameAr,
      categoryId: categoryKey,
      categoryNameAr: cat?.nameAr || '',
      price: Number(p.price),
      originalPrice: p.compareAtPrice ? Number(p.compareAtPrice) : undefined,
      rating: 5,
      reviewsCount: 30,
      inStock: p.stock > 0,
      stockCount: p.stock,
      brand: p.brandId ? p.brandId.replace('brand-', '').toUpperCase() : 'دكاني',
      description: p.descriptionAr,
      features: p.features || [],
      image: p.images[0] || '/images/hero_dokkany_workspace.jpg',
      tags: ('keywords' in p && Array.isArray((p as { keywords?: string[] }).keywords) ? (p as { keywords: string[] }).keywords : []),
      badge: p.badgeText,
      specs: (p.specs as unknown as Record<string, string>) || {},
      images: p.images,
      slug: p.slug,
    };
  });

  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      }
    >
      <CatalogClient products={products} />
    </Suspense>
  );
}

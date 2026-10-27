import { Suspense } from 'react';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { CatalogClient } from './CatalogClient';
import { Product } from '@/types/store';
import { ProductCardSkeleton } from '@/components/common/Skeleton';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'كتالوج المنتجات والعروض',
  description: 'تصفح كافة الأدوات المكتبية والمدرسية وإكسسوارات الكمبيوتر والموبايل بأفضل الأسعار في مصر.',
};

export default async function CatalogPage() {
  const dbProducts = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true, brand: true, variants: true },
    orderBy: { createdAt: 'desc' },
  });

  // Map DB products to Product type (serializable plain objects)
  const products: Product[] = dbProducts.map((p) => {
    const categoryKey: 'stationery' | 'computer' | 'mobile' =
      p.category?.slug === 'stationery' ? 'stationery' : p.category?.slug === 'computer' ? 'computer' : 'mobile';

    return {
      id: p.id,
      name: p.nameEn || p.nameAr,
      nameAr: p.nameAr,
      categoryId: categoryKey,
      categoryNameAr: p.category?.nameAr || '',
      price: Number(p.price),
      originalPrice: p.compareAtPrice ? Number(p.compareAtPrice) : undefined,
      rating: 5,
      reviewsCount: 30,
      inStock: p.stock > 0,
      stockCount: p.stock,
      brand: p.brand?.nameEn || 'دكاني',
      description: p.descriptionAr,
      features: p.features as string[] || [],
      image: p.images[0] || '/images/hero_dokkany_workspace.jpg',
      tags: p.keywords as string[] || [],
      badge: p.badgeText || undefined,
      specs: (p.specs as Record<string, string>) || {},
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

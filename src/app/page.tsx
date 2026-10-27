import { prisma } from '@/lib/prisma';
import { Hero } from '@/components/home/Hero';
import { Categories } from '@/components/home/Categories';
import { ProductSpotlight } from '@/components/home/ProductSpotlight';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Benefits } from '@/components/home/Benefits';
import { ProductCardData } from '@/components/product/ProductCard';

export const revalidate = 60; // ISR cache revalidation 60s

export default async function HomePage() {
  const dbProducts = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true, brand: true, variants: true },
    orderBy: { soldCount: 'desc' },
    take: 12,
  });

  // Map DB products to ProductCardData format (serializable)
  const products: ProductCardData[] = dbProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    nameAr: p.nameAr,
    brandName: p.brand?.nameEn || undefined,
    categoryNameAr: p.category?.nameAr || undefined,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    stock: p.stock,
    badgeText: p.badgeText,
    images: p.images,
  }));

  // Spotlight product: AKG N29 earphones or first product
  const spotlightProduct = products.find((p) => p.slug === 'samsung-akg-n29-anc-earphones') || products[0];

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Categories />
      {spotlightProduct && <ProductSpotlight product={spotlightProduct} />}
      <FeaturedProducts products={products} />
      <Benefits />
    </div>
  );
}

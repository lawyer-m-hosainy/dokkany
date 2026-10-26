import { Hero } from '@/components/home/Hero';
import { Categories } from '@/components/home/Categories';
import { ProductSpotlight } from '@/components/home/ProductSpotlight';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Benefits } from '@/components/home/Benefits';
import { SEED_PRODUCTS, SEED_CATEGORIES } from '../../prisma/seedData';
import { ProductCardData } from '@/components/product/ProductCard';

export const revalidate = 60; // ISR cache revalidation 60s

export default async function HomePage() {
  // Map SEED_PRODUCTS to ProductCardData format
  const products: ProductCardData[] = SEED_PRODUCTS.map((p) => {
    const cat = SEED_CATEGORIES.find((c) => c.id === p.categoryId);
    return {
      id: p.id,
      slug: p.slug,
      nameAr: p.nameAr,
      brandName: p.brandId ? p.brandId.replace('brand-', '').toUpperCase() : undefined,
      categoryNameAr: cat?.nameAr,
      price: Number(p.price),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
      stock: p.stock,
      badgeText: p.badgeText,
      images: p.images,
    };
  });

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

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProductDetailView } from '@/components/product/ProductDetailView';
import { Product } from '@/types/store';
import { siteConfig } from '@/config/site';

export const revalidate = 60;

interface ProductPageProps {
  params: {
    slug: string;
  };
}

function mapDbToProduct(p: {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string | null;
  descriptionAr: string;
  price: unknown;
  compareAtPrice: unknown;
  stock: number;
  badgeText: string | null;
  images: string[];
  features: unknown;
  keywords: unknown;
  specs: unknown;
  category: { slug: string; nameAr: string } | null;
  brand: { nameEn: string | null } | null;
}): Product {
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
    reviewsCount: 25,
    inStock: p.stock > 0,
    stockCount: p.stock,
    brand: p.brand?.nameEn || 'دكاني',
    description: p.descriptionAr,
    features: (p.features as string[]) || [],
    image: p.images[0] || '/images/hero_dokkany_workspace.jpg',
    tags: (p.keywords as string[]) || [],
    badge: p.badgeText || undefined,
    specs: (p.specs as Record<string, string>) || {},
    images: p.images,
    slug: p.slug,
  };
}

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const dbProduct = await prisma.product.findFirst({
    where: { slug: params.slug, isActive: true },
    include: { category: true, brand: true },
  });

  if (!dbProduct) {
    return { title: 'المنتج غير موجود' };
  }

  const product = mapDbToProduct(dbProduct);

  return {
    title: product.nameAr,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.nameAr} | ${siteConfig.name}`,
      description: product.description.slice(0, 160),
      images: [
        {
          url: product.image,
          width: 800,
          height: 800,
          alt: product.nameAr,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const dbProduct = await prisma.product.findFirst({
    where: { slug: params.slug, isActive: true },
    include: { category: true, brand: true, variants: true },
  });

  if (!dbProduct) {
    notFound();
  }

  const product = mapDbToProduct(dbProduct);

  // Get related products from same category
  const relatedDbProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      categoryId: dbProduct.categoryId,
      id: { not: dbProduct.id },
    },
    include: { category: true, brand: true, variants: true },
    take: 8,
  });

  const allProducts = [product, ...relatedDbProducts.map(mapDbToProduct)];

  // JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.nameAr,
    image: product.images,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EGP',
      price: product.price,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${siteConfig.url}/product/${product.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailView product={product} allProducts={allProducts} />
    </>
  );
}

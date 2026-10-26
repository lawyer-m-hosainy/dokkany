import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetailView } from '@/components/product/ProductDetailView';
import { SEED_PRODUCTS, SEED_CATEGORIES } from '../../../../prisma/seedData';
import { Product } from '@/types/store';
import { siteConfig } from '@/config/site';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

// Convert SEED product to Store Product type
function mapSeedToProduct(p: (typeof SEED_PRODUCTS)[0]): Product {
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
    reviewsCount: 25,
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
}

export async function generateStaticParams() {
  return SEED_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const rawProduct = SEED_PRODUCTS.find(
    (p) => p.slug === params.slug || p.id === params.slug
  );

  if (!rawProduct) {
    return {
      title: 'المنتج غير موجود',
    };
  }

  const product = mapSeedToProduct(rawProduct);

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

export default function ProductDetailPage({ params }: ProductPageProps) {
  const rawProduct = SEED_PRODUCTS.find(
    (p) => p.slug === params.slug || p.id === params.slug
  );

  if (!rawProduct) {
    notFound();
  }

  const product = mapSeedToProduct(rawProduct);
  const allProducts = SEED_PRODUCTS.map(mapSeedToProduct);

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
      url: `${siteConfig.url}/product/${product.slug || product.id}`,
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

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeArabicText } from '@/lib/arabicNormalize';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const sortBy = searchParams.get('sortBy') || 'featured';
    const q = searchParams.get('q');
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit')) || 20));

    const rawProducts = await prisma.product.findMany({
      where: { isActive: true },
      include: { category: true, brand: true },
    });

    let products = rawProducts.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.nameEn || p.nameAr,
      nameAr: p.nameAr,
      categoryId: p.category.slug,
      categoryNameAr: p.category.nameAr,
      price: Number(p.price),
      originalPrice: p.compareAtPrice ? Number(p.compareAtPrice) : undefined,
      inStock: p.stock > 0,
      stockCount: p.stock,
      brand: p.brand?.nameAr || 'دكاني',
      description: p.descriptionAr,
      features: p.features || [],
      image: p.images[0] || '/images/hero_dokkany_workspace.jpg',
      tags: p.keywords || [],
      badge: p.badgeText,
      specs: (p.specs as Record<string, string>) || {},
      images: p.images,
      soldCount: p.soldCount,
    }));

    // 1. Filter by category
    if (category && category !== 'all') {
      products = products.filter((p) => p.categoryId === category);
    }

    // 2. Filter by brand
    if (brand && brand !== 'all') {
      products = products.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
    }

    // 3. Filter by price range
    if (minPrice !== undefined) {
      products = products.filter((p) => p.price >= minPrice);
    }
    if (maxPrice !== undefined) {
      products = products.filter((p) => p.price <= maxPrice);
    }

    // 4. Normalized Arabic Search
    if (q && q.trim()) {
      const normalizedQuery = normalizeArabicText(q);
      const queryTerms = normalizedQuery.split(' ').filter(Boolean);
      products = products.filter((p) => {
        const normalizedName = normalizeArabicText(p.nameAr);
        const normalizedDesc = normalizeArabicText(p.description);
        const normalizedBrand = normalizeArabicText(p.brand);
        return queryTerms.every(
          (term) =>
            normalizedName.includes(term) ||
            normalizedDesc.includes(term) ||
            normalizedBrand.includes(term)
        );
      });
    }

    // 5. Sorting
    if (sortBy === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'bestsellers') {
      products.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
    } else if (sortBy === 'deals') {
      products.sort((a, b) => {
        const discountA = a.originalPrice ? a.originalPrice - a.price : 0;
        const discountB = b.originalPrice ? b.originalPrice - b.price : 0;
        return discountB - discountA;
      });
    }

    // 6. Pagination
    const totalCount = products.length;
    const startIndex = (page - 1) * limit;
    const paginatedProducts = products.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء جلب المنتجات' },
      { status: 500 }
    );
  }
}

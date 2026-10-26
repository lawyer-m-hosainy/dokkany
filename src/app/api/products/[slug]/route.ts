import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SEED_PRODUCTS, SEED_CATEGORIES } from '../../../../../prisma/seedData';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: {
    slug: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { slug } = params;

    // Try DB first
    try {
      const dbProduct = await prisma.product.findFirst({
        where: {
          OR: [{ slug }, { id: slug }],
          isActive: true,
        },
        include: { category: true, brand: true, variants: true },
      });

      if (dbProduct) {
        return NextResponse.json({
          success: true,
          product: {
            id: dbProduct.id,
            slug: dbProduct.slug,
            nameAr: dbProduct.nameAr,
            nameEn: dbProduct.nameEn,
            categoryId: dbProduct.category.slug,
            categoryNameAr: dbProduct.category.nameAr,
            price: Number(dbProduct.price),
            compareAtPrice: dbProduct.compareAtPrice ? Number(dbProduct.compareAtPrice) : null,
            stock: dbProduct.stock,
            images: dbProduct.images,
            badgeText: dbProduct.badgeText,
            features: dbProduct.features,
            specs: dbProduct.specs,
            brand: dbProduct.brand?.nameAr || 'دكاني',
            variants: dbProduct.variants,
          },
        });
      }
    } catch {
      // Fallback below
    }

    // Fallback to seed data
    const raw = SEED_PRODUCTS.find((p) => p.slug === slug || p.id === slug);
    if (!raw) {
      return NextResponse.json(
        { success: false, message: 'المنتج غير موجود' },
        { status: 404 }
      );
    }

    const cat = SEED_CATEGORIES.find((c) => c.id === raw.categoryId);

    return NextResponse.json({
      success: true,
      product: {
        id: raw.id,
        slug: raw.slug,
        nameAr: raw.nameAr,
        nameEn: raw.nameEn,
        categoryId: cat?.slug || 'all',
        categoryNameAr: cat?.nameAr || '',
        price: Number(raw.price),
        compareAtPrice: raw.compareAtPrice ? Number(raw.compareAtPrice) : null,
        stock: raw.stock,
        images: raw.images,
        badgeText: raw.badgeText,
        features: raw.features || [],
        specs: raw.specs || {},
        brand: raw.brandId ? raw.brandId.replace('brand-', '').toUpperCase() : 'دكاني',
      },
    });
  } catch (error) {
    console.error('Error fetching single product:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء جلب تفاصيل المنتج' },
      { status: 500 }
    );
  }
}

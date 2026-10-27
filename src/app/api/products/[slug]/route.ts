import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: {
    slug: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { slug } = params;

    const dbProduct = await prisma.product.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
        isActive: true,
      },
      include: { category: true, brand: true, variants: true },
    });

    if (!dbProduct) {
      return NextResponse.json(
        { success: false, message: 'المنتج غير موجود' },
        { status: 404 }
      );
    }

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
  } catch (error) {
    console.error('Error fetching single product:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء جلب تفاصيل المنتج' },
      { status: 500 }
    );
  }
}

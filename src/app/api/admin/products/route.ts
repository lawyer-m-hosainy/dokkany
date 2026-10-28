import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function createSlug(name: string): string {
  const clean = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0621-\u064A-]/g, '')
    .replace(/[\s_]+/g, '-');
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${clean || 'item'}-${suffix}`;
}

const createProductSchema = z.object({
  nameAr: z.string().min(2, 'اسم المنتج بالعربية مطلوب'),
  nameEn: z.string().optional(),
  slug: z.string().optional(),
  descriptionAr: z.string().min(5, 'الوصف التفصيلي للمنتج مطلوب'),
  price: z.number().positive('السعر يجب أن يكون رقماً أكبر من صفر'),
  compareAtPrice: z.number().positive().optional().nullable(),
  costPrice: z.number().positive().optional().nullable(),
  stock: z.number().int().min(0, 'الكمية في المخزن لا تقل عن صفر'),
  categoryId: z.string().min(1, 'يرجى اختيار القسم'),
  brandId: z.string().optional().nullable(),
  images: z.array(z.string().url('رابط الصورة غير صحيح')).min(1, 'يرجى إضافة صورة واحدة على الأقل'),
  badgeText: z.string().optional().nullable(),
  features: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

// GET /api/admin/products - List products with optional search and filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const categoryId = searchParams.get('categoryId');

    const where: Record<string, unknown> = {};

    if (categoryId && categoryId !== 'all') {
      where.categoryId = categoryId;
    }

    if (q && q.trim()) {
      where.OR = [
        { nameAr: { contains: q.trim(), mode: 'insensitive' } },
        { nameEn: { contains: q.trim(), mode: 'insensitive' } },
        { slug: { contains: q.trim(), mode: 'insensitive' } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: { select: { id: true, nameAr: true, slug: true } },
        brand: { select: { id: true, nameAr: true, nameEn: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      products: products.map((p) => ({
        id: p.id,
        slug: p.slug,
        nameAr: p.nameAr,
        nameEn: p.nameEn,
        descriptionAr: p.descriptionAr,
        price: Number(p.price),
        compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
        stock: p.stock,
        images: p.images,
        badgeText: p.badgeText,
        features: p.features,
        isActive: p.isActive,
        isFeatured: p.isFeatured,
        soldCount: p.soldCount,
        category: p.category,
        brand: p.brand,
        createdAt: p.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching admin products:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء جلب قائمة المنتجات' },
      { status: 500 }
    );
  }
}

// POST /api/admin/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.errors[0]?.message || 'بيانات المنتج غير صحيحة',
          errors: parsed.error.errors,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Check slug uniqueness or generate one
    let finalSlug = data.slug?.trim() || createSlug(data.nameAr);
    const existing = await prisma.product.findUnique({ where: { slug: finalSlug } });
    if (existing) {
      finalSlug = `${finalSlug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const newProduct = await prisma.product.create({
      data: {
        slug: finalSlug,
        nameAr: data.nameAr.trim(),
        nameEn: data.nameEn?.trim() || null,
        descriptionAr: data.descriptionAr.trim(),
        price: data.price,
        compareAtPrice: data.compareAtPrice || null,
        costPrice: data.costPrice || null,
        stock: data.stock,
        categoryId: data.categoryId,
        brandId: data.brandId || null,
        images: data.images,
        badgeText: data.badgeText?.trim() || null,
        features: data.features.filter((f) => f.trim().length > 0),
        isActive: data.isActive,
        isFeatured: data.isFeatured,
      },
      include: {
        category: { select: { nameAr: true } },
        brand: { select: { nameAr: true } },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'تم إضافة المنتج بنجاح!',
      product: {
        id: newProduct.id,
        slug: newProduct.slug,
        nameAr: newProduct.nameAr,
      },
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء حفظ المنتج في قاعدة البيانات' },
      { status: 500 }
    );
  }
}

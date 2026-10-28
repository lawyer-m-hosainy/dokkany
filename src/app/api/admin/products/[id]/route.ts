import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: {
    id: string;
  };
}

const updateProductSchema = z.object({
  nameAr: z.string().min(2, 'اسم المنتج بالعربية مطلوب'),
  nameEn: z.string().optional().nullable(),
  slug: z.string().min(2, 'الرابط التعريفي مطلوب'),
  descriptionAr: z.string().min(5, 'الوصف التفصيلي للمنتج مطلوب'),
  price: z.number().positive('السعر يجب أن يكون رقماً أكبر من صفر'),
  compareAtPrice: z.number().positive().optional().nullable(),
  costPrice: z.number().positive().optional().nullable(),
  stock: z.number().int().min(0, 'الكمية في المخزن لا تقل عن صفر'),
  categoryId: z.string().min(1, 'يرجى اختيار القسم'),
  brandId: z.string().optional().nullable(),
  images: z.array(z.string()).min(1, 'يرجى إضافة صورة واحدة على الأقل'),
  badgeText: z.string().optional().nullable(),
  features: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

// GET /api/admin/products/[id]
export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'المنتج غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product: {
        id: product.id,
        slug: product.slug,
        nameAr: product.nameAr,
        nameEn: product.nameEn,
        descriptionAr: product.descriptionAr,
        price: Number(product.price),
        compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
        costPrice: product.costPrice ? Number(product.costPrice) : null,
        stock: product.stock,
        categoryId: product.categoryId,
        brandId: product.brandId,
        images: product.images,
        badgeText: product.badgeText,
        features: product.features,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
      },
    });
  } catch (error) {
    console.error('Error fetching product for admin:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء جلب بيانات المنتج' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/products/[id]
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params;
    const body = await request.json();
    const parsed = updateProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.errors[0]?.message || 'بيانات التحديث غير صحيحة',
          errors: parsed.error.errors,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Verify product exists
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'المنتج غير موجود' },
        { status: 404 }
      );
    }

    // Check slug uniqueness if changed
    if (data.slug !== existing.slug) {
      const slugConflict = await prisma.product.findUnique({ where: { slug: data.slug } });
      if (slugConflict && slugConflict.id !== id) {
        return NextResponse.json(
          { success: false, message: 'هذا الرابط التعريفي مستخدم لمنتج آخر، يرجى تغييره' },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        nameAr: data.nameAr.trim(),
        nameEn: data.nameEn?.trim() || null,
        slug: data.slug.trim(),
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
    });

    return NextResponse.json({
      success: true,
      message: 'تم تحديث بيانات المنتج بنجاح!',
      product: {
        id: updated.id,
        slug: updated.slug,
        nameAr: updated.nameAr,
      },
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء تحديث بيانات المنتج' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[id]
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params;

    const existing = await prisma.product.findUnique({
      where: { id },
      include: { orderItems: true },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'المنتج غير موجود' },
        { status: 404 }
      );
    }

    // If product has historical orders, soft-delete by deactivating it
    if (existing.orderItems && existing.orderItems.length > 0) {
      await prisma.product.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({
        success: true,
        message: 'تم تعطيل المنتج وإخفاؤه من المتجر (تم الاحتفاظ به في الأرشيف لوجود طلبات سابقة مرتبطة به)',
      });
    }

    // Otherwise permanently delete
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: 'تم حذف المنتج نهائياً بنجاح!',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء حذف المنتج' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [categories, brands] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        select: { id: true, slug: true, nameAr: true },
      }),
      prisma.brand.findMany({
        where: { isActive: true },
        orderBy: { nameAr: 'asc' },
        select: { id: true, slug: true, nameAr: true, nameEn: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      categories,
      brands,
    });
  } catch (error) {
    console.error('Error fetching categories & brands for admin:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء جلب الأقسام والماركات' },
      { status: 500 }
    );
  }
}

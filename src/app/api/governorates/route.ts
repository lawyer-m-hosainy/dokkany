import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EGYPTIAN_GOVERNORATES } from '@/config/site';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    try {
      const dbGovernorates = await prisma.governorate.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      });

      if (dbGovernorates && dbGovernorates.length > 0) {
        return NextResponse.json({
          success: true,
          governorates: dbGovernorates.map((g) => ({
            id: g.id,
            nameAr: g.nameAr,
            nameEn: g.nameEn,
            shippingFee: Number(g.shippingFee),
          })),
        });
      }
    } catch {
      // Fallback to static config
    }

    return NextResponse.json({
      success: true,
      governorates: EGYPTIAN_GOVERNORATES,
    });
  } catch (error) {
    console.error('Error fetching governorates:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء جلب قائمة المحافظات' },
      { status: 500 }
    );
  }
}

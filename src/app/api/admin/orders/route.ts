import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as OrderStatus | null;
    const q = searchParams.get('q');
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit')) || 25));

    const whereClause: Record<string, unknown> = {};

    if (status && Object.values(OrderStatus).includes(status)) {
      whereClause.status = status;
    }

    if (q && q.trim()) {
      whereClause.OR = [
        { customerName: { contains: q.trim(), mode: 'insensitive' } },
        { customerPhone: { contains: q.trim() } },
        { orderNumber: { contains: q.trim() } },
      ];
    }

    let orders: Array<unknown> = [];
    let totalCount = 0;

    try {
      const [fetchedOrders, count] = await Promise.all([
        prisma.order.findMany({
          where: whereClause,
          include: { items: true },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.order.count({ where: whereClause }),
      ]);
      orders = fetchedOrders;
      totalCount = count;
    } catch {
      // Return empty if DB is in migration or initial setup
      orders = [];
      totalCount = 0;
    }

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit) || 1,
      },
    });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء جلب قائمة الطلبات' },
      { status: 500 }
    );
  }
}

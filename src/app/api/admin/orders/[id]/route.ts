import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: {
    id: string;
  };
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params;
    const body = await request.json();
    const newStatus = body.status as OrderStatus;

    if (!Object.values(OrderStatus).includes(newStatus)) {
      return NextResponse.json(
        { success: false, message: 'حالة الطلب غير صالحة' },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const existingOrder = await tx.order.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!existingOrder) {
        throw new Error('الطلب غير موجود');
      }

      const oldStatus = existingOrder.status;

      // 1. If moving to CANCELLED or RETURNED from an active state -> Refund stock
      const wasActive = oldStatus !== 'CANCELLED' && oldStatus !== 'RETURNED';
      const isNowInactive = newStatus === 'CANCELLED' || newStatus === 'RETURNED';

      if (wasActive && isNowInactive) {
        for (const item of existingOrder.items) {
          if (item.productId) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stock: { increment: item.quantity },
                soldCount: { decrement: item.quantity },
              },
            });
          }
        }
      }

      // 2. If reviving from CANCELLED/RETURNED back to active state -> Re-deduct stock
      const wasInactive = oldStatus === 'CANCELLED' || oldStatus === 'RETURNED';
      const isNowActive = newStatus !== 'CANCELLED' && newStatus !== 'RETURNED';

      if (wasInactive && isNowActive) {
        for (const item of existingOrder.items) {
          if (item.productId) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stock: { decrement: item.quantity },
                soldCount: { increment: item.quantity },
              },
            });
          }
        }
      }

      // 3. Update the order status
      return await tx.order.update({
        where: { id },
        data: { status: newStatus },
        include: { items: true },
      });
    });

    return NextResponse.json({
      success: true,
      message: 'تم تحديث حالة الطلب بنجاح',
      order: updatedOrder,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'حدث خطأ أثناء تحديث حالة الطلب';
    console.error('Error updating order status:', error);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

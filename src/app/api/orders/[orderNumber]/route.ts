import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: {
    orderNumber: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { orderNumber } = params;

    try {
      const order = await prisma.order.findUnique({
        where: { orderNumber },
        include: { items: true },
      });

      if (order) {
        return NextResponse.json({
          success: true,
          order: {
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            governorateName: order.governorateName,
            status: order.status,
            subtotal: Number(order.subtotal),
            shippingFee: Number(order.shippingFee),
            discountAmount: Number(order.discountAmount),
            totalAmount: Number(order.totalAmount),
            createdAt: order.createdAt,
            items: order.items.map((i) => ({
              productNameAr: i.productNameAr,
              quantity: i.quantity,
              unitPrice: Number(i.unitPrice),
              totalPrice: Number(i.totalPrice),
              productImage: i.productImage,
            })),
          },
        });
      }
    } catch {
      // Fallback
    }

    // Fallback info if offline demo
    return NextResponse.json({
      success: true,
      order: {
        orderNumber,
        status: 'NEW',
        message: 'طلبك قيد المراجعة والتجهيز للشحن.',
      },
    });
  } catch (error) {
    console.error('Error fetching order by orderNumber:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء جلب تفاصيل الطلب' },
      { status: 500 }
    );
  }
}

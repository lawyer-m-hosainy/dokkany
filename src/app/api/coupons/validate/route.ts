import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const validateCouponSchema = z.object({
  code: z.string().min(1, 'كود الخصم مطلوب').trim(),
  subtotal: z.number().positive('المجموع الفرعي يجب أن يكون موجباً'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = validateCouponSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error.errors[0]?.message || 'بيانات غير صحيحة' },
        { status: 400 }
      );
    }

    const { code, subtotal } = result.data;
    const cleanCode = code.toUpperCase();

    // Check DB
    try {
      const coupon = await prisma.coupon.findUnique({
        where: { code: cleanCode },
      });

      if (coupon) {
        if (!coupon.isActive) {
          return NextResponse.json(
            { success: false, message: 'كود الخصم غير مفعّل حالياً' },
            { status: 400 }
          );
        }

        if (coupon.expiresAt && new Date() > coupon.expiresAt) {
          return NextResponse.json(
            { success: false, message: 'انتهت صلاحية كود الخصم' },
            { status: 400 }
          );
        }

        if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
          return NextResponse.json(
            { success: false, message: 'تم استنفاد الحد الأقصى لاستخدام هذا الكود' },
            { status: 400 }
          );
        }

        const minAmount = coupon.minOrderAmount ? Number(coupon.minOrderAmount) : 0;
        if (subtotal < minAmount) {
          return NextResponse.json(
            { success: false, message: `الحد الأدنى لتفعيل هذا الكود هو ${minAmount} ج.م` },
            { status: 400 }
          );
        }

        let discountAmount = 0;
        if (coupon.discountType === 'PERCENTAGE') {
          discountAmount = Math.round((subtotal * Number(coupon.discountValue)) / 100);
        } else {
          discountAmount = Number(coupon.discountValue);
        }

        return NextResponse.json({
          success: true,
          valid: true,
          code: coupon.code,
          discountAmount: Math.min(discountAmount, subtotal),
          message: 'تم تفعيل كود الخصم بنجاح!',
        });
      }
    } catch (dbError) {
      console.error('Database error in coupon validation:', dbError);
    }

    return NextResponse.json(
      { success: false, valid: false, message: 'كود الخصم غير صحيح أو منتهي الصلاحية' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء فحص كود الخصم' },
      { status: 500 }
    );
  }
}
